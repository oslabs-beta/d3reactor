import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Line } from '../Line';
import { LineProps } from '../../../types';

const mockedData =
  'M0,594.1063333333333L290.1190476190476,6.0830000000000055L580.2380952380952,491.5643333333333L638.2619047619048,815.4116666666666L696.2857142857142,807.301L754.3095238095239,718.9526666666667L812.3333333333333,581.9403333333333L870.3571428571429,689.4066666666666L928.3809523809523,730.2496666666667L986.4047619047619,806.1423333333333L1044.4285714285713,844.3783333333333L1102.452380952381,684.1926666666667L1160.4761904761904,643.6393333333333L1218.5,767.0373333333333';
const stroke = 'rgb(157, 200, 226)';
const LineProps: LineProps = {
  fill: 'none',
  stroke: stroke,
  strokeWidth: '1px',
  d: mockedData,
};
const svg = document.createElement('svg');

const setup = () => {
  return render(
    <svg>
      <Line {...LineProps} />
    </svg>
  );
};

describe('Line test', () => {
  test('it should render Line', () => {
    setup();
    expect(screen.getByTestId('d3reactor-line')).toBeInTheDocument();
  });
});
