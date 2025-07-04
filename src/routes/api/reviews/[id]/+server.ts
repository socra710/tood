import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, cookies }) => {
  try {
    const buffetId = params.id;
    
    // Mock data for now - in a real app, this would come from a database
    const mockReviews = [
      {
        id: 1,
        buffetId: parseInt(buffetId),
        userName: "김민수",
        userPicture: "/favicon.png",
        tasteRating: 4,
        priceRating: 5,
        serviceRating: 4,
        comment: "음식 맛도 좋고 가격도 합리적이에요. 직원분들도 친절하시고 추천합니다!",
        createdAt: new Date('2024-01-15').toISOString()
      },
      {
        id: 2,
        buffetId: parseInt(buffetId),
        userName: "이지현",
        userPicture: "/favicon.png",
        tasteRating: 5,
        priceRating: 4,
        serviceRating: 5,
        comment: "다양한 음식들이 있어서 좋았어요. 특히 샐러드바가 신선하고 맛있었습니다.",
        createdAt: new Date('2024-01-10').toISOString()
      }
    ];

    return new Response(JSON.stringify({
      success: true,
      reviews: mockReviews
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '리뷰를 불러오는 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: RequestHandler = async ({ request, params, cookies }) => {
  try {
    // Check if user is logged in
    const sessionCookie = cookies.get('session_user');
    if (!sessionCookie) {
      return new Response(JSON.stringify({
        success: false,
        message: '로그인이 필요합니다.'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = JSON.parse(sessionCookie);
    const { buffetId, tasteRating, priceRating, serviceRating, comment } = await request.json();

    // Validate input
    if (!buffetId || !tasteRating || !priceRating || !serviceRating || !comment) {
      return new Response(JSON.stringify({
        success: false,
        message: '모든 필드를 입력해주세요.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate ratings
    if (tasteRating < 1 || tasteRating > 5 || priceRating < 1 || priceRating > 5 || serviceRating < 1 || serviceRating > 5) {
      return new Response(JSON.stringify({
        success: false,
        message: '평점은 1-5 사이의 값이어야 합니다.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // In a real app, save to database
    // For now, just return success
    const newReview = {
      id: Date.now(),
      buffetId: parseInt(buffetId),
      userName: user.name,
      userPicture: user.picture,
      tasteRating,
      priceRating,
      serviceRating,
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    return new Response(JSON.stringify({
      success: true,
      message: '리뷰가 성공적으로 등록되었습니다.',
      review: newReview
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Post review error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '리뷰 등록 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};