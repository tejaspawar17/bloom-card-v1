import React from 'react';

interface PolaroidFrameProps {
  imageSrc: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}

export function PolaroidFrame({ imageSrc, className = '', style, onClick }: PolaroidFrameProps) {
  if (!imageSrc) return null;

  return (
    <div 
      onClick={onClick ? (e) => { e.stopPropagation(); onClick(e); } : undefined}
      className={`w-[clamp(100px,38.4cqw,146px)] h-[clamp(115px,44.2cqw,168px)] bg-[#F8F8F5] pt-[clamp(5.5px,2.2cqw,8.5px)] px-[clamp(5.5px,2.2cqw,8.5px)] pb-[clamp(16px,6.8cqw,26px)] rounded-[1px] absolute top-[clamp(28px,10.5cqw,50px)] right-[clamp(14px,5.8cqw,22px)] rotate-[-4.8deg] z-10 ${onClick ? 'pointer-events-auto cursor-pointer active:scale-[0.97] transition-transform' : 'pointer-events-none'} flex flex-col select-none ${className}`}
      style={{ 
        boxShadow: '1px 1px 2px 0 rgba(0, 0, 0, 0.35)',
        ...style 
      }}
    >
      {/* Paper texture overlay on the frame (procedural SVG fractal noise) */}
      <div 
        className="absolute inset-0 pointer-events-none z-20 rounded-[1px]"
        style={{
          backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIgLz48ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==")',
          opacity: 0.5
        }}
      />

      {/* Recessed Inner Photo Well */}
      <div className="w-full h-full overflow-hidden relative bg-[#e8e8e8] z-10">
        <img 
          src={imageSrc} 
          alt="Polaroid Memory" 
          className="w-full h-full object-cover block" 
        />

        {/* Film grain layer (procedural SVG turbulence noise) */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=")',
            backgroundSize: '180px 180px',
            opacity: 0.12
          }}
        />

        {/* Light leak overlay (warm amber + soft blue, screen blend mode) */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 20% 30%, rgba(255,200,150,0.2) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(150,180,255,0.15) 0%, transparent 45%)',
            mixBlendMode: 'screen'
          }}
        />

        {/* Vignette overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.25) 100%)'
          }}
        />

        {/* Subtle inner edge bevel */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] border border-black/5" />
      </div>
    </div>
  );
}
