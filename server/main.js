const express = require('express')
const debug = require('debug')('app:server')
const webpack = require('webpack')
const webpackConfig = require('../build/webpack.config')
const config = require('../config')
const http = require('http')
const Rx = require('rxjs')
const path = require('path')
const cookieParser = require('cookie-parser')
const nedb = require('nedb')

const app = express()
const paths = config.utils_paths

const server = http.createServer(app)
const io = require('socket.io')(server)

app.get('/player', (req,res) => res.sendFile(path.join(__dirname, '../src/player.html')))

app.use(cookieParser('this.is.bad.secret'))

app.get('/', (req,res,next) => {
  if (!req.signedCookies.userId) {
    const userId = Math.random().toString(36).substr(2,7)
    res.cookie('userId', userId, {httpOnly: true, signed: true, maxAge: 1000*60*60*24})
    req.signedCookies.userId = userId
  }
  next()
})

// This rewrites all routes requests to the root /index.html file
// (ignoring file requests). If you want to implement universal
// rendering, you'll want to remove this middleware.
app.use(require('connect-history-api-fallback')())

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.env === 'development') {
  const compiler = webpack(webpackConfig)

  debug('Enable webpack dev and HMR middleware')
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath  : webpackConfig.output.publicPath,
    contentBase : paths.client(),
    hot         : true,
    quiet       : config.compiler_quiet,
    noInfo      : config.compiler_quiet,
    lazy        : false,
    stats       : config.compiler_stats
  }))
  app.use(require('webpack-hot-middleware')(compiler))

  // Serve static assets from ~/src/static since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(express.static(paths.client('static')))
} else {
  debug(
    'Server is being run outside of live development mode, meaning it will ' +
    'only serve the compiled application bundle in ~/dist. Generally you ' +
    'do not need an application server for this and can instead use a web ' +
    'server such as nginx to serve your static files. See the "deployment" ' +
    'section in the README for more information on deployment strategies.'
  )

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(express.static(paths.dist()))
}

let db = {}

db.queue = new nedb({filename: 'queue.db', autoload:true})
db.users = new nedb({filename: 'users.db', autoload:true})

io.on('connection', socket => {
  let req = socket.handshake
  let res = {}
  cookieParser('this.is.bad.secret')(req, res, () => {})
  const userId = req.signedCookies.userId
  socket.on('get-userid', (cb) => {
    db.users.findOne({ _id: userId }, (err, doc) => {
      if (doc) {
        cb({ valid: true, userId, admin: doc.admin })
      } else {
        cb({ valid: false })
      }
    })
  })

  socket.on('set-username', (data, cb) => {
    db.users.findOne({ username: data }, (err, doc) => {
      if (doc) {
        cb({valid: false})
      } else {
        db.users.insert({_id: userId, username: data, admin: false}, () => cb({ valid: true, userId, admin:(username === 'bad hombre') }))
      }
    })
  })

  socket.on('add-video', (data, cb) => {
  })
})

module.exports = server
