import NextAuth,{ AuthError}  from "next-auth";
import {DrizzleAdapter as Adapter, DrizzleAdapter} from "@auth/drizzle-adapter";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from 'next-auth';
import { findUserById,loginUser } from "@/db/user";
import { db } from "@/db";
import { accounts,authenticators,sessions,users,verificationTokens } from "@/db/schema";
import { adapter } from "next/dist/server/web/adapter";

export class InvalidTypeError extends AuthError{
    code ='login-with-oauth';

}

export const config = {
    providers : [
        GitHub(
            {
            async profile(profile){
                return{
                    id : profile.id.toString(),
                    name : profile.name ?? profile.login,
                    email : profile.email,
                    image : profile.avatar_url,
                    username : profile.login,
                    isVerified :true,
                }
            }
        }),
        Google({
            clientId : process.env.GOOGLE_CLIENT_ID,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET,
            async profile(profile){
                return{
                    id : profile.sub,
                    name : profile.name,
                    email : profile.email,
                    image : profile.picture,
                    username : profile.email.split('@')[0],
                    isVerified :true,
                }
            }
        }),
        Credentials({
            async authorize(credentials :Partial<Record<string,unknown>>){
                try {
                    if(
                        !credentials?.identifier ||
                        !credentials?.password ||
                        typeof credentials.identifier !== 'string' ||
                        typeof credentials.password !== 'string'
                    ){
                        return null;
                    }
                    const user = await loginUser(credentials.identifier,credentials.password);
                    if(!user){
                        return null;
                    }
                    return{
                        ...user,
                        username :user.username??'',
                        isVerified:user.isVerified??false,
                        isAcceptingMessages:user.isAcceptingMessages??false,
                    };
                } catch (error) {
                    if(error instanceof AuthError){
                        throw new InvalidTypeError(error.message);
                    }else{
                        throw error;
                    }
                }
            }
        })
    ],
    adapter :DrizzleAdapter(db,{
        usersTable : users,
        accountsTable : accounts,
        sessionsTable:sessions,
        verificationTokensTable:verificationTokens,
        authenticatorsTable:authenticators,
    }),
    callbacks :{
        async jwt({ token }: { token: any }){
            const user = await findUserById(token.sub as string);
            if(user){
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        } ,
        async session({session, token}: {session: any, token: any}){
            if(token){
                session.user.id = token.sub;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        } 
     },
     session : {
        strategy : "jwt",
        maxAge : 30 * 24 * 60 * 60, // 30 days
     },
     secret : process.env.AUTH_SECRET,
     pages:{
        signIn : 'sign-in',
     },
}satisfies NextAuthConfig;

export const {handlers,auth,signIn,signOut} = NextAuth(config);
