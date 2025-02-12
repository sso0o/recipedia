"use client";

import React, {JSX, useState} from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage(): JSX.Element {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                setError("");
                router.push("/page/login");
            } else {
                setError(data.message || "회원가입 실패!");
            }
        } catch (err: unknown) {
            console.error(err);
            setLoading(false);
            setError("회원가입 실패!");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor="username" className="block text-gray-700">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    className="w-full p-3 border rounded"
                    placeholder="Enter your name"
                    required
                />

                <label htmlFor="email" className="block text-gray-700">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="w-full p-3 border rounded"
                    placeholder="Enter your email"
                    required
                />

                <label htmlFor="password" className="block text-gray-700">
                    password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded"
                    placeholder="Enter your password"
                    required
                />
                {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
}
