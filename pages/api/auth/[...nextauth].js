// 데이터베이스 연결 및 필요한 모듈 import
import { connectDB } from '@/util/database';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';

import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';

import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// NextAuth 설정 옵션 정의
export const authOptions = {
  providers: [
    // GitHub 소셜 로그인 제공자
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // Google 소셜 로그인 제공자
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Kakao 소셜 로그인 제공자
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
    // Credentials Provider (아이디/비밀번호 로그인)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // 데이터베이스 연결
        let db = (await connectDB).db('myapp');
        // 사용자가 입력한 이메일로 사용자 검색
        let user = await db
          .collection('user_cred')
          .findOne({ email: credentials.email });

        if (!user) {
          console.log('해당 이메일은 없음');
          return null;
        }

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          console.log('비밀번호가 틀림');
          return null;
        }

        // 인증 성공 시 사용자 정보 반환
        return user;
      },
    }),
  ],

  // 세션 및 JWT 설정// 세션 유지 기간: 30일 // JWT를 사용하여 세션 관리
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    // JWT 생성 시 실행되는 콜백
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = {};
        token.user.name = user.name || user.username; // 소셜 로그인과 Credentials 간 이름 처리
        token.user.email = user.email;
      }
      return token;
    },
    // 세션에서 사용자 정보 조회 시 실행되는 콜백
    session: async ({ session, token }) => {
      session.user = token.user;
      return session;
    },
    // 리다이렉션 경로 설정
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith(baseUrl)) {
        return url; // 기본적으로 URL이 baseUrl로 시작하면 그대로 사용
      }
      return baseUrl + '/main'; // 메인 페이지로 이동
    },
  },

  // MongoDB 어댑터 설정
  adapter: MongoDBAdapter(connectDB),

  // 보안 키 설정
  secret: process.env.NEXTAUTH_SECRET,
  baseUrl: baseUrl, // baseUrl 명시적으로 설정
};

export default NextAuth(authOptions);
