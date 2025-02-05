"use client";

import { useState, useEffect } from "react";

export default function MyRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyRecipes = async () => {
            try {
                const response = await fetch("/api/recipes/my-recipes");
                if (!response.ok) {
                    throw new Error("Failed to fetch recipes");
                }
                const data = await response.json();
                setRecipes(data);  // 받아온 레시피 데이터 저장
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyRecipes();
    }, []);

    return (
        <div className="space-y-6">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                        <div key={recipe._id} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 w-full ">
                            <div className="hidden md:flex h-48 bg-gray-200">
                                {/* 레시피 이미지 placeholder */}
                                <img
                                    src={recipe.image || "/placeholder.png"} // 기본 이미지 제공
                                    alt={recipe.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-3">{recipe.title}</h3>
                                <p className="text-gray-600 mb-3">{recipe.description}</p>
                                <p className="text-gray-600 text-sm mb-3">{recipe.likes} Likes | {recipe.views} Views</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
