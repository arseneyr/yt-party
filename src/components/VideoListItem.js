import React, { PropTypes } from 'react'
import { ListItem, Avatar } from 'material-ui'

export const VideoListItem = ({ title, thumbnailUrl, ...other }) => (
  <ListItem
    primaryText={<div style={{
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' }}>{title}</div>}
    leftAvatar={
      <Avatar
        style={{ borderRadius: 0, objectFit: 'cover' }}
        src={thumbnailUrl}
      />}
    {...other}
  />
)

VideoListItem.propTypes = {
  title: React.PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string]).isRequired,
  thumbnailUrl: PropTypes.string.isRequired
}

export default VideoListItem
