"use client";

import {createContext, useState, useEffect, ReactNode, JSX} from "react";
import Cookies from "js-cookie";


interface AuthContextType {
    isLoggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        Cookies.set("token", token, { expires: 1, path: "/", secure: process.env.NODE_ENV === "production" });
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        Cookies.remove("token", { path: "/" });
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};
