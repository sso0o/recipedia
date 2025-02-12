"use client";

import React, {JSX, useContext, useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function Login(): JSX.Element {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    // AuthContext에서 login 함수와 isLoggedIn 값을 단언
    const { login, isLoggedIn } = useContext(AuthContext) as {
        login: (token: string) => void;
        isLoggedIn: boolean;
    };
    const router = useRouter();

    // 이미 로그인 상태라면 메인 페이지로 리다이렉트
    useEffect(() => {
        if (isLoggedIn) {
            router.push("/");
        }
    }, [isLoggedIn, router]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "로그인 실패");
            login(data.token); // 상태 업데이트
            router.push("/");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("로그인 실패");
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>

            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                    }
                    className="w-full p-3 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                    }
                    className="w-full p-3 border rounded"
                    required
                />
                {error && <p className="text-red-500 text-center">{error}</p>}
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                    로그인
                </button>
            </form>
            <p className="text-center mt-4">
                계정이 없으신가요?{" "}
                <a href="/page/register" className="text-blue-500">
                    회원가입
                </a>
            </p>
        </div>
    );
}
