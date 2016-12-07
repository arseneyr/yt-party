import * as webpack from 'webpack';
import base from './webpack.config.base';
import * as LoaderOptionsPlugin from 'webpack/lib/LoaderOptionsPlugin';

const config: webpack.Configuration = {
  ...base,
  devtool: 'eval-source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    ...[].concat(base.entry)
  ],
  plugins: [
    ...base.plugins,
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
  ]
};

export default config;
