<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Header from '../../../../components/Header.svelte';
  import Footer from '../../../../components/Footer.svelte';

  export let data;
  let { buffet } = data;

  let title = '';
  let content = '';
  let imageFile = null;
  let imagePreview = '';
  let isSubmitting = false;
  let contentTextarea;

  function insertText(before, after) {
    if (!contentTextarea) return;
    
    const start = contentTextarea.selectionStart;
    const end = contentTextarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    content = newText;
    
    // Set cursor position after insertion
    setTimeout(() => {
      contentTextarea.focus();
      contentTextarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  }

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
    
    if (!content.trim()) {
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

      const response = await fetch('/api/menu/register', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        alert('메뉴가 성공적으로 등록되었습니다.');
        goto('/'); // 메인 페이지로 이동
      } else {
        alert(result.message || '메뉴 등록에 실패했습니다.');
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
        <div class="editor-toolbar">
          <button type="button" class="toolbar-btn" on:click={() => insertText('**', '**')}>
            <strong>B</strong>
          </button>
          <button type="button" class="toolbar-btn" on:click={() => insertText('*', '*')}>
            <em>I</em>
          </button>
          <button type="button" class="toolbar-btn" on:click={() => insertText('~~', '~~')}>
            <s>S</s>
          </button>
          <button type="button" class="toolbar-btn" on:click={() => insertText('\n- ', '')}>
            • 목록
          </button>
          <button type="button" class="toolbar-btn" on:click={() => insertText('\n1. ', '')}>
            1. 번호
          </button>
        </div>
        <textarea
          id="content"
          bind:value={content}
          bind:this={contentTextarea}
          placeholder="메뉴에 대한 설명을 입력하세요&#10;&#10;**굵게**, *기울임*, ~~취소선~~, 목록 등을 사용할 수 있습니다."
          required
          rows="10"
        ></textarea>
        <div class="editor-help">
          <small>간단한 서식을 사용할 수 있습니다. 도구 모음의 버튼을 클릭하거나 직접 입력하세요.</small>
        </div>
      </div>

      <div class="form-group">
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
      </div>

      <div class="form-actions">
        <button type="button" class="cancel-btn" on:click={handleCancel}>
          취소
        </button>
        <button type="submit" class="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? '등록 중...' : '등록'}
        </button>
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
    gap: 0.5rem;
  }

  .form-group label {
    font-weight: bold;
    color: #333;
  }

  .form-group input,
  .form-group textarea {
    padding: 0.75rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #ff8c00;
  }

  .form-group textarea {
    resize: vertical;
    min-height: 120px;
    font-family: 'Courier New', monospace;
  }

  .editor-toolbar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    background: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 8px 8px 0 0;
    border-bottom: none;
  }

  .toolbar-btn {
    padding: 0.25rem 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .toolbar-btn:hover {
    background: #e9ecef;
    border-color: #adb5bd;
  }

  .toolbar-btn:active {
    background: #dee2e6;
  }

  .editor-help {
    margin-top: 0.5rem;
  }

  .editor-help small {
    color: #6c757d;
    font-style: italic;
  }

  .form-group:has(.editor-toolbar) textarea {
    border-radius: 0 0 8px 8px;
    border-top: none;
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