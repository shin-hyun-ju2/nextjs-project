'use client';
import Link from 'next/link'; /* 링크를 이용하려면 가져오기해야 함. */

export default function ListItem({ result }) {
  return (
    <>
      <div>
        {result.map((a, i) => {
          return (
            <div className="list-item" key={i}>
              <Link href={'/detail/' + result[i]._id}>
                <h4>{result[i].title}</h4>
              </Link>
              <p>{result[i].content}</p>
              <Link href={'/edit/' + result[i]._id}>🖊️</Link>{' '}
              {/* 글마다 수정버튼이 생김. */}
              <span
                onClick={(e) => {
                  // 서버에 DELETE 요청을 보낼 때 fetch 사용
                  // fetch("/api/post/delete", { method: "DELETE", body: result[i]._id });
                  //삭제할 글의 ID를 JSON 형식으로 전달
                  fetch('/api/post/delete', {
                    method: 'DELETE',
                    body: JSON.stringify({ id: result[i]._id }),
                  }).then(() => {
                    e.target.parentElement.style.opacity = 0;
                    setTimeout(() => {
                      e.target.parentElement.style.display = 'none';
                    }, 400);
                  });
                }}
              >
                🗑️
              </span>
            </div>
          );
        })}
      </div>
      <Link href={'/write'}>글쓰기</Link>
    </>
  );
}
