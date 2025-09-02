import { connectDB } from '@/util/database'; // 데이터베이스 연결 유틸리티를 임포트
import bcrypt from 'bcrypt'; // bcrypt 라이브러리를 임포트

export default async function handler(요청, 응답) {
  // 요청 메서드가 POST인지 확인
  if (요청.method === 'POST') {
    const { email, password } = 요청.body; // 요청 본문에서 이메일과 비밀번호를 추출

    // 입력 값 검증: 이메일과 비밀번호가 빈값인지 확인
    if (!email || !password) {
      return 응답.status(400).json('이메일과 비밀번호를 모두 입력해주세요.'); // 오류 응답 전송
    }

    // 데이터베이스 연결
    let db = (await connectDB).db('myapp'); // 'myapp' 데이터베이스에 연결

    // 이메일 중복 확인
    const existingUser = await db
      .collection('user_cred')
      .findOne({ email: email }); // 이메일로 사용자 검색
    if (existingUser) {
      return 응답.status(400).json('이미 사용 중인 이메일입니다.'); // 중복된 이메일에 대한 오류 응답
    }

    // 비밀번호 해싱
    let hash = await bcrypt.hash(password, 10); // 비밀번호를 해싱
    요청.body.password = hash; // 해싱된(암호화된) 비밀번호를 요청 객체에 다시 저장

    // 사용자 자격 증명 정보를 'user_cred' 컬렉션에 삽입
    await db.collection('user_cred').insertOne(요청.body); // user_cred 정보가 저장될 컬렉션에 사용자 정보 삽입

    // 성공 응답 전송
    //응답.status(200).json('성공'); // 성공 메시지 전송
    응답.redirect(302, '/api/auth/signin');
  } else {
    // 허용되지 않는 요청 메서드 처리
    응답.status(405).json('허용되지 않는 메서드입니다.'); // 허용되지 않는 메서드에 대한 오류 응답
  }
}
