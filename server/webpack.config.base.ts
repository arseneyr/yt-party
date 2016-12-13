import * as path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as LoaderOptionsPlugin from 'webpack/lib/LoaderOptionsPlugin';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import { Configuration } from 'webpack';

const srcPath = path.resolve(__dirname, '../src');

const config: Configuration = {
  context: srcPath,
  entry: [
    './main.tsx'
  ],
  output: {
    path: path.resolve(__dirname, '../build')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(srcPath, './index.html')
    }),
    new LoaderOptionsPlugin({
      options: {
        postcss: [
          require('postcss-cssnext')
        ],
        resolve: {},
        context: '/'
      }
    })
  ],
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.scss',
      '.css'
    ]
  },
  module: {
    rules: [
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
      },
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, '../node_modules'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [[ 'es2015', { modules: false } ], 'react']
            }
          }
        ]
      }
    ]
  }
}

export default config;