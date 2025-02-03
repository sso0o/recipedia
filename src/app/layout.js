"use client";
import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function RootLayout({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 페이지 로드 후 로그인 상태 확인
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token); // token이 있으면 로그인 상태로 설정
    }, []); // 컴포넌트가 처음 마운트될 때만 실행

    // 로그아웃 처리
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);  // 로그아웃 시 로그인 상태 해제
    };

    return (
        <html lang="en">
        <head>
            <title>RECIPEDIA</title>
            <meta name="description" content="Generated by sso" />
            <link rel="icon" href="/favicon.ico" />
        </head>
        <body className="font-sans bg-gray-100 text-gray-900">
        {/* Header */}
        <header className="bg-gray-800 text-white py-4 shadow-md">
            <nav className="max-w-7xl mx-auto px-4">
                <ul className="flex justify-center gap-8">
                    <li>
                        <Link
                            href="/"
                            className="text-xl font-semibold hover:text-blue-400 transition duration-300"
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/recipes"
                            className="text-xl font-semibold hover:text-blue-400 transition duration-300"
                        >
                            Recipe
                        </Link>
                    </li>
                    {/* 로그인 여부에 따라 버튼 표시 */}
                    <li>
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="text-xl font-semibold text-red-500 hover:text-red-600 transition duration-300"
                            >
                                Log Out
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="text-xl font-semibold hover:text-blue-400 transition duration-300"
                            >
                                Log In
                            </Link>
                        )}
                    </li>
                </ul>
            </nav>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
            {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-4 text-center fixed bottom-0 w-full">
            <p>&copy; 2025 Recipedia. All rights reserved.</p>
        </footer>

        </body>
        </html>
    );
}