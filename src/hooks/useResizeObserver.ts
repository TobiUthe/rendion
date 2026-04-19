"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Dimensions {
  width: number;
  height: number;
}

export function useResizeObserver(): {
  ref: React.RefObject<HTMLDivElement | null>;
  width: number;
  height: number;
} {
  const ref = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      setDimensions((prev) => {
        if (prev.width === Math.floor(width) && prev.height === Math.floor(height)) {
          return prev;
        }
        return { width: Math.floor(width), height: Math.floor(height) };
      });
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(handleResize);
    observer.observe(element);

    const rect = element.getBoundingClientRect();
    setDimensions({
      width: Math.floor(rect.width),
      height: Math.floor(rect.height),
    });

    return () => {
      observer.disconnect();
    };
  }, [handleResize]);

  return { ref, ...dimensions };
}
