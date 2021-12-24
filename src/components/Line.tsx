import React from 'react';
import {LineProps} from '../../types'

const LinePath = ({fill = 'none', stroke, strokeWidth = '1px', d }: LineProps):JSX.Element => {

  console.log('Line rendeed')
  return (
<path
            className="line"
            fill={fill}
            stroke={stroke}
            strokeWidth= {strokeWidth}
            d={d}
          />  )
}

export const Line = React.memo(LinePath)
