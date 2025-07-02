<script lang="ts">
  import Header from '../../../components/Header.svelte';
  import Footer from '../../../components/Footer.svelte';
  import LoadingBar from '../../../components/LoadingBar.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let buffet: any = null; // 배열이 아니라 객체!
  let loading = true;
  let error: string | null = null;

  let mapContainer: HTMLDivElement | null = null;
  let map: any = null;

  $: id = +$page.params.id;

  async function fetchBuffetDetail(id: number) {
    loading = true;
    error = null;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/tood?Id=${id}`);
      if (!res.ok) throw new Error('API 요청 실패');
      const result = await res.json();
      if (result.success !== 'true') {
        throw new Error(result.message || '알 수 없는 에러');
      }
      buffet = result.data; // 결과는 객체!
    } catch (e) {
      error = e.message;
      buffet = null;
    } finally {
      loading = false;
    }
  }

  function loadKakaoMapScript(callback) {
    const scriptId = 'kakao-map-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src =
        'https://dapi.kakao.com/v2/maps/sdk.js?appkey=38f3cb332825f04c4c29380a8fd7359c&autoload=false';
      script.onload = callback;
      document.head.appendChild(script);
    } else {
      if (window.kakao && window.kakao.maps) callback();
      else
        document.getElementById(scriptId)!.addEventListener('load', callback);
    }
  }

  onMount(() => {
    fetchBuffetDetail(id);
  });

  // buffet가 바뀌고, loading이 끝났을 때 지도 생성
  $: if (!loading && buffet && mapContainer) {
    loadKakaoMapScript(() => {
      if (
        mapContainer &&
        window.kakao &&
        window.kakao.maps &&
        buffet.lat &&
        buffet.lng
      ) {
        kakao.maps.load(() => {
          const lat = Number(buffet.lat);
          const lng = Number(buffet.lng);

          console.log(`지도 좌표: ${lat}, ${lng}`);

          // 지도 초기화 (기존 지도 객체가 있으면 제거해도 됨)
          map = new window.kakao.maps.Map(mapContainer, {
            center: new window.kakao.maps.LatLng(lat, lng),
            level: 3,
          });
          // 마커 표시
          new window.kakao.maps.Marker({
            map,
            position: new window.kakao.maps.LatLng(
              Number(buffet.lat),
              Number(buffet.lng)
            ),
          });
        });
      }
    });
  }
</script>

<Header />

<div class="main-detail-wrap">
  <main>
    {#if loading}
      <LoadingBar />
    {:else if error}
      <div class="error">{error}</div>
    {:else if buffet}
      <h2 class="buffet-title">{buffet.name}</h2>
      <div class="buffet-info">
        <p>
          <strong>지역:</strong>
          {buffet.region ? `${buffet.region} ` : ''}{buffet.location}
        </p>
        <p><strong>주소:</strong> {buffet.address}</p>
        {#if buffet.strength}
          <p><strong>특징:</strong> {buffet.strength}</p>
        {/if}
      </div>
      <section class="menu-section">
        <h3>{buffet.menuName}</h3>
        <img class="menu-img" src={buffet.todayMenuImage} alt="오늘밥 사진" />
        <div class="menu-text">{buffet.todayMenuText}</div>
      </section>
      <section class="map-section">
        <h3>위치 지도</h3>
        <div bind:this={mapContainer} class="map-box"></div>
      </section>
    {:else}
      <div>해당 데이터 정보를 찾을 수 없습니다.</div>
    {/if}
  </main>
</div>

<Footer />

<style>
  .main-detail-wrap {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 2.5rem 0 2rem 0;
    background: #fffefa;
  }
  main {
    width: 100%;
    max-width: 540px;
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 6px 24px 0 rgba(255, 140, 0, 0.08);
    padding: 2.2rem 2rem 2.5rem 2rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .buffet-title {
    font-size: 2rem;
    font-weight: 800;
    color: #ff8c00;
    margin-bottom: 1rem;
    text-align: center;
  }
  .buffet-info {
    font-size: 1.08rem;
    color: #555;
    margin-bottom: 1rem;
    width: 100%;
  }
  .menu-section,
  .map-section {
    width: 100%;
    margin-top: 2rem;
    background: #fffcf5;
    border-radius: 12px;
    padding: 1.5rem 1.3rem;
    box-shadow: 0 2px 6px #f2e3d3;
    text-align: center;
  }
  .menu-section {
    margin-bottom: 1rem;
  }
  .menu-img {
    width: 100%;
    max-width: 350px;
    border-radius: 8px;
    margin-bottom: 1rem;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .menu-text {
    font-size: 1.18rem;
    color: #444;
    margin-bottom: 0.2rem;
  }
  .map-section {
    margin-bottom: 0;
  }
  .map-box {
    width: 100%;
    height: 300px;
    border-radius: 12px;
    border: 1px solid #eee;
    margin-top: 0.9rem;
  }
  .error {
    color: #e74c3c;
    font-size: 1.1rem;
    text-align: center;
    margin: 2rem 0;
  }
  @media (max-width: 600px) {
    main {
      max-width: 98vw;
      padding: 1.2rem 0.5rem 1.5rem 0.5rem;
    }
    .menu-section,
    .map-section {
      padding: 1rem 0.5rem;
    }
  }
</style>
