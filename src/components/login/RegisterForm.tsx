"use client";

import { useRef, useState, type FormEvent } from "react";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAcceptedTerms, setIsAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { register } = useAuth();
  const router = useRouter();
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

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

    if (password !== confirmPassword) {
      setErrorMessage("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      const result = await register({
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`.trim(),
        displayName: `${firstName} ${lastName}`.trim(),
        phone,
        email,
        password,
        acceptedTerms: isAcceptedTerms,
      });

      if (result.success) {
        setSuccessMessage(
          result.requiresEmailConfirmation
            ? "ลงทะเบียนสำเร็จ! กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ"
            : "ลงทะเบียนสำเร็จ! กำลังนำคุณเข้าสู่ระบบ...",
        );
        setTimeout(() => {
          router.push(result.requiresEmailConfirmation ? "/login" : "/");
        }, 1500);
        return;
      }

      setErrorMessage(result.error || "เกิดข้อผิดพลาดในการลงทะเบียน");
      isSubmittingRef.current = false;
      setIsLoading(false);
    } catch {
      setErrorMessage("ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง");
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <LoginCard isWide>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <LoginTextField
            id="firstName"
            label="ชื่อจริง"
            placeholder="กรุณากรอกชื่อจริง"
            autoComplete="given-name"
            value={firstName}
            onChange={setFirstName}
          />
          <LoginTextField
            id="lastName"
            label="นามสกุล"
            placeholder="กรุณากรอกนามสกุล"
            autoComplete="family-name"
            value={lastName}
            onChange={setLastName}
          />
        </div>
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
        <LoginTextField
          id="confirmPassword"
          label="ยืนยันรหัสผ่าน"
          type="password"
          placeholder="กรุณากรอกรหัสผ่านอีกครั้ง"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={setConfirmPassword}
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
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              ข้อตกลงและเงื่อนไข
            </Link>{" "}
            และ{" "}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              นโยบายความเป็นส่วนตัว
            </Link>
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
