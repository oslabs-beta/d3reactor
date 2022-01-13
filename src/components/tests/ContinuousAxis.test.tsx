import React from "react";
import { cleanup, render } from "@testing-library/react";
import { Axis } from "../ContinuousAxis";
import { ContinuousAxisProps } from "../../../types";

const AxisProps: ContinuousAxisProps = {
  x: 0,
  y: 869,
  xGrid: false,
  scale: jest.fn(),
  type: "bottom",
  label: "testAxis",
  height: 969,
  width: 1206,
  margin: {
    left: 20,
    right: 20,
    bottom: 80,
    top: 20,
  },
};

const setup = () => {
  return render(<Axis {...AxisProps} />);
};
describe("Axis test", () => {
  afterEach(() => {
    cleanup();
  });
  test("it should render Axis", () => {
    setup();
  });
});
