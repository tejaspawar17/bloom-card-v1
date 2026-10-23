import { useState } from "react";
import { motion } from "framer-motion";
import WindowPanel from "@/components/ui/WindowPanel";
import { OCCASIONS } from "@/data/cardData";
import { cn } from "@/lib/utils";

const occasionRows = [
  ['sorry', 'birthday', 'celebration'],
  ['thank_you', 'get_well'],
  ['miss_you', 'love', 'so_proud'],
  ['sad', 'angry', 'tired', 'homie'],
];

export default function OccasionPicker({ value, onChange }) {
  const [internalSelected, setInternalSelected] = useState(null);
  const selected = value !== undefined ? value : internalSelected;
  
  const handleSelect = (label) => {
    const newSelected = selected === label ? null : label;
    setInternalSelected(newSelected);
    if (onChange) onChange(newSelected);
  };

  return (
    <WindowPanel 
      title="Select Occasion"
      bodyClassName="pt-[13px] px-[15px] pb-[15px] xl:pt-[15px] xl:px-[17px] xl:pb-[17px] 2xl:pt-[16px] 2xl:px-[18px] 2xl:pb-[18px]"
    >
      <div 
        className="flex flex-col justify-between h-[125px] xl:h-[141px] 2xl:h-[152px] gap-[6px] xl:gap-[7px] 2xl:gap-[8px] w-full select-none" 
        role="radiogroup" 
        aria-label="Select Occasion"
      >
        {occasionRows.map((row, rowIndex) => (
          <div className="flex items-center gap-[5px] xl:gap-[6px] 2xl:gap-[6px]" key={rowIndex}>
            {row.map((id) => {
              const occ = OCCASIONS.find(o => o.id === id);
              if (!occ) return null;
              const isSelected = selected === occ.label;

              return (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  key={occ.label}
                  onClick={() => handleSelect(occ.label)}
                  className={cn(
                    "inline-flex items-center justify-center gap-[3px] xl:gap-[4px] h-[28px] xl:h-[30px] 2xl:h-[32px] px-[10px] xl:px-[11px] 2xl:px-[12px] py-[6px] xl:py-[6.5px] 2xl:py-[7px] rounded-full font-sans text-[11.5px] leading-[16px] xl:text-[12px] xl:leading-[17px] 2xl:text-[13px] 2xl:leading-[18px] tracking-[-0.0177em] font-normal transition-all duration-150 cursor-pointer outline-none select-none border-0 shadow-none whitespace-nowrap",
                    isSelected
                      ? "bg-[#0088FF] text-white"
                      : "bg-[rgba(114,114,114,0.08)] text-[rgba(229,229,234,0.70)] hover:bg-[rgba(153,153,153,0.15)] hover:text-white/85"
                  )}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <img 
                    src={`/assets/emojis/${occ.emoji}.png`} 
                    alt="" 
                    className="w-[12px] h-[12px] xl:w-[13px] xl:h-[13px] 2xl:w-[14px] 2xl:h-[14px] object-contain flex-shrink-0" 
                  />
                  <span>{occ.label}</span>
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>
    </WindowPanel>
  );
}
