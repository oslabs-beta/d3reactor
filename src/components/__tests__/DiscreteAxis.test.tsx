import React from 'react';
import * as d3 from 'd3';
import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react';
import { DiscreteAxis } from '../DiscreteAxis';
import { DiscreteAxisProps } from '../../../types';

// tests for top axis tick text position and transformation not written
// functionality must be implemented in component first
// write test for useEffect and useState to add more margin

const portfolio = [
  {
    date: '2019-07-22',
    marketvalue: 96446.730245,
    value: -0.016192713510560883,
  },
  {
    date: '2019-07-23',
    marketvalue: 96483.764726,
    value: 0.02219996607383714,
  },
  {
    date: '2019-07-24',
    marketvalue: 96579.495121,
    value: 0.12144116731337547,
  },
  {
    date: '2019-07-25',
    marketvalue: 96691.287123,
    value: 0.2373330172054904,
  },
  {
    date: '2019-07-26',
    marketvalue: 96508.730766,
    value: 0.04808160794729189,
  },
  {
    date: '2019-07-29',
    marketvalue: 96565.511343,
    value: 0.10694454973870622,
  },
  {
    date: '2019-07-30',
    marketvalue: 96591.277652,
    value: 0.13365580959164142,
  },
  {
    date: '2019-07-31',
    marketvalue: 96607.294778,
    value: 0.15026034595279442,
  },
];
const unemployment = [
  {
    division: 'Bethesda-Rockville-Frederick, MD Met Div',
    date: '2000-02-01T00:00:00.000Z',
    unemployment: 2.6,
  },
  {
    division: 'Bethesda-Rockville-Frederick, MD Met Div',
    date: '2000-03-01T00:00:00.000Z',
    unemployment: 2.6,
  },
  {
    division: 'Bethesda-Rockville-Frederick, MD Met Div',
    date: '2000-04-01T00:00:00.000Z',
    unemployment: 2.6,
  },
  {
    division: 'Bethesda-Rockville-Frederick, MD Met Div',
    date: '2000-05-01T00:00:00.000Z',
    unemployment: 2.7,
  },
  {
    division: 'Bethesda-Rockville-Frederick, MD Met Div',
    date: '2000-06-01T00:00:00.000Z',
    unemployment: 2.7,
  },
  {
    division: 'Bethesda-Rockville-Frederick, MD Met Div',
    date: '2000-07-01T00:00:00.000Z',
    unemployment: 2.7,
  },
  {
    division: 'Bethesda-Rockville-Frederick, MD Met Div',
    date: '2000-08-01T00:00:00.000Z',
    unemployment: 2.6,
  },
  {
    division: 'Bethesda-Rockville-Frederick, MD Met Div',
    date: '2000-09-01T00:00:00.000Z',
    unemployment: 2.6,
  },
];

const unemploymentLongText = [
  {
    division: 'Bethesda-Rockville-Frederick, MD Met Div',
    date: '2000-01-01T00:00:00.000Z',
    unemployment: 2.6,
  },
  {
    division: 'Boston-Cambridge-Quincy, MA NECTA Div',
    date: '2003-01-01T00:00:00.000Z',
    unemployment: 5.3,
  },
  {
    division: 'Brockton-Bridgewater-Easton, MA NECTA Div',
    date: '2005-10-01T00:00:00.000Z',
    unemployment: 5.4,
  },
  {
    division: 'Camden, NJ Met Div',
    date: '2008-01-01T00:00:00.000Z',
    unemployment: 4.7,
  },
  {
    division: 'Chicago-Joliet-Naperville, IL Met Div',
    date: '2005-11-01T00:00:00.000Z',
    unemployment: 5.5,
  },
];

const mockSetState = jest.fn();

const xAccessor = (d: any) => d.date;

const scale = d3
  .scaleBand()
  .paddingInner(0.1)
  .paddingOuter(0.1)
  .domain(portfolio.map(xAccessor))
  .range([0, 700]);
const props: DiscreteAxisProps = {
  x: 0,
  y: 626,
  scale,
  type: 'bottom',
  width: 800,
  margin: {
    left: 20,
    right: 80,
    top: 20,
    bottom: 154,
  },
  data: portfolio,
  xAccessor,
  setTickMargin: mockSetState,
};

const setup = (props: DiscreteAxisProps) => {
  return render(
    <svg>
      <DiscreteAxis {...props} />
    </svg>
  );
};

