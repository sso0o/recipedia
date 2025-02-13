"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 레시피 데이터에 대한 타입 정의
interface Recipe {
    _id: string;
    title: string;
    likes: number;
    views: number;
}

export default function Home() {
    const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
    const [randomRecipe, setRandomRecipe] = useState<Recipe | null>(null);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [search, setSearch] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [cookingTime, setCookingTime] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    // 로그인 상태 확인 (예시로 localStorage 사용)
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    // 레시피 등록 페이지로 리다이렉트 (로그인 상태 체크)
    const handleRecipeRegister = () => {
        if (isAuthenticated) {
            router.push("/page/recipes/register");
        } else {
            router.push("/page/login");
        }
    };

    // 인기 레시피 가져오기
    useEffect(() => {
        const fetchPopularRecipes = async () => {
            try {
                const response = await fetch("/api/recipes/search?type=popular");
                const data: Recipe[] = await response.json();
                setPopularRecipes(data);
            } catch (error) {
                console.error("인기 레시피 가져오기 실패:", error);
            }
        };
        fetchPopularRecipes();
    }, []);

    // 오늘의 추천 레시피 가져오기
    useEffect(() => {
        const fetchRandomRecipe = async () => {
            try {
                const response = await fetch("/api/recipes/search?type=random");
                const data: Recipe = await response.json();
                setRandomRecipe(data);
            } catch (error) {
                console.error("오늘의 추천 레시피 가져오기 실패:", error);
            }
        };
        fetchRandomRecipe();
    }, []);

    // 레시피 검색 및 필터링 가져오기
    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/recipes/search?type=search&search=${encodeURIComponent(
                        search
                    )}&category=${encodeURIComponent(category)}&cookingTime=${encodeURIComponent(cookingTime)}`
                );
                const data: Recipe[] = await response.json();
                setRecipes(data);
            } catch (error) {
                console.error("레시피 가져오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [search, category, cookingTime]);

    return (
        <div className="flex flex-col w-full sm:min-w-[320px] md:min-w-[600px] lg:min-w-[800px]">
            <div className="flex justify-end mb-8">
                <button
                    onClick={handleRecipeRegister}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition transform hover:scale-105"
                >
                    레시피 등록
                </button>
            </div>

            {/* 인기 레시피 섹션 */}
            <section className="mb-14">
                <h2 className="text-3xl font-semibold text-gray-700 mb-6">🔥 인기 레시피</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {popularRecipes.map((recipe) => (
                        <Link key={recipe._id} href={`/page/recipes/${recipe._id}`} className="block">
                            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-3">{recipe.title}</h3>
                                <p className="text-gray-600 text-sm">
                                    {recipe.likes} Likes | {recipe.views} Views
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 오늘의 추천 레시피 섹션 */}
            <section className="mb-14">
                <h2 className="text-3xl font-semibold text-gray-700 mb-6">🌟 오늘의 추천 레시피</h2>
                {randomRecipe ? (
                    <Link href={`/page/recipes/${randomRecipe._id}`} className="block">
                        <div className="bg-yellow-100 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
                            <h3 className="text-2xl font-semibold text-gray-800">{randomRecipe.title}</h3>
                        </div>
                    </Link>
                ) : (
                    <p className="text-gray-600">오늘의 추천 레시피가 없습니다.</p>
                )}
            </section>

            {/* 레시피 검색 및 필터 섹션 */}
            <section className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* 검색창 */}
                    <input
                        type="text"
                        placeholder="요리명 또는 재료명 검색"
                        className="w-full sm:w-1/3 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200 ease-in-out"
                        value={search}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                    />

                    {/* 카테고리 필터 */}
                    <select
                        className="w-full sm:w-1/3 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200 ease-in-out"
                        value={category}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
                    >
                        <option value="">카테고리 선택</option>
                        <option value="kor">한식</option>
                        <option value="chi">중식</option>
                        <option value="jpn">일식</option>
                        <option value="wes">양식</option>
                        <option value="etc">기타</option>
                        <option value="des">디저트</option>
                    </select>

                    {/* 조리시간 필터 */}
                    <select
                        className="w-full sm:w-1/3 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200 ease-in-out"
                        value={cookingTime}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setCookingTime(e.target.value)}
                    >
                        <option value="">조리시간 필터</option>
                        <option value="quick">빠른 요리 (30분 이하)</option>
                        <option value="slow">정성 요리 (30분 이상)</option>
                    </select>
                </div>
            </section>

            {/* 레시피 목록 */}
            {loading ? (
                <p className="text-center text-xl text-gray-600">로딩 중...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recipes.map((recipe) => (
                        <Link key={recipe._id} href={`/src/app/page/recipes/${recipe._id}`} className="block">
                            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-3">{recipe.title}</h3>
                                <p className="text-gray-600 text-sm">
                                    {recipe.likes} Likes | {recipe.views} Views
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
