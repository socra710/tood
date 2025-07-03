import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const POST = async ({ request, cookies }) => {
  const { credential } = await request.json();

  // 1. 구글 토큰 검증
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (e) {
    return new Response('Invalid token', { status: 401 });
  }

  const apiUrl = `${import.meta.env.VITE_API_URL}/user/upsert`; // 실제 API URL로 변경

  const apiResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    }),
  });

  const result = await apiResponse.json();

  if (result.success !== 'true') {
    return new Response(result.message || '알 수 없는 에러', { status: 500 });
  }

  const userDate = result.data;

  // 3. 세션 쿠키 발급 (user.id 등)
  cookies.set(
    'session_user',
    JSON.stringify({
      googleId: userDate.googleId,
      name: userDate.name,
      email: userDate.email,
      picture: userDate.picture,
    }),
    {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
    }
  );

  return new Response(
    JSON.stringify({
      googleId: userDate.googleId,
      name: userDate.name,
      email: userDate.email,
      picture: userDate.picture,
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
