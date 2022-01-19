import React from 'react';
import BarChart from '../charts/BarChart/BarChart';
import LineChart from '../charts/LineChart/LineChart';
import AreaChart from '../charts/AreaChart/AreaChart';
import ScatterPlot from '../charts/ScatterPlot/ScatterPlot';
import PieChart from '../charts/PieChart/PieChart';

import unemployment from '../data/unemployment.json';
import penguins from '../data/penguins.json';
import portfolio from '../data/portfolio.json';
import fruit from '../data/fruit.json';
import skinny_fruit from '../data/skinny_fruit.json';
import sales from '../data/sales.json';

// eslint-disable-next-line react/display-name
const Test = React.memo((): JSX.Element => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <BarChart
        height="100%"
        width="100%"
        data={portfolio.slice(5, 10)}
        xKey="date"
        yKey="value"
        // groupBy='fruit'
        xAxis="bottom"
        yAxis="right"
        yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
        legend={'bottom'}
      />
      <PieChart
        data={fruit}
        label="label"
        value="value"
        legend="top-right"
        outerRadius={240}
        legendLabel="l"
        pieLabel={true}
        colorScheme="schemeRdYlGn"
      />
      <AreaChart
        data={penguins}
        height="100%"
        width="100%"
        xKey="body_mass_g"
        xDataType="number"
        yKey="culmen_length_mm"
        xGrid={true}
        yGrid={true}
        xAxis="top"
        yAxis="right"
        xAxisLabel="Date"
        yAxisLabel="Number of fruit"
        legend={true}
        // legend="left-top"
        legendLabel="🐬"
      />
      <ScatterPlot
        height="100%"
        width="100%"
        data={penguins}
        xKey="flipper_length_mm"
        xDataType="number"
        yKey="body_mass_g"
        groupBy="species"
        yAxis="right"
        xAxis="bottom"
        // xGrid={true}
        // yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Value"
        legend="bottom"
      />

      <LineChart
        height="500px"
        width="600px"
        data={unemployment}
        xKey="date"
        xDataType="date"
        yKey="unemployment"
        groupBy="division"
        data-test-id="line-chart"
        // xAxis="bottom"
        // yAxis="left"
        // xGrid={true}
        // yGrid={true}
        xAxisLabel="Date"
        yAxisLabel="Unemployment"
        legend={'right'}
        legendLabel="Locations"
      />
    </div>
  );
});

export default Test;
