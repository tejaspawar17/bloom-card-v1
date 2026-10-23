import React from 'react';
import clsx from 'clsx';
import TertiaryLiquidGlassButton from '@/components/ui/TertiaryLiquidGlassButton';

export default function CardMessageBox({
  to = 'Tejavu',
  from = 'Tejavu',
  message = '',
  variant = 'paper',
  trainerName = '',
  trainerBio = '',
  onEdit,
  className = '',
}) {
  const isTrainer = variant === 'trainer';

  const shadowStyles = {
    paper: 'shadow-[2px_2px_2px_0.5px_rgba(0,0,0,0.25)]',
    metallic: 'shadow-[1px_3px_2px_rgba(0,0,0,0.5)]',
    pokemon: 'shadow-[2px_2px_2px_0.5px_rgba(0,0,0,0.25)]',
    trainer: 'shadow-[2px_2px_2px_rgba(0,0,0,0.3)]',
  };

  if (isTrainer) {
    return (
      <div
        onClick={onEdit}
        role="button"
        tabIndex={0}
        className={clsx(
          'p-4 bg-white/95 rounded-[14px] border border-neutral-200 cursor-pointer select-none transition-all group hover:bg-white',
          shadowStyles.trainer,
          className
        )}
      >
        <div className="flex items-center justify-between mb-1.5 border-b border-neutral-100 pb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-neutral-800">Trainer:</span>
            <span className="text-xs text-neutral-600 font-semibold">{trainerName || 'Trainer Name'}</span>
          </div>
          <span className="text-[10px] text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Edit
          </span>
        </div>
        <div className="text-xs text-neutral-700 italic leading-relaxed line-clamp-3">
          "{trainerBio || 'Write trainer bio here...'}"
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onEdit}
      role="button"
      tabIndex={0}
      className={clsx(
        'relative p-1 bg-[#FFFDF8] rounded-[14px] cursor-pointer select-none transition-all group hover:bg-white',
        shadowStyles[variant] || shadowStyles.paper,
        className
      )}
    >
      <div className="w-full h-full border border-pink-400 rounded-[10px] p-3 relative">
        <div className="flex justify-between text-[11px] text-pink-500/70 mb-2 border-b border-pink-100 pb-1.5 font-medium">
          <span>To: <strong className="text-pink-600">{to || '...'}</strong></span>
          <span>From: <strong className="text-pink-600">{from || '...'}</strong></span>
        </div>
        <p className="text-xs text-neutral-700 leading-relaxed line-clamp-4 font-script text-[16px]">
          {message || 'Write your message here...'}
        </p>
        <div className="absolute -bottom-2 -right-2 z-40 pointer-events-auto">
          <TertiaryLiquidGlassButton onClick={onEdit} />
        </div>
      </div>
    </div>
  );
}
