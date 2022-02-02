import { Margin, LegendPos } from '../types';
import { DiscreteAxis } from './components/DiscreteAxis';

const LightTheme = {
  strokeGridLineColor: '#ebebeb',
  textColor: '#8c8c8c',
  axisBaseLineColor: '#ebebeb',
  legendTextColor: '#212121',
  legendBackgroundColor: '#ffffff',
  legendBorder: '1px solid #ebebeb',
};

const DarkTheme = {
  strokeGridLineColor: '#3d3d3d',
  textColor: '#727272',
  axisBaseLineColor: '#3d3d3d',
  legendTextColor: '#e5e5e5',
  legendBackgroundColor: '#1d1d1d',
  legendBorder: '1px solid #3d3d3d',
};

export const themes = {
  light: LightTheme,
  dark: DarkTheme,
};

export function getBrowser() {
  let browser;
  const sUsrAg = navigator.userAgent;
  if (sUsrAg.indexOf('Firefox') > -1) {
    browser = 'Mozilla Firefox';
    // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
  } else if (sUsrAg.indexOf('SamsungBrowser') > -1) {
    browser = 'Samsung Internet';
    // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
  } else if (sUsrAg.indexOf('Opera') > -1 || sUsrAg.indexOf('OPR') > -1) {
    browser = 'Opera';
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
  } else if (sUsrAg.indexOf('Trident') > -1) {
    browser = 'Microsoft Internet Explorer';
    // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
  } else if (sUsrAg.indexOf('Edge') > -1) {
    browser = 'Microsoft Edge';
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
  } else if (sUsrAg.indexOf('Chrome') > -1) {
    browser = 'Chrome';
    // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
  } else if (sUsrAg.indexOf('Safari') > -1) {
    browser = 'Safari';
    // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
  } else {
    browser = 'unknown';
  }
  return browser;
}

export const EXTRA_LEGEND_MARGIN = 6;

export function getXAxisCoordinates(
  xAxis: 'top' | 'bottom' | false = 'bottom',
  height: number,
  margin: Margin
) {
  const xAxisX = 0;
  const marginDifference = height - margin.top - margin.bottom;
  let xAxisY: number = marginDifference > 40 ? marginDifference : 40;

  if (xAxis === 'top') xAxisY = 0;

  return {
    xAxisX,
    xAxisY,
  };
}

export function getYAxisCoordinates(
  yAxis: 'left' | 'right' | false = 'left',
  width: number,
  margin: Margin
) {
  let yAxisX = 0;
  const yAxisY = 0;
  const marginDifference = width - margin.left - margin.right;
  if (yAxis === 'right') yAxisX = marginDifference > 40 ? marginDifference : 40;

  return {
    yAxisX,
    yAxisY,
  };
}

export function getMargins(
  xAxis: 'top' | 'bottom' | false = 'bottom',
  yAxis: 'left' | 'right' | false = 'left',
  xAxisLabel: string | undefined,
  yAxisLabel: string | undefined
) {
  let left = 20,
    right = 20,
    top = 20,
    bottom = 20;

  function addVerticalMargin() {
    switch (xAxis) {
      case 'top':
        top += 40;
        break;
      case 'bottom':
        bottom += 40;
    }
  }

  function addHorizontalMargin() {
    switch (yAxis) {
      case 'left':
        left += 40;
        break;
      case 'right':
        right += 40;
    }
  }

  if (xAxis) addVerticalMargin();
  if (xAxis && xAxisLabel) addVerticalMargin();
  if (yAxis) addHorizontalMargin();
  if (yAxis && yAxisLabel) addHorizontalMargin();

  return { left, right, top, bottom };
}

