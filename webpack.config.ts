import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from'html-webpack-plugin';
import 'webpack-dev-server';



const webpackconfiguration: webpack.Configuration =  {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'index.js',
    library: {
      name: 'd3reacts',
      type: 'umd',
    },
  },
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

export default webpackconfiguration;
