import React from 'react';
import { Card, CardMedia, CardTitle, CardActions } from 'react-toolbox/lib/card';
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list';
import { Avatar } from 'react-toolbox/lib/avatar';
import { Button, IconButton } from 'react-toolbox/lib/button';
import { Link } from 'react-router';

import theme from './Queue.css';

const Queue = ({ loading, queue, currentUser, deleteVideo }: any) => (
  <div>
  {
    !loading && queue.length > 0
      ? <Card raised key='sure'>
        <CardMedia
          aspectRatio='wide'
          image={queue[0].thumbnailUrl}
        />
        <CardTitle
          title={queue[0].title}
          subtitle={['Queued by ', <b key='yup'>{queue[0].queuedBy.name}</b>]}
        />
        { currentUser && (queue[0].queuedBy.id === currentUser.id || currentUser.admin) &&
        <CardActions>
          <Button label="SKIP!" onClick={() => deleteVideo(queue[0].id)} />
        </CardActions>
        }
      </Card>
    : undefined
  }
  <div className={theme.floatingAddButtonContainer} >
    <Link to='/search'>{
      ({onClick}: any) =>
        <Button icon='add' onClick={onClick} theme={theme} floating accent/>
    }
    </Link>
  </div>
  <List theme={theme}>
    <ListSubHeader caption='Up Next' />
    {
      !loading && queue.length > 1 ?
        queue.slice(1).map((v: any) => (
          <ListItem
            ripple={false}
            key={v.id}
            caption={v.title}
            legend={v.queuedBy.name ? ['Queued by ', <b key={v.id}>{v.queuedBy.name}</b>] : undefined as any}
            theme={theme}
            rightActions={currentUser && (v.queuedBy.id === currentUser.id || currentUser.admin) && [
              <IconButton icon='delete' onClick={() => deleteVideo(v.id)}/>
            ]}
            leftActions={[ <Avatar
              key={v.id}
              cover
              theme={theme}
              image={v.thumbnailUrl}
            />]} />
        )) : []
    }
  </List>
  </div>
)

export default Queue;
