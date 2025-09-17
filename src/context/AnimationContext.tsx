import { createContext, RefObject } from 'react';

// This context will hold the ref of the cart icon to be used in animations
export const AnimationContext = createContext<{
  cartIconRef: RefObject<HTMLAnchorElement | null>;
} | null>(null);
