import Github from "next-auth/providers/github";
import { GithubProfile } from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { Awaitable } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import User from "@/app/(models)/User";
import bcrypt from 'bcrypt';

interface TokenSetParameters {
    access_token: string;
    refresh_token?: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    // Other relevant properties...
  }

export const options = {
    providers: [
        Github({
            profile(profile: any) {
                console.log("Profile of Github:", profile);
                let userRole = "Github User";
                if (profile?.email === 'sujan.maharjan75@gmail.com') {
                    userRole = 'admin';
                }
                const modifiedProfile = {
                    ...profile,
                    role: userRole
                };

                return modifiedProfile;
            },
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string
        }),

        Google({
            profile(profile: any) {
                console.log("Profile of Google:", profile);
                let userRole = "Google User";
                if (profile?.email === 'sujan.maharjan75@gmail.com') {
                    userRole = 'admin';
                }
                const modifiedProfile = {
                    ...profile,
                    id: profile.sub,
                    role: userRole
                };

                return modifiedProfile;
            },
            clientId:  process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        Credentials({
            name:'credentials',
            credentials:{
                email:{
                    label: 'Email:',
                    type: 'text',
                    placeholder: 'Enter your email address'
                },
                password:{
                    label: 'Password:',
                    type: 'password',
                    placeholder: 'Enter your password'
                }
            },
            async authorize(credentials: any, req) {
                try{
                    const foundUser:any = await User.findOne({email: credentials?.email}).lean().exec();
                    if(foundUser){
                        console.log('User Exists');
                        
                        const match = await bcrypt.compare(credentials?.password, foundUser?.password);
                        if(match){
                            console.log("Good Pass");
                            delete foundUser?.password;
                            foundUser['role'] = 'Unverified email';
                            return foundUser;
                        }
                    }
                }catch(err){
                    console.log(err)
                }
                return null;
            },
        }),
    ],
    callbacks:{
        async jwt({token, user}:{token:any, user:any }){
            if(user) token.role = user.role;
            return token;
        },
        async session({session, token}: {session:any, token:any}){
            if(session?.user) session.user.role = token.role
            return session;
        }
    }
}