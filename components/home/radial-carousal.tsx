'use client';

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  type Variants,
} from 'motion/react';
import { X } from 'lucide-react';
import ExpandableProfileCard from './expandable-profile';

export interface GalleryItem {
  id: string | number;
  url: string;
  title?: string;
  subtitle?: string;
  content?: React.ReactNode;
}

export interface RadialCarouselProps {
  items: GalleryItem[];
  radius?: number;
  thumbnailSize?: number;
  centerSize?: number;
}

export const RadialCarousel: React.FC<RadialCarouselProps> = ({
  items,
  radius = 260,
  thumbnailSize = 110,
  centerSize = 400,
}) => {
  const [isExpanded, setIsExpanded] = useState(true); // Default to scattered view
  const [activeIndex, setActiveIndex] = useState(0);

  const [responsiveSizes, setResponsiveSizes] = useState({
    radius,
    thumbnailSize,
    centerSize,
  });

  const dragConstraintsRef = useRef(null);

  useEffect(() => {
    const updateSizes = () => {
      const width = window.innerWidth;
      if (width < 400) {
        setResponsiveSizes({
          radius: Math.min(radius, 130),
          thumbnailSize: Math.min(thumbnailSize, 80),
          centerSize: Math.min(centerSize, 260),
        });
      } else if (width < 640) {
        setResponsiveSizes({
          radius: Math.min(radius, 180),
          thumbnailSize: Math.min(thumbnailSize, 90),
          centerSize: Math.min(centerSize, 300),
        });
      } else if (width < 1024) {
        setResponsiveSizes({
          radius: Math.min(radius, 240),
          thumbnailSize: Math.min(thumbnailSize, 100),
          centerSize: Math.min(centerSize, 340),
        });
      } else {
        setResponsiveSizes({ radius, thumbnailSize, centerSize });
      }
    };

    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, [radius, thumbnailSize, centerSize]);

  // Generate consistent pseudo-random positions for the scattered notes
  const randomConfigs = useMemo(() => {
    let seed = 12345;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    return items.map(() => {
      return {
        nx: random() * 2 - 1, // -1 to 1
        ny: random() * 2 - 1, // -1 to 1
        nRot: (random() * 2 - 1) * 35, // -35 to 35 degrees
      };
    });
  }, [items]);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
    setIsExpanded(false);
  };

  const containerVariants: Variants = {
    collapsed: { transition: { staggerChildren: 0.01, staggerDirection: -1 } },
    expanded: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
  };

  return (
    <div 
      ref={dragConstraintsRef}
      className="relative flex h-[400px] w-full items-center justify-center overflow-visible select-none sm:h-[500px]"
    >
      <AnimatePresence mode="popLayout">
        {!isExpanded ? (
          <motion.div
            key="center-view"
            layout
            transition={{ type: 'spring', bounce: 0.15, duration: 0.15 }}
            className="relative z-10 w-[300px] sm:w-[400px]"
          >
            <div className="relative">
              <ExpandableProfileCard
                imageSrc={items[activeIndex].url}
                title={items[activeIndex].title}
                subtitle={items[activeIndex].subtitle}
                content={items[activeIndex].content}
                layoutIdPrefix={`card-${items[activeIndex].id}`}
              />

              <button
                onClick={toggleExpand}
                className="absolute -top-3 -right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 transition-colors backdrop-blur-md shadow-lg"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="wall-view"
            variants={containerVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="relative flex h-full w-full items-center justify-center"
          >
            <motion.div
              drag
              dragConstraints={dragConstraintsRef}
              dragElastic={0.2}
              className="relative flex h-full w-full cursor-grab active:cursor-grabbing items-center justify-center"
            >
              {items.map((item, index) => {
                const config = randomConfigs[index];
                // Spread notes based on radius
                const targetX = config.nx * responsiveSizes.radius * 1.8;
                const targetY = config.ny * responsiveSizes.radius * 0.8;
                return (
                  <Item
                    key={item.id}
                    item={item}
                    targetX={targetX}
                    targetY={targetY}
                    targetRotate={config.nRot}
                    thumbnailSize={responsiveSizes.thumbnailSize}
                    onClick={() => handleItemClick(index)}
                  />
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ItemProps {
  item: GalleryItem;
  targetX: number;
  targetY: number;
  targetRotate: number;
  thumbnailSize: number;
  onClick: () => void;
}

const Item: React.FC<ItemProps> = ({
  item,
  targetX,
  targetY,
  targetRotate,
  thumbnailSize,
  onClick,
}) => {
  const itemVariants: Variants = {
    collapsed: {
      opacity: 0,
      scale: 0.5,
      x: 0,
      y: 0,
      rotate: 0,
      transition: { type: 'spring', bounce: 0.3, duration: 0.4 },
    },
    expanded: {
      scale: 1,
      opacity: 1,
      x: targetX,
      y: targetY,
      rotate: targetRotate,
      transition: { type: 'spring', bounce: 0.4, duration: 0.6 },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      onClick={onClick}
      className="absolute cursor-pointer"
      whileHover={{ scale: 1.1, zIndex: 50, rotate: targetRotate > 0 ? targetRotate - 5 : targetRotate + 5 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        layoutId={`card-${item.id}`}
        style={{ width: thumbnailSize, height: thumbnailSize }}
        className="overflow-hidden rounded-xl border-4 border-white bg-white shadow-xl transition-shadow hover:shadow-2xl sm:rounded-2xl dark:border-neutral-800 dark:bg-neutral-900"
      >
        <motion.img
          layoutId={`image-card-${item.id}`}
          src={item.url}
          alt={item.title}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
};


