import React from 'react';
import * as d3 from 'd3';
import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react';
import { Axis } from '../ContinuousAxis';
import { ContinuousAxisProps } from '../../../types';
import portfolio from '../../../data/portfolio.json';

const setup = (props: ContinuousAxisProps) => {
  return render(
    <svg>
      <Axis {...props} />
    </svg>
  );
};

const mockData = portfolio;

const [xMin, xMax] = d3.extent(mockData, (d) => new Date(d['date']));
const xScaleTime = d3
  .scaleTime()
  .domain([xMin ?? 0, xMax ?? 0])
  .range([0, 400]);

const yScale = d3
  .scaleLinear()
  .domain([-6.652160159084837, 3.742471419804005])
  .range([400, 0])
  .nice();

const initialProps: ContinuousAxisProps = {
  x: 0,
  y: 400,
  scale: xScaleTime,
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
    bottom: 80,
  },
};

const rightProps: ContinuousAxisProps = {
  ...initialProps,
  type: 'right',
  x: 400,
  y: 0,
  scale: yScale,
  margin: {
    left: 20,
    right: 80,
    top: 20,
    bottom: 80,
  },
  xTicksValue: undefined,
};

describe('Continuous Axis test', () => {
  test('it should render a line for bottom axis', () => {
    setup(initialProps);
    expect(screen.getByTestId('d3reactor-continuous')).toBeVisible();
  });

  test('it should render a line for top axis', () => {
    setup(topProps);
    expect(screen.getByTestId('d3reactor-continuous')).toBeVisible();
  });

  test('it should not render a line for left axis if not ScatterPlot', () => {
    setup(leftProps);
    expect(
      screen.queryByTestId('d3reactor-continuous')
    ).not.toBeInTheDocument();
  });

  test('it should not render a line for right axis if not ScatterPlot', () => {
    setup(rightProps);
    expect(
      screen.queryByTestId('d3reactor-continuous')
    ).not.toBeInTheDocument();
  });

  test('it should render a line for left axis in ScatterPlot', () => {
    const yScale = d3.scaleLinear().domain([0, 4675]).range([600, 0]).nice();
    const leftProps: ContinuousAxisProps = {
      x: 0,
      y: 0,
      scale: yScale,
      type: 'left',
      width: 700,
      height: 700,
      margin: { left: 80, right: 20, top: 20, bottom: 80 },
      yGrid: true,
      chartType: 'scatter-plot',
    };
    setup(leftProps);
    expect(screen.queryByTestId('d3reactor-continuous')).toBeInTheDocument();
  });

  test('it should render a line for right axis in ScatterPlot', () => {
    const yScale = d3.scaleLinear().domain([0, 4675]).range([600, 0]).nice();
    const leftProps: ContinuousAxisProps = {
      x: 512,
      y: 0,
      scale: yScale,
      type: 'right',
      width: 700,
      height: 700,
      margin: { left: 20, right: 168, top: 20, bottom: 80 },
      yGrid: true,
      chartType: 'scatter-plot',
    };
    setup(leftProps);
    expect(screen.queryByTestId('d3reactor-continuous')).toBeInTheDocument();
  });

  test('it should compute axis line coordinates for left axis in ScatterPlot', () => {
    const yScale = d3.scaleLinear().domain([0, 4675]).range([600, 0]).nice();
    const leftProps: ContinuousAxisProps = {
      x: 0,
      y: 0,
      scale: yScale,
      type: 'left',
      width: 700,
      height: 700,
      margin: { left: 80, right: 20, top: 20, bottom: 80 },
      yGrid: true,
      chartType: 'scatter-plot',
    };
    setup(leftProps);
    expect(screen.getByTestId('d3reactor-continuous')).toHaveAttribute(
      'x1',
      '0'
    );
    expect(screen.getByTestId('d3reactor-continuous')).toHaveAttribute(
      'x2',
      '0'
    );
    expect(screen.getByTestId('d3reactor-continuous')).toHaveAttribute(
      'y1',
      '0'
    );
    expect(screen.getByTestId('d3reactor-continuous')).toHaveAttribute(
      'y2',
      '600'
    );
  });

  test('it should compute axis line coordinates for right axis in ScatterPlot', () => {
    const yScale = d3.scaleLinear().domain([0, 4675]).range([600, 0]).nice();
    const leftProps: ContinuousAxisProps = {
      x: 512,
      y: 0,
      scale: yScale,
      type: 'right',
      width: 700,
      height: 700,
      margin: { left: 20, right: 168, top: 20, bottom: 80 },
      yGrid: true,
      chartType: 'scatter-plot',
    };
    setup(leftProps);
    expect(screen.getByTestId('d3reactor-continuous')).toHaveAttribute(
      'x1',
      '512'
    );
    expect(screen.getByTestId('d3reactor-continuous')).toHaveAttribute(
      'x2',
      '512'
    );
    expect(screen.getByTestId('d3reactor-continuous')).toHaveAttribute(
      'y1',
      '0'
    );
    expect(screen.getByTestId('d3reactor-continuous')).toHaveAttribute(
      'y2',
      '600'
    );
  });

  test('it should compute axis line coordinates for bottom axis', () => {
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
  });
  test('it should compute axis line coordinates for top axis', () => {
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
  });

  test('it should render formatted date tick text', () => {
    setup(initialProps);
    expect(screen.getByText('10/1/2019')).toBeVisible();
    expect(
      screen.queryByText('2019-10-01T04:00:00.000Z')
    ).not.toBeInTheDocument();
  });

  test('it should filter tick text elements number of horizontal axis based on its width', () => {
    setup(initialProps);
    expect(screen.queryByText('12/1/2019')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('d3reactor-ticktext')).toHaveLength(2);
    cleanup();
    setup({ ...initialProps, width: 1000, height: 1000 });
    expect(screen.queryAllByTestId('d3reactor-ticktext')).toHaveLength(8);
  });

  test('it should filter tick text elements number of vertical axis based on its width', () => {
    setup(leftProps);
    expect(screen.queryAllByTestId('d3reactor-ticktext')).toHaveLength(6);
    expect(screen.queryByText('1')).not.toBeInTheDocument();
    cleanup();
    const yScaleUpdated = d3
      .scaleLinear()
      .domain([-6.652160159084837, 3.742471419804005])
      .range([900, 0])
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

  test('it should filter tick text elements number based on height for right axis', () => {
    setup(rightProps);
    expect(screen.queryAllByTestId('d3reactor-ticktext')).toHaveLength(6);
    expect(screen.queryByText('1')).not.toBeInTheDocument();
    cleanup();
    const yScaleUpdated = d3
      .scaleLinear()
      .domain([-6.652160159084837, 3.742471419804005])
      .range([900, 0])
      .nice();
    const rightPropsResized = {
      ...leftProps,
      width: 1000,
      height: 1000,
      scale: yScaleUpdated,
    };
    setup(rightPropsResized);
    expect(screen.queryAllByTestId('d3reactor-ticktext')).toHaveLength(12);
    expect(screen.queryByText('1')).toBeInTheDocument();
  });

  test('it should compute tick text position for bottom axis', () => {
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
    const updatedXScaleTime = d3
      .scaleTime()
      .domain([xMin ?? 0, xMax ?? 0])
      .range([0, 900]);
    setup({
      ...initialProps,
      width: 1000,
      height: 1000,
      scale: updatedXScaleTime,
      y: 900,
    });
    expect(screen.getByText('2/1/2020')).toHaveAttribute(
      'transform',
      'translate(698.4555984555984, 918)'
    );
  });

  test('it should compute tick text position for top axis', () => {
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
    const updatedXScaleTime = d3
      .scaleTime()
      .domain([xMin ?? 0, xMax ?? 0])
      .range([0, 900]);
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
      scale: updatedXScaleTime,
    };
    setup(topPropsResized);
    expect(screen.getByText('2/1/2020')).toHaveAttribute(
      'transform',
      'translate(698.4555984555984, -8)'
    );
  });

  test('it should compute tick text position for left axis', () => {
    setup(leftProps);
    expect(screen.getByText('-6')).toHaveAttribute(
      'transform',
      'translate(-12, 363.6363636363636)'
    );
    expect(screen.getByText('0')).toHaveAttribute(
      'transform',
      'translate(-12, 145.45454545454547)'
    );
  });

  test('it should compute tick text position for right axis', () => {
    setup(rightProps);
    expect(screen.getByText('-6')).toHaveAttribute(
      'transform',
      'translate(412, 363.6363636363636)'
    );
    expect(screen.getByText('0')).toHaveAttribute(
      'transform',
      'translate(412, 145.45454545454547)'
    );
  });

  test('it should not display gridlines for bottom axis by default', () => {
    setup(initialProps);
    expect(screen.queryAllByTestId('d3reactor-gridline')).toHaveLength(0);
  });

  test('it should not display gridlines for left axis by default', () => {
    setup(leftProps);
    expect(screen.queryAllByTestId('d3reactor-gridline')).toHaveLength(0);
  });

  test('it should not display gridlines for right axis by default', () => {
    setup(rightProps);
    expect(screen.queryAllByTestId('d3reactor-gridline')).toHaveLength(0);
  });

  test('it should not display gridlines for top axis by default', () => {
    setup(topProps);
    expect(screen.queryAllByTestId('d3reactor-gridline')).toHaveLength(0);
  });

  test('it should display gridlines for bottom axis when enabled', () => {
    setup({ ...initialProps, xGrid: true });
    const elements = screen.queryAllByTestId('d3reactor-gridline');
    expect(elements).toHaveLength(10);
    expect(elements[0]).toHaveAttribute('x1', '0');
    expect(elements[0]).toHaveAttribute('x2', '0');
    expect(elements[0]).toHaveAttribute('y1', '0');
    expect(elements[0]).toHaveAttribute('y2', '-400');
    expect(elements[9]).toHaveAttribute('x1', '400');
    expect(elements[9]).toHaveAttribute('x2', '400');
    expect(elements[9]).toHaveAttribute('y1', '0');
    expect(elements[9]).toHaveAttribute('y2', '-400');
  });

  test('it should display gridlines for top axis when enabled', () => {
    setup({
      ...topProps,
      xGrid: true,
    });
    const elements = screen.queryAllByTestId('d3reactor-gridline');
    expect(elements).toHaveLength(10);
    expect(elements[0]).toHaveAttribute('x1', '0');
    expect(elements[0]).toHaveAttribute('x2', '0');
    expect(elements[0]).toHaveAttribute('y1', '0');
    expect(elements[0]).toHaveAttribute('y2', '400');
    expect(elements[9]).toHaveAttribute('x1', '400');
    expect(elements[9]).toHaveAttribute('x2', '400');
    expect(elements[9]).toHaveAttribute('y1', '0');
    expect(elements[9]).toHaveAttribute('y2', '400');
  });

  test('it should display gridlines for left axis when enabled', () => {
    setup({ ...leftProps, yGrid: true });
    const elements = screen.queryAllByTestId('d3reactor-gridline');
    expect(elements).toHaveLength(12);
    expect(elements[0]).toHaveAttribute('x1', '0');
    expect(elements[0]).toHaveAttribute('x2', '400');
    expect(elements[0]).toHaveAttribute('y1', '400');
    expect(elements[0]).toHaveAttribute('y2', '400');
    expect(elements[9]).toHaveAttribute('x1', '0');
    expect(elements[9]).toHaveAttribute('x2', '400');
    expect(elements[9]).toHaveAttribute('y1', '72.7272727272727');
    expect(elements[9]).toHaveAttribute('y2', '72.7272727272727');
  });

  test('it should display gridlines for right axis when enabled', () => {
    setup({ ...rightProps, yGrid: true });
    const elements = screen.queryAllByTestId('d3reactor-gridline');
    expect(elements).toHaveLength(12);
    expect(elements[0]).toHaveAttribute('x1', '0');
    expect(elements[0]).toHaveAttribute('x2', '-400');
    expect(elements[0]).toHaveAttribute('y1', '400');
    expect(elements[0]).toHaveAttribute('y2', '400');
    expect(elements[9]).toHaveAttribute('x1', '0');
    expect(elements[9]).toHaveAttribute('x2', '-400');
    expect(elements[9]).toHaveAttribute('y1', '72.7272727272727');
    expect(elements[9]).toHaveAttribute('y2', '72.7272727272727');
  });
});
