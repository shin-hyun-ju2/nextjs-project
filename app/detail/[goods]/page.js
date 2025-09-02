import { connectDB } from '@/util/database';
//몽고DB연결 @/경로는 어디있는 경로이든 찾아올때 사용

import { ObjectId } from 'mongodb'; //DB의 ID가져옴.
import Comment from './Comment';

export default async function Detail(props) {
  const client = await connectDB;
  const db = client.db('myapp');
  let result = await db
    .collection('post')
    .findOne({ _id: new ObjectId(props.params.goods) });
  //유저가 url에 입력한 값. 즉, 게시글을 작성했을 때 생성되는 id값을 url에 입력

  return (
    <div>
      <h4>상세페이지</h4>
      <h4>{result.title}</h4> {/* 두번째 타이틀 */}
      <p>{result.content}</p> {/* 두번째 내용 */}
      <Comment _id={result._id.toString()} />
      {/* 댓글 컴포넌트에 게시글 ID 전달 */}
    </div>
  );
}
