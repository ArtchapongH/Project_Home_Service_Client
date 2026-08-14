"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Server,
  Database,
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
} from "lucide-react";

type HealthResponse = {
  ok?: boolean;
  database?: "connected" | "disconnected" | string;
  [key: string]: unknown;
};

type TestResult = {
  status: "idle" | "loading" | "success" | "error";
  httpStatus?: number;
  statusText?: string;
  latencyMs?: number;
  data?: HealthResponse | null;
  errorMessage?: string;
  errorType?: "network" | "server" | "database" | "unknown";
  testedAt?: string;
};

export default function TestConnectionPage() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

  const [result, setResult] = useState<TestResult>({
    status: "idle",
  });

  const handleTestConnection = async () => {
    setResult((prev) => ({
      ...prev,
      status: "loading",
      errorMessage: undefined,
    }));

    const startTime = performance.now();
    const testedAt = new Date().toLocaleTimeString("th-TH", {
      hour12: false,
    });

    try {
      const response = await fetch(`${apiBaseUrl}/health`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);

      let payload: HealthResponse | null = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (response.ok && payload?.ok) {
        setResult({
          status: "success",
          httpStatus: response.status,
          statusText: response.statusText || "OK",
          latencyMs,
          data: payload,
          testedAt,
        });
      } else {
        // Backend answered but returned error or database disconnected
        const isDbError = payload?.database === "disconnected";
        setResult({
          status: "error",
          httpStatus: response.status,
          statusText: response.statusText || "Error",
          latencyMs,
          data: payload,
          errorMessage: isDbError
            ? "เชื่อมต่อเซิร์ฟเวอร์ได้ แต่ไม่สามารถเชื่อมต่อฐานข้อมูล Database ได้"
            : `เซิร์ฟเวอร์ตอบกลับสถานะข้อผิดพลาด HTTP ${response.status}`,
          errorType: isDbError ? "database" : "server",
          testedAt,
        });
      }
    } catch (err: unknown) {
      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);
      const message =
        err instanceof Error ? err.message : "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";

      setResult({
        status: "error",
        latencyMs,
        data: null,
        errorMessage: message,
        errorType: "network",
        testedAt,
      });
    }
  };

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
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
            Dev Tool
          </span>
        </div>

        {/* Header */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                ทดสอบการเชื่อมต่อ Backend & Database
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                ตรวจสอบสถานะความพร้อมของ Express Backend Server และการเชื่อมต่อไปยัง PostgreSQL Database
              </p>
            </div>
            <button
              onClick={handleTestConnection}
              disabled={result.status === "loading"}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  result.status === "loading" ? "animate-spin" : ""
                }`}
              />
              {result.status === "loading"
                ? "กำลังทดสอบ..."
                : "ทดสอบการเชื่อมต่อ (Ping)"}
            </button>
          </div>

          {/* Config URL Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 border border-gray-200">
            <Globe className="h-4 w-4 text-gray-500 shrink-0" />
            <span className="font-semibold text-gray-700">Target Base URL:</span>
            <code className="rounded bg-white px-2 py-0.5 font-mono text-blue-600 border border-gray-200">
              {apiBaseUrl}
            </code>
            <span className="text-gray-400">|</span>
            <span className="font-semibold text-gray-700">Endpoint:</span>
            <code className="rounded bg-white px-2 py-0.5 font-mono text-purple-600 border border-gray-200">
              GET /health
            </code>
          </div>
        </div>

        {/* Status Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
          {/* Backend Status Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Backend Server
                </span>
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <Server className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                {result.status === "idle" && (
                  <span className="inline-flex items-center text-sm font-medium text-gray-500">
                    <span className="mr-2 h-2.5 w-2.5 rounded-full bg-gray-300" />
                    ยังไม่ได้ทดสอบ
                  </span>
                )}
                {result.status === "loading" && (
                  <span className="inline-flex items-center text-sm font-medium text-blue-600">
                    <span className="mr-2 h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                    กำลังเชื่อมต่อ...
                  </span>
                )}
                {result.status === "success" && (
                  <span className="inline-flex items-center text-sm font-semibold text-emerald-600">
                    <CheckCircle2 className="mr-1.5 h-5 w-5 text-emerald-500" />
                    ออนไลน์ (HTTP {result.httpStatus})
                  </span>
                )}
                {result.status === "error" && (
                  <span className="inline-flex items-center text-sm font-semibold text-rose-600">
                    <XCircle className="mr-1.5 h-5 w-5 text-rose-500" />
                    {result.httpStatus
                      ? `ผิดพลาด (HTTP ${result.httpStatus})`
                      : "เชื่อมต่อไม่สำเร็จ"}
                  </span>
                )}
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Port: 3001 | Express API
            </p>
          </div>

          {/* Database Status Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  PostgreSQL Database
                </span>
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <Database className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                {result.status === "idle" && (
                  <span className="inline-flex items-center text-sm font-medium text-gray-500">
                    <span className="mr-2 h-2.5 w-2.5 rounded-full bg-gray-300" />
                    ยังไม่ได้ทดสอบ
                  </span>
                )}
                {result.status === "loading" && (
                  <span className="inline-flex items-center text-sm font-medium text-blue-600">
                    <span className="mr-2 h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                    กำลังตรวจสอบ...
                  </span>
                )}
                {result.status === "success" && (
                  <span className="inline-flex items-center text-sm font-semibold text-emerald-600">
                    <CheckCircle2 className="mr-1.5 h-5 w-5 text-emerald-500" />
                    {result.data?.database === "connected"
                      ? "Connected (SELECT 1)"
                      : "Ready"}
                  </span>
                )}
                {result.status === "error" && (
                  <span className="inline-flex items-center text-sm font-semibold text-rose-600">
                    {result.data?.database === "disconnected" ? (
                      <>
                        <XCircle className="mr-1.5 h-5 w-5 text-rose-500" />
                        Disconnected
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="mr-1.5 h-5 w-5 text-amber-500" />
                        ไม่สามารถตรวจสอบได้
                      </>
                    )}
                  </span>
                )}
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Supabase / PostgreSQL Pool
            </p>
          </div>

          {/* Response Latency Card */}
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
                {result.status === "idle" && (
                  <span className="text-2xl font-bold text-gray-400">-</span>
                )}
                {result.status === "loading" && (
                  <span className="text-sm font-medium text-blue-600 animate-pulse">
                    กำลังจับเวลา...
                  </span>
                )}
                {(result.status === "success" || result.status === "error") && (
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-2xl font-bold ${
                        (result.latencyMs ?? 0) < 200
                          ? "text-emerald-600"
                          : (result.latencyMs ?? 0) < 600
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      {result.latencyMs}
                    </span>
                    <span className="text-sm font-medium text-gray-500">ms</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-400">
              <Clock className="mr-1 h-3.5 w-3.5" />
              {result.testedAt ? `ทดสอบเมื่อ: ${result.testedAt}` : "ยังไม่มีข้อมูล"}
            </div>
          </div>
        </div>

        {/* Error Notification Alert */}
        {result.status === "error" && (
          <div className="mb-8 rounded-2xl bg-rose-50 p-6 border border-rose-200">
            <div className="flex items-start">
              <ShieldAlert className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-rose-800">
                  พบปัญหาในการเชื่อมต่อ
                </h3>
                <p className="mt-1 text-sm text-rose-700">
                  {result.errorMessage || "เกิดข้อผิดพลาดในการส่ง Request ไปยัง Backend"}
                </p>
                <div className="mt-4 rounded-xl bg-white p-4 text-xs text-gray-700 border border-rose-100">
                  <span className="font-bold text-gray-900">แนวทางแก้ไขเบื้องต้น:</span>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
                    {result.errorType === "network" && (
                      <>
                        <li>ตรวจสอบว่าได้สั่งรัน Backend หรือยัง: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-rose-600">cd home_services_backend && npm run dev</code></li>
                        <li>ตรวจสอบว่า Backend รันอยู่ที่พอร์ต 3001 ตรงกับ <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">NEXT_PUBLIC_API_BASE_URL</code> หรือไม่</li>
                        <li>ตรวจสอบการตั้งค่า CORS ในไฟล์ <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">src/app.mjs</code> ของ Backend</li>
                      </>
                    )}
                    {result.errorType === "database" && (
                      <>
                        <li>ตรวจสอบค่า <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">DATABASE_URL</code> ในไฟล์ <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">home_services_backend/.env</code></li>
                        <li>ทดสอบเชื่อมต่อฐานข้อมูลโดยตรงผ่านสคริปต์: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">npm run db:ping</code></li>
                      </>
                    )}
                    {result.errorType === "server" && (
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
                Raw JSON Response (GET /health)
              </span>
            </div>
            {result.httpStatus && (
              <span
                className={`rounded px-2 py-0.5 text-xs font-mono font-bold ${
                  result.httpStatus === 200
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : "bg-rose-950 text-rose-400 border border-rose-800"
                }`}
              >
                HTTP {result.httpStatus} {result.statusText}
              </span>
            )}
          </div>
          <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-emerald-300">
            {result.status === "idle" && (
              <span className="text-slate-500">// กดปุ่ม &quot;ทดสอบการเชื่อมต่อ&quot; ด้านบนเพื่อดูข้อมูล Response</span>
            )}
            {result.status === "loading" && (
              <span className="text-slate-500">// กำลังส่ง Request ไปยัง {apiBaseUrl}/health ...</span>
            )}
            {(result.status === "success" || result.status === "error") && (
              <code>
                {result.data
                  ? JSON.stringify(result.data, null, 2)
                  : JSON.stringify(
                      {
                        error: true,
                        message: result.errorMessage || "No response received",
                      },
                      null,
                      2
                    )}
              </code>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
