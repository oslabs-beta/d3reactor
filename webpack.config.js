const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/d3reacts.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'd3reacts.js',
    library: {
      name: 'd3reacts',
      type: 'umd',
      umdNamedDefine: true 
    },
  },
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  devServer: {
    port: 8080,
    open: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /.(css)$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}