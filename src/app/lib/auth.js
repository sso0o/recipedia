// src/app/lib/auth.js
import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET

export function verifyJwt(token) {
    if (!token) {
        throw new Error("Token not found");
    }
    try {
        return jwt.verify(token, secret);  // JWT secret로 토큰을 검증
    } catch (error) {
        throw new Error("Invalid or expired token");  // 만약 토큰이 유효하지 않으면 오류를 던짐
    }
}

export function getUserIdFromToken(req) {

    try {
        const token = req.cookies.get('token');

        if (!token) {
            return null;
        }

        const decoded = jwt.verify(token.value, secret); // JWT 검증
        return { userId: decoded._id };
    } catch (error) {
        console.error("토큰 검증 실패:", error);
        return null;
    }
}