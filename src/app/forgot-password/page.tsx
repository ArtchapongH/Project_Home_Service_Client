import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/login/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "ลืมรหัสผ่าน",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
