import { connectDB } from '@/util/database';
//몽고DB연결 @/경로는 어디있는 경로이든 찾아올때 사용

import { ObjectId } from 'mongodb'; //DB의 ID가져옴.

export default async function Edit(props) {
  //props를 설정하면 다이나믹 라우트에 있는 게시글들 가져올수있음.
  const client = await connectDB;
  const db = client.db('myapp');
  let result = await db
    .collection('post')
    .findOne({ _id: new ObjectId(props.params.id) });
  //유저가 url에 입력한 값. 즉, 게시글을 작성했을 때 생성되는 id값을 url에 입력

  console.log(result);

  return (
    /* write페이지와 UI가 똑같음. */
    <div className="">
      <h4>글수정</h4>
      <form action="/api/post/edit" method="POST">
        {/* 수정된 내용의 _id를 이용해 해당글만 db에 저장되도록 _id의 input을 추가함. */}
        <input
          type="text"
          name="_id"
          defaultValue={result._id.toString()}
          style={{ display: 'none' }}
        />
        <input type="text" name="title" defaultValue={result.title} />
        <input type="text" name="content" defaultValue={result.content} />
        <button type="submit">수정하기</button>
      </form>
    </div>
  );
}
