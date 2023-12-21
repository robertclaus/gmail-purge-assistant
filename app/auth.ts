import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.OAUTH_CLIENT_KEY as string,
      clientSecret: process.env.OAUTH_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
        if (account) {
            token.accessToken = account.access_token;
        }
        return token;
    },
    async session({ session, token }) {
        //@ts-ignore
        session.accessToken = token.accessToken;
        return session;
    },
  },
});
