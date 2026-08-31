"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import FacebookLoginButton from "./FacebookLoginButton";
import LoginCard from "./LoginCard";
import LoginSubmitButton from "./LoginSubmitButton";
import LoginTextField from "./LoginTextField";
import OrDivider from "./OrDivider";

export default function LoginForm() {
  const t = useTranslations("Login");
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

      setErrorMessage(result.error || t("errors.invalidCredentials"));
      isSubmittingRef.current = false;
      setIsLoading(false);
    } catch {
      setErrorMessage(t("errors.generic"));
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <LoginCard>
      <h1 className="mb-6 text-center text-xl font-semibold text-blue-900 sm:mb-8 sm:text-2xl">
        {t("title")}
      </h1>

      {errorMessage && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
        <LoginTextField
          id="email"
          label={t("email")}
          type="email"
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <div>
          <LoginTextField
            id="password"
            label={t("password")}
            type="password"
            placeholder={t("passwordPlaceholder")}
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
          />
          <div className="mt-2 flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-blue-500 underline sm:text-sm"
            >
              ลืมรหัสผ่าน?
            </Link>
          </div>
        </div>
        <LoginSubmitButton isDisabled={isLoading}>
          {isLoading ? t("submitting") : t("submit")}
        </LoginSubmitButton>
      </form>

      <OrDivider label={t("orDivider")} />
      <FacebookLoginButton label={t("facebook")} />

      <p className="mt-5 text-center text-xs text-gray-700 sm:mt-6 sm:text-sm">
        {t("noAccount")}{" "}
        <Link href="/register" className="text-blue-500 underline">
          {t("register")}
        </Link>
      </p>
    </LoginCard>
  );
}
