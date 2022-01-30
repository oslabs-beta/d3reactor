import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
  Margin,
  ScaleFunc,
  toolTipState,
  xAccessorFunc,
  yAccessorFunc,
} from '../../types';

export default function ListeningRect({
  data,
  layers,
  width,
  height,
  margin,
  xScale,
  yScale,
  xKey,
  yKey,
  xAccessor,
  setTooltip,
}: {
  data: any;
  layers: d3.Series<
    {
      [key: string]: number;
    },
    string
  >[];
  width: number;
  height: number;
  margin: Margin;
  xScale: ScaleFunc;
  yScale: ScaleFunc;
  xKey: string;
  yKey: string;
  xAccessor: xAccessorFunc;
  yAccessor: yAccessorFunc;
  setTooltip?: React.Dispatch<any>;
}) {
  const anchor = useRef(null);

  // const [scrollPosition, setScrollPosition] = useState(0);

  // const handleScroll = () => {
  //   const position = window.pageYOffset;
  //   setScrollPosition(position);
  // };

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll, { passive: true });

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  const tooltipState: toolTipState = {
    cursorX: 0,
    cursorY: 0,
    distanceFromTop: 0,
    distanceFromRight: 0,
    distanceFromLeft: 0,
    data,
  };

  function onMouseMove(e: any) {
    let sBrowser;
    const sUsrAg = navigator.userAgent;
    if (sUsrAg.indexOf('Firefox') > -1) {
      sBrowser = 'Mozilla Firefox';
      // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
    } else if (sUsrAg.indexOf('SamsungBrowser') > -1) {
      sBrowser = 'Samsung Internet';
      // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
    } else if (sUsrAg.indexOf('Opera') > -1 || sUsrAg.indexOf('OPR') > -1) {
      sBrowser = 'Opera';
      // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
    } else if (sUsrAg.indexOf('Trident') > -1) {
      sBrowser = 'Microsoft Internet Explorer';
      // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
    } else if (sUsrAg.indexOf('Edge') > -1) {
      sBrowser = 'Microsoft Edge';
      // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
    } else if (sUsrAg.indexOf('Chrome') > -1) {
      sBrowser = 'Chrome';
      // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
    } else if (sUsrAg.indexOf('Safari') > -1) {
      sBrowser = 'Safari';
      // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
    } else {
      sBrowser = 'unknown';
    }
    const mousePosition = d3.pointer(e);
    const hoveredX = xScale.invert(mousePosition[0]);
    const hoveredY = yScale.invert(mousePosition[1]);

    // ****************************************
    // Find x position
    // ****************************************
    let closestXValue: any = 0;
    const getDistanceFromHoveredX = function (d: any) {
      // This StackOverFlow Article helped me with this TS issue
      // https://stackoverflow.com/questions/48274028/the-left-hand-and-right-hand-side-of-an-arithmetic-operation-must-be-of-type-a
      return Math.abs(xAccessor(d).valueOf() - hoveredX.valueOf());
    };

    const closestXIndex = d3.leastIndex(data, (a, b) => {
      return getDistanceFromHoveredX(a) - getDistanceFromHoveredX(b);
    });

    if (typeof closestXIndex === 'number') {
      const closestDataPoint = data[closestXIndex];
      closestXValue = xAccessor(closestDataPoint);

      tooltipState.cursorX =
        sBrowser === 'Chrome'
          ? e.nativeEvent.pageX - e.nativeEvent.layerX + xScale(closestXValue)
          : e.nativeEvent.pageX - e.nativeEvent.offsetX + xScale(closestXValue);
    }

    // ****************************************
    // Find y position
    // ****************************************
    let closestYValue: any = 0;
    const closestYSequence = layers.map((layer) => {
      if (typeof closestXIndex === 'number') {
        return layer[closestXIndex][1];
      }
    });

    const getDistanceFromHoveredY = function (d: any) {
      return Math.abs(d - hoveredY.valueOf());
    };

    const closestYIndex = d3.leastIndex(closestYSequence, (a, b) => {
      return getDistanceFromHoveredY(a) - getDistanceFromHoveredY(b);
    });

    if (typeof closestYIndex === 'number') {
      if (typeof closestXIndex === 'number') {
        closestYValue = layers[closestYIndex][closestXIndex][1];

        tooltipState.cursorY =
          sBrowser === 'Chrome'
            ? e.pageY - e.nativeEvent.layerY + yScale(closestYValue)
            : e.pageY - e.nativeEvent.offsetY + yScale(closestYValue);

        const closestYKey: string = layers[closestYIndex].key;
        tooltipState.data = {
          [xKey]: data[closestXIndex][xKey],
          [yKey]: data[closestXIndex][closestYKey],
        };
      }
    }

    tooltipState.distanceFromTop = tooltipState.cursorY + margin.top;
    tooltipState.distanceFromRight =
      width - (margin.left + tooltipState.cursorX);
    tooltipState.distanceFromLeft = margin.left + tooltipState.cursorX;

    if (setTooltip) {
      setTooltip(tooltipState);
    }
  }
  const rectWidth = width - margin.right - margin.left;
  const rectHeight = height - margin.bottom - margin.top;
  return (
    <rect
      ref={anchor}
      width={rectWidth >= 0 ? rectWidth : 0}
      height={rectHeight >= 0 ? rectHeight : 0}
      fill="transparent"
      onMouseMove={onMouseMove}
      onMouseLeave={() => (setTooltip ? setTooltip(false) : null)}
    />
  );
}
