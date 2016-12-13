/// <reference types="material-ui" />

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

declare module '*.scss' {
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

interface MaterialUiComponent {
  (props: any, context: {muiTheme: __MaterialUI.Styles.MuiTheme}): JSX.Element,
  contextTypes?: React.ValidationMap<any>
}

declare module 'material-ui' {
  //export class Card extends React.Component<__MaterialUI.Card.CardProps & {zDepth?: number}, {}> {}
}