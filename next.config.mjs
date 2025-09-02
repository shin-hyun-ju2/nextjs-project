/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';

// .env 파일에서 환경 변수 로드
dotenv.config();

const nextConfig = {
  reactStrictMode: true, // React 엄격 모드 활성화
  env: {
    MONGODB_URI: process.env.MONGODB_URI, // MongoDB 연결 URI
    NEXTAUTH_URL: process.env.NEXTAUTH_URL, // NextAuth URL
  },
  images: {
    domains: ['your-image-domain.com'], // 이미지 도메인 설정 (필요시 수정)
  },
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true, // 영구 리디렉션 여부
      },
    ];
  },
};

export default nextConfig;
