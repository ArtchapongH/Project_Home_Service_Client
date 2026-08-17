"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/services/apiClient";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try{
            await apiClient.post("/auth/login", {
                email: email,
                password: password
            });
            alert("Login successful");
            router.push("/admin/services");
        } catch {
            alert("Login failed");
        }
    }

    return (
        <>
        <h1 className="mb-8 text-center text-4xl font-bold text-[#092c76]">เข้าสู่ระบบแอดมิน</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
            <label htmlFor="email" className="mb-2 block text-lg font-semibold text-[#2b2f38]">
                Email<span className="text-[#ea3d3d]">*</span>
            </label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 w-full rounded-md border border-[#d8dde7] px-3 text-base text-[#222] outline-none transition focus:border-[#2d63f6]"
            />
            </div>

            <div>
            <label htmlFor="password" className="mb-2 block text-lg font-semibold text-[#2b2f38]">
                Password<span className="text-[#ea3d3d]">*</span>
            </label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-md border border-[#d8dde7] px-3 text-base text-[#222] outline-none transition focus:border-[#2d63f6]"
            />
            </div>

            <button
            type="submit"
            className="mt-6 h-12 w-full rounded-md bg-[#2d63f6] text-lg font-semibold text-white transition hover:bg-[#2453d5]"
            >
            เข้าสู่ระบบ
            </button>
        </form>
        </>
    );
};

export default LoginPage;
