"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Server,
  Database,
  UserCheck,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Globe,
  Terminal,
  ArrowLeft,
  ShieldAlert,
  Key,
} from "lucide-react";
import apiClient from "@/src/services/apiClient";
import { getMyProfile } from "@/src/services/profile.service";
import type { UserProfile } from "@/src/types/user";

type HealthResponse = {
  ok?: boolean;
  database?: "connected" | "disconnected" | string;
  [key: string]: unknown;
};

type TestResult = {
  status: "idle" | "loading" | "success" | "error";
  endpointTested?: string;
  httpStatus?: number;
  statusText?: string;
  latencyMs?: number;
  data?: unknown;
  errorMessage?: string;
  errorType?: "network" | "server" | "database" | "auth" | "unknown";
  testedAt?: string;
};

export default function TestConnectionPage() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
  const devUserId = process.env.NEXT_PUBLIC_DEV_USER_ID || "dev-user-001";

  const [activeTab, setActiveTab] = useState<"health" | "profile">("health");

  const [healthResult, setHealthResult] = useState<TestResult>({
    status: "idle",
  });

  const [profileResult, setProfileResult] = useState<TestResult>({
    status: "idle",
  });

  // Test 1: Health & Database check via Axios apiClient
  const handleTestHealth = async () => {
    setHealthResult((prev) => ({
      ...prev,
      status: "loading",
      errorMessage: undefined,
    }));

    const startTime = performance.now();
    const testedAt = new Date().toLocaleTimeString("th-TH", { hour12: false });

    try {
      const response = await apiClient.get<HealthResponse>("/health");
      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);

      const payload = response.data;
      if (payload?.ok) {
        setHealthResult({
          status: "success",
          endpointTested: "GET /health",
          httpStatus: response.status,
          statusText: response.statusText || "OK",
          latencyMs,
          data: payload,
          testedAt,
        });
      } else {
        const isDbError = payload?.database === "disconnected";
        setHealthResult({
          status: "error",
          endpointTested: "GET /health",
          httpStatus: response.status,
          statusText: response.statusText || "Error",
          latencyMs,
          data: payload,
          errorMessage: isDbError
            ? "เชื่อมต่อเซิร์ฟเวอร์สำเร็จ แต่ Database Disconnected"
            : `เซิร์ฟเวอร์ตอบกลับสถานะข้อผิดพลาด HTTP ${response.status}`,
          errorType: isDbError ? "database" : "server",
          testedAt,
        });
      }
    } catch (err: unknown) {
      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);
      const errObj = err as { message?: string; code?: string; [key: string]: unknown };
      const message = errObj?.message || "ไม่สามารถเชื่อมต่อกับ Express Backend ได้";

      setHealthResult({
        status: "error",
        endpointTested: "GET /health",
        latencyMs,
        data: errObj,
        errorMessage: message,
        errorType: errObj?.code === "NETWORK_ERROR" ? "network" : "server",
        testedAt,
      });
    }
  };

  // Test 2: User Profile API check via profile.service.ts
  const handleTestProfile = async () => {
    setProfileResult((prev) => ({
      ...prev,
      status: "loading",
      errorMessage: undefined,
    }));

    const startTime = performance.now();
    const testedAt = new Date().toLocaleTimeString("th-TH", { hour12: false });

    try {
      const profileData: UserProfile = await getMyProfile();
      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);

      setProfileResult({
        status: "success",
        endpointTested: "GET /api/users/me",
        httpStatus: 200,
        statusText: "OK",
        latencyMs,
        data: profileData,
        testedAt,
      });
    } catch (err: unknown) {
      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);
      const errObj = err as { message?: string; code?: string; [key: string]: unknown };
      const message = errObj?.message || "ไม่สามารถดึงข้อมูล User Profile ได้";

      setProfileResult({
        status: "error",
        endpointTested: "GET /api/users/me",
        latencyMs,
        data: errObj,
        errorMessage: message,
        errorType: errObj?.code === "NETWORK_ERROR" ? "network" : "auth",
        testedAt,
      });
    }
  };

  const currentResult = activeTab === "health" ? healthResult : profileResult;
  const currentAction = activeTab === "health" ? handleTestHealth : handleTestProfile;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f8fafc] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับหน้าหลัก
          </Link>
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
              Axios Client
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              Dev Branch
            </span>
          </div>
        </div>

        {/* Header & Tabs */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                ทดสอบการเชื่อมต่อ Backend (Axios API Client)
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                ทดสอบการเรียกใช้งานผ่าน Axios Instance พร้อม Request/Response Interceptors
              </p>
            </div>
            <button
              onClick={currentAction}
              disabled={currentResult.status === "loading"}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  currentResult.status === "loading" ? "animate-spin" : ""
                }`}
              />
              {currentResult.status === "loading"
                ? "กำลังทดสอบ..."
                : activeTab === "health"
                ? "ทดสอบ Health & DB"
                : "ทดสอบ User Profile"}
            </button>
          </div>

          {/* Test Tabs */}
          <div className="mt-6 flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("health")}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "health"
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Server className="h-4 w-4" />
              1. Health & Database Check
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "profile"
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              2. User Profile API Check
            </button>
          </div>

          {/* Config URL & Interceptor Info Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 border border-gray-200">
            <Globe className="h-4 w-4 text-gray-500 shrink-0" />
            <span className="font-semibold text-gray-700">Base URL:</span>
            <code className="rounded bg-white px-2 py-0.5 font-mono text-blue-600 border border-gray-200">
              {apiBaseUrl}
            </code>
            <span className="text-gray-400">|</span>
            <span className="font-semibold text-gray-700">Active Endpoint:</span>
            <code className="rounded bg-white px-2 py-0.5 font-mono text-purple-600 border border-gray-200">
              {activeTab === "health" ? "GET /health" : "GET /api/users/me"}
            </code>
            <span className="text-gray-400">|</span>
            <Key className="h-3.5 w-3.5 text-gray-500 shrink-0" />
            <span className="font-semibold text-gray-700">x-user-id:</span>
            <code className="rounded bg-white px-2 py-0.5 font-mono text-emerald-600 border border-gray-200">
              {devUserId}
            </code>
          </div>
        </div>

        {/* Status Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
          {/* Card 1: Server / API Client Status */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {activeTab === "health" ? "Express Server" : "Profile API"}
                </span>
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  {activeTab === "health" ? (
                    <Server className="h-5 w-5" />
                  ) : (
                    <UserCheck className="h-5 w-5" />
                  )}
                </div>
              </div>
              <div className="mt-4">
                {currentResult.status === "idle" && (
                  <span className="inline-flex items-center text-sm font-medium text-gray-500">
                    <span className="mr-2 h-2.5 w-2.5 rounded-full bg-gray-300" />
                    ยังไม่ได้ทดสอบ
                  </span>
                )}
                {currentResult.status === "loading" && (
                  <span className="inline-flex items-center text-sm font-medium text-blue-600">
                    <span className="mr-2 h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                    กำลังส่ง Request...
                  </span>
                )}
                {currentResult.status === "success" && (
                  <span className="inline-flex items-center text-sm font-semibold text-emerald-600">
                    <CheckCircle2 className="mr-1.5 h-5 w-5 text-emerald-500" />
                    เชื่อมต่อสำเร็จ (HTTP {currentResult.httpStatus})
                  </span>
                )}
                {currentResult.status === "error" && (
                  <span className="inline-flex items-center text-sm font-semibold text-rose-600">
                    <XCircle className="mr-1.5 h-5 w-5 text-rose-500" />
                    {currentResult.httpStatus
                      ? `ผิดพลาด (HTTP ${currentResult.httpStatus})`
                      : "เชื่อมต่อไม่สำเร็จ"}
                  </span>
                )}
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Axios Instance | Timeout: 10s
            </p>
          </div>

          {/* Card 2: Database / Auth Status */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {activeTab === "health" ? "PostgreSQL Database" : "Auth Header (x-user-id)"}
                </span>
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  {activeTab === "health" ? (
                    <Database className="h-5 w-5" />
                  ) : (
                    <Key className="h-5 w-5" />
                  )}
                </div>
              </div>
              <div className="mt-4">
                {currentResult.status === "idle" && (
                  <span className="inline-flex items-center text-sm font-medium text-gray-500">
                    <span className="mr-2 h-2.5 w-2.5 rounded-full bg-gray-300" />
                    ยังไม่ได้ทดสอบ
                  </span>
                )}
                {currentResult.status === "loading" && (
                  <span className="inline-flex items-center text-sm font-medium text-blue-600">
                    <span className="mr-2 h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                    กำลังตรวจสอบ...
                  </span>
                )}
                {currentResult.status === "success" && (
                  <span className="inline-flex items-center text-sm font-semibold text-emerald-600">
                    <CheckCircle2 className="mr-1.5 h-5 w-5 text-emerald-500" />
                    {activeTab === "health" ? "Connected (SELECT 1)" : "Authenticated"}
                  </span>
                )}
                {currentResult.status === "error" && (
                  <span className="inline-flex items-center text-sm font-semibold text-rose-600">
                    <AlertTriangle className="mr-1.5 h-5 w-5 text-amber-500" />
                    {activeTab === "health"
                      ? "Disconnected หรือตรวจสอบไม่ได้"
                      : "Auth / Fetch Failed"}
                  </span>
                )}
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-400">
              {activeTab === "health"
                ? "Supabase / PG Pool"
                : `Header: x-user-id: ${devUserId}`}
            </p>
          </div>

          {/* Card 3: Latency */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Latency / Response Time
                </span>
                <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                {currentResult.status === "idle" && (
                  <span className="text-2xl font-bold text-gray-400">-</span>
                )}
                {currentResult.status === "loading" && (
                  <span className="text-sm font-medium text-blue-600 animate-pulse">
                    กำลังจับเวลา...
                  </span>
                )}
                {(currentResult.status === "success" || currentResult.status === "error") && (
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-2xl font-bold ${
                        (currentResult.latencyMs ?? 0) < 200
                          ? "text-emerald-600"
                          : (currentResult.latencyMs ?? 0) < 600
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      {currentResult.latencyMs}
                    </span>
                    <span className="text-sm font-medium text-gray-500">ms</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-400">
              <Clock className="mr-1 h-3.5 w-3.5" />
              {currentResult.testedAt
                ? `ทดสอบเมื่อ: ${currentResult.testedAt}`
                : "ยังไม่มีข้อมูล"}
            </div>
          </div>
        </div>

        {/* Error Notification Alert */}
        {currentResult.status === "error" && (
          <div className="mb-8 rounded-2xl bg-rose-50 p-6 border border-rose-200">
            <div className="flex items-start">
              <ShieldAlert className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-rose-800">
                  พบปัญหาในการเชื่อมต่อ Axios Client
                </h3>
                <p className="mt-1 text-sm text-rose-700">
                  {currentResult.errorMessage ||
                    "เกิดข้อผิดพลาดในการส่ง Request ผ่าน apiClient"}
                </p>
                <div className="mt-4 rounded-xl bg-white p-4 text-xs text-gray-700 border border-rose-100">
                  <span className="font-bold text-gray-900">แนวทางแก้ไขเบื้องต้น:</span>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
                    {currentResult.errorType === "network" && (
                      <>
                        <li>ตรวจสอบว่าได้สั่งรัน Backend หรือยัง: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-rose-600">cd home_services_backend && npm run dev</code></li>
                        <li>ตรวจสอบว่า Backend รันอยู่ที่พอร์ต 3001 ตรงกับ <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">NEXT_PUBLIC_API_BASE_URL</code> หรือไม่</li>
                        <li>ตรวจสอบ CORS ใน <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">src/app.mjs</code> ของ Backend</li>
                      </>
                    )}
                    {currentResult.errorType === "database" && (
                      <>
                        <li>ตรวจสอบค่า <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">DATABASE_URL</code> ในไฟล์ <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">home_services_backend/.env</code></li>
                        <li>ทดสอบเชื่อมต่อฐานข้อมูลโดยตรง: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">npm run db:ping</code></li>
                      </>
                    )}
                    {currentResult.errorType === "auth" && (
                      <>
                        <li>ตรวจสอบค่า <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">NEXT_PUBLIC_DEV_USER_ID</code> ในไฟล์ <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">.env</code></li>
                        <li>ตรวจสอบว่าผู้ใช้ ID ดังกล่าวมีอยู่ในฐานข้อมูล Table users หรือไม่</li>
                      </>
                    )}
                    {currentResult.errorType === "server" && (
                      <>
                        <li>ตรวจสอบ Log ในหน้าต่าง Terminal ของ Backend เพื่อดูรายละเอียด Error Stack</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Raw Response Payload Viewer */}
        <div className="rounded-2xl bg-[#0f172a] text-gray-200 p-6 shadow-md border border-slate-800">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Axios Response Data ({activeTab === "health" ? "GET /health" : "GET /api/users/me"})
              </span>
            </div>
            {currentResult.httpStatus && (
              <span
                className={`rounded px-2 py-0.5 text-xs font-mono font-bold ${
                  currentResult.httpStatus === 200
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : "bg-rose-950 text-rose-400 border border-rose-800"
                }`}
              >
                HTTP {currentResult.httpStatus} {currentResult.statusText}
              </span>
            )}
          </div>
          <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-emerald-300">
            {currentResult.status === "idle" && (
              <span className="text-slate-500">// กดปุ่มทดสอบด้านบนเพื่อส่ง Request ผ่าน Axios apiClient</span>
            )}
            {currentResult.status === "loading" && (
              <span className="text-slate-500">// กำลังส่ง Axios Request ไปยัง {apiBaseUrl}{activeTab === "health" ? "/health" : "/api/users/me"} ...</span>
            )}
            {(currentResult.status === "success" || currentResult.status === "error") && (
              <code>
                {JSON.stringify(currentResult.data || { message: currentResult.errorMessage }, null, 2)}
              </code>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
