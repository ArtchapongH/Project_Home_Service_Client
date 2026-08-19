"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function TechnicianLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login, logout } = useAuth();
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success && result.user) {
      if (result.user.role?.toUpperCase() !== "TECHNICIAN") {
        await logout();
        setErrorMessage(
          "คุณไม่มีสิทธิ์เข้าใช้งานส่วนช่างเทคนิค (สำหรับ Technician เท่านั้น)",
        );
        return;
      }

      router.push("/technician");
      return;
    }

    setErrorMessage(result.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold text-[#092c76]">
        เข้าสู่ระบบช่าง
      </h1>

      {errorMessage && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3.5 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="technician-email"
            className="mb-2 block text-lg font-semibold text-[#2b2f38]"
          >
            Email<span className="text-[#ea3d3d]">*</span>
          </label>
          <input
            id="technician-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="technician@example.com"
            className="h-11 w-full rounded-md border border-[#d8dde7] px-3 text-base text-[#222] outline-none transition focus:border-[#2d63f6]"
          />
        </div>

        <div>
          <label
            htmlFor="technician-password"
            className="mb-2 block text-lg font-semibold text-[#2b2f38]"
          >
            Password<span className="text-[#ea3d3d]">*</span>
          </label>
          <input
            id="technician-password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="h-11 w-full rounded-md border border-[#d8dde7] px-3 text-base text-[#222] outline-none transition focus:border-[#2d63f6]"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 h-12 w-full rounded-md bg-[#2d63f6] text-lg font-semibold text-white transition hover:bg-[#2453d5] disabled:opacity-50"
        >
          {isLoading ? "กำลังตรวจสอบสิทธิ์..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}
