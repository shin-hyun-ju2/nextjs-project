import { MongoClient } from 'mongodb';

/* const uri =
  "mongodb+srv://admin:hsys02280621@cluster0.hi0rvwl.mongodb.net/myapp?retryWrites=true&w=majority&appName=Cluster0"; */

// 환경 변수에서 MongoDB URI 가져오기
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

let client;
let connectDB;

if (!connectDB) {
  client = new MongoClient(uri, {
    // useUnifiedTopology: true, // 최신 드라이버에서 권장 옵션
  });
  connectDB = client.connect();
}

export { connectDB };
