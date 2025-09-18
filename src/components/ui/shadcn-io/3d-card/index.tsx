'use client';

import { cn } from '@/lib/utils';
import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    rotateX.set(-y);
    rotateY.set(x);
  };

  const handleMouseEnter = (_: React.MouseEvent<HTMLDivElement>) => {
    setIsMouseEntered(true);
    if (!containerRef.current) return;
  };

  const handleMouseLeave = (_: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const rotateXSpring = useSpring(rotateX, {
    stiffness: 100,
    damping: 35,
    mass: 0.5,
  });

  const rotateYSpring = useSpring(rotateY, {
    stiffness: 100,
    damping: 35,
    mass: 0.5,
  });

  const transform = useTransform(
    [rotateXSpring, rotateYSpring],
    ([newRotateX, newRotateY]) => {
      return `rotateX(${newRotateX}deg) rotateY(${newRotateY}deg)`;
    }
  );

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn('flex items-center justify-center', containerClassName)}
        style={{
          perspective: '1000px',
        }}
      >
        <motion.div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          className={cn(
            'flex items-center justify-center relative w-full',
            // 'flex items-center justify-center relative transition-all duration-200 ease-linear w-full',

            className
          )}
          style={{
            transformStyle: 'preserve-3d',
            transform,
          }}
        >
          {children}
        </motion.div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        '[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardItem = ({
  as: Tag = 'div',
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  [key: string]: unknown;
}) => {
  const [isMouseEntered] = useMouseEnter();

  // Создаем отдельные motion values для каждого параметра
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const tz = useMotionValue(0);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rz = useMotionValue(0);

  // Применяем пружинную анимацию с настроенными параметрами
  const springConfig = {
    stiffness: 180,
    damping: 50,
    mass: 1.6,
    restDelta: 0.001,
  };
  const txSpring = useSpring(tx, springConfig);
  const tySpring = useSpring(ty, springConfig);
  const tzSpring = useSpring(tz, springConfig);
  const rxSpring = useSpring(rx, springConfig);
  const rySpring = useSpring(ry, springConfig);
  const rzSpring = useSpring(rz, springConfig);

  // Создаем transform с помощью useTransform
  const transform = useTransform(
    [txSpring, tySpring, tzSpring, rxSpring, rySpring, rzSpring],
    ([x, y, z, rotX, rotY, rotZ]) =>
      `translateX(${x}px) translateY(${y}px) translateZ(${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`
  );

  // Обновляем значения при изменении состояния
  useEffect(() => {
    if (isMouseEntered) {
      tx.set(Number(translateX));
      ty.set(Number(translateY));
      tz.set(Number(translateZ));
      rx.set(Number(rotateX));
      ry.set(Number(rotateY));
      rz.set(Number(rotateZ));
    } else {
      tx.set(0);
      ty.set(0);
      tz.set(0);
      rx.set(0);
      ry.set(0);
      rz.set(0);
    }
  }, [
    isMouseEntered,
    translateX,
    translateY,
    translateZ,
    rotateX,
    rotateY,
    rotateZ,
    tx,
    ty,
    tz,
    rx,
    ry,
    rz,
  ]);

  const MotionTag = motion(Tag);

  return (
    <MotionTag
      className={className}
      style={{
        transform,
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error('useMouseEnter must be used within a CardContainer');
  }
  return context;
};
