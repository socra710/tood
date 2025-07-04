import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const buffetId = url.searchParams.get('buffetId');
    
    if (buffetId) {
      // Get stats for a specific buffet
      const stats = getBuffetReviewStats(parseInt(buffetId));
      return new Response(JSON.stringify({
        success: true,
        stats
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Get stats for all buffets
      const allStats = getAllBuffetReviewStats();
      return new Response(JSON.stringify({
        success: true,
        stats: allStats
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Get review stats error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '리뷰 통계를 불러오는 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Mock review data for multiple buffets
const mockReviewDatabase = [
  // Buffet 1 reviews
  {
    id: 1,
    buffetId: 1,
    userName: "김민수",
    userPicture: "/favicon.png",
    tasteRating: 4,
    priceRating: 5,
    serviceRating: 4,
    comment: "음식 맛도 좋고 가격도 합리적이에요.",
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 2,
    buffetId: 1,
    userName: "이지현",
    userPicture: "/favicon.png",
    tasteRating: 5,
    priceRating: 4,
    serviceRating: 5,
    comment: "다양한 음식들이 있어서 좋았어요.",
    createdAt: new Date('2024-01-10').toISOString()
  },
  {
    id: 3,
    buffetId: 1,
    userName: "박철수",
    userPicture: "/favicon.png",
    tasteRating: 4,
    priceRating: 3,
    serviceRating: 4,
    comment: "맛은 좋은데 가격이 조금 비싸요.",
    createdAt: new Date('2024-01-08').toISOString()
  },
  // Buffet 2 reviews
  {
    id: 4,
    buffetId: 2,
    userName: "최영희",
    userPicture: "/favicon.png",
    tasteRating: 5,
    priceRating: 5,
    serviceRating: 5,
    comment: "완벽한 뷔페입니다!",
    createdAt: new Date('2024-01-12').toISOString()
  },
  {
    id: 5,
    buffetId: 2,
    userName: "정민호",
    userPicture: "/favicon.png",
    tasteRating: 4,
    priceRating: 4,
    serviceRating: 5,
    comment: "직원들이 정말 친절해요.",
    createdAt: new Date('2024-01-14').toISOString()
  },
  // Buffet 3 reviews
  {
    id: 6,
    buffetId: 3,
    userName: "한소영",
    userPicture: "/favicon.png",
    tasteRating: 3,
    priceRating: 4,
    serviceRating: 3,
    comment: "무난한 편이에요.",
    createdAt: new Date('2024-01-05').toISOString()
  },
  // Buffet 4 reviews
  {
    id: 7,
    buffetId: 4,
    userName: "서준호",
    userPicture: "/favicon.png",
    tasteRating: 5,
    priceRating: 3,
    serviceRating: 4,
    comment: "음식 맛은 최고인데 가격이 아쉬워요.",
    createdAt: new Date('2024-01-20').toISOString()
  },
  {
    id: 8,
    buffetId: 4,
    userName: "김하늘",
    userPicture: "/favicon.png",
    tasteRating: 4,
    priceRating: 4,
    serviceRating: 4,
    comment: "전체적으로 만족합니다.",
    createdAt: new Date('2024-01-18').toISOString()
  },
  {
    id: 9,
    buffetId: 4,
    userName: "이태양",
    userPicture: "/favicon.png",
    tasteRating: 5,
    priceRating: 5,
    serviceRating: 5,
    comment: "모든 면에서 완벽했어요!",
    createdAt: new Date('2024-01-16').toISOString()
  },
  // Buffet 5 reviews
  {
    id: 10,
    buffetId: 5,
    userName: "장미란",
    userPicture: "/favicon.png",
    tasteRating: 2,
    priceRating: 3,
    serviceRating: 2,
    comment: "기대보다 아쉬웠어요.",
    createdAt: new Date('2024-01-03').toISOString()
  }
];

function getBuffetReviewStats(buffetId: number) {
  const reviews = mockReviewDatabase.filter(r => r.buffetId === buffetId);
  
  if (reviews.length === 0) {
    return {
      buffetId,
      reviewCount: 0,
      overallRating: 0,
      tasteRating: 0,
      priceRating: 0,
      serviceRating: 0
    };
  }
  
  const totalTaste = reviews.reduce((sum, r) => sum + r.tasteRating, 0);
  const totalPrice = reviews.reduce((sum, r) => sum + r.priceRating, 0);
  const totalService = reviews.reduce((sum, r) => sum + r.serviceRating, 0);
  
  const avgTaste = totalTaste / reviews.length;
  const avgPrice = totalPrice / reviews.length;
  const avgService = totalService / reviews.length;
  
  // Calculate overall rating as average of all three ratings
  const overallRating = (avgTaste + avgPrice + avgService) / 3;
  
  return {
    buffetId,
    reviewCount: reviews.length,
    overallRating: Math.round(overallRating * 10) / 10, // Round to 1 decimal place
    tasteRating: Math.round(avgTaste * 10) / 10,
    priceRating: Math.round(avgPrice * 10) / 10,
    serviceRating: Math.round(avgService * 10) / 10
  };
}

function getAllBuffetReviewStats() {
  // Get unique buffet IDs from the mock database
  const buffetIds = [...new Set(mockReviewDatabase.map(r => r.buffetId))];
  
  const allStats = buffetIds.map(buffetId => getBuffetReviewStats(buffetId));
  
  // Create a map for easy lookup
  const statsMap: { [key: number]: any } = {};
  allStats.forEach(stat => {
    statsMap[stat.buffetId] = stat;
  });
  
  return statsMap;
}