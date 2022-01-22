import React from 'react';
import * as d3 from 'd3';
import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react';
import { Axis } from '../ContinuousAxis';
import { ContinuousAxisProps } from '../../../types';
import portfolio from '../../data/portfolio.json';

//add tests for axis on the right side
//add vertical axis tests for scatterplot
//add tests with numeric values for horizontal axis in scatterplot
//add tests to check style attribute of tick text

const setup = (props: ContinuousAxisProps) => {
  return render(
    <svg>
      <Axis {...props} />
    </svg>
  );
};

const mockData = portfolio;

const [xMin, xMax] = d3.extent(mockData, (d) => new Date(d['date']));
const xScale = d3
  .scaleTime()
  .domain([xMin ?? 0, xMax ?? 0])
  .range([0, 400]);

const yScale = d3
  .scaleLinear()
  .domain([-6.652160159084837, 3.742471419804005])
  .range([440, 0])
  .nice();

const initialProps: ContinuousAxisProps = {
  x: 0,
  y: 400,
  scale: xScale,
  type: 'bottom',
  width: 500,
  height: 500,
  margin: { left: 80, right: 20, top: 20, bottom: 80 },
  xGrid: undefined,
  yGrid: undefined,
  xTicksValue: [
    new Date('2019-07-15T00:00:00.000Z'),
    new Date('2019-08-01T04:00:00.000Z'),
    new Date('2019-09-01T04:00:00.000Z'),
    new Date('2019-10-01T04:00:00.000Z'),
    new Date('2019-11-01T04:00:00.000Z'),
    new Date('2019-12-01T05:00:00.000Z'),
    new Date('2020-01-01T05:00:00.000Z'),
    new Date('2020-02-01T05:00:00.000Z'),
    new Date('2020-03-01T05:00:00.000Z'),
    new Date('2020-03-30T00:00:00.000Z'),
  ],
};

const topProps: ContinuousAxisProps = {
  ...initialProps,
  type: 'top',
  y: 0,
  margin: {
    left: 80,
    right: 20,
    top: 80,
    bottom: 20,
  },
};

const leftProps: ContinuousAxisProps = {
  ...initialProps,
  type: 'left',
  y: 0,
  scale: yScale,
  xTicksValue: undefined,
  margin: {
    left: 80,
    right: 20,
    top: 20,
    bottom: 40,
  },
};

