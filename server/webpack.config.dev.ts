import * as webpack from 'webpack';
import * as LoaderOptionsPlugin from 'webpack/lib/LoaderOptionsPlugin';
import * as merge from 'webpack-merge';
import base from './webpack.config.base';

const config: webpack.Configuration = {
  devtool: 'eval-source-map',
  output: {    
    filename: '[name].js'
  },
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client'
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new LoaderOptionsPlugin({
      debug: true
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      },
      DEVELOPMENT: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  stats: {
    chunks: false
  }
};

export default merge.smart(config, base);
