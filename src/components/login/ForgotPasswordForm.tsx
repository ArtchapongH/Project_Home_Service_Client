"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import LoginCard from "./LoginCard";
import LoginSubmitButton from "./LoginSubmitButton";
import LoginTextField from "./LoginTextField";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <LoginCard width="medium">
      <h1 className="mb-6 text-center text-xl font-semibold text-blue-900 sm:mb-8 sm:text-2xl">
        ลืมรหัสผ่าน
      </h1>

      {isSubmitted ? (
        <p className="mb-6 text-center text-sm leading-6 text-gray-700">
          หากอีเมลนี้มีในระบบ เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้
          กรุณาตรวจสอบกล่องจดหมายของคุณ
        </p>
      ) : (
        <>
          <p className="mb-6 text-center text-sm leading-6 text-gray-700">
            กรอกอีเมลที่ใช้สมัคร แล้วเราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
            <LoginTextField
              id="forgot-password-email"
              label="อีเมล"
              type="email"
              placeholder="กรุณากรอกอีเมล"
              autoComplete="email"
              value={email}
              onChange={setEmail}
            />
            <LoginSubmitButton>ส่งลิงก์รีเซ็ตรหัสผ่าน</LoginSubmitButton>
          </form>
        </>
      )}

      <Link
        href="/login"
        className="mt-5 block text-center text-xs text-blue-500 underline sm:mt-6 sm:text-sm"
      >
        กลับไปหน้าเข้าสู่ระบบ
      </Link>
    </LoginCard>
  );
}
