import React from 'react';

interface PolaroidFrameProps {
  imageSrc: string;
}

export function PolaroidFrame({ imageSrc }: PolaroidFrameProps) {
  return (
    <div className="w-[clamp(100px,38.4cqw,146px)] h-[clamp(115px,44.2cqw,168px)] bg-[#FAF9F5] pt-[clamp(5.5px,2.2cqw,8.5px)] px-[clamp(5.5px,2.2cqw,8.5px)] pb-[clamp(16px,6.8cqw,26px)] rounded-[1px] shadow-[0_4px_10px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.08)] absolute top-[clamp(28px,10.5cqw,50px)] right-[clamp(14px,5.8cqw,22px)] rotate-[-4.8deg] z-10 transition-all duration-200 ease-out pointer-events-none flex flex-col select-none">
      
      {/* Recessed Inner Photo Well */}
      <div className="w-full h-full overflow-hidden relative bg-stone-900">
        <img 
          src={imageSrc} 
          alt="Memory" 
          className="w-full h-full object-cover block" 
        />
        
        {/* Subtle inner bevel overlay */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.35)] border border-black/10" />
        
        {/* Faint warm vintage film sheen */}
        <div className="absolute inset-0 pointer-events-none bg-[#A67C52] mix-blend-color-burn opacity-10" />
      </div>
      
      {/* Reflection Texture Film over the whole polaroid */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{ 
          backgroundImage: 'url(/assets/polaroid-defaults/polaroid-texture.png)', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'screen',
          opacity: 0.8
        }}
      />
    </div>
  );
}
