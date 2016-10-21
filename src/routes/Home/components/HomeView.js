import React, { PropTypes } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import './HomeView.scss'
import { Card, CardMedia, CardTitle, FloatingActionButton, Subheader, List } from 'material-ui'
import ContentAdd from 'material-ui/svg-icons/content/add'
import VideoListItem from 'components/VideoListItem'
import { Link } from 'react-router'

export const HomeView = ({ queue }, context) => (
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
      {queue.toArray().map(v =>
        <VideoListItem
          disabled
          key={v.getIn(['video','id'])}
          title={v.getIn(['video','title'])}
          thumbnailUrl={v.getIn(['video','thumbnailUrl'])}
          secondaryText={v.has('queuedBy') ? <b key={v.getIn(['video','id'])}>{v.get('queuedBy')}</b> : null}
        />
      )}
    </List>
  </div>
)

HomeView.contextTypes = {
  muiTheme: PropTypes.object.isRequired
}

HomeView.propTypes = {
  queue: ImmutablePropTypes.listOf(ImmutablePropTypes.contains({
    video: ImmutablePropTypes.contains({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      thumbnailUrl: PropTypes.string.isRequired
    }),
    owner: PropTypes.string.isRequired
  }).isRequired).isRequired,
  userId: PropTypes.string.isRequired,
  admin: PropTypes.bool.isRequired
}

export default HomeView
