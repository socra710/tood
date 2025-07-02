import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch }) => {
  // 1. 뷔페 리스트 API 호출 (id 목록 받아오기)
  const api = import.meta.env.VITE_API_URL || 'https://watbab.vercel.app/api';
  const res = await fetch(`${api}/buffets`);
  const result = await res.json();

  let buffetUrls = '';
  if (result.success === 'true' && Array.isArray(result.data)) {
    buffetUrls = result.data
      .filter((buffet: any) => buffet.hasTodayMenu === '1') // ← 조건 추가!
      .map(
        (buffet: { todayMenuId: number }) => `
  <url>
    <loc>https://watbab.vercel.app/tood/${buffet.todayMenuId}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      )
      .join('');
  }

  // 정적 페이지들도 추가
  const staticUrls = `
  <url>
    <loc>https://watbab.vercel.app/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  `;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${staticUrls}
${buffetUrls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
