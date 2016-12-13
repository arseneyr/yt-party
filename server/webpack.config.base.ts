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
    path: path.resolve(__dirname, '../build'),
    publicPath: '/'
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
      '.ts',
      '.tsx',
      '.scss',
      '.css'
    ]
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        //include: path.resolve(__dirname, '../node_modules/react-toolbox'),
        use: [
          'style-loader',
          'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss-loader',
          'sass-loader?sourceMap'
        ]
      },
      /*{
        test: /\.css$/,
        include: [srcPath, path.resolve(__dirname, '../styles')],
        use: ['style-loader', 'css-loader']
      },*/
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