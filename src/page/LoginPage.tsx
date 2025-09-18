import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("admin@example.com");
    const [password, setPassword] = useState("password123");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Đăng nhập mô phỏng (dữ liệu tĩnh)
        alert(`Đăng nhập với:\nEmail: ${email}\nMật khẩu: ${password}`);
    };

    return (
        <div className="min-h-screen bg-[#78B3CE] flex items-center justify-center p-5 font-sans">
            <div className="bg-[#FBF8EF] p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
                <div className="mb-8">
                    <div className="w-20 h-20 bg-[#78B3CE] rounded-full mx-auto mb-5 flex items-center justify-center text-3xl text-[#FBF8EF] font-bold">
                        A
                    </div>
                    <h1 className="text-[#78B3CE] text-3xl font-bold mb-3">
                        Đăng Nhập
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Vui lòng đăng nhập để truy cập trang .
                    </p>
                </div>
                <form onSubmit={handleLogin} className="text-left">
                    <div className="mb-5">
                        <label className="block text-[#78B3CE] text-sm font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Nhập email quản trị"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border-2 border-[#C9E6F0] rounded-xl text-base outline-none transition-colors duration-300 focus:border-[#78B3CE]"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-[#78B3CE] text-sm font-semibold mb-2">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 pr-12 border-2 border-[#C9E6F0] rounded-xl text-base outline-none transition-colors duration-300 focus:border-[#78B3CE]"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#78B3CE] text-sm hover:text-[#5a8ba3] transition-colors"
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#F96E2A] text-white p-4 rounded-xl text-base font-semibold cursor-pointer shadow-lg shadow-[#F96E2A]/30 transition-all duration-300 hover:bg-[#e55a1f] hover:-translate-y-1 mb-5"
                    >
                        Đăng nhập
                    </button>
                </form>
                <div className="text-center">
                    <Link
                        to="/forgot-password"
                        className="bg-transparent border-none text-[#F96E2A] text-sm cursor-pointer underline transition-colors duration-300 hover:text-[#e55a1f]"
                    >
                        Quên mật khẩu?
                    </Link>
                </div>
                <div className="mt-8 pt-5 border-t border-[#C9E6F0] text-gray-400 text-xs">
                    © 2025 Đăng Nhập . Mọi quyền được bảo lưu.
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
