
import jwt, { JwtPayload } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';

const secret = process.env.JWT_SECRET as string;

export function verifyJwt(token: string): string | JwtPayload {
    if (!token) {
        throw new Error("Token not found");
    }
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.error("Invalid token:", error);
        throw new Error("Invalid or expired token");
    }
}

export function getUserIdFromToken(req: NextRequest): { userId: string } | null {
    try {
        const token = req.cookies.get('token');
        if (!token) {
            return null;
        }
        const decoded = jwt.verify(token.value, secret);
        // decoded가 객체이며 _id 필드가 존재하는지 확인
        if (typeof decoded === 'object' && decoded !== null && '_id' in decoded) {
            return { userId: (decoded as { _id: string })._id };
        }
        return null;
    } catch (error) {
        console.error("토큰 검증 실패:", error);
        return null;
    }
}
