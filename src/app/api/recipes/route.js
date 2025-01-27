// /app/api/recipe/route.js
import connectToDatabase from '../../lib/mongodb'; // DB 연결 함수
import Recipe from '../../models/Recipe';

export async function POST(req) {
    try {
        // 요청 본문을 JSON으로 파싱
        const { title, ingredients, instructions } = await req.json();

        // MongoDB 연결
        await connectToDatabase();

        // 새로운 레시피 생성
        const newRecipe = await Recipe.create({ title, ingredients, instructions });

        // 성공적인 응답 반환
        return new Response(JSON.stringify({ message: 'Recipe Created', recipe: newRecipe }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        // 에러 처리
        return new Response(JSON.stringify({ error: 'Failed to create recipe' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
