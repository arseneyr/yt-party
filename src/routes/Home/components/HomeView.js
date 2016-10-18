import React, { PropTypes } from 'react'
import './HomeView.scss'
import { Card, CardMedia, CardTitle, FloatingActionButton, Subheader, List } from 'material-ui'
import ContentAdd from 'material-ui/svg-icons/content/add'
import VideoListItem from 'components/VideoListItem'
import { Link } from 'react-router'

export const HomeView = (props, context) => (
  <div>
    <Card zDepth={3} style={{ position: 'relative' }}>
      <CardMedia
        overlay={<CardTitle title='Overlay title' subtitle='Overlay subtitle' />}
        >
        <img src='http://img.youtube.com/vi/u-2ckLBV21g/maxresdefault.jpg' />
      </CardMedia>
      <FloatingActionButton
        containerElement={<Link to='/search' />}
        style={{
          position: 'absolute',
          bottom: -(context.muiTheme.floatingActionButton.buttonSize / 2),
          right: '30px' }}
        >
        <ContentAdd />
      </FloatingActionButton>
    </Card>
    <List>
      <Subheader>Up Next</Subheader>
      <VideoListItem
        key={0}
        title='sup'
        thumbnailUrl='http://img.youtube.com/vi/u-2ckLBV21g/maxresdefault.jpg'
        secondaryText={['Queued by ', <b>dudebro</b>]}
      />
    </List>
  </div>
)

HomeView.contextTypes = {
  muiTheme: PropTypes.object.isRequired
}

export default HomeView
