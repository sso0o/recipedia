import connectToDB from '../../../lib/mongodb'; // DB 연결 함수
import Recipe from '../../../models/Recipe';

export async function GET(req) {
    await connectToDB();

    try {
        const totalRecipes = await Recipe.countDocuments();
        const randomIndex = Math.floor(Math.random() * totalRecipes);
        const recipe = await Recipe.findOne().skip(randomIndex); // 랜덤 레시피 가져오기

        return new Response(JSON.stringify(recipe), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "데이터를 가져오는 데 실패했습니다." }),
            { status: 500 }
        );
    }
}