<script>
  export let selectedRegion = '서울';
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
</script>

<div class="region-select-wrap">
  <label for="region-select" class="region-label">지역 선택</label>
  <select id="region-select" bind:value={selectedRegion} class="region-select">
    {#each regions as region}
      <option value={region}>{region}</option>
    {/each}
  </select>
</div>

<style>
  .region-select-wrap {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.2rem;
  }
  .region-label {
    font-weight: 600;
    color: #ff8c00;
    font-size: 1.05rem;
    letter-spacing: 0.5px;
  }
  .region-select {
    appearance: none;
    border: 2px solid #ffd699;
    border-radius: 8px;
    background: #fff8ed
      url("data:image/svg+xml;utf8,<svg fill='orange' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M7 10l5 5 5-5z'/></svg>")
      no-repeat right 0.9rem center/1.1em;
    font-size: 1rem;
    padding: 0.55em 2.3em 0.55em 1em;
    color: #333;
    min-width: 120px;
    outline: none;
    transition: border-color 0.2s;
    cursor: pointer;
  }
  .region-select:focus {
    border-color: #ff8c00;
    box-shadow: 0 0 0 2px #ffefd6;
  }
  .region-select option {
    background: #fff8ed;
  }
</style>
