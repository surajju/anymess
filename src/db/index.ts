import {drizzle} from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

if(!process.env.TURSO_DATABASE_URL){
    throw new Error('DATABASE_URL is not defined');
}

if(!process.env.TURSO_AUTH_TOKEN){
    throw new Error('AUTH_TOKEN is not defined');
}

//create a client connection

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client,{schema});