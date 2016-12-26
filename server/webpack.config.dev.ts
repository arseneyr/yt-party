import * as webpack from 'webpack';
import * as LoaderOptionsPlugin from 'webpack/lib/LoaderOptionsPlugin';
import * as merge from 'webpack-merge';
import base from './webpack.config.base';
import APP_CONFIG from '../config';

const config: webpack.Configuration = {
  devtool: 'eval-source-map',
  output: {
    filename: '[name].js',
    publicPath: '/'
  },
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client'
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      },
      DEVELOPMENT: true,
      APP_CONFIG: JSON.stringify(APP_CONFIG)
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
