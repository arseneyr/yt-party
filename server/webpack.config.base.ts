import * as path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';

const srcPath = path.resolve(__dirname, '../src');

const config: Configuration = {
  context: srcPath,
  entry: [
    './main.tsx'
  ],
  output: {
    path: path.resolve(__dirname, '../build'),
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(srcPath, './index.html')
    })
  ],
  resolve: {
    extensions: [
      '.js',
      '.ts',
      '.tsx'
    ]
  },
  module: {
    noParse: /\.min\.js/,
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: srcPath,
        options: {
          presets: [[ 'es2015', { modules: false } ], 'react']
        }
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [[ 'es2015', { modules: false } ], 'react']
            }
          },
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  }
}

export default config;