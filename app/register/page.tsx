import type { Metadata } from "next";
import RegisterForm from "@/src/components/login/RegisterForm";

export const metadata: Metadata = {
  title: "ลงทะเบียน",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
