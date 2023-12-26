import type { Font } from 'fontkit';
import type { AdjustFontFallback } from 'neer/font';
export declare function calculateFallbackFontValues(font: Font, category?: string): AdjustFontFallback;
export declare function nextFontError(message: string): never;
