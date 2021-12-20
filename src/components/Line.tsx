import React from 'react';
import {LineProps} from '../../types'

const Line = ({fill = 'none', stroke, strokeWidth = '1px', d }: LineProps):JSX.Element => {
  return (
<path
            className="line"
            fill={fill}
            stroke={stroke}
            strokeWidth= {strokeWidth}
            d={d}
          />  )
}

export default Line;