// src/app/api/recipes/my-recipes/route.js
import { NextResponse } from 'next/server';
import connectToDB from '../../../lib/mongodb'; // DB 연결 함수
import Recipe from '../../../models/Recipe';
import { verifyJwt } from "../../../lib/auth";

export async function GET(req) {
    try {
        // 쿠키에서 토큰 읽기
        const cookies = req.headers.get('cookie');
        const token = cookies?.split(';').find(cookie => cookie.trim().startsWith('token='));

        if (!token) {
            return new NextResponse('Token not found', { status: 401 });
        }

        const actualToken = token.split('=')[1];  // JWT 토큰만 추출
        const user = verifyJwt(actualToken);  // 토큰 검증 후 사용자 정보 확인

        await connectToDB();
        // 모든 레시피 가져오기 (Mongoose 사용)
        const recipes = await Recipe
            .find({ userId: user.id }); // 현재 로그인한 사용자의 레시피를 가져옵니다

        return new NextResponse(JSON.stringify(recipes), { status: 200 });
    } catch (error) {
        console.error("Error fetching recipes:", error);  // 에러 출력

        return new NextResponse("Unauthorized", { status: 401 });
    }
}
