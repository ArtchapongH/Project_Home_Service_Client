"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Checkbox from "@mui/material/Checkbox";
import { useAuth } from "@/contexts/AuthContext";
import FacebookLoginButton from "./FacebookLoginButton";
import LoginCard from "./LoginCard";
import LoginSubmitButton from "./LoginSubmitButton";
import LoginTextField from "./LoginTextField";
import OrDivider from "./OrDivider";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAcceptedTerms, setIsAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isAcceptedTerms) {
      setErrorMessage("กรุณายอมรับข้อตกลงและเงื่อนไขก่อนลงทะเบียน");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setIsLoading(true);
    const result = await register({
      fullName,
      phone,
      email,
      password,
    });
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(
        result.requiresEmailConfirmation
          ? "ลงทะเบียนสำเร็จ! กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ"
          : "ลงทะเบียนสำเร็จ! กำลังนำคุณเข้าสู่ระบบ...",
      );
      setTimeout(() => {
        router.push(result.requiresEmailConfirmation ? "/login" : "/");
      }, 1500);
    } else {
      setErrorMessage(result.error || "เกิดข้อผิดพลาดในการลงทะเบียน");
    }
  };

  return (
    <LoginCard>
      <h1 className="mb-6 text-center text-xl font-semibold text-blue-900 sm:mb-8 sm:text-2xl">
        ลงทะเบียน
      </h1>

      {errorMessage && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <LoginTextField
          id="fullName"
          label="ชื่อ - นามสกุล"
          placeholder="กรุณากรอกชื่อ - นามสกุล"
          autoComplete="name"
          value={fullName}
          onChange={setFullName}
        />
        <LoginTextField
          id="phone"
          label="เบอร์โทรศัพท์"
          type="tel"
          placeholder="กรุณากรอกเบอร์โทรศัพท์"
          autoComplete="tel"
          value={phone}
          onChange={setPhone}
        />
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
          placeholder="กรุณากรอกรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
        />

        <div className="flex items-start gap-1">
          <Checkbox
            checked={isAcceptedTerms}
            onChange={(event) => setIsAcceptedTerms(event.target.checked)}
            size="small"
            sx={{ pt: 0.25 }}
          />
          <p className="pt-1 text-xs text-gray-700 sm:text-sm">
            ยอมรับ{" "}
            <a href="#terms" className="text-blue-500 underline">
              ข้อตกลงและเงื่อนไข
            </a>{" "}
            และ{" "}
            <a href="#privacy" className="text-blue-500 underline">
              นโยบายความเป็นส่วนตัว
            </a>
          </p>
        </div>

        <LoginSubmitButton isDisabled={!isAcceptedTerms || isLoading}>
          {isLoading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
        </LoginSubmitButton>
      </form>

      <OrDivider />
      <FacebookLoginButton />

      <Link
        href="/login"
        className="mt-5 block text-center text-xs text-blue-500 underline sm:mt-6 sm:text-sm"
      >
        กลับไปหน้าเข้าสู่ระบบ
      </Link>
    </LoginCard>
  );
}
