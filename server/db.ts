import * as r from 'rethinkdb';
import { serverConfig as APP_CONFIG } from '../config';

let c: r.Connection = null;

export const connect = () => r.connect({host: APP_CONFIG.DB_HOST}).then(e => (c=e,e));

interface User {
  id: string;
  name:string;
  admin:boolean;
}

interface Video {
  youtubeId: string;
  queuedBy: User;
}

export const createUser = (user: User) => r.table('users').insert(user).run(c);
export const findUser = (id:string) => r.table('users').get(id).run(c);

export const doesNameExist = (name:string) => r.table('users').getAll(name,{index:'name'}).count().run(c).then(count => count > 0);

const getVideosQuery = () => r.table('videos').orderBy({index: 'queuedAt'});
export const getVideos = () => getVideosQuery().run(c).then(cur => cur.toArray());
export const onVideosChanged = (callback: any) => (getVideosQuery().limit(1000).changes({squash:true, includeInitial: true, includeOffsets:true} as any) as any).run(c).then((cursor:any) => cursor.each(callback))

export const addVideo = (video: Video) => r.table('videos').insert({...video, queued_at: new Date()}).run(c);

export const doesVideoExist = (youtubeId: string) => r.table('videos').getAll(youtubeId,{index: 'youtubeId'}).count().run(c).then(count => count > 0);
export const deleteVideo = (id:string) => r.table('videos').get(id).delete().run(c);