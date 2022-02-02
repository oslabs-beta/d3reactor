# d3reactor

An open-source library of charts for creating performant, responsive data visualizations built with React and D3. 

The main goal of this library to help you create customizable charts easily. 

# Installation
Let's get your first d3reactor chart setup in less < 5 minutes.

## Install the d3reactor package
```
npm install d3reactor
```
OR
```
yarn add d3reactor
```

## Import d3reactor into your React project

```
import * as d3reactor from "d3reactor"
```

OR you can import each chart separately 

```
import {AreaChart, BarChart, PieChart, ScatterPlot, LineChart} from "d3reactor"
```

# Examples

```
  <AreaChart
    data={my_data}
    xKey='my_xkey_value'
    yKey='my_ykey_value'
    groupBy='my_group' // if you want a multi-chart
  />

```

And you're good to go!


<img width="1100" alt="Stacked Bar Chart" src="https://user-images.githubusercontent.com/83976244/152202135-2f15b0e9-62da-47c5-aa61-9db4a2a7b80c.png">



