// lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // 환경 변수에서 MongoDB URI 가져오기
const options = {}; // MongoDB 클라이언트 옵션, 필요에 따라 커스터마이징 가능

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local"); // Mongo URI가 제공되지 않은 경우 오류 발생
}

if (process.env.NODE_ENV === "development") {
  // 개발 모드에서는 클라이언트가 매번 핫 리로드될 때마다 재생성되지 않도록 전역 변수를 사용
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect(); // 클라이언트를 연결하고 전역에 Promise로 저장
  }
  clientPromise = global._mongoClientPromise; // 전역 클라이언트 Promise 사용
} else {
  // 프로덕션 모드에서는 전역 변수를 사용하지 않는 것이 좋음
  client = new MongoClient(uri, options);
  clientPromise = client.connect(); // 클라이언트를 직접 연결하고 Promise로 저장
}

// 애플리케이션에서 사용할 클라이언트 Promise를 내보내기
export default clientPromise;
