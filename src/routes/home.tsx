import React, { PropTypes } from 'react';
import { Card, CardMedia, CardTitle } from 'react-toolbox/lib/card';
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list';
import { Avatar } from 'react-toolbox/lib/avatar';
import { Button } from 'react-toolbox/lib/button';
import { Link } from 'react-router';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import theme from './avatar.css';

const Home= ({ data }: any) => (
  <div>
  {
    !data.loading && data.nowPlaying
      ? [<Card raised key='sure'>
        <CardMedia
          aspectRatio='wide'
          image={data.nowPlaying.thumbnailUrl}
        />
        <CardTitle
          title={data.nowPlaying.title}
          subtitle={['Queued by ', <b key='yup'>{data.nowPlaying.queuedBy}</b>]}
        />
      </Card>,
      <div key='butts' className={theme.floatingAddButtonContainer} >
        <Button icon='add' theme={theme} floating accent/>
      </div>]
    : undefined
  }
  <List>
    <ListSubHeader caption='Up Next' />
    {
      !data.loading && data.queue.length > 0 ?
        data.queue.map((v: any) => (
          <ListItem
            ripple={false}
            key={v.id}
            caption={v.title}
            legend={v.queuedBy ? ['Queued by ', <b key={v.id}>{v.queuedBy}</b>] : undefined as any}
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

export default graphql(gql`
  query Test {
    queue {
      id
      thumbnailUrl
      title
      queuedBy
    }
    nowPlaying {
      id
      thumbnailUrl
      title
      queuedBy
    }
  }
`)(Home);

