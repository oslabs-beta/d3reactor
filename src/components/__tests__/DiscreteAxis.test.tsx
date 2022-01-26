import React from 'react';
import * as d3 from 'd3';
import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react';
import { DiscreteAxis } from '../DiscreteAxis';
import { DiscreteAxisProps } from '../../../types';
import portfolio from '../../../data/portfolio.json';

const setup = (props: DiscreteAxisProps) => {
  return render(
    <svg>
      <DiscreteAxis {...props} />
    </svg>
  );
};



describe('Disccrete Axis test', () => {

  test('it should render a line for bottom axis', () => {
    setup(initialProps);
    expect(screen.getByTestId('d3reactor-continuous')).toBeVisible();
  });
})