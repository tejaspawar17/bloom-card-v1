import React from "react";
export function MetallicVictorianFrame({ children }: { children: React.ReactNode }) {
  return <div className="relative w-full h-full aspect-[688/960] border-4 border-yellow-500 bg-gradient-to-br from-yellow-200 to-yellow-600 rounded-lg">{children}</div>;
}
