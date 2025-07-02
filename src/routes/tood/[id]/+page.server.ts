import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const id = params.id;
  const res = await fetch(`${import.meta.env.VITE_API_URL}/tood?Id=${id}`);
  const result = await res.json();

  if (!res.ok || result.success !== 'true') {
    throw new Error(result.message || '알 수 없는 에러');
  }

  return {
    buffet: result.data,
  };
};
