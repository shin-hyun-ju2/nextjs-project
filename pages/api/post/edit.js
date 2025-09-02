import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb'; //DB의 ID가져옴.
import { getServerSession } from "next-auth"; // 세션 정보를 가져오기 위한 함수
import { authOptions } from "../auth/[...nextauth]"; // NextAuth 인증 설정

// post/new.js파일 복사하여 가져와 수정
export default async function handler(요청, 응답) {
  if (요청.method == "POST") {
    try {
      // 현재 로그인한 사용자의 세션 정보 가져오기
      const session = await getServerSession(요청, 응답, authOptions);

      if (!session) {
        // 로그인하지 않은 경우
        return 응답.status(401).json("로그인이 필요합니다."); // 401 Unauthorized
      }

      const db = (await connectDB).db("myapp");

      // 수정하려는 게시글 가져오기
      const postToEdit = await db
        .collection("post")
        .findOne({ _id: new ObjectId(요청.body._id) });

      if (!postToEdit) {
        // 게시글이 없을 경우
        return 응답.status(404).json("게시글을 찾을 수 없습니다."); // 404 Not Found
      }

      if (postToEdit.author !== session.user.email) {
        // 현재 로그인한 사용자가 작성자가 아닐 경우
        return 응답.status(403).json("본인 글만 수정할 수 있습니다."); // 403 Forbidden
      }

      // 수정할 내용 정의
      const listModify = {
        title: 요청.body.title,
        content: 요청.body.content,
      };

      // 게시글 수정
      const result = await db.collection("post").updateOne(
        { _id: new ObjectId(요청.body._id) }, // 수정할 게시글 조건
        { $set: listModify } // 수정할 내용
      );

      // 수정 완료 후 리스트 페이지로 리디렉션
      return 응답.redirect(302, "/list");
    } catch (error) {
      console.error(error);
      return 응답.status(500).json("서버 에러 발생"); // 500 Internal Server Error
    }
  } else {
    // POST 요청이 아닌 경우
    return 응답.status(405).json("허용되지 않는 메서드입니다."); // 405 Method Not Allowed
  }
}
