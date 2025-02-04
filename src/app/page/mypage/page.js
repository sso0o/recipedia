"use client";
import { useState } from "react";
import MyRecipes from "./MyRecipes";
import MyInfo from "./MyInfo";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("recipes"); // 기본적으로 내 레시피 탭을 활성화

    // 탭을 클릭했을 때 활성화 상태를 변경하는 함수
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            {/* 탭 메뉴 */}
            <div className="flex border-b-2 mb-6 w-full">
                <button
                    onClick={() => setActiveTab("recipes")}
                    className={`flex-1 py-2 text-lg font-semibold transition duration-300 ${
                        activeTab === "recipes"
                            ? "text-orange-500 border-b-4 border-orange-500"
                            : "text-gray-600 hover:text-orange-500"
                    }`}
                >
                    내 레시피
                </button>
                <button
                    onClick={() => setActiveTab("info")}
                    className={`flex-1 py-2 text-lg font-semibold transition duration-300 ${
                        activeTab === "info"
                            ? "text-orange-500 border-b-4 border-orange-500"
                            : "text-gray-600 hover:text-orange-500"
                    }`}
                >
                    내 정보
                </button>
            </div>

            {/* 탭 콘텐츠 */}
            <div className="flex flex-col w-full sm:min-w-[320px] md:min-w-[600px] lg:min-w-[800px]">
                {/* 내 레시피 */}
                {activeTab === "recipes" && <div className="w-full"><MyRecipes/></div>}
                {/* 내 정보 */}
                {activeTab === "info" && <div className="w-full"><MyInfo/></div>}
            </div>
        </div>
    );
}
