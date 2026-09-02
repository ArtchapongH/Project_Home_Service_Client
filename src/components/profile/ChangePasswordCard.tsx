"use client";

import { useRef, useState, type FormEvent } from "react";
import PasswordVisibilityToggle from "@/components/login/PasswordVisibilityToggle";
import { changeMyPassword } from "@/services/profile.service";
import { getChangePasswordErrorMessage } from "@/utils/getAuthErrorMessage";

const inputClass =
  "w-full rounded-lg border border-gray-300 py-2.5 pl-3 pr-11 text-sm text-gray-900 outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500";
const saveButtonClass =
  "inline-flex min-h-[42px] min-w-24 items-center justify-center rounded-[8px] border border-transparent bg-blue-500 px-[22px] py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  autoComplete: string;
  onChange: (value: string) => void;
};

function PasswordField({
  id,
  label,
  value,
  autoComplete,
  onChange,
}: PasswordFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="grid gap-2 py-4 sm:grid-cols-[160px_1fr] sm:items-center sm:gap-6">
      <label htmlFor={id} className="text-sm font-medium text-gray-500">
        {label}
        <span className="text-[#d7263d]">*</span>
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPasswordVisible ? "text" : "password"}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        />
        <div className="absolute top-1/2 right-1 -translate-y-1/2">
          <PasswordVisibilityToggle
            isPasswordVisible={isPasswordVisible}
            onToggle={() => setIsPasswordVisible((previous) => !previous)}
          />
        </div>
      </div>
    </div>
  );
}

export function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword.length < 6) {
      setErrorMessage("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage("รหัสผ่านใหม่ต้องแตกต่างจากรหัสผ่านปัจจุบัน");
      return;
    }

    isSubmittingRef.current = true;
    setIsSaving(true);

    try {
      await changeMyPassword({
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMessage("บันทึกรหัสผ่านเรียบร้อยแล้ว");
    } catch (error: unknown) {
      setErrorMessage(getChangePasswordErrorMessage(error));
    } finally {
      isSubmittingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <section
      aria-label="รีเซ็ตรหัสผ่าน"
      className="grid w-full gap-1 overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7"
    >
      <form className="grid gap-1" onSubmit={handleSubmit}>
        <div className="m-0 divide-y divide-gray-100">
          <PasswordField
            id="currentPassword"
            label="รหัสผ่านปัจจุบัน"
            autoComplete="current-password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <PasswordField
            id="newPassword"
            label="รหัสผ่านใหม่"
            autoComplete="new-password"
            value={newPassword}
            onChange={setNewPassword}
          />
          <PasswordField
            id="confirmPassword"
            label="ยืนยันรหัสผ่านใหม่"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        </div>

        {successMessage ? (
          <p className="pt-2 text-sm text-green-700">{successMessage}</p>
        ) : null}
        {errorMessage ? (
          <p className="pt-2 text-sm text-red-600">{errorMessage}</p>
        ) : null}

        <div className="flex justify-end pt-5">
          <button type="submit" disabled={isSaving} className={saveButtonClass}>
            {isSaving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </form>
    </section>
  );
}
