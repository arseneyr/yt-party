import React from 'react';
import theme from './MainContainer.css';
import NameDialog from './NameDialog';

class MainContainer extends React.Component<any,any> {

  render() {
    return <div
      className={theme.container}>
        <NameDialog />
        { this.props.children }
      </div>
  }
}

export default MainContainer;