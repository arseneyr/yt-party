interface DefaultMiddleware {
  (...x: any[]): any;
}

declare module "connect-history-api-fallback" {
  let _f: DefaultMiddleware
  export = _f;
}

declare module "webpack-dev-middleware" {
  let _f: DefaultMiddleware
  export = _f;
}

declare module "webpack-hot-middleware" {
  let _f: DefaultMiddleware
  export = _f;
}

declare module 'webpack/lib/LoaderOptionsPlugin' {
  let _f: any;
  export = _f;
}
