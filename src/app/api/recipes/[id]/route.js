import connectToDB from '../../../lib/mongodb'; // DB 연결 함수
import Recipe from '../../../models/Recipe';

export async function GET(req, { params }) {
    try {
        await connectToDB();

        // params 객체를 제대로 받는 방식으로 수정
        const recipeId = params.id; // params.id 가져오기 (비동기 처리는 필요 없음)
        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            return new Response("레시피를 찾을 수 없습니다.", { status: 404 });
        }

        return new Response(JSON.stringify(recipe), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response("서버 오류 발생", { status: 500 });
    }
}
