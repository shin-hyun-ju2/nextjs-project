"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginBtn() {
  return (
    <button
      onClick={() => {
        signIn();
      }}
    >
      로그인
    </button>
    /* singIn()함수만 넣으면 로그인 페이지로 자동 이동됨.  */
  );
}
