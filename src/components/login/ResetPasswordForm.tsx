"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import LoginCard from "./LoginCard";
import LoginSubmitButton from "./LoginSubmitButton";
import LoginTextField from "./LoginTextField";
import { resetPasswordWithRecovery } from "@/services/auth.service";
import { getResetPasswordErrorMessage } from "@/utils/getAuthErrorMessage";
import {
  clearRecoveryParamsFromUrl,
  getRecoverySessionFromUrl,
  type RecoverySession,
} from "@/utils/getRecoverySessionFromUrl";

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recoverySession, setRecoverySession] = useState<RecoverySession | null>(
    null,
  );
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const session = getRecoverySessionFromUrl();
    setRecoverySession(session);

    if (!session) {
      setErrorMessage(
        "ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุ กรุณาขอลิงก์ใหม่จากหน้าลืมรหัสผ่าน",
      );
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    setErrorMessage("");

    if (!recoverySession) {
      setErrorMessage(
        "ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุ กรุณาขอลิงก์ใหม่จากหน้าลืมรหัสผ่าน",
      );
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      await resetPasswordWithRecovery({
        newPassword,
        confirmNewPassword: confirmPassword,
        accessToken: recoverySession.accessToken,
        refreshToken: recoverySession.refreshToken,
      });
      clearRecoveryParamsFromUrl();
      setIsSubmitted(true);
    } catch (error: unknown) {
      setErrorMessage(getResetPasswordErrorMessage(error));
      isSubmittingRef.current = false;
    } finally {
      setIsLoading(false);
    }
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
            <LoginSubmitButton isDisabled={isLoading || !recoverySession}>
              {isLoading ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
            </LoginSubmitButton>
          </form>
        </>
      )}

      <div className="mt-5 flex flex-col items-center gap-2 sm:mt-6">
        {!isSubmitted && !recoverySession ? (
          <Link
            href="/forgot-password"
            className="text-xs text-blue-500 underline sm:text-sm"
          >
            ขอลิงก์รีเซ็ตรหัสผ่านใหม่
          </Link>
        ) : null}
        <Link
          href="/login"
          className="text-xs text-blue-500 underline sm:text-sm"
        >
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    </LoginCard>
  );
}
