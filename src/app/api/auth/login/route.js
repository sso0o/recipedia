import User from "../../../models/User";
import jwt from "jsonwebtoken";
import connectToDB  from '../../../lib/mongodb'; // DB 연결 함수
import { NextResponse } from "next/server";


export async function POST(req) {
    const { email, password } = await req.json();

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

    // JWT 발급
    const token = jwt.sign(user.toObject(), process.env.JWT_SECRET, { expiresIn: "1h" });

    // 쿠키에 토큰 추가 (NextResponse의 cookies API 사용)
    const res = NextResponse.json({ message: 'Logged in successfully' });
    res.cookies.set('token', token, {
        httpOnly: true,  // JavaScript에서 접근 불가
        secure: process.env.NODE_ENV === 'production',  // 프로덕션 환경에서만 secure 사용
        sameSite: 'Strict',
        maxAge: 60 * 60,  // 1시간 동안 유효
    });

    return res;
}