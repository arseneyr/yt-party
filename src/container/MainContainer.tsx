import React from 'react';
import theme from './MainContainer.css';
import NameDialog from '../components/NameDialog';

const MainContainer = (props: React.HTMLProps<HTMLDivElement>) => (
  <div className={theme.container}>
    <NameDialog />
    { props.children }
  </div>
);

export default MainContainer;