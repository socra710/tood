<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { onClickOutside } from '$lib/utils/onClickOutside'; // 외부 클릭시 닫기용 (직접 구현 필요할 수 있음)

  let user = null;
  let showMenu = false;
  let menuRef;

  // 메뉴 바깥 클릭 시 닫기
  // onClickOutside(menuRef, () => (showMenu = false));

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

    if (menuRef) {
      const { destroy } = onClickOutside(menuRef, () => (showMenu = false));
      return destroy;
    }
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
        window.location.reload(); // 현재 페이지 새로고침
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
    <div
      class="logo-area"
      on:click={() => goto('/')}
      on:keydown={(e) => e.key === 'Enter' && goto('/')}
      role="button"
      tabindex="0"
    >
      <img
        class="logo-img"
        src="/favicon.png"
        alt="Wat밥 로고"
        width="28"
        height="28"
      />
      <span class="title">Wat밥</span>
    </div>
    <div class="login-area">
      <div
        id="google-signin-btn"
        style="display: {user ? 'none' : 'block'}"
      ></div>

      {#if user}
        <div class="avatar-menu">
          <button
            class="avatar-button"
            on:click={() => (showMenu = !showMenu)}
            aria-label="메뉴 열기"
          >
            <img src={user.picture} alt="프로필" class="avatar" />
          </button>
          {#if showMenu}
            <div
              class="dropdown"
              bind:this={menuRef}
              use:onClickOutside={() => (showMenu = false)}
            >
              <!-- <div class="dropdown-item">{user.name}</div> -->
              <button
                class="dropdown-item"
                on:click={() => goto('/user/profile')}
                type="button"
              >
                정보수정
              </button>
              <button
                class="dropdown-item logout"
                on:click={handleLogout}
                type="button"
              >
                로그아웃
              </button>
            </div>
          {/if}
        </div>
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
    cursor: pointer;
    transition: transform 0.2s;
  }
  .logo-area:hover {
    transform: scale(1.05);
  }
  .logo-img {
    background: #fff;
    border-radius: 50%;
    box-sizing: content-box;
    box-shadow: 0 0 0 2px #fff;
    vertical-align: middle;
    position: relative;
    /* top: -2px; */
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
  /* .logout-btn {
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
  } */
  /* .logout-btn:hover {
    background: #fee2a8;
  }
  .user-name {
    font-weight: 600;
    font-size: 1rem;
    color: #fff9e8;
  } */
  @media (max-width: 600px) {
    .header-content {
      max-width: 100%;
      padding: 0 6px;
    }
    .title {
      font-size: 1.2rem;
      letter-spacing: 1px;
    }
    /* .logout-btn {
      font-size: 0.93rem;
      padding: 6px 13px 6px 8px;
    } */
  }

  .avatar-menu {
    position: relative;
    display: inline-block;
  }
  .avatar-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid #ff8c00;
    box-shadow: 0 2px 8px rgba(255, 140, 0, 0.1);
    transition: box-shadow 0.2s;
    cursor: pointer;
    vertical-align: middle;
  }
  .avatar:hover {
    box-shadow: 0 4px 16px rgba(255, 140, 0, 0.2);
  }

  .dropdown {
    position: absolute;
    right: 0;
    margin-top: 10px;
    background: #fff;
    border-radius: 12px;
    border: 1.5px solid #ff8c00;
    min-width: 150px;
    box-shadow:
      0 8px 32px rgba(255, 140, 0, 0.1),
      0 2px 8px rgba(0, 0, 0, 0.05);
    z-index: 10;
    color: #222;
    font-size: 15px;
    padding: 6px 0;
    animation: fadeIn 0.15s;
    box-sizing: border-box; /* 추가 */
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .dropdown::before {
    content: '';
    position: absolute;
    top: -10px;
    right: 16px;
    border-width: 0 8px 10px 8px;
    border-style: solid;
    border-color: transparent transparent #ff8c00 transparent;
    display: block;
  }

  .dropdown-item {
    padding: 11px 15px; /* 패딩을 좌우 16px로 줄임 */
    cursor: pointer;
    color: #222;
    border: none;
    background: none;
    transition:
      background 0.18s,
      color 0.18s;
    border-radius: 6px;
    margin: 0; /* margin 제거 */
    width: 100%;
    text-align: left;
    font-size: 15px;
    box-sizing: border-box; /* 추가! */
    display: block; /* 추가: 100% 너비 보장 */
  }

  .dropdown-item:hover {
    background: #ff8c00;
    color: #fff;
  }

  .dropdown-item + .dropdown-item {
    margin-top: 2px;
  }

  .dropdown-item.logout {
    color: #ff8c00;
    font-weight: bold;
  }
  .dropdown-item.logout:hover {
    background: #fff3e0;
    color: #ff8c00;
  }
</style>
