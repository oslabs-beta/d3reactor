import React from "react";
import { RectangleProps } from "../../types";

export const Rectangle = React.memo(
  ({ x, y, width, height, fill, setTooltip }: RectangleProps): JSX.Element => {
    let cellCenter = { cx: 0, cy: 0 };
    if (typeof x === "number" && typeof y === "number") {
      const cx = x + width / 2;
      const cy = y - 50;
      cellCenter = { cx, cy };
    }
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        onMouseOver={(e) => {
          setTooltip ? setTooltip(cellCenter) : null;
        }}
        onMouseOut={() => (setTooltip ? setTooltip(false) : null)}
      />
    );
  }
);
