"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import FacebookLoginButton from "./FacebookLoginButton";
import LoginCard from "./LoginCard";
import LoginSubmitButton from "./LoginSubmitButton";
import LoginTextField from "./LoginTextField";
import OrDivider from "./OrDivider";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <LoginCard>
      <h1 className="mb-6 text-center text-xl font-semibold text-blue-900 sm:mb-8 sm:text-2xl">
        เข้าสู่ระบบ
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
        <LoginTextField
          id="email"
          label="อีเมล"
          type="email"
          placeholder="กรุณากรอกอีเมล"
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <LoginTextField
          id="password"
          label="รหัสผ่าน"
          type="password"
          placeholder="กรุณากรอกรหัสผ่าน"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
        />
        <LoginSubmitButton>เข้าสู่ระบบ</LoginSubmitButton>
      </form>

      <OrDivider />
      <FacebookLoginButton />

      <p className="mt-5 text-center text-xs text-gray-700 sm:mt-6 sm:text-sm">
        ยังไม่มีบัญชีผู้ใช้ HomeService?{" "}
        <Link href="/register" className="text-blue-500 underline">
          ลงทะเบียน
        </Link>
      </p>
    </LoginCard>
  );
}
