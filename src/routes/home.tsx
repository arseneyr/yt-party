import React, { PropTypes } from 'react';
import { Card, CardMedia } from 'react-toolbox/lib/card';
import { Button } from 'react-toolbox/lib/button';
import { Link } from 'react-router';

const Home = () => (
  <Card
    raised
  >
    <CardMedia
      image='http://img.youtube.com/vi/u-2ckLBV21g/maxresdefault.jpg'
      aspectRatio='wide'
    />
  </Card>
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
