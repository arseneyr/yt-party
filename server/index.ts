import * as express from 'express';
const app = express();
import * as historyMiddleware from 'connect-history-api-fallback';
import * as devMiddleware from 'webpack-dev-middleware';
import * as hotMiddleware from 'webpack-hot-middleware';
import * as compression from 'compression';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { graphiqlExpress } from 'graphql-server-express';
import graphql from './graphql';

import * as webpack from 'webpack';
import devConfig from './webpack.config.dev';
import prodConfig from './webpack.config.prod';

const isProd = process.env.NODE_ENV === 'production';
const config = isProd ? prodConfig : devConfig;
const compiler = webpack(config);

app.use(compression());

if (!isProd) {
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
  }));
}

app.use('/graphql', bodyParser.json(), graphql);
app.use(historyMiddleware());

if (!isProd) {
  app.use(hotMiddleware(compiler));

  app.use(devMiddleware(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    }
  }));

  app.listen(3000);

} else {
  app.use('/static', express.static(path.resolve(__dirname, '../build'), {maxAge: '1y'}));
  app.use('/', express.static(path.resolve(__dirname, '../build')));

  compiler.run((err,stats) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(stats.toString({
      colors: true,
      chunks: false
    }));

    app.listen(80);
  })
}
