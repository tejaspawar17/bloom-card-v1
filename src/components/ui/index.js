/**
 * Design System Component Library
 * Extracted directly from Figma file: Bloom Card V1
 * Pages: "Design Components" (#649:11027) & "Design System" (#753:10726)
 * 
 * Built with shadcn/ui primitives + custom Bloom Card components
 */

// === shadcn/ui primitives ===
export { Button, buttonVariants } from './button';
export { Badge, badgeVariants } from './badge';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';
export { ScrollArea, ScrollBar } from './scroll-area';
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from './tooltip';

// === Custom Bloom Card components ===
export { default as LiquidGlassButton } from './LiquidGlassButton';
export { default as BloomLogo } from './BloomLogo';
export { default as SegmentedControl } from './SegmentedControl';
export { default as VerticalCardSelector } from './VerticalCardSelector';
export { default as FigmaWindow } from './FigmaWindow';
export { default as WindowPanel } from './WindowPanel';
export { default as WindowModal } from './WindowModal';
export { default as OccasionChip } from './OccasionChip';
export { default as EmojiChip } from './EmojiChip';
export { default as StickerItem } from './StickerItem';
export { default as Sticker } from './Sticker';
export { default as Polaroid } from './Polaroid';
export { default as FlowerPolaroidCard } from './FlowerPolaroidCard';
export { default as Stamp } from './Stamp';
export { default as FlowerNameBadge } from './FlowerNameBadge';
export { default as FlowerUsecaseBadge } from './FlowerUsecaseBadge';
export { default as CardSubjectBox } from './CardSubjectBox';
export { default as CardMessageBox } from './CardMessageBox';

export { default as TertiaryLiquidGlassButton } from './TertiaryLiquidGlassButton';
