import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
  const session = cookies.get('session_user');
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  return new Response(session, {
    headers: { 'Content-Type': 'application/json' },
  });
};
