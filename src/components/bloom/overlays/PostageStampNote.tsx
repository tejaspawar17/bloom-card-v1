import React, { useState } from "react";
import TertiaryLiquidGlassButton from "@/components/ui/TertiaryLiquidGlassButton";

export function PostageStampNote({ 
  message = "", 
  onEdit,
  isPreview = false
}: { 
  message?: string;
  recipient?: string;
  onEdit?: () => void;
  isPreview?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div
      onClick={handleEditClick}
      className={`relative flex flex-col items-center justify-center w-[clamp(222px,85cqw,325px)] h-[clamp(143px,55cqw,210px)] px-[clamp(16px,6.2cqw,23px)] py-[clamp(14px,5.2cqw,21px)] bg-contain bg-no-repeat bg-center z-30 ${isPreview ? '' : 'cursor-pointer group transition-transform active:scale-95'}`}
      style={{ backgroundImage: "url('/assets/bloom/stamp-bg.png')" }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center relative -translate-y-[0.4cqw]">
        <div 
          className="w-[90%] text-center text-[clamp(17.5px,7.1cqw,27px)] leading-[clamp(27px,11.2cqw,43px)] font-['Homemade_Apple',cursive] text-[#FF0000]"
        >
          <span className="whitespace-pre-wrap">{message}</span>
        </div>
      </div>
      
      {/* Tertiary Edit Button overlapping 90% over the title card */}
      {!isPreview && (
        <div className="absolute bottom-[1.2cqw] right-[1.2cqw] z-40 pointer-events-auto">
          <TertiaryLiquidGlassButton onClick={handleEditClick} isEditing={isEditing} />
        </div>
      )}
    </div>
  );
}
