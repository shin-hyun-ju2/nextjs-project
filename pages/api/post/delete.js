import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb'; // DB의 ID 가져옴.

/* getServerSession을 사용하려면 NextAuth 설정 파일이 필요합니다. 이 파일은 authOptions를 정의하며, NextAuth의 기본 설정을 포함합니다. */
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";


export default async function handler(요청, 응답) {
  // 요청 body가 JSON 형식으로 전달되었는지 확인
  const body = JSON.parse(요청.body); //JSON.parse()는 이 문자열을 JavaScript 객체로 변환합니다.
  if (요청.method == "DELETE") {
    console.log(body);
    
    // 현재 세션을 가져옴
    let session = await getServerSession(요청, 응답, authOptions);

    // MongoDB와 연결
    const db = (await connectDB).db("myapp");  //★데이터베이스명 확인 중요★
    
    // 요청 body에 해당하는 포스트를 DB에서 찾음
    let result = await db.collection("post").findOne({ _id: new ObjectId(body) });

    // 찾은 포스트의 작성자와 현재 세션의 유저가 일치하는지 확인
    if (result.author == session.user.email) {
      // 작성자가 일치하면 포스트를 삭제
      let result = await db.collection("post").deleteOne({ _id: new ObjectId(body) });
      console.log(result);
      return 응답.status(200).json("삭제완료");
    } else {
      // 작성자가 일치하지 않으면 에러 응답
      return 응답.status(500).json("현재유저와 작성자 불일치");
    }
  } else {
    // DELETE 메서드가 아닌 경우 처리할 로직 추가 (예: 405 Method Not Allowed 응답)
    return 응답.status(405).json("허용되지 않는 메서드");
  }
}
