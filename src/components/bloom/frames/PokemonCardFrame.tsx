import React from "react";
export function PokemonCardFrame({ children }: { children: React.ReactNode }) {
  return <div className="relative w-full h-full aspect-[688/960] rounded-xl border border-neutral-300 bg-yellow-400 p-2">{children}</div>;
}
