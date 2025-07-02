<div class="loading-bar-wrap">
  <div class="spinner"></div>
</div>

<style>
  .loading-bar-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 120px;
  }
  .spinner {
    width: 38px;
    height: 38px;
    border: 4px solid #ffecd2;
    border-top: 4px solid #ff8c00;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
