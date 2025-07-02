<script>
  import { onMount } from 'svelte';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import LoadingBar from '../components/LoadingBar.svelte';
  import RegionSelector from '../components/RegionSelector.svelte';
  import BuffetCard from '../components/BuffetCard.svelte';

  let selectedRegion = '경기';
  let regions = ['서울', '부산', '대구', '광주', '대전'];
  let buffets = [];
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
    } catch (e) {
      error = '데이터를 불러오는 데 실패했습니다.';
    } finally {
      loading = false;
    }
  }

  // 첫 진입시 한번만 호출
  onMount(() => {
    fetchBuffets();
  });

  // 선택된 지역에 맞는 뷔페만 필터
  $: filteredBuffets = buffets.filter((b) => b.region === selectedRegion);

  $: count = filteredBuffets.length;
  $: gridClass =
    count === 1
      ? 'one-card'
      : count === 2
        ? 'two-cards'
        : count === 3
          ? 'three-cards'
          : '';
</script>

<Header />

<main>
  <div class="ad-banner">[광고]</div>

  <h2>오늘의 메뉴(Tood)</h2>
  <RegionSelector bind:selectedRegion {regions} />

  {#if loading}
    <LoadingBar />
  {:else if error}
    <div class="error-msg">{error}</div>
  {:else}
    <div class={'buffet-list ' + gridClass}>
      {#each filteredBuffets as buffet}
        <BuffetCard {buffet} />
      {:else}
        <div class="empty-msg">해당 지역에 등록된 뷔페가 없습니다.</div>
      {/each}
    </div>
  {/if}

  <div class="ad-banner">[광고]</div>
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
</style>
