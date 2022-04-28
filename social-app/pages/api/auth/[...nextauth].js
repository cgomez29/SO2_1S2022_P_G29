import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { socialApi } from '../../../api';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { data } = await socialApi.post('/auth/signIn', {
            username: credentials.username,
            password: credentials.password,
          });
        return data;
        } catch (error) {
            return null;    
        }
      },    
    }),
  ],

  // Custom Pages

  pages: {
    signIn: '/'
  },

  // Callbacks
  jwt: {

  },

  session: {
    maxAge: 2592000, // 30d 
    strategy: 'jwt',
    updateAge: 86400, // cada dia
  },  

  callbacks: {
    async jwt({token, account, user}) {
        // console.log({token, account, user})
        
        if ( account ) {
            token.accessToken = account.access_token; 
            switch (account.type) {
                case 'credentials':
                    token.user = user;
                    break;
            }
        }

        return token;
    },
    async session({ session, token, user}) {

        // console.log({ session, token, user})

        session.accessToken = token.accessToken;

        session.user = token.user;
        return session;
    }
  },
  secret: 'effcsgaersgere',
});
