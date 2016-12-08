import * as express from 'express';
const app = express();
import * as historyMiddleware from 'connect-history-api-fallback';
import * as devMiddleware from 'webpack-dev-middleware';
import * as hotMiddleware from 'webpack-hot-middleware';
import * as compression from 'compression';
import * as path from 'path';

import * as webpack from 'webpack';
import devConfig from './webpack.config.dev';
import prodConfig from './webpack.config.prod';

const isProd = process.env.NODE_ENV === 'production';
const config = isProd ? prodConfig : devConfig;
const compiler = webpack(config);

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
} else {
  compiler.run((err,stats) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(stats.toString({ 
      colors: true, 
      chunks: false 
    }));

    app.use(compression());
    app.use(express.static(path.resolve(__dirname, '../build'), {
      maxAge: '1y'
    }));
  })
}

app.listen(3000);
