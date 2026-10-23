import React, { useState } from "react";
import TertiaryLiquidGlassButton from "@/components/ui/TertiaryLiquidGlassButton";

export function PostageStampNote({ 
  message = "Happy Birthday!!", 
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
      className={`relative flex flex-col items-center justify-center w-[clamp(202px,78cqw,296px)] h-[clamp(130px,50cqw,190px)] px-[clamp(15px,5.7cqw,21px)] py-[clamp(13px,4.8cqw,19px)] bg-contain bg-no-repeat bg-center z-30 ${isPreview ? '' : 'cursor-pointer group transition-transform active:scale-95'}`}
      style={{ backgroundImage: "url('/assets/bloom/stamp-bg.png')" }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center relative -translate-y-[0.4cqw]">
        <div 
          className="w-[90%] text-center text-[clamp(14.5px,5.8cqw,22px)] leading-[clamp(24px,9.6cqw,36px)] font-['Homemade_Apple',cursive] text-[#FF0000]"
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
