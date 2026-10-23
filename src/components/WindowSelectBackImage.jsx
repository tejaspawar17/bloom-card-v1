import React, { useRef, useState } from "react";
import { useCard } from '@/context/CardContext';
import WindowPanel from '@/components/ui/WindowPanel';
import { cn } from '@/lib/utils';
import { Upload, Ban } from 'lucide-react';

const defaultImage = "/assets/polaroid-defaults/image1.png";
const alternateImage = "/assets/polaroid-defaults/image2.png";

export default function WindowSelectBackImage() {
  const fileInputRef = useRef(null);
  const { state, dispatch } = useCard();
  const [uploadedUrl, setUploadedUrl] = useState(null);

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

  function handleUpload(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedUrl(url);
    dispatch({ type: 'SET_BACK_IMAGE', payload: url });
  }

  function handleSelect(val) {
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
      label: 'Upload',
      isUploadedCustom: isCustomUploaded,
      onClick: () => {
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

  return (
    <WindowPanel 
      title="Upload / Select Image for the Back"
      bodyClassName="pt-[13px] px-[15px] pb-[15px] xl:pt-[15px] xl:px-[17px] xl:pb-[17px] 2xl:pt-[16px] 2xl:px-[18px] 2xl:pb-[18px]"
    >
      <input 
        accept="image/*" 
        className="sr-only"
        onChange={(event) => handleUpload(event.target.files?.[0])}
        ref={fileInputRef} 
        type="file" 
      />

      <div 
        className="w-[268px] xl:w-[305px] 2xl:w-[328px] px-[3px] mx-auto flex flex-row justify-between items-start"
        role="radiogroup"
        aria-label="Upload or Select Image for the Back"
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
              className="relative flex flex-col items-center cursor-pointer group outline-none active:scale-[0.96] transition-transform duration-150 ease-out w-[54px] h-[74px] xl:w-[61px] xl:h-[84px] 2xl:w-[66px] 2xl:h-[90px] font-sans"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Selection BG matching Flower & Sticker chips (59x74 / 67x84 / 72x90, x:-3, r:15, #0088FF) */}
              <div
                className={cn(
                  'absolute top-0 -left-[2.5px] xl:-left-[3px] w-[59px] h-[74px] xl:w-[67px] xl:h-[84px] 2xl:w-[72px] 2xl:h-[90px] rounded-[13px] xl:rounded-[14px] 2xl:rounded-[15px] transition-colors duration-200 pointer-events-none',
                  isSelected
                    ? 'bg-[#0088FF]'
                    : 'bg-transparent group-hover:bg-[rgba(153,153,153,0.15)]'
                )}
              />

              {/* Inner Card (Figma: 66x66, y:3, r:12, #1A1A1A) */}
              <div className="relative mt-[2.5px] xl:mt-[3px] w-[54px] h-[54px] xl:w-[61px] xl:h-[61px] 2xl:w-[66px] 2xl:h-[66px] rounded-[10px] xl:rounded-[11px] 2xl:rounded-[12px] overflow-hidden bg-[#1A1A1A] z-10 flex items-center justify-center">
                {item.id === 'uploaded' ? (
                  item.isUploadedCustom ? (
                    <img className="size-full object-cover" src={state.selectedBackImage} alt="Uploaded back" />
                  ) : (
                    <Upload className="w-[16px] h-[16px] xl:w-[18px] xl:h-[18px] 2xl:w-5 2xl:h-5 text-[#F5F5F5] group-hover:text-white transition-colors" strokeWidth={1.75} />
                  )
                ) : item.image ? (
                  <img className="size-full object-cover" src={item.image} alt={item.label} />
                ) : (
                  <Ban className="w-[16px] h-[16px] xl:w-[18px] xl:h-[18px] 2xl:w-5 2xl:h-5 text-[#F5F5F5] group-hover:text-white transition-colors" strokeWidth={1.75} />
                )}
              </div>

              {/* Label (Inter 400 11/13, rgba(229,229,234,0.70)) */}
              <span
                className={cn(
                  'relative mt-[2.5px] xl:mt-[3px] text-[10px] leading-[12px] xl:text-[10.5px] xl:leading-[12.5px] 2xl:text-[11px] 2xl:leading-[13px] tracking-[0.0055em] truncate w-[54px] xl:w-[61px] 2xl:w-[66px] text-center transition-colors duration-200 z-10 font-sans',
                  isSelected
                    ? 'text-white font-medium'
                    : 'text-[rgba(229,229,234,0.70)] font-normal group-hover:text-white/85'
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </WindowPanel>
  );
}
