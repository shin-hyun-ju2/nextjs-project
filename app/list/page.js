import { connectDB } from "@/util/database";
//몽고DB연결 @/경로는 어디있는 경로이든 찾아올때 사용

import ListItem from "./ListItem";

export const dynamic = "force-dynamic"; //다이나믹 렌더링으로 강제 변경
/* export const revalidate = 60; */ //60초 후에 갱신. revalidate는 예약변수임.

export default async function List() {
  try {
    const client = await connectDB;
    // MongoDB 연결 클라이언트를 생성합니다.

    const db = client.db("myapp");
    // "myapp"이라는 데이터베이스를 선택합니다.

    let result = await db.collection("post").find().toArray();
    // "post" 컬렉션에서 모든 도큐먼트를 가져옵니다.
    // toArray()를 사용하여 결과를 배열 형태로 변환합니다.

    // MongoDB `_id`를 문자열로 변환하여 직렬화 가능하게 만듭니다.
    result = result.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));

    return (
      <div className="list-bg">
        {/* 리스트 배경 스타일을 적용한 div */}
        <ListItem result={result} />
        {/* 자식 컴포넌트로 MongoDB에서 가져온 데이터를 props로 전달합니다. */}
      </div>
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return <div>Error loading data.</div>;
    // 데이터 로딩 중 오류 발생 시 사용자에게 메시지를 표시합니다.
  }
}
