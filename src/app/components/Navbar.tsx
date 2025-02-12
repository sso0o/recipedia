"use client";

import {JSX, useContext, useState} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {AuthContext} from "@/context/AuthContext";

// AuthContext의 타입이 이미 정의되어 있다면 아래 타입 정의는 생략해도 됩니다.
interface AuthContextType {
    isLoggedIn: boolean;
    logout: () => void;
}

export default function Navbar(): JSX.Element {
    // AuthContext에 대한 타입 단언을 사용 (만약 AuthContext에 타입이 정의되어 있다면 생략 가능)
    const { isLoggedIn, logout } = useContext(AuthContext) as AuthContextType;
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.refresh(); // 상태 반영을 위해 새로고침
        router.push("/");
    };

    // 메뉴 토글 함수
    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    // 링크 클릭 시 메뉴 닫기
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <nav className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            {/* 로고 및 메뉴 버튼 */}
            <div className="flex-1 flex items-center">
    <button
        className="md:hidden text-xl font-semibold hover:text-orange-400 transition duration-300"
    onClick={toggleMenu}
        >
            ☰
          </button>
          </div>

    {/* 데스크탑 메뉴 */}
    <div className="hidden md:flex flex-1 justify-center gap-8">
    <Link
        href="/"
    className="text-xl font-semibold hover:text-orange-400 transition duration-300"
        >
        Home
        </Link>
        <Link
    href="/page/recipes"
    className="text-xl font-semibold hover:text-orange-400 transition duration-300"
        >
        Recipe
        </Link>
    {isLoggedIn && (
        <Link
            href="/page/mypage"
        className="text-xl font-semibold hover:text-orange-400 transition duration-300"
            >
            MyPage
            </Link>
    )}
    {isLoggedIn ? (
            <button
                className="text-xl font-semibold hover:text-orange-400 transition duration-300"
        onClick={handleLogout}
            >
            로그아웃
            </button>
    ) : (
        <Link
            href="/page/login"
        className="text-xl font-semibold hover:text-orange-400 transition duration-300"
            >
            로그인
            </Link>
    )}
    </div>
    </nav>

    {/* 모바일 메뉴 */}
    <div
        className={`${
        isMenuOpen ? "block" : "hidden"
    } absolute top-0 left-0 w-full bg-gray-800 text-white px-4 py-6 md:hidden transition-all duration-300 z-20`}
>
    <div className="flex flex-col items-center gap-6">
    <Link
        href="/"
    className="text-xl font-semibold hover:text-orange-400 transition duration-300"
    onClick={closeMenu}
        >
        Home
        </Link>
        <Link
    href="/page/recipes"
    className="text-xl font-semibold hover:text-orange-400 transition duration-300"
    onClick={closeMenu}
        >
        Recipe
        </Link>
    {isLoggedIn && (
        <Link
            href="/page/mypage"
        className="text-xl font-semibold hover:text-orange-400 transition duration-300"
        onClick={closeMenu}
            >
            MyPage
            </Link>
    )}
    {isLoggedIn ? (
            <button
                className="text-xl font-semibold hover:text-orange-400 transition duration-300"
        onClick={() => {
        closeMenu();
        handleLogout();
    }}
    >
        로그아웃
        </button>
    ) : (
        <Link
            href="/page/login"
        className="text-xl font-semibold hover:text-orange-400 transition duration-300"
        onClick={closeMenu}
            >
            로그인
            </Link>
    )}
    </div>
    </div>
    </>
    );
}
