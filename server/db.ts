import * as r from 'rethinkdb';
import { serverConfig as APP_CONFIG } from '../config';

let c = null;

export const connect = () => r.connect({host: APP_CONFIG.DB_HOST}).then(e => (c=e,e));

