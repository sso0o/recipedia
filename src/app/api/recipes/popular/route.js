import connectToDB from '../../../lib/mongodb'; // DB 연결 함수
import Recipe from '../../../models/Recipe';

export async function GET(req) {
    await connectToDB();

    try {
        const recipes = await Recipe.find()
            .sort({ likes: -1 }) // 좋아요 수로 내림차순 정렬
            .limit(5); // 인기 레시피 상위 5개 가져오기

        return new Response(JSON.stringify(recipes), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "데이터를 가져오는 데 실패했습니다." }),
            { status: 500 }
        );
    }
}