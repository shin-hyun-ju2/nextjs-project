'use client';

//detail/[goods]/page.js에서 에러가 나는경우에 error페이지 보여주기
export default function Error({ error, reset }) {
  //error와 reset 데이터 가져옴
  //props로 error와 reset 데이터 가져올 수도 있음.

  return (
    <dvi>
      <div>에러발생</div>
      <button
        onClick={() => {
          reset(); //페이지 새로고침
        }}
      >
        reset
      </button>
    </dvi>
  );
}
