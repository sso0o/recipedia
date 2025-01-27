"use client"; // 클라이언트 사이드 코드에서만 작동하도록 명시
import { useState } from "react";
import axios from "axios";


export default function Recipe() {
    // 상태 관리: 폼 필드에 입력된 값들
    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");

    // 제출 처리 함수
    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 동작을 막기

        // 폼 데이터 준비
        const recipeData = {
            title,
            ingredients,
            instructions,
        };

        try {
            // API로 데이터 전송 (POST)
            const response = await fetch("/api/recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(recipeData),
            });

            // 응답 상태 확인
            if (response.ok) {
                const result = await response.json();
                alert("레시피가 등록되었습니다!");
                setTitle(""); // 폼 초기화
                setIngredients(""); // 폼 초기화
                setInstructions(""); // 폼 초기화
            } else {
                const result = await response;  // 오류 페이지 HTML 반환 시 텍스트 처리
                alert(`오류 발생: ${result.message}`);
            }
        } catch (error) {
            console.error("API 요청 오류:", error);
            alert("서버와 연결할 수 없습니다.");
        }

    };

    return (
        <>
            <h1>레시피 등록</h1>
            <form onSubmit={handleSubmit}> {/* 오류 나는 부분 */}
                <div>
                    <label htmlFor="title">레시피 제목</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="ingredients">재료</label>
                    <textarea
                        id="ingredients"
                        name="ingredients"
                        required
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="instructions">조리법</label>
                    <textarea
                        id="instructions"
                        name="instructions"
                        required
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                    />
                </div>
                <button type="submit">등록</button>
            </form>
        </>

    );
}
