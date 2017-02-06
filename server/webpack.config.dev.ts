import * as webpack from 'webpack';
import * as LoaderOptionsPlugin from 'webpack/lib/LoaderOptionsPlugin';
import * as merge from 'webpack-merge';
import base from './webpack.config.base';
import { clientConfig } from '../config';

const config: webpack.Configuration = {
  devtool: 'eval-source-map',
  output: {
    filename: '[name].js',
    publicPath: '/'
  },
  entry: {
    hotLoader: 'react-hot-loader/patch',
    hotMiddleware: 'webpack-hot-middleware/client'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      },
      DEVELOPMENT: true,
      APP_CONFIG: JSON.stringify(clientConfig)
    })
  ],
  stats: {
    chunks: false
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss-loader',
        ]
      }
    ]
  }
};

export default merge.smart(config, base);