export function getMarginsWithLegend(
  xAxis: 'top' | 'bottom' | false | undefined,
  yAxis: 'left' | 'right' | false | undefined,
  xAxisLabel: string | undefined,
  yAxisLabel: string | undefined,
  legend: LegendPos = false,
  xOffset = 0,
  yOffset = 0,
  // legendOffset: [number, number] = [0, 0], // ideally this should be mandatory if legend is truthy
  cWidth = 0, // ideally this should be mandatory if legend is truthy
  cHeight = 0, // ideally this should be mandatory if legend is truthy
  tickMargin?: number
) {
  let left = 20,
    right = 20,
    top = 20,
    bottom = tickMargin ? tickMargin + 20 : 20;
  function addVerticalMargin() {
    switch (xAxis) {
      case 'top':
        top += 40;
        break;
      case 'bottom':
        bottom += 40;
    }
  }
  function addHorizontalMargin() {
    switch (yAxis) {
      case 'left':
        left += 40;
        break;
      case 'right':
        right += 40;
    }
  }

  function addVerticalMargin1() {
    switch (xAxis) {
      case 'top':
        top += 20;
        break;
      case 'bottom':
        bottom += 20;
        break;
      case undefined:
        bottom += 20;
        break;
      case false:
        bottom += 20;
        break;
    }
  }
  function addHorizontalMargin1() {
    switch (yAxis) {
      case 'left':
        left += 20;
        break;
      case 'right':
        right += 20;
        break;
      case undefined:
        left += 20;
        break;
      case false:
        left += 20;
        break;
    }
  }
  if (xAxis) addVerticalMargin();
  if (xAxisLabel) addVerticalMargin1();
  if (yAxis) addHorizontalMargin();
  if (yAxisLabel) addHorizontalMargin1();

  if (legend === true) legend = 'right';
  if (legend) {
    // make room for legend by adjusting margin:
    // const xOffset = legendOffset[0];
    // const yOffset = legendOffset[1];
    let marginExt = 0;
    switch (legend) {
      case 'top':
      case 'left-top':
      case 'right-top':
        top += yOffset + EXTRA_LEGEND_MARGIN;
        break;
      case 'left-bottom':
      case 'right-bottom':
      case 'bottom':
        bottom += yOffset + EXTRA_LEGEND_MARGIN;
        break;
      case 'left':
      case 'top-left':
      case 'bottom-left':
        marginExt = left + xOffset + EXTRA_LEGEND_MARGIN;
        if (marginExt > 0) left = marginExt;
        break;
      case 'top-right':
      case 'bottom-right':
      case 'right':
      default:
        marginExt = right + xOffset + EXTRA_LEGEND_MARGIN;
        if (marginExt > 0) right = marginExt;
    }
  }
  return { left, right, top, bottom };
}

export const LABEL_MARGIN = 20;
export const AXIS_MARGIN = 40;

export function getAxisLabelCoordinates(
  x: number,
  y: number,
  height: number,
  width: number,
  margin: Margin,
  type: string | boolean,
  axis: boolean,
  tickMargin = 0
) {
  let rotate = 0;
  let axisLabelX = 0;
  let axisLabelY = 0;
  const labelMargin = LABEL_MARGIN;
  const axisMargin = AXIS_MARGIN + tickMargin;
  let position: number;
  switch (type) {
    case 'top':
      position = width - margin.right - margin.left;
      axisLabelX = position > 40 ? position / 2 : 40 / 2;
      axisLabelY = y - labelMargin / 2 - axisMargin;
      rotate = 0;
      break;
    case 'right':
      axisLabelX = x + labelMargin / 2 + axisMargin;
      position = height - margin.top - margin.bottom;
      axisLabelY = position > 40 ? position / 2 : 40 / 2;
      rotate = 90;
      break;
    case 'bottom':
      position = width - margin.right - margin.left;
      axisLabelX = position > 40 ? position / 2 : 40 / 2;
      axisLabelY = axis ? y + labelMargin + axisMargin : y + labelMargin;
      rotate = 0;
      break;
    case 'left':
      axisLabelX = axis ? -labelMargin / 2 - axisMargin : -labelMargin;
      position = height - margin.top - margin.bottom;
      axisLabelY = position > 40 ? position / 2 : 40 / 2;
      rotate = -90;
      break;
    case false:
      axisLabelX = -labelMargin / 2;
      axisLabelY = (height - margin.top - margin.bottom) / 2;
      rotate = -90;
  }
  return {
    axisLabelX,
    axisLabelY,
    rotate,
  };
}

