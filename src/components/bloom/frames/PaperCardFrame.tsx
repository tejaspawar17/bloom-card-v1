import React from "react";
export function PaperCardFrame({ children }: { children: React.ReactNode }) {
  return <div className="relative w-full h-full aspect-[688/960] rounded-2xl overflow-hidden shadow-2xl select-none border border-[#95a0a6]/60 bg-transparent">{children}</div>;
}
