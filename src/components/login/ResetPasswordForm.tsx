"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import LoginCard from "./LoginCard";
import LoginSubmitButton from "./LoginSubmitButton";
import LoginTextField from "./LoginTextField";

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (newPassword.length < 6) {
      setErrorMessage("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setIsSubmitted(true);
  };

  return (
    <LoginCard width="medium">
      <h1 className="mb-6 text-center text-xl font-semibold text-blue-900 sm:mb-8 sm:text-2xl">
        ตั้งรหัสผ่านใหม่
      </h1>

      {isSubmitted ? (
        <p className="mb-6 text-center text-sm leading-6 text-gray-700">
          ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่
        </p>
      ) : (
        <>
          <p className="mb-6 text-center text-sm leading-6 text-gray-700">
            กรอกรหัสผ่านใหม่เพื่อเข้าใช้งานบัญชีของคุณ
          </p>

          {errorMessage ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {errorMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
            <LoginTextField
              id="reset-new-password"
              label="รหัสผ่านใหม่"
              type="password"
              placeholder="กรุณากรอกรหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
              autoComplete="new-password"
              value={newPassword}
              onChange={setNewPassword}
            />
            <LoginTextField
              id="reset-confirm-password"
              label="ยืนยันรหัสผ่านใหม่"
              type="password"
              placeholder="กรุณากรอกรหัสผ่านอีกครั้ง"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
            <LoginSubmitButton>บันทึกรหัสผ่านใหม่</LoginSubmitButton>
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
