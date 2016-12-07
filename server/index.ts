import * as express from 'express';
const app = express();
import * as historyMiddleware from 'connect-history-api-fallback';
import * as devMiddleware from 'webpack-dev-middleware';
import * as hotMiddleware from 'webpack-hot-middleware';

import * as webpack from 'webpack';
import config from './webpack.config.dev';
const compiler = webpack(config);

//compiler.run((err,stats) => {console.log("err: " + err);console.log("stats: " + stats)});

app.use(historyMiddleware());
app.use(hotMiddleware(compiler));
app.use(devMiddleware(compiler, {
  noInfo: false,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}));

app.listen(3000);
