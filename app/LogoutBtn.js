"use client";

import { signOut } from "next-auth/react";

export default function LogoutBtn() {
  return (
    <>
      <button
        onClick={() => {
          signOut();
        }}
      >
        로그아웃
      </button>
      {/* signOut()함수만 넣으면 자동 로그아웃 됨.. */}
    </>
  );
}
