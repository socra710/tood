<script>
  import { onMount } from 'svelte';
  
  let quill;
  let quillElem;
  let uploadStatus = '';

  async function handleQuillImageUpload(file) {
    try {
      uploadStatus = 'Uploading...';
      const formData = new FormData();
      formData.append('image', file);

      // This would normally go to /api/upload/image
      // For demonstration, we'll simulate the response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful upload
      const mockImageUrl = URL.createObjectURL(file);
      
      // Insert the image into the Quill editor
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      quill.insertEmbed(index, 'image', mockImageUrl);
      
      // Move cursor to after the image
      quill.setSelection(index + 1);
      
      uploadStatus = 'Image uploaded successfully!';
      setTimeout(() => uploadStatus = '', 3000);
    } catch (error) {
      console.error('Image upload error:', error);
      uploadStatus = 'Upload failed!';
      setTimeout(() => uploadStatus = '', 3000);
    }
  }

  onMount(() => {
    quill = new Quill(quillElem, {
      theme: 'snow',
      placeholder: 'Try clicking the image button to upload an image...',
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['image'],
          ['clean'],
        ],
      },
    });

    // Configure image upload handler
    quill.getModule('toolbar').addHandler('image', function() {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = function() {
        const file = input.files[0];
        if (file) {
          handleQuillImageUpload(file);
        }
      };
    });
  });
</script>

<svelte:head>
  <title>Image Upload Test - Wat밥</title>
</svelte:head>

<div class="container">
  <h1>Image Upload Test</h1>
  <p>This page demonstrates the image upload functionality for the Quill editor.</p>
  
  {#if uploadStatus}
    <div class="status-message" class:success={uploadStatus.includes('success')} class:error={uploadStatus.includes('failed')}>
      {uploadStatus}
    </div>
  {/if}
  
  <div class="editor-container">
    <div bind:this={quillElem} style="height: 400px;"></div>
  </div>
  
  <div class="info">
    <h2>How it works:</h2>
    <ol>
      <li>Click the image button in the toolbar above</li>
      <li>Select an image file from your device</li>
      <li>The image will be uploaded to the server</li>
      <li>The image URL will be inserted into the editor</li>
    </ol>
    
    <h2>Technical Details:</h2>
    <ul>
      <li><strong>Frontend:</strong> SvelteKit API endpoint at <code>/api/upload/image</code></li>
      <li><strong>Backend:</strong> Java servlet at <code>/upload/image</code></li>
      <li><strong>File Types:</strong> JPEG, PNG, GIF, WEBP</li>
      <li><strong>Max Size:</strong> 10MB</li>
      <li><strong>Security:</strong> Authentication required, file validation</li>
    </ul>
  </div>
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  h1 {
    color: #ff8c00;
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .editor-container {
    margin: 2rem 0;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .status-message {
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 4px;
    text-align: center;
    font-weight: bold;
  }
  
  .success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  .error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  .info {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    margin-top: 2rem;
  }
  
  .info h2 {
    color: #333;
    margin-top: 0;
  }
  
  .info ul, .info ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
  
  .info li {
    margin: 0.5rem 0;
  }
  
  code {
    background: #e9ecef;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
  }
</style>