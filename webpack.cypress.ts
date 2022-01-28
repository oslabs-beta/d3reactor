import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import webpackconfiguration from './webpack.common';

const webpackdevconfiguration: webpack.Configuration =  {
  entry: './tests/index.cypress.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'index.cypress.js',
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    })
  ],
}

export default merge(webpackconfiguration, webpackdevconfiguration);