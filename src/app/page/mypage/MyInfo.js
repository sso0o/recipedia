"use client";
import { useState, useEffect } from "react";

export default function MyInfo() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch("/api/users", { credentials: "include" }); // JWT 쿠키 포함 요청
                if (!response.ok) {
                    throw new Error("Failed to fetch user info");
                }
                const data = await response.json();
                setUser(data);  // 유저 정보 상태 업데이트
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="bg-white shadow-lg rounded-lg p-6">
                {loading ? (
                    <p>Loading...</p>
                ) : user ? (
                    <div className="space-y-4">
                        <p className="text-lg font-medium">Name: <span className="text-gray-700">{user.name}</span></p>
                        <p className="text-lg font-medium">Email: <span className="text-gray-700">{user.email}</span></p>
                    </div>
                ) : (
                    <p className="text-red-500">User info not available</p>
                )}
            </div>
        </div>
    );
}
