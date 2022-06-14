import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { dbUsers } from '../../../database';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: {
          label: 'Correo',
          type: 'email',
          placeholder: 'correo@google.com'
        },
        password: {
          label: 'Contraseña',
          type: 'password',
          placeholder: 'Contraseña...'
        }
      },
      async authorize(credentials) {
        return await dbUsers.checkUserEmailPssword(
          credentials!.email,
          credentials!.password
        );
      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
    // ...add more providers here
  ],

  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  session: {
    maxAge: 2592000, /// 30d
    strategy: 'jwt',
    updateAge: 86400 /// 1d
  },

  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;

        switch (account.type) {
          case 'oauth':
            // TODO: crear usuario o verificar si existe en mi DB
            token.user = await dbUsers.oAuthToDbUser(
              user?.email || '',
              user?.name || ''
            );
            break;

          case 'credentials':
            token.user = user;
            break;

          default:
            break;
        }
      }

      return token;
    },

    async session({ session, token, user }) {
      session.accessToken = token.access_token;
      session.user = token.user as any;

      return session;
    }
  }
});
