"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [randomRecipe, setRandomRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [loading, setLoading] = useState(false);

  // 인기 레시피 가져오기
  useEffect(() => {
    const fetchPopularRecipes = async () => {
      try {
        const response = await fetch("/api/recipes/popular");
        const data = await response.json();
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
        const response = await fetch("/api/recipes/random");
        const data = await response.json();
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
            `/api/recipes/search?search=${search}&category=${category}&cookingTime=${cookingTime}`
        );
        const data = await response.json();
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
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">추천 레시피</h1>

        {/* 인기 레시피 섹션 */}
        <section className="mb-14">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">🔥 인기 레시피</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularRecipes.map((recipe) => (
                <Link key={recipe._id} href={`/recipes/${recipe._id}`} className="block">
                  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">{recipe.title}</h3>
                    <p className="text-gray-600 text-sm">{recipe.likes} Likes | {recipe.views} Views</p>
                  </div>
                </Link>
            ))}
          </div>
        </section>

        {/* 오늘의 추천 레시피 섹션 */}
        <section className="mb-14">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">🌟 오늘의 추천 레시피</h2>
          {randomRecipe ? (
              <Link href={`/recipes/${randomRecipe._id}`} className="block">
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
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* 카테고리 필터 */}
            <select
                className="w-full sm:w-1/3 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200 ease-in-out"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">카테고리 선택</option>
              <option value="한식">한식</option>
              <option value="중식">중식</option>
              <option value="일식">일식</option>
              <option value="양식">양식</option>
              <option value="기타">기타</option>
              <option value="디저트">디저트</option>
            </select>

            {/* 조리시간 필터 */}
            <select
                className="w-full sm:w-1/3 p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200 ease-in-out"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
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
                  <Link key={recipe._id} href={`/recipes/${recipe._id}`} className="block">
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-3">{recipe.title}</h3>
                      <p className="text-gray-600 text-sm">{recipe.likes} Likes | {recipe.views} Views</p>
                    </div>
                  </Link>
              ))}
            </div>
        )}
      </div>
  );
}
