'use client';

import { useState, useEffect } from 'react';

export default function Comment(props) {
  const [comment, setComment] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 댓글 목록 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/comment/list?id=' + props._id);
        if (!response.ok) {
          throw new Error('댓글 데이터를 가져오는 중 오류가 발생했습니다.');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [props._id]);

  // 댓글 작성
  const handleSubmit = async () => {
    if (!comment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/comment/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: comment,
          _id: props._id, // 부모 게시물 ID 전달
        }),
      });

      if (!response.ok) {
        throw new Error('댓글을 전송하는 중 오류가 발생했습니다.');
      }

      const newComment = await response.json();

      // 새로운 댓글을 기존 데이터에 추가
      setData((prevData) => [...prevData, newComment]);
      setComment(''); // 입력 필드 초기화
    } catch (err) {
      setError('댓글을 전송하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <hr />
      {loading ? (
        '로딩중'
      ) : error ? (
        <p>{error}</p>
      ) : (
        data.map((a, i) => <p key={i}>{a.content}</p>)
      )}

      <input
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        placeholder="댓글을 입력하세요"
      />
      <button onClick={handleSubmit}>댓글 전송</button>
    </div>
  );
}
