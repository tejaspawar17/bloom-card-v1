import React from "react";
export function StudioPanel({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`bg-neutral-900/80 border border-emerald-950/40 rounded-2xl p-4 shadow-[0_0_40px_-10px_rgba(74,222,128,0.15)] ${className || ""}`}>{children}</div>;
}
