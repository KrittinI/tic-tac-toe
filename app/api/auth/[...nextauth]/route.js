import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import LineProvider from "next-auth/providers/line";
import { pool } from "../../../../config/database";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@doe.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        const { rows } = await pool.query(
          `SELECT * FROM PLAYERS WHERE email=$1
           `,
          [credentials.email]
        );

        const user = rows[0];

        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } else {
          throw new Error("Invalid email or password");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: { scope: "profile email openid" },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET,
      authorization: {
        params: { scope: "profile openid email" },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!user.email) {
          return false;
        }

        if (account.provider === "credentials") {
          return true;
        }

        const {
          rows: [existingAccount],
        } = await pool.query(
          `SELECT * FROM ACCOUNTS WHERE provider_account_id=$1 AND provider=$2`,
          [account.providerAccountId, account.provider]
        );

        if (existingAccount) {
          return true;
        }

        const { rows } = await pool.query(
          `SELECT * FROM PLAYERS WHERE email=$1
           `,
          [user.email]
        );

        let existingUser = rows[0];

        if (!existingUser) {
          const { rows } = await pool.query(
            `INSERT INTO PLAYERS (name, email)
             VALUES ($1, $2)
             RETURNING id, name, email, created_at`,
            [user.name, user.email]
          );

          existingUser = rows[0];
        }

        await pool.query(
          `
          INSERT INTO ACCOUNTS (user_id, type, provider, provider_account_id) 
          VALUES ($1, $2, $3, $4)`,
          [
            existingUser.id,
            account.type,
            account.provider,
            account.providerAccountId,
          ]
        );

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id;
        session.user.image = token.picture;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/profile`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
