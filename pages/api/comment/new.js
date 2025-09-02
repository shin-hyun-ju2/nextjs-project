import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';
import { authOptions } from '../auth/[...nextauth]';
import { getServerSession } from 'next-auth';

export default async function handler(요청, 응답) {
  try {
    let session = await getServerSession(요청, 응답, authOptions);

    if (요청.method === 'POST') {
      if (typeof 요청.body === 'string') {
        요청.body = JSON.parse(요청.body);
      }

      let 저장할거 = {
        content: 요청.body.comment,
        parent: new ObjectId(요청.body._id),
        author: session.user.email,
        createdAt: new Date(), // 댓글 작성 시간 추가
      };

      let db = (await connectDB).db('myapp');
      let result = await db.collection('comment').insertOne(저장할거);

      // 저장된 댓글 데이터를 클라이언트로 반환
      응답.status(200).json({
        _id: result.insertedId,
        ...저장할거,
      });
    } else {
      응답.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error(error);
    응답.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}
