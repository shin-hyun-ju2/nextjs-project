import { connectDB } from '@/util/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(요청, 응답) {
  let session = await getServerSession(요청, 응답, authOptions);
  if (session) {
    // 로그인이 되어 있을 경우
    요청.body.author = session.user.email;
  } else {
    // 로그인 해 주세요 메세지 띄우기
    //return 응답.status(401).json({ message: "로그인 해 주세요" });
    //로그인 페이지로 이동하기
    return 응답.redirect(302, '../auth/signin');
  }
  console.log(session.user.email);

  if (요청.method == 'POST') {
    if (요청.body.title == '' || 요청.body.content == '') {
      return 응답.status(500).json('빈 내용을 채우세요.');
    }
    try {
      let db = (await connectDB).db('myapp');
      let result = db.collection('post').insertOne(요청.body);
      응답.redirect(302, '/list'); //성공했다면 실행
    } catch (error) {
      alert('문제가 있습니다.'); //실패했다면 실행. 에러의 정보를 받을 필요 없다면 생략가능
    }
  }
}
