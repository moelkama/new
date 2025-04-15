import { motion, useAnimation } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface AnimateChangeInHeightProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  skipInitialAnimation?: boolean;
}

const AnimateChangeInHeight = ({
  children,
  className = "",
  isOpen,
  skipInitialAnimation = false,
}: AnimateChangeInHeightProps) => {
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setContentHeight] = useState(0);
  const [, setIsAnimating] = useState(false);

  // Measure the height of the inner div using ResizeObserver
  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const newHeight = entries[0].contentRect.height;
        setContentHeight(newHeight);
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Start animation when isOpen changes to true
  useEffect(() => {
    if (skipInitialAnimation && isOpen) {
      // Only set height to auto if it should be open and we're skipping animation
      controls.set({ height: "auto" });
      return;
    }

    if (isOpen) {
      setIsAnimating(true);
      controls.start({ height: "auto" });
    } else {
      controls.start({ height: 0 });
    }
  }, [isOpen, controls, skipInitialAnimation]);

  // After animation completes, stop animating if open
  const handleAnimationComplete = () => {
    if (isOpen) {
      setIsAnimating(false);
    }
  };

  return (
    <motion.div
      className="overflow-hidden"
      // Only set initial height to auto if it should be open AND we're skipping animation
      initial={
        skipInitialAnimation && isOpen ? { height: "auto" } : { height: 0 }
      }
      animate={controls}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
      onAnimationComplete={handleAnimationComplete}
    >
      <div ref={containerRef} className={className}>
        {children}
      </div>
    </motion.div>
  );
};

export default AnimateChangeInHeight;
