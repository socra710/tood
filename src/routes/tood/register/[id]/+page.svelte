<script>
  import { goto } from '$app/navigation';
  import { onMount, onDestroy } from 'svelte';
  import Header from '../../../../components/Header.svelte';
  import Footer from '../../../../components/Footer.svelte';

  export let data;
  let { buffet } = data;

  let title = '';
  let content = '';
  let imageFile = null;
  let imagePreview = '';
  let isSubmitting = false;

  let quill;
  let quillElem;

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      imageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit() {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    // Quill에서 content 받아오기
    content = quill ? quill.root.innerHTML : content;
    if (!content.trim() || content === '<p><br></p>') {
      alert('내용을 입력해주세요.');
      return;
    }

    isSubmitting = true;
    try {
      const formData = new FormData();
      formData.append('buffetId', buffet.id);
      formData.append('title', title);
      formData.append('content', content);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/menu/register`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();
      if (result.success !== 'true') {
        alert(result.message || '메뉴 등록에 실패했습니다.');
      } else {
        alert('메뉴가 성공적으로 등록되었습니다.');
        goto('/');
      }
    } catch (error) {
      alert('메뉴 등록 중 오류가 발생했습니다.');
    } finally {
      isSubmitting = false;
    }
  }

  function handleCancel() {
    goto('/');
  }

  onMount(async () => {
    let user = null;
    const res = await fetch('/api/me');
    if (res.ok) {
      user = await res.json();
    }

    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      goto('/');
      return;
    }

    quill = new Quill(quillElem, {
      theme: 'snow',
      placeholder: '이미지, 서식 등 다양한 입력이 가능합니다.',
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }], // Adds alignment options (left, center, right, justify)
          ['image'],
          ['clean'],
        ],
      },
    });
  });

  onDestroy(() => {
    quill = null;
  });
</script>

<svelte:head>
  <title>{buffet.name} - 메뉴 등록</title>
  <meta name="description" content="{buffet.name}의 오늘 메뉴를 등록하세요." />
</svelte:head>

<Header />

<div class="main-register-wrap">
  <main>
    <h1 class="page-title">메뉴 등록</h1>
    <div class="buffet-info">
      <h2>{buffet.name}</h2>
      <p>{buffet.location}</p>
    </div>
    <form on:submit|preventDefault={handleSubmit} class="register-form">
      <div class="form-group">
        <label for="title">제목</label>
        <input
          type="text"
          id="title"
          bind:value={title}
          placeholder="오늘의 메뉴 제목을 입력하세요"
          required
          maxlength="100"
        />
      </div>
      <div class="form-group">
        <label for="content">내용</label>
        <div bind:this={quillElem} style="height: 300px;"></div>
      </div>
      <!-- <div class="form-group">
        <label for="image">사진 업로드</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          on:change={handleImageChange}
        />
        {#if imagePreview}
          <div class="image-preview">
            <img src={imagePreview} alt="미리보기" />
          </div>
        {/if}
      </div> -->
      <div class="form-actions">
        <button type="submit" class="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? '등록 중...' : '등록'}
        </button>
        <button type="button" class="cancel-btn" on:click={handleCancel}
          >취소</button
        >
      </div>
    </form>
  </main>
</div>

<Footer />

<style>
  .main-register-wrap {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 2.5rem 1rem 2rem 1rem;
    background: #fffefa;
  }
  main {
    width: 100%;
    max-width: 600px;
    background: #fff;
    border-radius: 18px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  .page-title {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  .buffet-info {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    text-align: center;
  }
  .buffet-info h2 {
    color: #ff8c00;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  .buffet-info p {
    color: #666;
    margin: 0;
  }
  .register-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    /* gap: 0.5rem; */
  }
  .form-group label {
    font-weight: bold;
    color: #333;
    margin-bottom: 0.5rem;
  }
  .form-group input {
    padding: 0.75rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }
  .form-group input:focus {
    outline: none;
    border-color: #ff8c00;
  }
  .image-preview {
    margin-top: 1rem;
  }
  .image-preview img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
    border: 2px solid #ddd;
  }
  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
  }
  .cancel-btn,
  .submit-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
  }
  .cancel-btn {
    background: #6c757d;
    color: white;
  }
  .cancel-btn:hover {
    background: #5a6268;
  }
  .submit-btn {
    background: #ff8c00;
    color: white;
  }
  .submit-btn:hover:not(:disabled) {
    background: #e67e00;
  }
  .submit-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  @media (max-width: 768px) {
    .main-register-wrap {
      padding: 1rem;
    }
    main {
      padding: 1.5rem;
    }
    .page-title {
      font-size: 1.5rem;
    }
    .form-actions {
      flex-direction: column;
    }
    .cancel-btn,
    .submit-btn {
      width: 100%;
    }
  }
</style>
