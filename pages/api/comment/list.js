import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';

export default async function handler(요청, 응답) {
  const db = (await connectDB).db('myapp');
  /* 부모게시물의 id가져오기 */
  const result = await db
    .collection('comment')
    .find({ parent: new ObjectId(요청.query.id) }) //모든 게시물 중 부모가 보낸게시물_id 찾기
    .toArray();
  응답.status(200).json(result);
}
