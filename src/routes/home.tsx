import React, { PropTypes } from 'react';
import { Card, CardMedia, CardTitle } from 'react-toolbox/lib/card';
import { List, ListItem, ListSubHeader, ListItemProps } from 'react-toolbox/lib/list';
import { Avatar } from 'react-toolbox/lib/avatar';
import { Button } from 'react-toolbox/lib/button';
import { Link } from 'react-router';

import theme from './avatar.scss';

const Home = () => (
  <div>
  <Card raised>
    <CardMedia
      aspectRatio='wide'
      image='http://img.youtube.com/vi/SXiSVQZLje8/maxresdefault.jpg'
      contentOverlay
      className={theme.darkOverlay}
      theme={theme}
    >
      <CardTitle title='SUP'
      className={theme.darkOverlay} theme={theme} subtitle="oh yes"/>
    </CardMedia>
  </Card>
  <Button icon='add' floating accent/>
  <List>
    <ListSubHeader caption='Up Next' />
    <ListItem caption="YPYPYP" legend={['Queued by: ',<b>sup</b>] as any} leftActions={[<Avatar cover theme={theme} image='http://img.youtube.com/vi/SXiSVQZLje8/maxresdefault.jpg' />]} />
    <ListItem theme={theme} caption="YPYPYPddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd" />
    <ListItem caption="YPYPYP" />
  </List>
  </div>
)

/*const Home2: MaterialUiComponent = ({}, context) => (
  <div>
    <Card zDepth={1} style={{ position: 'relative' }}>
      <CardMedia
        overlay={<CardTitle title='Overlay title' subtitle='Overlay subtitle' />}
        >
        <img src='http://img.youtube.com/vi/u-2ckLBV21g/maxresdefault.jpg' />
      </CardMedia>
      <FloatingActionButton
        containerElement={<Link to='/search' />}
        style={{
          position: 'absolute',
          bottom: context.muiTheme.floatingActionButton
            ? -(context.muiTheme.floatingActionButton.buttonSize / 2)
            : undefined,
          right: '30px' }}
        >
        <AddIcon />
      </FloatingActionButton>
    </Card>
    <List>
      <Subheader>
        Up Next
        <IconButton style={{ transform: 'translate(0px, 4px)' }}><EditIcon /></IconButton>
      </Subheader>
      <ListItem
          disabled
        primaryText={<div style={{
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' }}>dfdf</div>}
        secondaryText={["Queued by ", <b>yoooo</b>]}
      />
    </List>
    </div>
);

Home.contextTypes = {
  muiTheme: PropTypes.object.isRequired
}*/

export default Home;
