import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const buffetId = params.id;

  // Get buffet info for the registration page
  const res = await fetch(`${import.meta.env.VITE_API_URL}/buffets`);
  const result = await res.json();

  if (!res.ok || result.success !== 'true') {
    throw new Error(result.message || '알 수 없는 에러');
  }

  // Find the specific buffet
  const buffet = result.data.find((b: any) => b.id === buffetId);

  if (!buffet) {
    // throw new Error('뷔페를 찾을 수 없습니다.');
    redirect(302, '/');
  }

  if (buffet.hasTodayMenu === '1') {
    // throw new Error('오늘의 메뉴가 이미 등록되어 있습니다.');
    redirect(302, '/');
  }

  return {
    buffet,
  };
};
