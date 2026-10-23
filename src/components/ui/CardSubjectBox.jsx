import React, { useState } from 'react';
import clsx from 'clsx';
import { PencilSimple } from '@phosphor-icons/react';
import { useCard } from '@/context/CardContext';
import TertiaryLiquidGlassButton from '@/components/ui/TertiaryLiquidGlassButton';

export default function CardSubjectBox({
  variant = 'paper',
  onClick,
  onEdit,
  className = '',
  isPreview = false,
}) {
  const { state, dispatch } = useCard();
  const subject = state.subject;
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = (e) => {
    if (isPreview) return;
    if (isEditing) return;
    if (onClick) onClick(e);
    else if (onEdit) onEdit(e);
    else setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    dispatch({ type: 'SET_SUBJECT', payload: e.target.value });
  };

  if (variant === 'metallic') {
    return (
      <div
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Edit subject"
        className={clsx(
          "w-full h-full flex items-center justify-center cursor-pointer group outline-none z-30 drop-shadow-lg relative",
          className
        )}
        style={{
          WebkitTapHighlightColor: 'transparent',
          backgroundImage: 'url(/assets/bloom/metallic_subject_front.png)',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        {!isPreview && (
            <div className="absolute bottom-1 right-1 z-40 pointer-events-auto">
              <TertiaryLiquidGlassButton 
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(e);
                }} 
                isEditing={isEditing} 
              />
            </div>
          )}
        <div className="w-[66%] h-[50%] flex flex-col items-center justify-center transition-opacity group-hover:opacity-70">
          {isEditing ? (
            <textarea
                autoFocus
                maxLength={25}
                rows={2}
                value={subject}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full h-full bg-transparent border-none outline-none text-center resize-none overflow-hidden"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: '7.22cqw',
                  lineHeight: '8.33cqw',
                  color: '#FF0000',
                  wordBreak: 'break-word',
                }}
              />
          ) : (
            <span 
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: '7.22cqw',
                  lineHeight: '8.33cqw',
                  color: '#FF0000',
                  wordBreak: 'break-word',
                  textAlign: 'center',
                  whiteSpace: 'pre-wrap',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
              {subject || 'I am really sorry!!!'}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'paper') {
    return (
      <div
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Edit subject"
        className={clsx(
          "w-[clamp(200px,63cqw,240px)] h-[clamp(116px,36.8cqw,140px)] flex items-center justify-center p-[clamp(8px,2.5cqw,12px)] cursor-pointer group outline-none z-30 drop-shadow-xl relative",
          className
        )}
        style={{
          WebkitTapHighlightColor: 'transparent',
          backgroundColor: '#FFFDF8',
          maskImage: 'radial-gradient(circle at 4px 4px, transparent 4px, black 4.5px)',
          maskSize: '12px 12px',
          maskPosition: '-4px -4px',
          WebkitMaskImage: 'radial-gradient(circle at 4px 4px, transparent 4px, black 4.5px)',
          WebkitMaskSize: '12px 12px',
          WebkitMaskPosition: '-4px -4px',
        }}
      >
        {!isPreview && (
          <div className="absolute -bottom-2 -right-2 z-40 pointer-events-auto">
            <TertiaryLiquidGlassButton 
              onClick={(e) => {
                e.stopPropagation();
                handleClick(e);
              }}
              isEditing={isEditing} 
            />
          </div>
        )}

        {/* Inner Border Box */}
        <div 
          className="relative w-full h-full flex items-center justify-center transition-colors group-hover:bg-black/5"
          style={{ border: '1px solid #FF0000' }}
        >
          {/* Text */}
          <div 
            className="w-full h-full p-2 flex items-center justify-center text-center"
            style={{
              fontFamily: "var(--font-script)",
              fontSize: '6.66cqw',
                  lineHeight: '7.77cqw',
              color: '#FF0000'
            }}
          >
            {isEditing ? (
              <textarea
                autoFocus
                value={subject}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full h-full bg-transparent border-none outline-none text-center resize-none"
              />
            ) : (
              <span className="whitespace-pre-wrap">{subject || 'Happy Birthday!! Aayush'}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback for pokemon
  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      className={clsx(
        'w-[238px] p-4 rounded-[14px] border border-neutral-200 cursor-pointer select-none transition-all group hover:bg-white relative',
        'bg-white/95 backdrop-blur-sm shadow-[0px_4px_4px_rgba(0,0,0,0.4)] z-30',
        className
      )}
    >
      {!isPreview && (
        <div className="absolute -top-3 -right-3 z-40 pointer-events-auto">
          <TertiaryLiquidGlassButton 
            onClick={(e) => {
              e.stopPropagation();
              handleClick(e);
            }}
            isEditing={isEditing} 
          />
        </div>
      )}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Card Subject</span>
      </div>
      {isEditing ? (
        <textarea
          autoFocus
          value={subject}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full text-sm font-bold text-neutral-900 leading-snug bg-transparent border-none outline-none resize-none"
        />
      ) : (
        <p className="text-sm font-bold text-neutral-900 leading-snug line-clamp-3 whitespace-pre-wrap">
          {subject || 'Click to add subject'}
        </p>
      )}
    </div>
  );
}
