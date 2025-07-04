<script lang="ts">
  import Header from '../../../components/Header.svelte';
  import Footer from '../../../components/Footer.svelte';
  import StarRating from '../../../components/StarRating.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  export let data;
  let buffet = data.buffet;

  let mapContainer: HTMLDivElement | null = null;
  let map: any = null;
  let user: any = null;
  let reviews: any[] = [];
  let newReview = {
    tasteRating: 0,
    priceRating: 0,
    serviceRating: 0,
    comment: '',
  };
  let isSubmitting = false;

  $: id = +$page.params.id;

  async function checkUser() {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        user = await res.json();
      }
    } catch (e) {
      console.error('Failed to check user:', e);
    }
  }

  async function fetchReviews() {
    try {
      const res = await fetch(`/api/reviews/${id}`);
      if (res.ok) {
        const result = await res.json();
        reviews = result.reviews || [];
      }
    } catch (e) {
      console.error('Failed to fetch reviews:', e);
    }
  }

  async function submitReview() {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (
      newReview.tasteRating === 0 ||
      newReview.priceRating === 0 ||
      newReview.serviceRating === 0
    ) {
      alert('모든 항목에 점수를 매겨주세요.');
      return;
    }

    if (!newReview.comment.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    isSubmitting = true;
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buffetId: id,
          tasteRating: newReview.tasteRating,
          priceRating: newReview.priceRating,
          serviceRating: newReview.serviceRating,
          comment: newReview.comment,
        }),
      });

      if (res.ok) {
        alert('리뷰가 등록되었습니다.');
        newReview = {
          tasteRating: 0,
          priceRating: 0,
          serviceRating: 0,
          comment: '',
        };
        await fetchReviews();
      } else {
        const error = await res.json();
        alert(error.message || '리뷰 등록에 실패했습니다.');
      }
    } catch (e) {
      console.error('Failed to submit review:', e);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    } finally {
      isSubmitting = false;
    }
  }

  function loadKakaoMapScript(callback) {
    const scriptId = 'kakao-map-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_REST_JAVASCRIPT_KEY}&autoload=false`;
      script.onload = callback;
      document.head.appendChild(script);
    } else {
      if (window.kakao && window.kakao.maps) callback();
      else
        document.getElementById(scriptId)!.addEventListener('load', callback);
    }
  }

  onMount(() => {
    checkUser();
    fetchReviews();

    if (buffet && mapContainer) {
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

            map = new window.kakao.maps.Map(mapContainer, {
              center: new window.kakao.maps.LatLng(lat, lng),
              level: 3,
            });
            new window.kakao.maps.Marker({
              map,
              position: new window.kakao.maps.LatLng(lat, lng),
            });
          });
        }
      });
    }
  });
</script>

<svelte:head>
  <title>{buffet.name}</title>
  <meta
    name="description"
    content="{buffet.name} 를 한눈에! 오늘 뭐 먹지? 고민은 Wat밥에서 해결하세요."
  />
  <meta property="og:title" content="{buffet.name} - 왓밥" />
  <meta
    property="og:description"
    content="{buffet.name} 를 한눈에! 오늘 뭐 먹지? 고민은 Wat밥에서 해결하세요."
  />
  <!-- 필요시 추가적인 meta 태그 -->
</svelte:head>

<Header />

