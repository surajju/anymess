import {sql} from 'drizzle-orm';
import { integer,sqliteTable,text,primaryKey } from 'drizzle-orm/sqlite-core';
import type { AdapterAccountType } from 'next-auth/adapters';
import { Content } from 'next/font/google';

//users schema for storing user info
export const users = sqliteTable('user',{
    id:text('id')
       .primaryKey()
       .$defaultFn(() =>crypto.randomUUID()),
    name:text('name'),
    email:text('email').unique(),
    username : text('username').unique(),
    password:text('password'),
    emailVerified:integer('emailVerified',{mode:'timestamp_ms'}),
    image:text('image'),
    isVerified: integer('isVerified', { mode: 'boolean' }).default(false),
    isAcceptingMessages: integer('isAcceptingMessages', { mode: 'boolean' }).default(true),
});

//authentication providers schema
export const accounts = sqliteTable(
    'account',
    {
    userId:text('userId')
        .notNull()
        .references(() => users.id,{onDelete : 'cascade'}),
    type:text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
    },
    (account) =>({
        compoundKey:primaryKey({
            columns :[account.provider, account.providerAccountId],
        })
    })
);


//session  schema
export const sessions = sqliteTable('session',
    {
        sessionToken : text('sessionToken').primaryKey(),
        userId : text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        expires: integer('expires',{mode:'timestamp_ms'}).notNull(),
    }
);

//verification token schema
export const verificationTokens = sqliteTable('verificationToken',
{
 identifier: text('identifier').notNull(),
 token: text('token').notNull(),
 expires: integer('expires',{mode:'timestamp_ms'}).notNull(),   

},
(verificationToken) => ({
    compositePk :primaryKey({
        columns: [verificationToken.identifier,verificationToken.token],
    })
})
);

//authenticators schema
export const authenticators = sqliteTable(
    'authenticator',
    {
      credentialID: text('credentialID').notNull().unique(),
      userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
      providerAccountId: text('providerAccountId').notNull(),
      credentialPublicKey: text('credentialPublicKey').notNull(),
      counter: integer('counter').notNull(),
      credentialDeviceType: text('credentialDeviceType').notNull(),
      credentialBackedUp: integer('credentialBackedUp', {
        mode: 'boolean',
      }).notNull(),
      transports: text('transports'),
    },
    (authenticator) => ({
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    }),
  );

  //message schema
  export const messages = sqliteTable('message',{
    id:text('id')
       .primaryKey()
       .$defaultFn(() => crypto.randomUUID()),
    userId:text('userId')
         .notNull()
         .references(() => users.id,{onDelete : 'cascade'}),
    content:text('content'),
    createdAt : text('createdAt')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
  });
