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

    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = React.useState<number>(1);
    const [translate, setTranslate] = React.useState<{ x: number; y: number }>(
      { x: 0, y: 0 }
    );
    const [isDragging, setIsDragging] = React.useState<boolean>(false);
    const dragStateRef = React.useRef<{ id: number | null; startX: number; startY: number; origX: number; origY: number }>({ id: null, startX: 0, startY: 0, origX: 0, origY: 0 });

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

    const getBounds = React.useCallback((nextScale: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { maxX: 0, maxY: 0 };
      const imgRatio = width / height;
      const containerRatio = rect.width / rect.height;
      const baseW = imgRatio > containerRatio ? rect.width : rect.height * imgRatio;
      const baseH = imgRatio > containerRatio ? rect.width / imgRatio : rect.height;
      const maxX = Math.max(0, (baseW * nextScale - rect.width) / 2);
      const maxY = Math.max(0, (baseH * nextScale - rect.height) / 2);
      return { maxX, maxY };
    }, [width, height]);

    const resetTransform = React.useCallback(() => {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
      setIsDragging(false);
      dragStateRef.current = { id: null, startX: 0, startY: 0, origX: 0, origY: 0 };
    }, []);

    React.useEffect(() => {
      if (!isOpen) {
        resetTransform();
      }
    }, [isOpen, resetTransform]);

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      e.preventDefault();
      const zoomIntensity = 0.2;
      const minScale = 1;
      const maxScale = 4;
      const direction = e.deltaY > 0 ? -1 : 1;
      const newScale = clamp(scale * (1 + zoomIntensity * direction), minScale, maxScale);
      const rect = containerRef.current.getBoundingClientRect();
      const dx = e.clientX - rect.left - rect.width / 2;
      const dy = e.clientY - rect.top - rect.height / 2;
      // Keep cursor point under the same position relative to image during zoom
      const ratio = newScale / scale;
      const nextX = translate.x - dx * (ratio - 1);
      const nextY = translate.y - dy * (ratio - 1);
      const { maxX, maxY } = getBounds(newScale);
      setScale(newScale);
      setTranslate({ x: clamp(nextX, -maxX, maxX), y: clamp(nextY, -maxY, maxY) });
    };

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (scale <= 1) return;
      const target = e.currentTarget as HTMLElement;
      try {
        target.setPointerCapture(e.pointerId);
      } catch {
        // noop
      }
      setIsDragging(true);
      dragStateRef.current = {
        id: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        origX: translate.x,
        origY: translate.y,
      };
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || dragStateRef.current.id !== e.pointerId) return;
      const dx = e.clientX - dragStateRef.current.startX;
      const dy = e.clientY - dragStateRef.current.startY;
      const nextX = dragStateRef.current.origX + dx;
      const nextY = dragStateRef.current.origY + dy;
      const { maxX, maxY } = getBounds(scale);
      setTranslate({ x: clamp(nextX, -maxX, maxX), y: clamp(nextY, -maxY, maxY) });
    };

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragStateRef.current.id === e.pointerId) {
        setIsDragging(false);
        dragStateRef.current = { id: null, startX: 0, startY: 0, origX: 0, origY: 0 };
      }
    };

    const onDoubleClick = () => {
      const midScale = 2;
      if (scale > 1) {
        resetTransform();
      } else {
        const { maxX, maxY } = getBounds(midScale);
        setScale(midScale);
        setTranslate({ x: clamp(0, -maxX, maxX), y: clamp(0, -maxY, maxY) });
      }
    };

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
        <DialogContent className="z-50 w-auto max-w-[70vw] p-0.5 bg-transparent border-0 shadow-none">
          <div
            ref={containerRef}
            onWheel={handleWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onDoubleClick={onDoubleClick}
            className="relative overflow-hidden bg-black/50 rounded-md flex items-center justify-center mx-auto"
            style={{ width: 'min(70vw, 720px)', height: 'min(80vh, 720px)' }}
          >
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              draggable={false}
              className={cn('select-none pointer-events-none', className)}
              style={{
                transform: `translate3d(${translate.x}px, ${translate.y}px, 0) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 120ms ease-out',
                objectFit: 'contain',
                maxWidth: '100%',
                maxHeight: '100%',
                willChange: 'transform',
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);
ImageZoom.displayName = 'ImageZoom';

export { ImageZoom };
