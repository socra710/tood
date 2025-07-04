import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const id = params.id;
  
  // Mock data for demonstration - in production this would come from the API
  const mockBuffet = {
    id: parseInt(id),
    name: "맛있는 뷔페",
    region: "경기",
    location: "수원",
    address: "경기도 수원시 팔달구 매탄동 123-45",
    strength: "다양한 요리와 친절한 서비스",
    menuName: "오늘의 특선 메뉴",
    todayMenuImage: "/favicon.png",
    todayMenuText: "<p>오늘의 특선 메뉴입니다.<br>- 한식: 불고기, 갈비찜<br>- 중식: 짜장면, 탕수육<br>- 일식: 초밥, 우동<br>- 양식: 스테이크, 파스타</p>",
    lat: 37.2636,
    lng: 127.0286,
    pricePerMeal: "15000"
  };

  try {
    // Try to fetch real data first
    const res = await fetch(`${import.meta.env.VITE_API_URL}/tood?Id=${id}`);
    const result = await res.json();

    if (res.ok && result.success === 'true') {
      return {
        buffet: result.data,
      };
    }
  } catch (error) {
    console.log('API not available, using mock data');
  }

  // Fall back to mock data
  return {
    buffet: mockBuffet,
  };
};
