//import { Config } from '../../config';

interface DevTools {
  (): any;
  open: () => any;
}

interface Window {
  Intl: any;
  __REDUX_DEVTOOLS_EXTENSION__: DevTools;
}

declare module 'react-router-scroll' {
  let useScroll: () => any;
  export = useScroll;
}

declare module '*.css' {
  const content: any;
  export default content;
}

interface NodeModule {
  hot: {
    accept: (path: string | string[], callback: () => void ) => void
  };
}

declare module "history/createBrowserHistory" {
  let _f: () => any;
  export default _f;
}

declare module 'react-router-addons-controlled/ControlledBrowserRouter' {
  let _f: any;
  export default _f;
}

declare const DEVELOPMENT: boolean;
declare const APP_CONFIG: any;