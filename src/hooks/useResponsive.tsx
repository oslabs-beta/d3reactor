import React, { useState, useEffect, useRef } from 'react';
import useEnvEffect from './useEnvEffect';
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState<[number, number]>([0, 0]);
  const [cHeight, setCHeight] = useState<number>(0);
  const [cWidth, setCWidth] = useState<number>(0);

  function updateSize() {
    setWindowSize([window.innerWidth, window.innerHeight]);
  }

  const anchor = useRef(null as any);

  useEnvEffect(() => {
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const container = anchor.current.getBoundingClientRect();
    setCHeight(container.height > 100 ? container.height : 100);
    setCWidth(container.width > 100 ? container.width : 100);
  }, [windowSize]);

  return { anchor, cHeight, cWidth };
};
