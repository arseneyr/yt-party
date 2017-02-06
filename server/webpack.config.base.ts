import * as path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as LoaderOptionsPlugin from 'webpack/lib/LoaderOptionsPlugin';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import { Configuration } from 'webpack';

const srcPath = path.resolve(__dirname, '../src');

// Fixes sort order so hot loader is always first.
const chunkSorter = (chunk1: any, chunk2: any) => {
  if (chunk1.names[0] === 'hotLoader') {
    return -1;
  } else if (chunk2.names[0] === 'hotLoader') {
    return 1;
  }

  return 0;
};

const config: Configuration = {
  context: srcPath,
  entry: {
    main: './main.tsx',
    player: './player.tsx'
  },
  output: {
    path: path.resolve(__dirname, '../build')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(srcPath, './index.html'),
      chunksSortMode: chunkSorter,
      excludeChunks: ['player']
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(srcPath, './index.html'),
      filename: 'player.html',
      chunks: ['player']
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
      '.css',
      '.json'
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
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      }
    ]
  }
}

export default config;