"use client";

import {useContext, useState} from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useContext(AuthContext);
    const router = useRouter();

    const handleLogin = async (e) => {
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
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded"
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">로그인</button>
            </form>
            <p className="text-center mt-4">
                계정이 없으신가요? <a href="/register" className="text-blue-500">회원가입</a>
            </p>
        </div>
    );
}
