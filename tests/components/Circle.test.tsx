import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Circle } from '../../src/components/Circle';
import { CircleProps } from '../../types';

const circleProps: CircleProps = {
  cx: 10,
  cy: 10,
  r: '1',
  color: 'red',
};

const setup = (props: CircleProps) => {
  return render(
    <svg>
      <Circle {...props} />
    </svg>
  );
};

describe('Circle test', () => {
  test('it should render Circle', () => {
    setup(circleProps);
    expect(screen.getByTestId('d3reactor-circle')).toBeInTheDocument();
  });

  test('Circle should have given color', () => {
    setup(circleProps);
    expect(screen.getByTestId('d3reactor-circle')).toHaveAttribute(
      'fill',
      circleProps.color
    );
  });

  test('Circle should have given radius', () => {
    setup(circleProps);
    expect(screen.getByTestId('d3reactor-circle')).toHaveAttribute(
      'r',
      circleProps.r
    );
  });

  test('Circle should have default radius', () => {
    const customProps = {
      cx: 10,
      cy: 10,
      color: 'red',
    };
    setup(customProps);
    expect(screen.getByTestId('d3reactor-circle')).toHaveAttribute('r', '4');
  });

  test('Circle should have given cx attribute', () => {
    setup(circleProps);
    expect(screen.getByTestId('d3reactor-circle')).toHaveAttribute(
      'cx',
      circleProps.cx.toString()
    );
  });

  test('Circle should have given cy attribute', () => {
    setup(circleProps);
    expect(screen.getByTestId('d3reactor-circle')).toHaveAttribute(
      'cy',
      circleProps.cy.toString()
    );
  });
});
