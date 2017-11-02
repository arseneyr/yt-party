import * as webpack from 'webpack';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as LoaderOptionsPlugin from 'webpack/lib/LoaderOptionsPlugin';
import * as merge from 'webpack-merge';
import base from './webpack.config.base';
import { clientConfig } from '../config';

const config: webpack.Configuration = {
  devtool: 'source-map',
  output: {
    filename: '[name].[chunkhash].js',
    sourceMapFilename: '../sourceMaps/[name].[chunkhash].map',
    publicPath: '/static/'
  },
  plugins: [
    new LoaderOptionsPlugin({
      debug: false,
      minimize: true
    }),
    new webpack.optimize.UglifyJsPlugin(<any>{
      sourceMap: true,
      comments: false,
      mangle: {
        toplevel: true
      },
      compress: {
        warnings: false,
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        screw_ie8: true,
        passes: 2
      }
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      },
      DEVELOPMENT: false,
      APP_CONFIG: JSON.stringify(clientConfig)
    }),
    new ExtractTextPlugin('styles.[contenthash].css'),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        // Use `loader` instead of `use` due to
        // https://github.com/webpack/extract-text-webpack-plugin/issues/265
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
            'postcss-loader',
          ]
        })
      }
    ]
  }
};

export default merge.smart(config, base);
