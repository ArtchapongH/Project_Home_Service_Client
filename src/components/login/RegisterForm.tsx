"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Checkbox from "@mui/material/Checkbox";
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <LoginCard>
      <h1 className="mb-6 text-center text-xl font-semibold text-blue-900 sm:mb-8 sm:text-2xl">
        ลงทะเบียน
      </h1>

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
          placeholder="กรุณากรอกรหัสผ่าน"
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

        <LoginSubmitButton isDisabled={!isAcceptedTerms}>
          ลงทะเบียน
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
