<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  export let buffet;

  let user = null;

  onMount(async () => {
    // 예시: 쿠키나 API(/api/me 등)로 로그인 정보 불러오기
    const res = await fetch('/api/me');
    if (res.ok) {
      user = await res.json();
    }
  });
</script>

<div class="buffet-card">
  <div class="top-row">
    <div class="img-box">
      <img
        src={buffet.image}
        alt="{buffet.name} 썸네일"
        width="64"
        height="64"
      />
    </div>
    <div class="name-and-btn">
      <div class="name-btn-row">
        <span class="name">{buffet.name}</span>
        {#if buffet.hasTodayMenu === '1'}
          <button
            class="view-btn"
            on:click={() => goto(`/tood/${buffet.todayMenuId}`)}>보기</button
          >
        {:else if user}
          <!-- 로그인된 경우에만 등록 버튼 노출 -->
          <button
            class="register-btn"
            on:click={() => goto(`/tood/register/${buffet.id}`)}
          >
            등록
          </button>
        {/if}
      </div>
      <div class="location-price-row">
        <span class="location">{buffet.location}</span>
        {#if buffet.pricePerMeal}
          <span class="price-info">
            | <span class="price"
              >{parseInt(buffet.pricePerMeal, 10).toLocaleString()}</span
            >원
          </span>
        {/if}
      </div>
      <div class="strength">{buffet.strength}</div>
    </div>
  </div>
</div>

<style>
  .buffet-card {
    border: 1px solid #eee;
    border-radius: 12px;
    background: #fff;
    padding: 1.2rem 1rem;
    min-width: 240px;
    max-width: 380px;
    width: 100%;
    text-align: left;
    box-shadow: 0 2px 8px #eee;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .top-row {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 1.1rem;
  }
  .img-box {
    width: 64px;
    height: 64px;
    border-radius: 10px;
    overflow: hidden;
    background: #fafafa;
    border: 1px solid #eee;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .img-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .name-and-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .name-btn-row {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin-bottom: 0.2rem;
  }
  .name {
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
  }
  .view-btn {
    background: #ff8c00;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 0.97rem;
    padding: 0.2rem 0.85rem;
    font-weight: bold;
    cursor: pointer;
  }

  .register-btn {
    background: #f7f7f7;
    color: #ff8c00;
    border: 1px solid #f7f7f7;
    border-radius: 8px;
    font-size: 0.97rem;
    padding: 0.2rem 0.85rem;
    font-weight: bold;
    cursor: pointer;
    transition:
      background 0.18s,
      color 0.18s;
  }
  .register-btn:hover:not(:disabled) {
    background: #ffe0b2;
    color: #e67e00;
  }
  .register-btn:disabled {
    background: #f2ede7;
    color: #bbb;
    cursor: not-allowed;
  }

  .location {
    color: #555;
    font-size: 0.98rem;
    margin-bottom: 0.08rem;
  }
  .strength {
    font-size: 0.98rem;
    color: #23754e;
  }

  .location-price-row {
    display: flex;
    align-items: center;
    gap: 0.8em;
    margin-top: 2px;
    margin-bottom: 2px;
  }
  .price-info {
    font-size: 0.97em;
    color: #1976d2;
  }
  .price {
    font-weight: bold;
    margin-left: 0.5em;
  }
</style>
