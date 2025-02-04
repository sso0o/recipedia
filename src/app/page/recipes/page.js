"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);

    // MongoDB에서 데이터 가져오기
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch("/api/recipes");
                const data = await response.json();
                setRecipes(data);
            } catch (error) {
                console.error("데이터 가져오기 실패:", error);
            }
        };
        fetchRecipes();
    }, []);

    return (
        <div className="container px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">레시피 목록</h1>

            <div className="flex justify-end mb-8">
                <Link href="/page/recipes/register">
                    <button
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-105">
                        레시피 등록
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recipes.map((recipe) => (
                    <Link key={recipe._id} href={`/page/recipes/${recipe._id}`}
                          className="block transform transition-all duration-300 hover:scale-105">
                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
                            <h2 className="text-xl font-semibold text-gray-700">{recipe.title}</h2>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
