import React from 'react';
//import {scaleTime} from "d3-scale";
//import { extent, max, min } from "d3-array"
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { Axis } from '../ContinuousAxis';
import { ContinuousAxisProps } from '../../../types';
import unemployment from '../../data/unemployment.json'

//this test is currently not running due to issues with d3 module internal use of ES6 modules. Transformation in 

// const setup = (props:ContinuousAxisProps) => {
//   return render(<svg><Axis {...props} /></svg>);
// };

// const mockData = unemployment;
// const rangeMax = 500 - 541 - 80;
// const [xMin, xMax] = extent(mockData, (d) => new Date(d['date']));
// const xScale = scaleTime()
// .domain([xMin ?? 0, xMax ?? 0])
// .range([0, rangeMax > 40 ? rangeMax : 40]);
// const initialProps: ContinuousAxisProps = {
//   x: 0,
//   y: 1037,
//   scale: xScale,
//   type: 'bottom',
//   width: 500,
//   height: 500,
//   margin: {left: 80, right: 541, top: 20, bottom: 80},
//   xGrid: false,
//   yGrid: undefined,
//   xTicksValue: [
//     "2000-01-01T00:00:00.000Z",
//     "2000-01-01T05:00:00.000Z",
//     "2001-01-01T05:00:00.000Z",
//     "2002-01-01T05:00:00.000Z",
//     "2003-01-01T05:00:00.000Z",
//     "2004-01-01T05:00:00.000Z",
//     "2005-01-01T05:00:00.000Z",
//     "2006-01-01T05:00:00.000Z",
//     "2007-01-01T05:00:00.000Z",
//     "2008-01-01T05:00:00.000Z",
//     "2009-01-01T05:00:00.000Z",
//     "2010-01-01T05:00:00.000Z",
//     "2011-01-01T05:00:00.000Z",
//     "2012-01-01T05:00:00.000Z",
//     "2013-01-01T05:00:00.000Z",
//     "2013-10-01T00:00:00.000Z"
// ]
// }




describe('Continuous Axis test', () => {

  test('it should render Line', () => {
    // setup(initialProps);
    // expect(screen.getByTestId('d3reactor-continuous')).toBeVisible()
  })
});