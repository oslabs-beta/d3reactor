# d3reactor

An open-source library of chart components for creating performant, responsive data visualizations in React

# The problem: 

D3 and React compete for control of the DOM, making it difficult to leverage D3's capabilities while taking advantage of React's virtual DOM. This often results in D3 code that re-renders the DOM unnecessarily, resulting in charts with poor performance. 

# Installation
Let's get your first d3reactor chart set up in less < 5 minutes.

## Install the d3reactor package
```
npm i d3reactor
```
OR
```
yarn install d3reactor
```
## Import d3reactor into your React file
```
import d3reactor from 'd3reactor'
```

## Instantiate a new d3reactor component in the return statement of your parent component
```
function MyParentComponent() {
  return (
    <d3reactor.AreaChart
      data={my_data}
      xKey='my_xkey_value'
      yKey='my_ykey_value'
      groupBy='my_group' // if you want a multi-chart
    />
  );
}
```

And you're good to go!

<img width="667" alt="Screen Shot 2022-01-27 at 11 49 44" src="https://user-images.githubusercontent.com/83984184/151405131-82e9c38f-806a-4cb1-8d6a-b24a62595279.png">
