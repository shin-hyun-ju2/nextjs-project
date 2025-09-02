'use client';

import { useRouter } from 'next/navigation';

export default function DetailLink({ urlId }) {
  //useReducer()는 클라이언트 컴포넌트에서만 가져다 쓸 수 있음.
  let router = useRouter();

  return (
    /* 버튼을 클릭하면 .push('/list')를 이용해 페이지 이동됨. */
    <button
      onClick={() => {
        router.push(urlId);
      }}
    >
      페이지로 이동
    </button>
  );
}
