"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Checkbox from "@mui/material/Checkbox";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { MIN_PASSWORD_LENGTH } from "@/utils/password";
import FacebookLoginButton from "./FacebookLoginButton";
import LoginCard from "./LoginCard";
import LoginSubmitButton from "./LoginSubmitButton";
import LoginTextField from "./LoginTextField";
import OrDivider from "./OrDivider";

export default function RegisterForm() {
  const t = useTranslations("Register");
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
      setErrorMessage(t("errors.termsAndConditions"));
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(t("errors.passwordLength"));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t("errors.passwordMatch"));
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
            ? t("success.emailConfirmation")
            : t("success.registrationSuccess"),
        );
        setTimeout(() => {
          router.push(result.requiresEmailConfirmation ? "/login" : "/");
        }, 1500);
        return;
      }

      setErrorMessage(result.error || t("errors.registrationError"));
      isSubmittingRef.current = false;
      setIsLoading(false);
    } catch {
      setErrorMessage(t("errors.generic"));
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <LoginCard isWide>
      <h1 className="mb-6 text-center text-xl font-semibold text-blue-900 sm:mb-8 sm:text-2xl">
        {t("title")}
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
            label={t("firstName")}
            placeholder={t("firstNamePlaceholder")}
            autoComplete="given-name"
            value={firstName}
            onChange={setFirstName}
          />
          <LoginTextField
            id="lastName"
            label={t("lastName")}
            placeholder={t("lastNamePlaceholder")}
            autoComplete="family-name"
            value={lastName}
            onChange={setLastName}
          />
        </div>
        <LoginTextField
          id="phone"
          label={t("phone")}
          type="tel"
          placeholder={t("phonePlaceholder")}
          autoComplete="tel"
          value={phone}
          onChange={setPhone}
        />
        <LoginTextField
          id="email"
          label={t("email")}
          type="email"
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <LoginTextField
          id="password"
          label={t("password")}
          type="password"
          placeholder={t("passwordPlaceholder")}
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
        />
        <LoginTextField
          id="confirmPassword"
          label={t("confirmPassword")}
          type="password"
          placeholder={t("confirmPasswordPlaceholder")}
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
            {t("acceptTerms")}{" "}
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {t("termsAndConditions")}
            </Link>{" "}
            {t("and")}{" "}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {t("privacyPolicy")}
            </Link>
          </p>
        </div>

        <LoginSubmitButton isDisabled={!isAcceptedTerms || isLoading}>
          {isLoading ? t("submitting") : t("submit")}
        </LoginSubmitButton>
      </form>

      <OrDivider label={t("orDivider")} />
      <FacebookLoginButton label={t("facebook")} />

      <Link
        href="/login"
        className="mt-5 block text-center text-xs text-blue-500 underline sm:mt-6 sm:text-sm"
      >
        {t("backToLogin")}
      </Link>
    </LoginCard>
  );
}
