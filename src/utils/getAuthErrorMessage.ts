import axios from "axios";

type AuthAction = "login" | "register";

function extractRawMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (typeof data === "object" && data !== null) {
      if ("message" in data && typeof data.message === "string") {
        return data.message;
      }
      if ("error" in data && typeof data.error === "string") {
        return data.error;
      }
    }

    return error.message ?? "";
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }

  return "";
}

function hasThaiText(value: string): boolean {
  return /[\u0E00-\u0E7F]/.test(value);
}

function isTechnicalMessage(value: string): boolean {
  const lower = value.toLowerCase();
  return (
    /status code\s*\d{3}/i.test(value) ||
    /^\d{3}\b/.test(value.trim()) ||
    lower.includes("request failed") ||
    lower.includes("network error") ||
    lower.includes("econnrefused") ||
    lower.includes("timeout") ||
    lower.includes("axios")
  );
}

export function getAuthErrorMessage(
  error: unknown,
  action: AuthAction,
): string {
  const raw = extractRawMessage(error).trim();
  const lower = raw.toLowerCase();
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  const hasNoResponse = axios.isAxiosError(error) && !error.response;

  if (hasNoResponse) {
    return "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่";
  }

  if (
    status === 409 ||
    status === 429 ||
    lower.includes("rate limit") ||
    lower.includes("too many")
  ) {
    if (status === 409 || lower.includes("already") || lower.includes("duplicate")) {
      return "อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบหรือใช้อีเมลอื่น";
    }
    return action === "register"
      ? "สมัครบ่อยเกินไปในขณะนี้ กรุณารอสักครู่แล้วลองใหม่อีกครั้ง"
      : "พยายามเข้าสู่ระบบบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่";
  }

  if (
    lower.includes("already registered") ||
    lower.includes("already exists") ||
    lower.includes("user already") ||
    lower.includes("duplicate")
  ) {
    return "อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบหรือใช้อีเมลอื่น";
  }

  if (lower.includes("not confirmed") || lower.includes("confirm your email")) {
    return "กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ";
  }

  if (
    status === 401 ||
    lower.includes("invalid login") ||
    lower.includes("invalid credentials") ||
    lower.includes("invalid email or password") ||
    lower.includes("wrong password")
  ) {
    return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
  }

  if (
    lower.includes("password") &&
    (lower.includes("least") || lower.includes("short"))
  ) {
    return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
  }

  if (status && status >= 500) {
    return "ระบบมีปัญหาชั่วคราว กรุณาลองใหม่อีกครั้งในอีกสักครู่";
  }

  if (raw && hasThaiText(raw) && !isTechnicalMessage(raw)) {
    return raw;
  }

  if (action === "login") {
    return "ไม่สามารถเข้าสู่ระบบได้ กรุณาตรวจสอบอีเมลและรหัสผ่านแล้วลองใหม่";
  }

  return "ไม่สามารถลงทะเบียนได้ กรุณาตรวจสอบข้อมูลแล้วลองใหม่อีกครั้ง";
}

export function getChangePasswordErrorMessage(error: unknown): string {
  const raw = extractRawMessage(error).trim();
  const lower = raw.toLowerCase();
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  const hasNoResponse = axios.isAxiosError(error) && !error.response;

  if (hasNoResponse) {
    return "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่";
  }

  if (
    status === 401 ||
    lower.includes("current password") ||
    lower.includes("incorrect password") ||
    lower.includes("wrong password") ||
    lower.includes("invalid credentials")
  ) {
    return "รหัสผ่านปัจจุบันไม่ถูกต้อง";
  }

  if (
    lower.includes("match") ||
    lower.includes("confirm") ||
    lower.includes("ไม่ตรง")
  ) {
    return "รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน";
  }

  if (
    lower.includes("same") ||
    lower.includes("identical") ||
    lower.includes("must be different")
  ) {
    return "รหัสผ่านใหม่ต้องแตกต่างจากรหัสผ่านปัจจุบัน";
  }

  if (
    lower.includes("password") &&
    (lower.includes("least") || lower.includes("short") || lower.includes("weak"))
  ) {
    return "รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร";
  }

  if (status && status >= 500) {
    return "ระบบมีปัญหาชั่วคราว กรุณาลองใหม่อีกครั้งในอีกสักครู่";
  }

  if (raw && hasThaiText(raw) && !isTechnicalMessage(raw)) {
    return raw;
  }

  return "ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง";
}
