<script>
  export let rating = 0;
  export let maxRating = 5;
  export let readonly = false;
  export let label = '';
  export let onRatingChange = (rating) => {};

  function handleClick(newRating) {
    if (!readonly) {
      rating = newRating;
      onRatingChange(newRating);
    }
  }

  function handleKeydown(event, newRating) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(newRating);
    }
  }
</script>

<div class="star-rating">
  {#if label}
    <span class="rating-label">{label}</span>
  {/if}
  <div class="stars">
    {#each Array(maxRating) as _, i}
      <button
        class="star"
        class:filled={i < rating}
        class:readonly
        disabled={readonly}
        on:click={() => handleClick(i + 1)}
        on:keydown={(e) => handleKeydown(e, i + 1)}
        aria-label="{label} {i + 1}점"
      >
        ★
      </button>
    {/each}
  </div>
</div>

<style>
  .star-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .rating-label {
    font-weight: 600;
    color: #333;
    min-width: 60px;
  }

  .stars {
    display: flex;
    gap: 0.2rem;
  }

  .star {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #ddd;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
  }

  .star:not(.readonly):hover {
    color: #ffb347;
  }

  .star.filled {
    color: #ff8c00;
  }

  .star.readonly {
    cursor: default;
  }

  .star:disabled {
    cursor: default;
  }
</style>