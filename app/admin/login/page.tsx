import React from "react";
import Image from "next/image";
import houseIcon from "@/src/assets/icons/house 1.png";


const LoginPage = () => {
    return (
        <div className="min-h-screen bg-[#f4f5fa] px-4 py-12">
            <div className="mx-auto flex w-full max-w-xl flex-col items-center">
                <div className="mb-10 flex items-center gap-3 text-[#2d63f6]">
                    <Image src={houseIcon} alt="Home Services" className="h-10 w-10" />
                    <span className="text-5xl font-semibold leading-none">HomeServices</span>
                </div>

                <div className="w-full rounded-md border border-[#d7dbe5] bg-white px-14 py-12 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                    <h1 className="mb-8 text-center text-4xl font-bold text-[#092c76]">เข้าสู่ระบบแอดมิน</h1>

                    <form className="space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-2 block text-lg font-semibold text-[#2b2f38]">
                                Email<span className="text-[#ea3d3d]">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
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
                </div>
            </div>
        </div>
    );
};

export default LoginPage;