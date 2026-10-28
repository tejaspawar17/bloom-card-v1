import React, { useRef, useState } from "react";
import { useCard } from '@/context/CardContext';
import WindowPanel from '@/components/ui/WindowPanel';
import { cn } from '@/lib/utils';
import { UploadSimple, Prohibit, CircleNotch } from '@phosphor-icons/react';
import { showToast } from '@/components/ui/AppleToast';

async function isHeicFile(file) {
  if (!file) return false;
  const name = (file.name || '').toLowerCase();
  const type = (file.type || '').toLowerCase();
  if (
    name.endsWith('.heic') ||
    name.endsWith('.heif') ||
    type === 'image/heic' ||
    type === 'image/heif'
  ) {
    return true;
  }
  try {
    const { isHeic } = await import('heic-to');
    return await isHeic(file);
  } catch {
    return false;
  }
}

async function optimizeImageForPolaroid(fileOrBlob, maxDimension = 1200) {
  return new Promise((resolve) => {
    if (!fileOrBlob || typeof window === 'undefined') {
      resolve(fileOrBlob);
      return;
    }

    const img = new Image();
    const tempUrl = URL.createObjectURL(fileOrBlob);

    img.onload = () => {
      URL.revokeObjectURL(tempUrl);
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      // If already within crisp bounds, don't re-encode
      if (!width || !height || (width <= maxDimension && height <= maxDimension)) {
        resolve(fileOrBlob);
        return;
      }

      let newWidth = width;
      let newHeight = height;

      if (width > height) {
        newHeight = Math.round((height * maxDimension) / width);
        newWidth = maxDimension;
      } else {
        newWidth = Math.round((width * maxDimension) / height);
        newHeight = maxDimension;
      }

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(fileOrBlob);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(fileOrBlob);
            return;
          }
          const cleanName = (fileOrBlob.name || 'photo').replace(/\.[^/.]+$/, '') + '.jpg';
          resolve(new File([blob], cleanName, { type: 'image/jpeg' }));
        },
        'image/jpeg',
        0.92
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(tempUrl);
      resolve(fileOrBlob);
    };

    img.src = tempUrl;
  });
}

const defaultImage = "/assets/polaroid-defaults/image1.png";
const alternateImage = "/assets/polaroid-defaults/image2.png";

