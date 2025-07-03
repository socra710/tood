import type { RequestHandler } from '@sveltejs/kit';
import jwt from 'jsonwebtoken'; // 서버용 JWT 패키지 사용

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID!;

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { credential } = await request.json();

  // 1. id_token(JWT) 검증 (signature, audience 등 체크)
  let payload;
  try {
    // 구글 공개키로 검증 (권장), 여기선 간단 예시
    payload = jwt.decode(credential); // 검증 없이 decode만 (실제로는 검증 해야함)
    // 실제 서비스에서는 jwt.verify() 또는 google-auth-library 사용 권장!
    console.log('Decoded payload:', payload);
    if (!payload || payload.aud !== GOOGLE_CLIENT_ID) {
      throw new Error('Invalid token');
    }
  } catch (e) {
    return new Response('Invalid token', { status: 401 });
  }

  // 2. 세션(쿠키)에 사용자 정보 저장
  // 예: user_id 또는 전체 payload, 실제 서비스에서는 세션스토어 사용 권장
  cookies.set(
    'session_user',
    JSON.stringify({
      sub: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    }),
    {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1일
    }
  );

  // 클라이언트로 사용자 정보 반환(필요시)
  return new Response(
    JSON.stringify({
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