export function checkRadiusDimension(
  height: number,
  width: number,
  radius: number | string,
  margin: Margin,
  legend?: LegendPos
) {
  //TODO: add minimum radius here?

  let legendMargin = 0;
  const screenSize = Math.min(height, width);
  switch (legend) {
    case 'top':
    case 'left-top':
    case 'right-top':
      legendMargin = margin.top;
      break;
    case 'bottom':
    case 'left-bottom':
    case 'right-bottom':
      legendMargin = Math.abs(margin.bottom);
      break;
    case 'left':
    case 'top-left':
    case 'bottom-left':
      legendMargin = margin.left;
      break;
    case 'right':
    case 'top-right':
    case 'bottom-right':
      legendMargin = margin.right;
      break;
  }

  if (typeof radius === 'string' && radius.endsWith('%')) {
    radius = radius.slice(0, -1);
    return ((Number(radius) * (screenSize - legendMargin)) / 2) * 0.01;
  } else if (Number(radius) > (screenSize - legendMargin) / 2) {
    return (screenSize - legendMargin) / 2;
  } else {
    return Number(radius);
  }
}

export function calculateOuterRadius(
  height: number,
  width: number,
  margin: Margin
) {
  const radius = Math.min(
    (height - margin.top - margin.bottom) / 2,
    (width - margin.left - margin.right) / 2
  );
  return Math.max(radius, 20);
}

interface CountryDataProps {
  key: string;
  values: Array<Array<number>>;
}

export function findYDomainMax(data: any, keyArr: string[]) {
  let yDomainMax = 0;
  data.forEach((obj: any) => {
    let stackedHeight = 0;
    for (const key of keyArr) {
      stackedHeight += obj[key];
      if (stackedHeight > yDomainMax) yDomainMax = stackedHeight;
    }
  });
  return yDomainMax;
}

interface CountryDataProps {
  key: string;
  values: Array<Array<number>>;
}

export function transformCountryData(arr: CountryDataProps[]) {
  const transformed = [];
  for (let i = 0; i < arr[0].values.length; i++) {
    const entry: any = {
      // TODO: get rid of any?
      date: arr[0].values[i][0],
    };
    for (let j = 0; j < arr.length; j++) {
      entry[arr[j].key] = arr[j].values[i][1];
    }
    transformed.push(entry);
  }
  return transformed;
}

export function transformSkinnyToWide(
  arr: any,
  keys: any,
  groupBy: string | undefined,
  xDataKey: string | undefined,
  yDataKey: string | undefined
) {
  const outputArr = [];
  // Find unique x vals. create 1 object with date prop for each date
  const rowsArr: any = [];
  for (const entry of arr) {
    if (!rowsArr.includes(entry[xDataKey ?? '']))
      rowsArr.push(entry[xDataKey ?? '']);
  }
  // create 1 prop with key for each val in keys, and associated val of 'value' from input arr at the object with current date & key name
  for (const rowValue of rowsArr) {
    const rowObj: any = {};
    rowObj[xDataKey ?? ''] = rowValue;

    for (const key of keys) {
      rowObj[key] = arr.reduce((val: number | undefined, currentRow: any) => {
        if (
          currentRow[xDataKey ?? ''] === rowValue &&
          currentRow[groupBy ?? ''] === key
        ) {
          return currentRow[yDataKey ?? ''];
        } else {
          return val;
        }
      }, null);
    }
    outputArr.push(rowObj);
  }
  return outputArr;
}

export function inferXDataType(el: any, xKey: string) {
  let xDataType: 'number' | 'date' | undefined;
  if (
    (typeof el[xKey] === 'string' && !isNaN(Date.parse(el[xKey]))) ||
    el[xKey] instanceof Date
  ) {
    xDataType = 'date';
  } else if (typeof el[xKey] === 'number') {
    xDataType = 'number';
  } else {
    throw new Error('Incorrect datatype');
  }
  return xDataType;
}
