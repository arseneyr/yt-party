import React from 'react';
import { graphql } from 'react-apollo';
import theme from './MainContainer.css';
import NameDialog from './NameDialog';
import { query } from '../container/Queue';

const MainContainer = (props: React.HTMLProps<HTMLDivElement>) => (
  <div className={theme.container}>
    <NameDialog />
    { props.children }
  </div>
);

export default graphql(query)(MainContainer);