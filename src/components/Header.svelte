<script>
  import { onMount } from 'svelte';

  let user = null;

  // Google Client ID 환경변수 또는 직접 하드코딩
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Google Identity Services 스크립트 로드
  function loadGoogleScript() {
    return new Promise((resolve) => {
      if (window.google && window.google.accounts) return resolve();
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }

  // JWT 디코딩 함수
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      alert('로그인 JWT 파싱 오류');
      return null;
    }
  }

  // 로그인 버튼 초기화 및 콜백 핸들러
  onMount(async () => {
    await loadGoogleScript();

    const res = await fetch('/api/me');
    if (res.ok) {
      user = await res.json();
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      { theme: 'outline', size: 'large', type: 'icon' } // 개선: text: 'icon'
    );
  });

  function handleCredentialResponse(response) {
    // response.credential === id_token(JWT)
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential }),
    }).then(async (res) => {
      if (res.ok) {
        user = await res.json();
        // 서버 세션으로 로그인 상태 유지, user 정보는 필요시만 저장
      } else {
        alert('로그인 실패');
      }
    });
  }

  function handleLogout() {
    user = null;

    fetch('/api/logout', {
      method: 'POST',
    }).then(async (res) => {
      if (res.ok) {
        window.location.replace('/'); // 로그아웃 후 홈으로 리다이렉트
      }
    });
  }
</script>

<header>
  <div class="header-content">
    <div class="logo-area">
      <img
        class="logo-img"
        src="/favicon.png"
        alt="Wat밥 로고"
        width="25"
        height="25"
      />
      <span class="title">Wat밥</span>
    </div>
    <div class="login-area">
      <div
        id="google-signin-btn"
        style="display: {user ? 'none' : 'block'}"
      ></div>
      {#if user}
        <img
          src={user.picture}
          alt="프로필"
          width="28"
          height="28"
          style="border-radius:50%;vertical-align:middle;margin-right:7px;"
        />
        <span class="user-name">{user.name}</span>
        <button class="logout-btn" on:click={handleLogout}>로그아웃</button>
      {/if}
    </div>
  </div>
</header>

<style>
  header {
    background: #ff8c00;
    color: #fff;
    padding: 0.1rem;
    letter-spacing: 1px;
  }
  .header-content {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
  }
  .logo-area {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .logo-img {
    background: #fff;
    border-radius: 50%;
    box-sizing: content-box;
    box-shadow: 0 0 0 2px #fff;
    vertical-align: middle;
    position: relative;
    top: -2px;
  }
  .title {
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: 2px;
  }
  .login-area {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .login-btn {
    background: #fff;
    color: #444;
    border: none;
    border-radius: 5px;
    padding: 7px 18px 7px 13px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background 0.18s;
  }
  .login-btn:hover {
    background: #ffe3b3;
  }
  .logout-btn {
    background: #fff;
    color: #ff8c00;
    border: none;
    border-radius: 5px;
    padding: 6px 12px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    margin-left: 8px;
    transition: background 0.18s;
  }
  .logout-btn:hover {
    background: #fee2a8;
  }
  .user-name {
    font-weight: 600;
    font-size: 1rem;
    color: #fff9e8;
  }
  @media (max-width: 600px) {
    .header-content {
      max-width: 100%;
      padding: 0 6px;
    }
    .title {
      font-size: 1.2rem;
      letter-spacing: 1px;
    }
    .login-btn,
    .logout-btn {
      font-size: 0.93rem;
      padding: 6px 13px 6px 8px;
    }
  }
</style>
