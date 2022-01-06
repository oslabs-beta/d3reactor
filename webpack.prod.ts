import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import webpackconfiguration from './webpack.common';

const webpackprodconfiguration: webpack.Configuration =  {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'index.js',
    clean: true,
    library: {
      name: 'd3reacts',
      type: 'umd',
    },
    globalObject: 'this'
  }, 
  mode: 'production',
  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      }
    }
  ],
}

export default merge(webpackconfiguration, webpackprodconfiguration);
