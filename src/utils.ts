import { Margin, LegendPos } from '../types';
import { DiscreteAxis } from './components/DiscreteAxis';

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
  const fontSize = 16;

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

interface CorrectedCountryDataProps {
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
