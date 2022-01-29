import { useState, useEffect } from 'react';


export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    {width: 0, height: 0}
  );

  useEffect(() => {
    function getWindowDimensions() {
      const { innerWidth: width, innerHeight: height } = window;
      return {
        width,
        height,
      };
    }
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    handleResize() 

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