describe('Discrete Axis test', () => {
  test('it should render a line for bottom axis', () => {
    setup(props);
    expect(screen.getByTestId('discrete-axis')).toBeVisible();
  });

  test('it should compute axis line coordinates for bottom axis', () => {
    setup(props);
    expect(screen.getByTestId('discrete-axis')).toHaveAttribute('x1', '0');
    expect(screen.getByTestId('discrete-axis')).toHaveAttribute('x2', '700');
    expect(screen.getByTestId('discrete-axis')).toHaveAttribute('y1', '626');
    expect(screen.getByTestId('discrete-axis')).toHaveAttribute('y2', '626');
  });

  test('it should render a line for top axis', () => {
    const updatedProps: DiscreteAxisProps = {
      ...props,
      y: 0,
      type: 'top',
      margin: {
        left: 20,
        right: 80,
        top: 80,
        bottom: 94,
      },
    };
    setup(updatedProps);
    expect(screen.getByTestId('discrete-axis')).toBeVisible();
  });

  test('it should compute axis line coordinates for top axis', () => {
    const updatedProps: DiscreteAxisProps = {
      ...props,
      y: 0,
      type: 'top',
      margin: {
        left: 20,
        right: 80,
        top: 80,
        bottom: 94,
      },
    };
    setup(updatedProps);
    expect(screen.getByTestId('discrete-axis')).toHaveAttribute('x1', '0');
    expect(screen.getByTestId('discrete-axis')).toHaveAttribute('x2', '700');
    expect(screen.getByTestId('discrete-axis')).toHaveAttribute('y1', '0');
    expect(screen.getByTestId('discrete-axis')).toHaveAttribute('y2', '0');
  });

  test("it should not format tick text if it's less than 10 characters", () => {
    setup(props);
    expect(screen.queryAllByTestId('d3reactor-ticktext')[0]).toHaveTextContent(
      '2019-07-22'
    );
  });

  test("it should format tick text if it's more than 10 characters and represents date", () => {
    const updatedScale = d3
      .scaleBand()
      .paddingInner(0.1)
      .paddingOuter(0.1)
      .domain(unemployment.map(xAccessor))
      .range([0, 700]);
    const updatedProps: DiscreteAxisProps = {
      ...props,
      y: 666,
      margin: {
        left: 20,
        right: 80,
        top: 20,
        bottom: 114,
      },
      scale: updatedScale,
      data: unemployment,
    };
    setup(updatedProps);
    expect(screen.queryAllByTestId('d3reactor-ticktext')[0]).toHaveTextContent(
      '2/1/2000'
    );
    expect(
      screen.queryAllByTestId('d3reactor-ticktext')[0]
    ).not.toHaveTextContent('2000-02-01T00:00:00.000Z');
  });

  test('it should rotate tick text on bottom axis if text width is more than width of rectangles', () => {
    setup(props);
    const elements = screen.queryAllByTestId('d3reactor-ticktext');
    expect(elements[0]).toHaveAttribute(
      'transform',
      'translate(51.03086419753081, 661), rotate(-90)'
    );
    expect(elements[2]).toHaveAttribute(
      'transform',
      'translate(223.87037037037032, 661), rotate(-90)'
    );
  });

  test('it should correctly position tick text on bottom axis', () => {
    const updatedScale = d3
      .scaleBand()
      .paddingInner(0.1)
      .paddingOuter(0.1)
      .domain(portfolio.map(xAccessor))
      .range([0, 1100]);
    setup({
      ...props,
      y: 1066,
      width: 1200,
      margin: {
        left: 20,
        right: 80,
        top: 20,
        bottom: 114,
      },
      scale: updatedScale,
    });
    const elements = screen.queryAllByTestId('d3reactor-ticktext');
    expect(elements[0]).toHaveAttribute(
      'transform',
      'translate(74.69135802469125, 1080)'
    );
    expect(elements[4]).toHaveAttribute(
      'transform',
      'translate(617.9012345679012, 1080)'
    );
  });

  test('it should correctly position tick text on top axis', () => {
    const updatedScale = d3
      .scaleBand()
      .paddingInner(0.1)
      .paddingOuter(0.1)
      .domain(portfolio.map(xAccessor))
      .range([0, 1100]);
    setup({
      ...props,
      y: 0,
      width: 1200,
      type: 'top',
      scale: updatedScale,
      margin: {
        left: 20,
        right: 80,
        top: 80,
        bottom: 54,
      },
    });
    const elements = screen.queryAllByTestId('d3reactor-ticktext');
    expect(elements[0]).toHaveAttribute(
      'transform',
      'translate(74.69135802469125, -7)'
    );
    expect(elements[4]).toHaveAttribute(
      'transform',
      'translate(617.9012345679012, -7)'
    );
  });

  test("it should slice text if it's longer than 10 characters and wider than rectangle", () => {
    const updatedScale = d3
      .scaleBand()
      .paddingInner(0.1)
      .paddingOuter(0.1)
      .domain(unemploymentLongText.map(xAccessor))
      .range([0, 1900]);
    const updatedProps: DiscreteAxisProps = {
      ...props,
      y: 1066,
      width: 2000,
      type: 'bottom',
      scale: updatedScale,
      margin: {
        left: 20,
        right: 80,
        top: 20,
        bottom: 114,
      },
      data: unemploymentLongText,
      xAccessor: (d: any) => d.division,
    };
    setup(updatedProps);
    expect(
      screen.queryByText('Bethesda-Rockville-Frederick, MD Met Div')
    ).toBeInTheDocument();
    cleanup();
    const resizedScale = d3
      .scaleBand()
      .paddingInner(0.1)
      .paddingOuter(0.1)
      .domain(unemploymentLongText.map(xAccessor))
      .range([0, 600]);
    setup({
      ...updatedProps,
      y: 526,
      width: 700,
      scale: resizedScale,
      margin: {
        left: 20,
        right: 80,
        top: 20,
        bottom: 154,
      },
    });
    expect(
      screen.queryByText('Bethesda-Rockville-Frederick, MD Met Div')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Bethesda-R')).toBeInTheDocument();
  });
});
