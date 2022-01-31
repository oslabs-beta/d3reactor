import React from 'react';
import BarChart from '../src/charts/BarChart/BarChart';
import LineChart from '../src/charts/LineChart/LineChart';
import AreaChart from '../src/charts/AreaChart/AreaChart';
import ScatterPlot from '../src/charts/ScatterPlot/ScatterPlot';
import PieChart from '../src/charts/PieChart/PieChart';

import unemployment from '../data/unemployment.json';
import penguins from '../data/penguins.json';
import portfolio from '../data/portfolio.json';
import fruit from '../data/fruit.json';

// eslint-disable-next-line react/display-name
const Test = React.memo((): JSX.Element => {
  return (
    <div className="app" style={{ height: '100vh', width: '100vw' }}>
      <PieChart
        data={fruit}
        label="label"
        value="value"
        legend="top-right"
        outerRadius={240}
        legendLabel="fruit"
        pieLabel={true}
      />
      <BarChart
        height="100%"
        width="100%"
        data={portfolio.slice(5, 13)}
        xKey="date"
        yKey="value"
        xAxis="bottom"
        yAxis="right"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
        legend={'bottom'}
        tooltipVisible={true}
      />
      <AreaChart
        height="100%"
        width="100%"
        data={portfolio.slice(30, 60)}
        xKey="date"
        yKey="value"
        xAxis="bottom"
        yAxis="right"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
      />
      <LineChart
        height={'100%'}
        width={'100%'}
        data={portfolio}
        xKey="date"
        xDataType="date"
        yKey="value"
        xAxis="bottom"
        yAxis="left"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
        legend={'right'}
        legendLabel="Markets"
      />
      <ScatterPlot
        height="100%"
        width="100%"
        data={penguins}
        xKey="flipper_length_mm"
        xDataType="number"
        xGrid={true}
        xAxis="bottom"
        xAxisLabel="Flipper Length"
        yKey="body_mass_g"
        yGrid={true}
        yAxis="right"
        yAxisLabel="Body Mass"
      />
    </div>
  );
});

export default Test;
