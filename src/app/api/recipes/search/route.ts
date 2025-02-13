import connectToDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';

export async function GET(req: Request): Promise<Response> {
    await connectToDB();
    const url = new URL(req.url);
    const type = url.searchParams.get("type");

    try {
        if (type === "random") {
            // 랜덤 레시피 가져오기
            const totalRecipes = await Recipe.countDocuments();
            const randomIndex = Math.floor(Math.random() * totalRecipes);
            const recipe = await Recipe.findOne().skip(randomIndex);
            return new Response(JSON.stringify(recipe), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } else if (type === "popular") {
            // 인기 레시피 상위 5개 가져오기
            const recipes = await Recipe.find()
                .sort({ likes: -1 })
                .limit(5);
            return new Response(JSON.stringify(recipes), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } else if (type === "search") {
            // 검색 파라미터 추출
            const search = url.searchParams.get("search");
            const category = url.searchParams.get("category");
            const cookingTime = url.searchParams.get("cookingTime");

            // 필터 객체 초기화
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const filter: { [key: string]: any } = {};

            // 검색어가 있으면 제목과 재료에서 정규식 검색 (대소문자 구분 없이)
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: "i" } },
                    { ingredients: { $regex: search, $options: "i" } },
                ];
            }

            // 카테고리 필터
            if (category) {
                filter.category = category;
            }

            // 조리시간 필터 (예: quick: 30분 이하, slow: 30분 초과)
            if (cookingTime) {
                if (cookingTime === "quick") {
                    filter.cookingTime = { $lte: 30 };
                } else if (cookingTime === "slow") {
                    filter.cookingTime = { $gt: 30 };
                }
            }

            // 필터를 적용하여 레시피 조회
            const recipes = await Recipe.find(filter);
            return new Response(JSON.stringify(recipes), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });

        } else {
            // type 파라미터가 없거나 유효하지 않은 경우 에러 반환 또는 기본 동작 설정
            return new Response(
                JSON.stringify({ error: "유효한 type 파라미터가 필요합니다." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
    } catch (error: unknown) {
        let errorMessage = "데이터를 가져오는 데 실패했습니다.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