<div class="main-detail-wrap">
  <main>
    <h1 class="buffet-title">{buffet.name}</h1>
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
      {#if buffet.todayMenuImage}
        <img
          class="menu-img"
          src={buffet.todayMenuImage}
          alt="오늘의 메뉴 사진"
        />
      {/if}
      <div class="ql-snow">
        <div class="ql-editor">
          {@html buffet.todayMenuText}
        </div>
      </div>
    </section>
    <section class="map-section">
      <h3>위치 지도</h3>
      <div bind:this={mapContainer} class="map-box"></div>
    </section>

    <!-- 리뷰 섹션 -->
    <section class="reviews-section">
      <h3>리뷰</h3>

      {#if user}
        <div class="review-form">
          <h4>리뷰 작성</h4>
          <div class="rating-container">
            <StarRating
              label="맛"
              bind:rating={newReview.tasteRating}
              onRatingChange={(rating) => (newReview.tasteRating = rating)}
            />
            <StarRating
              label="가격"
              bind:rating={newReview.priceRating}
              onRatingChange={(rating) => (newReview.priceRating = rating)}
            />
            <StarRating
              label="친절"
              bind:rating={newReview.serviceRating}
              onRatingChange={(rating) => (newReview.serviceRating = rating)}
            />
          </div>

          <textarea
            bind:value={newReview.comment}
            placeholder="리뷰를 작성해주세요..."
            maxlength="500"
            rows="4"
          ></textarea>

          <button
            class="submit-review-btn"
            on:click={submitReview}
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '리뷰 등록'}
          </button>
        </div>
      {:else}
        <p class="login-message">리뷰를 작성하려면 로그인이 필요합니다.</p>
      {/if}

      <div class="reviews-list">
        {#each reviews as review}
          <div class="review-item">
            <div class="review-header">
              <div class="reviewer-info">
                <img
                  src={review.userPicture}
                  alt="프로필"
                  class="reviewer-avatar"
                />
                <span class="reviewer-name">{review.userName}</span>
              </div>
              <span class="review-date"
                >{new Date(review.createdAt).toLocaleDateString()}</span
              >
            </div>

            <div class="review-ratings">
              <StarRating
                label="맛"
                rating={review.tasteRating}
                readonly={true}
              />
              <StarRating
                label="가격"
                rating={review.priceRating}
                readonly={true}
              />
              <StarRating
                label="친절"
                rating={review.serviceRating}
                readonly={true}
              />
            </div>

            <p class="review-comment">{review.comment}</p>
          </div>
        {:else}
          <p class="no-reviews">
            아직 리뷰가 없습니다. 첫 번째 리뷰를 남겨주세요!
          </p>
        {/each}
      </div>
    </section>
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
    /* background: #fffcf5; */
    border-radius: 12px;
    padding: 1.5rem 1.3rem;
    box-shadow: 0 2px 6px #f2e3d3;
    /* text-align: center; */
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
  .map-section {
    margin-bottom: 2rem;
  }
  .map-box {
    width: 100%;
    height: 300px;
    border-radius: 12px;
    border: 1px solid #eee;
    margin-top: 0.9rem;
  }

  /* 리뷰 섹션 스타일 */
  .reviews-section {
    width: 100%;
    margin-top: 2rem;
    border-radius: 12px;
    padding: 1.5rem 1.3rem;
    box-shadow: 0 2px 6px #f2e3d3;
  }

  .review-form {
    background: #f9f9f9;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
  }

  .review-form h4 {
    margin-bottom: 1rem;
    color: #333;
  }

  .rating-container {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 1rem;
  }

  .review-form textarea {
    width: 100%;
    padding: 0.8rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    resize: vertical;
    box-sizing: border-box;
    margin-bottom: 1rem;
  }

  .review-form textarea:focus {
    outline: none;
    border-color: #ff8c00;
  }

  .submit-review-btn {
    background: #ff8c00;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .submit-review-btn:hover:not(:disabled) {
    background: #e67e00;
  }

  .submit-review-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .login-message {
    text-align: center;
    color: #666;
    padding: 2rem;
    background: #f9f9f9;
    border-radius: 12px;
    margin-bottom: 2rem;
  }

  .reviews-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .review-item {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .reviewer-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .reviewer-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .reviewer-name {
    font-weight: 600;
    color: #333;
  }

  .review-date {
    color: #666;
    font-size: 0.9rem;
  }

  .review-ratings {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .review-comment {
    color: #333;
    line-height: 1.6;
    margin: 0;
  }

  .no-reviews {
    text-align: center;
    color: #666;
    padding: 2rem;
    background: #f9f9f9;
    border-radius: 12px;
  }
  @media (max-width: 600px) {
    main {
      max-width: 98vw;
      padding: 1.2rem 0.2rem 1.5rem 0.2rem;
    }
    .menu-section,
    .map-section,
    .reviews-section {
      padding: 1rem 0.2rem;
    }

    .rating-container {
      gap: 0.6rem;
    }

    .review-form {
      padding: 1rem;
    }

    .review-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .review-ratings {
      gap: 0.3rem;
    }
  }
</style>
