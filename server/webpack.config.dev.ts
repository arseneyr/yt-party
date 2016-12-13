import * as webpack from 'webpack';
import * as LoaderOptionsPlugin from 'webpack/lib/LoaderOptionsPlugin';
import * as merge from 'webpack-merge';
import base from './webpack.config.base';

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
      DEVELOPMENT: true
    })
  ],
  stats: {
    chunks: false
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss-loader',
          'sass-loader?sourceMap'
        ]
      }
    ]
  }
};

export default merge.smart(config, base);
