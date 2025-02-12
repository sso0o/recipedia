"use client";

import React, {JSX, useState} from "react";
import { FaTrashAlt } from "react-icons/fa";

interface Ingredient {
    ingredient: string;
    quantity: string;
}

interface Instruction {
    step: string;
}

export default function RecipeRegisterPage(): JSX.Element {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [category, setCategory] = useState<string>("");
    const [cookingTime, setCookingTime] = useState<string>("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { ingredient: "", quantity: "" },
    ]);
    const [instructions, setInstructions] = useState<Instruction[]>([
        { step: "" },
    ]);

    // 폼 제출 처리
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("cookingTime", cookingTime);
        if (image) {
            formData.append("image", image);
        }

        try {
            // 레시피 등록
            const recipeResponse = await fetch("/api/recipes", {
                method: "POST",
                body: formData, // FormData로 데이터 전송
            });

            const recipe = await recipeResponse.json();

            // 레시피 등록이 성공적이면 재료와 조리법을 각각 등록
            if (recipeResponse.ok) {
                for (let i = 0; i < ingredients.length; i++) {
                    await fetch("/api/ingredients", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            recipeId: recipe.recipe._id,
                            ingredient: ingredients[i].ingredient,
                            quantity: ingredients[i].quantity,
                        }),
                    });
                }

                for (let i = 0; i < instructions.length; i++) {
                    await fetch("/api/instructions", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            recipeId: recipe.recipe._id,
                            step: instructions[i].step,
                            order: i + 1,
                        }),
                    });
                }

                alert("레시피가 등록되었습니다!");
                setTitle("");
                setDescription("");
                setImage(null);
                setCategory("");
                setCookingTime("");
                setIngredients([{ ingredient: "", quantity: "" }]);
                setInstructions([{ step: "" }]);
            } else {
                const error = await recipeResponse.json();
                alert(`오류 발생: ${error.message}`);
            }
        } catch (err) {
            console.error(err);
            alert("서버와 연결할 수 없습니다.");
        }
    };

    const handleIngredientChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const values = [...ingredients];
        // e.target.name가 "ingredient" 또는 "quantity"여야 함
        values[index] = { ...values[index], [e.target.name]: e.target.value };
        setIngredients(values);
    };

    const handleInstructionChange = (
        index: number,
        e: React.ChangeEvent<HTMLTextAreaElement>
    ): void => {
        const values = [...instructions];
        values[index].step = e.target.value;
        setInstructions(values);
    };

    // 재료 추가 함수
    const addIngredient = (): void => {
        setIngredients([...ingredients, { ingredient: "", quantity: "" }]);
    };

    // 조리법 추가 함수
    const addInstruction = (): void => {
        setInstructions([...instructions, { step: "" }]);
    };

    // 재료 삭제 함수
    const removeIngredient = (index: number): void => {
        const values = [...ingredients];
        values.splice(index, 1); // 해당 index의 항목을 삭제
        setIngredients(values);
    };

    // 조리법 삭제 함수
    const removeInstruction = (index: number): void => {
        const values = [...instructions];
        values.splice(index, 1); // 해당 index의 항목을 삭제
        setInstructions(values);
    };

    // 파일 선택 처리
    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
                레시피 등록
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 레시피 제목 입력 */}
                <div className="space-y-2">
                    <label
                        htmlFor="title"
                        className="block text-lg font-semibold text-gray-700"
                    >
                        레시피 제목
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* 레시피 설명 입력 */}
                <div className="space-y-2">
                    <label
                        htmlFor="description"
                        className="block text-lg font-semibold text-gray-700"
                    >
                        설명
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* 대표 이미지 파일 업로드 */}
                <div className="space-y-2">
                    <label
                        htmlFor="image"
                        className="block text-lg font-semibold text-gray-700"
                    >
                        대표 이미지
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleImageChange}
                    />
                </div>

                {/* 카테고리 선택 */}
                <div className="space-y-2">
                    <label
                        htmlFor="category"
                        className="block text-lg font-semibold text-gray-700"
                    >
                        카테고리
                    </label>
                    <select
                        id="category"
                        name="category"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">카테고리 선택</option>
                        <option value="kor">한식</option>
                        <option value="chi">중식</option>
                        <option value="jpn">일식</option>
                        <option value="wes">양식</option>
                        <option value="etc">기타</option>
                        <option value="des">디저트</option>
                    </select>
                </div>

                {/* 조리 시간 입력 */}
                <div className="space-y-2">
                    <label
                        htmlFor="cookingTime"
                        className="block text-lg font-semibold text-gray-700"
                    >
                        조리 시간 (분)
                    </label>
                    <input
                        type="number"
                        id="cookingTime"
                        name="cookingTime"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cookingTime}
                        onChange={(e) => setCookingTime(e.target.value)}
                    />
                </div>

                {/* 재료 입력 */}
                <div className="space-y-2">
                    <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-700">재료</span>
                        <button
                            type="button"
                            className="bg-orange-400 text-white mx-3 px-3 py-1.5 rounded-lg hover:bg-orange-500 text-sm"
                            onClick={addIngredient}
                        >
                            +
                        </button>
                    </div>
                    {ingredients.map((ing, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <input
                                type="text"
                                name="ingredient"
                                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="재료"
                                value={ing.ingredient}
                                onChange={(e) => handleIngredientChange(index, e)}
                                required
                            />
                            <input
                                type="text"
                                name="quantity"
                                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="용량"
                                value={ing.quantity}
                                onChange={(e) => handleIngredientChange(index, e)}
                                required
                            />
                            <button
                                type="button"
                                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-300"
                                onClick={() => removeIngredient(index)}
                                disabled={ingredients.length === 1} // 재료가 하나일 경우 삭제 버튼 비활성화
                            >
                                <FaTrashAlt />
                            </button>
                        </div>
                    ))}
                </div>

                {/* 조리법 입력 */}
                <div className="space-y-2">
                    <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-700">조리 순서</span>
                        <button
                            type="button"
                            className="bg-orange-400 text-white mx-3 px-3 py-1.5 rounded-lg hover:bg-orange-500 text-sm"
                            onClick={addInstruction}
                        >
                            +
                        </button>
                    </div>
                    {instructions.map((inst, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <span className="text-lg font-semibold text-gray-700">{index + 1}.</span>
                            <textarea
                                name="step"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="조리법"
                                value={inst.step}
                                onChange={(e) => handleInstructionChange(index, e)}
                                required
                            />
                            <button
                                type="button"
                                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-300"
                                onClick={() => removeInstruction(index)}
                                disabled={instructions.length === 1} // 순서가 하나일 경우 삭제 버튼 비활성화
                            >
                                <FaTrashAlt />
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 mt-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                    레시피 등록
                </button>
            </form>
        </div>
    );
}