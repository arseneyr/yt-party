import React from 'react';
import './MainContainer.css';

const MainContainer = (props: React.HTMLProps<HTMLDivElement>) => (
  <div className='container'>
    { props.children }
  </div>
);

export default MainContainer;