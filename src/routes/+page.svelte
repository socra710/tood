<script>
  import { onMount } from 'svelte';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import LoadingBar from '../components/LoadingBar.svelte';
  import RegionSelector from '../components/RegionSelector.svelte';
  import BuffetCard from '../components/BuffetCard.svelte';

  let selectedRegion = '경기';
  let regions = [
    '서울',
    '부산',
    '대구',
    '광주',
    '대전',
    '울산',
    '인천',
    '경기',
    '강원',
    '충청',
    '전라',
    '경상',
    '제주',
  ];
  let searchTerm = '';
  let buffets = [];
  let reviewStats = {}; // Store review statistics
  let loading = false;
  let error = '';

  // API에서 뷔페 리스트 가져오기
  async function fetchBuffets() {
    loading = true;
    error = '';
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/buffets`);
      if (!res.ok) throw new Error('API 요청 실패');
      const result = await res.json(); // ← Java에서 보낸 JSON을 바로 파싱

      if (result.success !== 'true') {
        throw new Error(result.message || '알 수 없는 에러');
      }
      buffets = result.data; // 리스트는 result.data에 배열로 들어 있음
      
      // Fetch review statistics
      await fetchReviewStats();
    } catch (e) {
      error = '데이터를 불러오는 데 실패했습니다.';
    } finally {
      loading = false;
    }
  }

  // 리뷰 통계 가져오기
  async function fetchReviewStats() {
    try {
      const res = await fetch('/api/reviews/stats');
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          reviewStats = result.stats;
        }
      }
    } catch (e) {
      console.error('Failed to fetch review stats:', e);
    }
  }

  function toSimpleRegion(apiRegion) {
    // 앞 2글자만 반환 (예: "경기도" → "경기", "부산광역시" → "부산")
    return apiRegion?.slice(0, 2) || '';
  }

  // 첫 진입시 한번만 호출
  onMount(() => {
    fetchBuffets();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
              {
                headers: {
                  Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
                },
              }
            );
            const data = await res.json();
            const regionName = toSimpleRegion(
              data.documents[0]?.region_1depth_name
            );
            if (regions.includes(regionName)) {
              selectedRegion = regionName;
            }
          } catch (e) {}
        },
        (err) => {}
      );
    }
  });

  // 선택된 지역 및 검색에 맞는 뷔페만 필터하고 평점 높은 순으로 정렬
  $: filteredBuffets = buffets
    .filter((b) => b.region === selectedRegion)
    .filter((b) => b.name && b.name.includes(searchTerm))
    .sort((a, b) => {
      // 평점 높은 순으로 정렬
      const ratingA = reviewStats[a.id]?.overallRating || 0;
      const ratingB = reviewStats[b.id]?.overallRating || 0;
      return ratingB - ratingA;
    });

  $: count = filteredBuffets.length;
  $: gridClass =
    count === 1
      ? 'one-card'
      : count === 2
        ? 'two-cards'
        : count === 3
          ? 'three-cards'
          : 'three-cards';
</script>

<Header />

<main>
  <div class="ad-banner">[광고 문의]</div>

  <h1>오늘의 메뉴</h1>
  <RegionSelector bind:selectedRegion {regions} />

  <div class="search-box">
    <input
      type="text"
      placeholder="이름으로 검색"
      bind:value={searchTerm}
      maxlength="32"
    />
  </div>

  {#if loading}
    <LoadingBar />
  {:else if error}
    <div class="error-msg">{error}</div>
  {:else}
    <div class={'buffet-list ' + gridClass}>
      {#each filteredBuffets as buffet}
        <BuffetCard {buffet} reviewStats={reviewStats[buffet.id]} />
      {:else}
        <div class="empty-msg">해당 지역에 등록된 뷔페가 없습니다.</div>
      {/each}
    </div>
  {/if}

  <div class="ad-banner">[광고 문의]</div>
</main>

<Footer />

<style>
  main {
    max-width: 900px;
    margin: 0 auto;
  }
  .buffet-list {
    width: 100%;
    margin-top: 1.5rem;
    display: grid;
    gap: 1.2rem;
    justify-items: center;
  }
  .buffet-list.one-card {
    grid-template-columns: 1fr;
    max-width: none;
  }
  .buffet-list.one-card > * {
    width: 100%;
    max-width: 100%;
  }
  .buffet-list.two-cards,
  .buffet-list.three-cards {
    grid-template-columns: 1fr 1fr;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }
  .buffet-list.three-cards > :nth-child(3) {
    grid-column: 1 / span 2;
    justify-self: center;
    max-width: 400px;
    width: 100%;
  }
  @media (max-width: 600px) {
    .buffet-list,
    .buffet-list.one-card,
    .buffet-list.two-cards,
    .buffet-list.three-cards {
      grid-template-columns: 1fr !important;
      max-width: none;
    }
    .buffet-list > * {
      width: 100% !important;
      max-width: 100% !important;
    }
    .buffet-list.three-cards > :nth-child(3) {
      grid-column: auto;
      justify-self: stretch;
    }
  }
  .ad-banner {
    margin: 2rem 0;
    padding: 1rem;
    background: #faf3e2;
    text-align: center;
    border-radius: 8px;
    color: #ff8c00;
  }
  .loading-msg,
  .error-msg,
  .empty-msg {
    text-align: center;
    margin: 2rem 0;
    font-size: 1.1rem;
    color: #555;
  }
  .error-msg {
    color: #e44;
  }

  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2rem 0;
  }
  .spinner {
    width: 48px;
    height: 48px;
    border: 6px solid #ffe3b3;
    border-top: 6px solid #ff8c00;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .loading-text {
    color: #ff8c00;
    font-weight: 500;
    font-size: 1.1rem;
    letter-spacing: 1px;
  }

  .search-box {
    margin: 1.2rem 0 0.3rem 0;
    text-align: right;
  }
  .search-box input[type='text'] {
    padding: 0.5em 1em;
    border: 1.5px solid #ff8c00;
    border-radius: 8px;
    font-size: 1rem;
    width: 220px;
    max-width: 98%;
    box-sizing: border-box;
    outline: none;
    transition: border 0.2s;
  }
  .search-box input[type='text']:focus {
    border-color: #ffb347;
    background: #fff9f1;
  }
  @media (max-width: 600px) {
    .search-box {
      text-align: center;
    }
    .search-box input[type='text'] {
      width: 98%;
    }
  }
</style>
