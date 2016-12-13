import React from 'react';
import theme from './MainContainer.css';

const MainContainer = (props: React.HTMLProps<HTMLDivElement>) => (
  <div className={theme.container}>
    { props.children }
  </div>
);

export default MainContainer;