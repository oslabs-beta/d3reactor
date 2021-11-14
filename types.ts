
export interface Props<T> {
  data: any;
  height: T;
  width: T;
  xDataProp: string;
  yDataProp: string;
  xAxis?: 'top' | 'bottom' | false;
  yAxis?: 'left' | 'right' | false;
  xGrid?: boolean;
  yGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  
}

export interface Margin {
  top: number;
  right: number; 
  bottom: number;
  left: number;
}

export interface AxisProps {
    x:number;
    y:number;
    xGrid?: boolean;
    yGrid?: boolean;
    scale:d3.ScaleLinear<number, number, never>;
    type: string;
    label: string | undefined;
    height: number;
    width: number;
    margin: Margin;
}