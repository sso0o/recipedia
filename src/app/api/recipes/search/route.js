import connectToDB from '../../../lib/mongodb'; // DB 연결 함수
import Recipe from '../../../models/Recipe';
import { NextResponse } from 'next/server';



export async function GET(req) {


    const { search, category, cookingTime } = req.url.split('?')[1]?.split('&').reduce((acc, param) => {
        const [key, value] = param.split('=');
        acc[key] = value;
        return acc;
    }, {}) || {};

    await connectToDB();

    try {
        let filter = {}; // 필터 객체 초기화

        // 검색어가 있으면 제목과 재료로 검색
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } }, // 제목 검색 (대소문자 구분 안 함)
                { ingredients: { $regex: search, $options: "i" } }, // 재료 검색 (대소문자 구분 안 함)
            ];
        }

        // 카테고리 필터가 있으면 필터 추가
        if (category) {
            filter.category = category;
        }

        // 조리시간 필터가 있으면 필터 추가
        if (cookingTime) {
            // 조리시간을 기준으로 빠른 요리와 정성 요리 분류 예시
            if (cookingTime === "quick") {
                filter.cookingTime = { $lte: 30 }; // 30분 이하로 필터링
            } else if (cookingTime === "slow") {
                filter.cookingTime = { $gt: 30 }; // 30분 초과로 필터링
            }
        }

        // 필터를 적용하여 레시피 조회
        const recipes = await Recipe.find(filter);


        return new NextResponse(JSON.stringify(recipes), { status: 200 });
    } catch (error) {
        console.error("레시피 검색 오류:", error);
        return new NextResponse(JSON.stringify({ message: "서버 오류" }), { status: 500 });
    }
}