import type { Metadata } from "next";
import ResetPasswordForm from "@/components/login/ResetPasswordForm";

export const metadata: Metadata = {
  title: "ตั้งรหัสผ่านใหม่",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
