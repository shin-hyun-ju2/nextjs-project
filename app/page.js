import { connectDB } from '@/util/database'; //몽고DB연결 @/경로는 어디있는 경로이든 찾아올때 사용

//async function과 await는 같이 사용되어야 함.
export default async function Home() {
  /*   const client = await connectDB;
  const db = client.db("myapp");
  let result = await db.collection("post").find().toArray(); //collection의 모든 도큐멘트 가져올 수 있음.
  console.log(result); */

  //1분마다 캐싱된 데이터 갱신하기. 이렇게하면 1초마다 갱신하지 않아도 되고 서버 자원을 절약할 수 있다.
  await fetch('https://example.com/data', { next: { revalidate: 60 } });
  return <div>안녕</div>;
}
//"https://example.com/data"은 데이터 보관된 URL