export default function WindowSelectBackImage({ bare = false }) {
  const fileInputRef = useRef(null);
  const { state, dispatch } = useCard();
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [isConverting, setIsConverting] = useState(false);

  // We derive "selected" based on the global state so it syncs with the rest of the app
  const isCustomUploaded = Boolean(
    state.selectedBackImage &&
    state.selectedBackImage !== 'landscape' &&
    state.selectedBackImage !== 'portrait' &&
    state.selectedBackImage !== 'none'
  );

  const selected = state.selectedBackImage === 'landscape' ? '0' :
                   state.selectedBackImage === 'portrait' ? '1' :
                   state.selectedBackImage === 'none' ? 'none' : 'uploaded';

  function ensureBackSide() {
    if (state.activeSide !== 'back') {
      dispatch({ type: 'SET_ACTIVE_SIDE', payload: 'back' });
    }
  }

  async function handleUpload(file) {
    if (!file) return;

    let targetFile = file;

    if (await isHeicFile(file)) {
      setIsConverting(true);
      try {
        const { heicTo } = await import('heic-to');
        const convertedBlob = await heicTo({
          blob: file,
          type: 'image/jpeg',
          quality: 0.9,
        });
        const cleanName = (file.name || 'photo').replace(/\.[^/.]+$/, '') + '.jpg';
        targetFile = new File([convertedBlob], cleanName, { type: 'image/jpeg' });
        showToast({
          title: 'iPhone photo converted',
          description: 'Optimized HEIC to JPEG for display & sharing',
          duration: 2800,
        });
      } catch (err) {
        console.error('HEIC conversion failed:', err);
        showToast({
          title: 'Could not convert HEIC photo',
          description: 'Please upload a standard JPG or PNG.',
          duration: 3500,
        });
        setIsConverting(false);
        return;
      } finally {
        setIsConverting(false);
      }
    }

    // Resample ultra-high-resolution images with high-quality bicubic smoothing
    // to prevent GPU downsampling aliasing / pixelation on small displays
    targetFile = await optimizeImageForPolaroid(targetFile, 1200);

    if (uploadedUrl && uploadedUrl.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedUrl);
    }

    const url = URL.createObjectURL(targetFile);
    setUploadedUrl(url);
    dispatch({ type: 'SET_BACK_IMAGE', payload: url });
    ensureBackSide();
  }

  function handleSelect(val) {
    ensureBackSide();
    if (val === '0') {
      dispatch({ type: 'SET_BACK_IMAGE', payload: 'landscape' });
    } else if (val === '1') {
      dispatch({ type: 'SET_BACK_IMAGE', payload: 'portrait' });
    } else if (val === 'none') {
      dispatch({ type: 'SET_BACK_IMAGE', payload: 'none' });
    } else if (val === 'uploaded') {
      if (uploadedUrl) {
        dispatch({ type: 'SET_BACK_IMAGE', payload: uploadedUrl });
      } else {
        fileInputRef.current?.click();
      }
    }
  }

  const items = [
    {
      id: 'uploaded',
      label: isConverting ? 'Converting…' : 'Upload',
      isUploadedCustom: isCustomUploaded,
      onClick: () => {
        if (isConverting) return;
        if (selected === 'uploaded' || !uploadedUrl) {
          fileInputRef.current?.click();
        } else {
          handleSelect('uploaded');
        }
      },
    },
    {
      id: '0',
      label: 'Default 1',
      image: defaultImage,
      onClick: () => handleSelect('0'),
    },
    {
      id: '1',
      label: 'Default 2',
      image: alternateImage,
      onClick: () => handleSelect('1'),
    },
    {
      id: 'none',
      label: 'None',
      onClick: () => handleSelect('none'),
    },
  ];

  const renderBackArtworkItems = (isMobileMode = false) => (
    <>
      <input 
        accept="image/*,.heic,.heif" 
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleUpload(file);
          event.target.value = '';
        }}
        ref={fileInputRef} 
        type="file" 
      />

      <div 
        className={cn(
          "px-[3px] mx-auto flex flex-row justify-between items-start",
          isMobileMode
            ? "w-full max-w-[360px] gap-2"
            : "w-[268px] xl:w-[305px] 2xl:w-[328px]"
        )}
        role="radiogroup"
        aria-label="Back Cover Artwork"
      >
        {items.map((item) => {
          const isSelected = selected === item.id;

          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={item.onClick}
              className={cn(
                "relative flex flex-col items-center cursor-pointer group outline-none active:scale-[0.96] transition-transform duration-150 ease-out font-sans",
                isMobileMode
                  ? "w-[72px] h-[94px]"
                  : "w-[54px] h-[74px] xl:w-[61px] xl:h-[84px] 2xl:w-[66px] 2xl:h-[90px]"
              )}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div
                className={cn(
                  'absolute top-0 pointer-events-none transition-colors duration-200',
                  isMobileMode
                    ? 'w-[76px] h-[94px] -left-[2px] rounded-[15px]'
                    : '-left-[2.5px] xl:-left-[3px] w-[59px] h-[74px] xl:w-[67px] xl:h-[84px] 2xl:w-[72px] 2xl:h-[90px] rounded-[13px] xl:rounded-[14px] 2xl:rounded-[15px]',
                  isSelected
                    ? 'bg-[#0088FF]'
                    : 'bg-transparent group-hover:bg-[rgba(153,153,153,0.15)]'
                )}
              />

              <div className={cn(
                "relative overflow-hidden bg-[#1A1A1A] z-10 flex items-center justify-center",
                isMobileMode
                  ? "mt-[2px] w-[70px] h-[70px] rounded-[13px]"
                  : "mt-[2.5px] xl:mt-[3px] w-[54px] h-[54px] xl:w-[61px] xl:h-[61px] 2xl:w-[66px] 2xl:h-[66px] rounded-[10px] xl:rounded-[11px] 2xl:rounded-[12px]"
              )}>
                {item.id === 'uploaded' ? (
                  isConverting ? (
                    <CircleNotch className={isMobileMode ? "w-[26px] h-[26px] text-[#0088FF] animate-spin" : "w-[22px] h-[22px] xl:w-[25px] xl:h-[25px] 2xl:w-[28px] 2xl:h-[28px] text-[#0088FF] animate-spin"} weight="bold" />
                  ) : item.isUploadedCustom ? (
                    <img className="size-full object-cover" src={state.selectedBackImage} alt="Uploaded back" />
                  ) : (
                    <UploadSimple className={isMobileMode ? "w-[26px] h-[26px] text-[#F5F5F5] group-hover:text-white transition-colors" : "w-[22px] h-[22px] xl:w-[25px] xl:h-[25px] 2xl:w-[28px] 2xl:h-[28px] text-[#F5F5F5] group-hover:text-white transition-colors"} weight="bold" />
                  )
                ) : item.image ? (
                  <img className="size-full object-cover" src={item.image} alt={item.label} />
                ) : (
                  <Prohibit className={isMobileMode ? "w-[26px] h-[26px] text-[#F5F5F5] group-hover:text-white transition-colors" : "w-[22px] h-[22px] xl:w-[25px] xl:h-[25px] 2xl:w-[28px] 2xl:h-[28px] text-[#F5F5F5] group-hover:text-white transition-colors"} weight="bold" />
                )}
              </div>

              <span
                className={cn(
                  'relative font-sans truncate text-center transition-colors duration-200 z-10',
                  isMobileMode
                    ? 'mt-1 text-[11.5px] leading-[14px] w-[70px]'
                    : 'mt-[2.5px] xl:mt-[3px] text-[10px] leading-[12px] xl:text-[10.5px] xl:leading-[12.5px] 2xl:text-[11px] 2xl:leading-[13px] tracking-[0.0055em] w-[54px] xl:w-[61px] 2xl:w-[66px]',
                  isSelected
                    ? 'text-white font-medium'
                    : 'text-[rgba(229,229,234,0.70)] font-normal group-hover:text-[rgba(255,255,255,0.85)]'
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );

  if (bare) {
    return (
      <div className="w-full">
        <div className="text-[14px] font-semibold text-white tracking-tight mb-2.5 px-0.5">
          Back Cover Artwork
        </div>
        {renderBackArtworkItems(true)}
      </div>
    );
  }

  return (
    <WindowPanel 
      title="Back Cover Artwork"
      bodyClassName="pt-[13px] px-[15px] pb-[15px] xl:pt-[15px] xl:px-[17px] xl:pb-[17px] 2xl:pt-[16px] 2xl:px-[18px] 2xl:pb-[18px]"
    >
      {renderBackArtworkItems(false)}
    </WindowPanel>
  );
}
