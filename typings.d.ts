declare module 'react-router-scroll' {
  export function useScroll();
}

declare module '*.css' {
  const content: any;
  export default content;
}

interface Window {
  Intl: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <S>(...f: Redux.GenericStoreEnhancer[]) => Redux.StoreEnhancer<S>;
}

interface NodeModule {
  hot: {
    accept: (path: string | string[], callback: () => void ) => void
  };
}

declare module "offline-plugin/runtime" {
  export function install();
}