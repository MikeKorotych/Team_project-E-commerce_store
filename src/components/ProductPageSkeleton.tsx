import React from 'react';
import { motion } from 'framer-motion';

// Skeleton Box component з Framer Motion анімацією
const SkeletonBox = ({ width, height, className = "", circle = false }: {
  width?: number | string;
  height?: number | string;
  className?: string;
  circle?: boolean;
}) => (
  <motion.div
    className={`bg-gray-700 ${circle ? 'rounded-full' : 'rounded'} ${className}`}
    style={{ 
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height 
    }}
    animate={{
      opacity: [0.7, 1, 0.7],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

export const ProductPageSkeleton = () => {
  return (
    <div className="font-sans bg-[#1a1a29] text-white min-h-screen p-4 md:p-8">
      {/* Breadcrumb skeleton */}
      <div className="text-sm mb-4">
        <div className="flex items-center gap-2">
          <SkeletonBox width={16} height={16} />
          <SkeletonBox width={8} height={8} />
          <SkeletonBox width={64} height={16} />
        </div>
      </div>

      {/* Back button skeleton */}
      <div className="flex items-center mb-6">
        <SkeletonBox width={16} height={16} className="mr-2" />
        <SkeletonBox width={48} height={16} />
      </div>

      {/* Title skeleton */}
      <div className="mb-8">
        <SkeletonBox width={320} height={32} />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Image section skeleton */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2 mb-8 md:mb-0">
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible p-2">
            {[...Array(4)].map((_, index) => (
              <SkeletonBox key={index} width={80} height={80} className="flex-shrink-0" />
            ))}
          </div>
          <div className="flex-grow flex justify-center items-center p-2">
            <SkeletonBox width="100%" height={300} className="md:h-[400px]" />
          </div>
        </div>

        {/* Details section skeleton */}
        <div className="w-full md:w-1/2">
          {/* ID skeleton */}
          <div className="flex items-center mb-4">
            <SkeletonBox width={96} height={16} />
          </div>

          {/* Colors skeleton */}
          <div className="mb-6">
            <SkeletonBox width={128} height={20} className="mb-2" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, index) => (
                <SkeletonBox key={index} width={32} height={32} circle />
              ))}
            </div>
          </div>

          {/* Capacity skeleton */}
          <div className="mb-6">
            <SkeletonBox width={112} height={20} className="mb-2" />
            <div className="flex gap-2 flex-wrap">
              {[...Array(3)].map((_, index) => (
                <SkeletonBox key={index} width={64} height={40} />
              ))}
            </div>
          </div>

          {/* Price skeleton */}
          <div className="flex items-baseline gap-2 mb-6">
            <SkeletonBox width={80} height={32} />
            <SkeletonBox width={64} height={24} />
          </div>

          {/* Buttons skeleton */}
          <div className="flex gap-4 mb-8">
            <SkeletonBox height={48} width="100%" className="flex-grow" />
            <SkeletonBox width={48} height={48} />
          </div>

          {/* Specs skeleton */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            {[...Array(4)].map((_, index) => (
              <React.Fragment key={index}>
                <SkeletonBox width={64} height={16} />
                <SkeletonBox width={80} height={16} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* About and Tech specs skeleton */}
      <div className="mt-16 border-t border-gray-700 pt-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <SkeletonBox width={64} height={24} className="mb-4" />
          {[...Array(3)].map((_, index) => (
            <div key={index} className="mb-6">
              <SkeletonBox width={160} height={20} className="mb-2" />
              <div className="space-y-2">
                <SkeletonBox height={16} width="100%" />
                <SkeletonBox width="80%" height={16} />
                <SkeletonBox width="75%" height={16} />
              </div>
            </div>
          ))}
        </div>

        <div className="w-full md:w-1/2">
          <SkeletonBox width={96} height={24} className="mb-4" />
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            {[...Array(8)].map((_, index) => (
              <React.Fragment key={index}>
                <SkeletonBox width={80} height={16} />
                <SkeletonBox width={96} height={16} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* You may also like skeleton */}
      <div className="mt-16 border-t border-gray-700 pt-8">
        <div className="flex justify-between py-[24px]">
          <SkeletonBox width={192} height={32} />
          <div className="flex gap-4">
            <SkeletonBox width={40} height={40} />
            <SkeletonBox width={40} height={40} />
          </div>
        </div>
        <div className="flex gap-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="w-[250px] flex-shrink-0">
              <div className="bg-gray-800 rounded-lg p-4">
                <SkeletonBox height={196} width="100%" className="mb-4" />
                <SkeletonBox width="80%" height={16} className="mb-2" />
                <SkeletonBox width="60%" height={16} className="mb-4" />
                <div className="flex gap-2 mb-4">
                  <SkeletonBox width={64} height={24} />
                  <SkeletonBox width={48} height={24} />
                </div>
                <div className="space-y-2 mb-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <SkeletonBox width={48} height={12} />
                      <SkeletonBox width={64} height={12} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <SkeletonBox height={40} width="100%" className="flex-1" />
                  <SkeletonBox width={40} height={40} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
