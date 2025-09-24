'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ImageZoomProps extends React.ComponentPropsWithoutRef<'img'> {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
  className?: string;
  wrapperClassName?: string;
  overlayClassName?: string;
  overlay?: React.ReactNode;
}

const ImageZoom = React.forwardRef<HTMLImageElement, ImageZoomProps>(
  (
    {
      src,
      alt,
      width,
      height,
      className,
      wrapperClassName,
      overlayClassName,
      overlay,
      ...props
    },
    forwardedRef
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className={cn('relative h-fit w-fit cursor-pointer', wrapperClassName)}>
            <img
              ref={forwardedRef}
              src={src}
              alt={alt}
              width={width}
              height={height}
              className={className}
              {...props}
            />
            {overlay && (
              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center',
                  overlayClassName
                )}
              >
                {overlay}
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="z-50 max-w-[80vw] max-h-[80vh] flex items-center justify-center p-0">
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="max-w-full max-h-full object-contain"
          />
        </DialogContent>
      </Dialog>
    );
  }
);
ImageZoom.displayName = 'ImageZoom';

export { ImageZoom };
