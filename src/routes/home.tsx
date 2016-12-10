import React, { PropTypes } from 'react';
import {
  Card as OldCard,
  CardMedia,
  CardTitle,
  FloatingActionButton,
  List,
  ListItem,
  Subheader,
  IconButton
} from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';

import { Link } from 'react-router';

const Card:any = OldCard;

const Home: MaterialUiComponent = ({}, context) => (
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
}

export default Home;
