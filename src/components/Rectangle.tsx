import React from 'react';
import {RectangleProps} from '../../types'

export const Rectangle = React.memo(({x, y, width, height, fill}: RectangleProps):JSX.Element => {
  console.log('rectangle rendered')
  return (
<rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={fill}
          />  )
})

