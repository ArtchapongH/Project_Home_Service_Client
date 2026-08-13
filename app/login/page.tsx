import type { Metadata } from "next";
import LoginForm from "@/src/components/login/LoginForm";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ",
};

export default function LoginPage() {
  return <LoginForm />;
}
