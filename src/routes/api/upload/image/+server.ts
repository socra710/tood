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
    const imageFile = formData.get('image');

    if (!imageFile || !(imageFile instanceof File)) {
      return new Response(JSON.stringify({
        success: false,
        message: '이미지 파일이 선택되지 않았습니다.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      return new Response(JSON.stringify({
        success: false,
        message: '지원하지 않는 파일 형식입니다. JPG, PNG, GIF, WEBP 파일만 업로드 가능합니다.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      return new Response(JSON.stringify({
        success: false,
        message: '파일 크기가 너무 큽니다. 최대 10MB까지 업로드 가능합니다.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prepare FormData for Java API
    const javaFormData = new FormData();
    javaFormData.append('image', imageFile);

    // Call the Java API
    const apiUrl = `${import.meta.env.VITE_API_URL}/upload/image`;
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      body: javaFormData,
    });

    const result = await apiResponse.json();

    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        message: result.message || '이미지 업로드에 실패했습니다.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      imageUrl: result.imageUrl,
      message: '이미지가 성공적으로 업로드되었습니다.'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '서버 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};