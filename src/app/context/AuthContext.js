"use client";

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        setIsLoggedIn(!!token); // 토큰이 있으면 로그인 상태로 설정
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // 쿠키 삭제
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
