import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as uuid from 'uuid';
const app = express();
import * as historyMiddleware from 'connect-history-api-fallback';
import * as devMiddleware from 'webpack-dev-middleware';
import * as hotMiddleware from 'webpack-hot-middleware';
import * as compression from 'compression';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { graphiqlExpress } from 'graphql-server-express';
import graphql from './graphql';
import { serverConfig as APP_CONFIG } from '../config';

import * as webpack from 'webpack';
import devConfig from './webpack.config.dev';
import prodConfig from './webpack.config.prod';

const isProd = process.env.NODE_ENV === 'production';
const config = isProd ? prodConfig : devConfig;
const compiler = webpack(config);

app.use(compression());

app.use(cookieParser(APP_CONFIG.COOKIE_KEY));

if (!isProd) {
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
  }));
}

graphql.then(g => {
  app.use('/graphql', bodyParser.json(), g);
  app.use(historyMiddleware({
  rewrites: [
    { from: /\/player\/?$/, to: '/player.html'}
  ]
}));
  app.use('/index.html', (req,res,next) => {
    if (!req.signedCookies.user) {
      res.cookie('user', uuid.v4(), {signed: true, maxAge: 86400000})
    }
    next();
  });

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
});
