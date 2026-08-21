"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import FacebookLoginButton from "./FacebookLoginButton";
import LoginCard from "./LoginCard";
import LoginSubmitButton from "./LoginSubmitButton";
import LoginTextField from "./LoginTextField";
import OrDivider from "./OrDivider";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    setErrorMessage("");
    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        if (result.user?.role?.toUpperCase() === "ADMIN") {
          router.push("/admin/services");
        } else {
          router.push("/");
        }
        return;
      }

      setErrorMessage(result.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      isSubmittingRef.current = false;
      setIsLoading(false);
    } catch {
      setErrorMessage("ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง");
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <LoginCard>
      <h1 className="mb-6 text-center text-xl font-semibold text-blue-900 sm:mb-8 sm:text-2xl">
        เข้าสู่ระบบ
      </h1>

      {errorMessage && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {errorMessage}
        </div>
      )}

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
        <LoginSubmitButton isDisabled={isLoading}>
          {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </LoginSubmitButton>
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
