import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

/**
 * FlowerPolaroidCard Component
 * An exact reproduction of the polaroid/card component with proper image slot, 
 * title, meaning, and cultural history text hierarchy.
 *
 * @param {Object} props
 * @param {string} props.image - Path to the flower image
 * @param {string} props.title - The name of the flower
 * @param {string} props.meaning - The meaning of the flower
 * @param {string} props.history - Cultural history of the flower
 * @param {string} props.className - Additional classes
 */
export default function FlowerPolaroidCard({
  image,
  title,
  meaning,
  history,
  className,
  ...props
}) {
  return (
    <Card 
      className={cn(
        'w-[300px] overflow-hidden bg-[#fafafa] border-[#e5e5e5] shadow-lg rounded-none select-none',
        'font-instrument-sans',
        className
      )}
      {...props}
    >
      {/* Polaroid Image Slot - typical polaroid aspect ratio with border */}
      <div className="p-4 pb-2">
        <div className="w-full aspect-[4/5] bg-neutral-100 overflow-hidden relative shadow-inner">
          {image ? (
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300">
              No Image
            </div>
          )}
        </div>
      </div>

      <CardHeader className="pt-2 pb-4 px-5 text-center flex flex-col items-center gap-1">
        {/* Title */}
        <CardTitle className="font-instrument-serif text-3xl font-normal text-neutral-900 tracking-tight">
          {title}
        </CardTitle>
        
        {/* Meaning */}
        {meaning && (
          <CardDescription className="text-sm font-medium text-neutral-600 uppercase tracking-widest mt-1">
            {meaning}
          </CardDescription>
        )}
        
        {/* Cultural History */}
        {history && (
          <div className="mt-3 text-xs text-neutral-500 leading-relaxed italic max-w-[90%] text-balance">
            {history}
          </div>
        )}
      </CardHeader>
    </Card>
  );
}
