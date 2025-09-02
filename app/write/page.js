export default function Write() {
  return (
    <div className="">
      <h4>글작성</h4>
      {/* 전송버튼을 클릭하면 pages/api/post/new가 실행되도록 함. */}
      <form action="/api/post/new" method="POST">
        <input type="text" name="title" placeholder="글제목" />
        <input type="text" name="content" placeholder="글내용" />
        <button type="submit">버튼</button>
      </form>
    </div>
  );
}
