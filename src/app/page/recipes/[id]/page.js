"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function RecipeDetail() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [instructions, setInstructions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const recipeResponse = await fetch(`/api/recipes/${id}`);
                const recipeData = await recipeResponse.json();

                const ingredientsResponse = await fetch(`/api/ingredients?recipeId=${id}`);
                const ingredientsData = await ingredientsResponse.json();

                const instructionsResponse = await fetch(`/api/instructions?recipeId=${id}`);
                const instructionsData = await instructionsResponse.json();

                setRecipe(recipeData);
                setIngredients(ingredientsData);
                setInstructions(instructionsData.sort((a, b) => a.order - b.order));
            } catch (error) {
                console.error("레시피 가져오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchRecipe();
    }, [id]);

    if (loading) return <p className="text-center text-gray-500 text-lg">로딩 중...</p>;
    if (!recipe) return <p className="text-center text-gray-500 text-lg">레시피를 찾을 수 없습니다.</p>;

    return (

        <div className="flex flex-col w-full sm:min-w-[320px] md:min-w-[600px] lg:min-w-[800px] my-10 p-6 sm:p-8 md:p-10 bg-white rounded-2xl shadow-lg border border-gray-200">
            {recipe.image && (
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-cover rounded-xl mb-6 shadow-md"
                />
            )}

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">{recipe.title}</h1>
            <p className="text-center text-gray-600 text-base sm:text-lg md:text-xl mb-4">
                🕒 조리 시간: {recipe.cookingTime}분 | 📌 카테고리: {recipe.category}
            </p>

            {/* 🛒 재료 목록 */}
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mt-6 mb-4 border-b-2 pb-2">🛒 재료</h2>
            {ingredients.length > 0 ? (
                <ul className="space-y-3">
                    {ingredients.map((item, index) => (
                        <li key={index} className="flex justify-between p-3 sm:p-4 bg-gray-50 rounded-lg shadow">
                            <span className="font-medium text-gray-800">{item.ingredient}</span>
                            <span className="text-gray-600">{item.quantity}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">등록된 재료가 없습니다.</p>
            )}

            {/* 👨‍🍳 조리 순서 */}
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mt-6 mb-4 border-b-2 pb-2">👨‍🍳 조리 순서</h2>
            {instructions.length > 0 ? (
                <ol className="space-y-4">
                    {instructions.map((step, index) => (
                        <li key={index} className="flex items-start p-4 sm:p-5 bg-gray-100 border-l-4 border-orange-500 rounded-lg shadow">
                            <span className="font-bold text-orange-500 mr-3 text-base sm:text-lg">{index + 1}.</span>
                            <span className="text-gray-800">{step.step}</span>
                        </li>
                    ))}
                </ol>
            ) : (
                <p className="text-gray-500">등록된 조리법이 없습니다.</p>
            )}

            <div className="flex justify-center mt-8">
                <Link href="/page/recipes">
                    <button className="bg-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:bg-orange-600 transition-all duration-300">
                        목록으로 돌아가기
                    </button>
                </Link>
            </div>
        </div>
    );

}
