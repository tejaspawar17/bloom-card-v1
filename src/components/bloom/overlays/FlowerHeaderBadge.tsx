import React from "react";
export function FlowerHeaderBadge({ name }: { name: string }) {
  return <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-full px-4 py-1 text-white shadow-lg text-sm font-semibold">{name}</div>;
}