describe('Continuous Axis test', () => {
  test('it should render a line for horizontal axis', () => {
    setup(initialProps);
    expect(screen.getByTestId('d3reactor-continuous')).toBeVisible();
    cleanup();
    setup(topProps);
    expect(screen.getByTestId('d3reactor-continuous')).toBeVisible();
  });

  test('it should not render a line for vertical axis if not ScatterPlot', () => {
    setup(leftProps);
    expect(
      screen.queryByTestId('d3reactor-continuous')
    ).not.toBeInTheDocument();
  });

  test('it should render a line for vertical axis in ScatterPlot', () => {
    //write test for scaterplot
  });

  test('it should compute axis line coordinates according to type input', () => {
    setup(initialProps);
    expect(screen.getByTestId('d3reactor-continuous')).toHaveAttribute(
      'x1',
      '0'
    );
    expect(screen.getByTestId('d3reactor-continuous')).toHaveAttribute(
      'x2',
      '400'
    );
    expect(screen.getByTestId('d3reactor-continuous')).toHaveAttribute(
      'y1',
      '400'
    );
    expect(screen.getByTestId('d3reactor-continuous')).toHaveAttribute(
      'y2',
      '400'
    );
    cleanup();
    const topProps: ContinuousAxisProps = {
      ...initialProps,
      type: 'top',
      y: 0,
      margin: {
        left: 80,
        right: 20,
        top: 80,
        bottom: 20,
      },
    };
    setup(topProps);
    expect(screen.getByTestId('d3reactor-continuous')).toHaveAttribute(
      'x1',
      '0'
    );
    expect(screen.getByTestId('d3reactor-continuous')).toHaveAttribute(
      'x2',
      '400'
    );
    expect(screen.getByTestId('d3reactor-continuous')).toHaveAttribute(
      'y1',
      '0'
    );
    expect(screen.getByTestId('d3reactor-continuous')).toHaveAttribute(
      'y2',
      '0'
    );

    //write test for scatterplot
  });

  test('it should render formatted date tick text', () => {
    setup(initialProps);
    expect(screen.getByText('10/1/2019')).toBeVisible();
    expect(
      screen.queryByText('2019-10-01T04:00:00.000Z')
    ).not.toBeInTheDocument();
  });

  test('it should filter tick text elements number based on width for horizontal axes', () => {
    setup(initialProps);
    expect(screen.queryByText('12/1/2019')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('d3reactor-ticktext')).toHaveLength(2);
    cleanup();
    setup({ ...initialProps, width: 1000, height: 1000 });
    expect(screen.queryAllByTestId('d3reactor-ticktext')).toHaveLength(8);
  });

  test('it should filter tick text elements number based on height for vertical axes', () => {
    setup(leftProps);
    expect(screen.queryAllByTestId('d3reactor-ticktext')).toHaveLength(6);
    expect(screen.queryByText('1')).not.toBeInTheDocument();
    cleanup();
    const yScaleUpdated = d3
      .scaleLinear()
      .domain([-6.652160159084837, 3.742471419804005])
      .range([940, 0])
      .nice();
    const leftPropsResized = {
      ...leftProps,
      width: 1000,
      height: 1000,
      scale: yScaleUpdated,
    };
    setup(leftPropsResized);
    expect(screen.queryAllByTestId('d3reactor-ticktext')).toHaveLength(12);
    expect(screen.queryByText('1')).toBeInTheDocument();
  });

  test('it should compute tick text position', () => {
    setup(initialProps);
    expect(screen.getByText('10/1/2019')).toHaveAttribute(
      'transform',
      'translate(120.46332046332047, 418)'
    );
    expect(screen.getByText('1/1/2020')).toHaveAttribute(
      'transform',
      'translate(262.5482625482625, 418)'
    );
    cleanup();
    const updatedXScale = d3
      .scaleTime()
      .domain([xMin ?? 0, xMax ?? 0])
      .range([0, 900]);
    setup({
      ...initialProps,
      width: 1000,
      height: 1000,
      scale: updatedXScale,
      y: 900,
    });
    expect(screen.getByText('2/1/2020')).toHaveAttribute(
      'transform',
      'translate(698.4555984555984, 918)'
    );
    cleanup();
    const topProps: ContinuousAxisProps = {
      ...initialProps,
      type: 'top',
      y: 0,
      margin: {
        left: 80,
        right: 20,
        top: 80,
        bottom: 20,
      },
    };
    setup(topProps);
    expect(screen.getByText('10/1/2019')).toHaveAttribute(
      'transform',
      'translate(120.46332046332047, -8)'
    );
    expect(screen.getByText('1/1/2020')).toHaveAttribute(
      'transform',
      'translate(262.5482625482625, -8)'
    );
    cleanup();
    const topPropsResized: ContinuousAxisProps = {
      ...initialProps,
      type: 'top',
      y: 0,
      margin: {
        left: 80,
        right: 20,
        top: 80,
        bottom: 20,
      },
      width: 1000,
      height: 1000,
      scale: updatedXScale,
    };
    setup(topPropsResized);
    expect(screen.getByText('2/1/2020')).toHaveAttribute(
      'transform',
      'translate(698.4555984555984, -8)'
    );
    cleanup();
    setup(leftProps);
    expect(screen.getByText('-6')).toHaveAttribute(
      'transform',
      'translate(-12, 400)'
    );
    expect(screen.getByText('0')).toHaveAttribute(
      'transform',
      'translate(-12, 160)'
    );
  });

  test('it should not display gridlines by default', () => {
    setup(initialProps);
    expect(screen.queryAllByTestId('d3reactor-gridline')).toHaveLength(0);
    cleanup();
    setup(leftProps);
    expect(screen.queryAllByTestId('d3reactor-gridline')).toHaveLength(0);
  });

  test('it should display gridlines when true', async () => {
    let elements;
    setup({ ...initialProps, xGrid: true });
    expect(screen.queryAllByTestId('d3reactor-gridline')).toHaveLength(10);
    elements = screen.queryAllByTestId('d3reactor-gridline');
    expect(elements[0]).toHaveAttribute('x1', '0');
    expect(elements[0]).toHaveAttribute('x2', '0');
    expect(elements[0]).toHaveAttribute('y1', '0');
    expect(elements[0]).toHaveAttribute('y2', '-400');
    expect(elements[9]).toHaveAttribute('x1', '400');
    expect(elements[9]).toHaveAttribute('x2', '400');
    expect(elements[9]).toHaveAttribute('y1', '0');
    expect(elements[9]).toHaveAttribute('y2', '-400');
    cleanup();
    setup({
      ...initialProps,
      type: 'top',
      y: 0,
      margin: {
        left: 80,
        right: 20,
        top: 80,
        bottom: 20,
      },
      xGrid: true,
    });
    expect(screen.queryAllByTestId('d3reactor-gridline')).toHaveLength(10);
    elements = screen.queryAllByTestId('d3reactor-gridline');
    expect(elements[0]).toHaveAttribute('x1', '0');
    expect(elements[0]).toHaveAttribute('x2', '0');
    expect(elements[0]).toHaveAttribute('y1', '0');
    expect(elements[0]).toHaveAttribute('y2', '400');
    expect(elements[9]).toHaveAttribute('x1', '400');
    expect(elements[9]).toHaveAttribute('x2', '400');
    expect(elements[9]).toHaveAttribute('y1', '0');
    expect(elements[9]).toHaveAttribute('y2', '400');
    cleanup();
    setup({ ...leftProps, yGrid: true });
    expect(screen.queryAllByTestId('d3reactor-gridline')).toHaveLength(12);
    elements = screen.queryAllByTestId('d3reactor-gridline');
    expect(elements[0]).toHaveAttribute('x1', '0');
    expect(elements[0]).toHaveAttribute('x2', '400');
    expect(elements[0]).toHaveAttribute('y1', '440');
    expect(elements[0]).toHaveAttribute('y2', '440');
    expect(elements[9]).toHaveAttribute('x1', '0');
    expect(elements[9]).toHaveAttribute('x2', '400');
    expect(elements[9]).toHaveAttribute('y1', '79.99999999999997');
    expect(elements[9]).toHaveAttribute('y2', '79.99999999999997');
  });
});
