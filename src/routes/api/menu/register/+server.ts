import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
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

    const formData = await request.formData();
    const buffetId = formData.get('buffetId');
    const title = formData.get('title');
    const content = formData.get('content');
    const imageFile = formData.get('image');

    if (!buffetId || !title || !content) {
      return new Response(JSON.stringify({
        success: false,
        message: '필수 정보가 누락되었습니다.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse user info from session
    const user = JSON.parse(sessionCookie);

    // Prepare the data to send to Java API
    const menuData = {
      buffetId: buffetId,
      title: title,
      content: content,
      userId: user.googleId,
      menuDate: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
    };

    // If there's an image, we need to convert it to base64 or handle it separately
    // For now, let's assume the Java API accepts base64 encoded images
    if (imageFile && imageFile.size > 0) {
      const buffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      menuData.image = base64;
      menuData.imageFileName = imageFile.name;
      menuData.imageContentType = imageFile.type;
    }

    // Call the Java API
    const apiUrl = `${import.meta.env.VITE_API_URL}/menu/register`;
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuData),
    });

    const result = await apiResponse.json();

    if (result.success !== 'true') {
      return new Response(JSON.stringify({
        success: false,
        message: result.message || '메뉴 등록에 실패했습니다.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: '메뉴가 성공적으로 등록되었습니다.',
      data: result.data
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Menu registration error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '서버 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};