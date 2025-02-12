import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";


interface LoginRequestBody {
    email: string;
    password: string;
}

export async function POST(req: Request): Promise<NextResponse> {
    const { email, password } = (await req.json()) as LoginRequestBody;

    // 데이터베이스 연결
    await connectToDB();

    // 유저 찾기
    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // 비밀번호 비교
    const isMatch = await user.isPasswordMatch(password);
    if (!isMatch) {
        return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }
// JWT 발급 (환경 변수가 없으면 에러 발생)
    if (!process.env.JWT_SECRET) {
        throw new Error("Missing JWT_SECRET environment variable");
    }
    const token = jwt.sign(user.toObject(), process.env.JWT_SECRET as string, { expiresIn: "1h" });

    // 쿠키에 토큰 추가 (NextResponse의 cookies API 사용)
    const res = NextResponse.json({ message: "Logged in successfully", token });
    return res;
}

// export default POST;