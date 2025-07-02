<footer>
  <div class="footer-inner">
    <div class="footer-left">
      <!-- <span class="footer-title">Wat밥</span> -->
      <img
        class="logo-img"
        src="/favicon.png"
        alt="Wat밥 로고"
        width="32"
        height="32"
      />
      <span class="footer-copy">&copy; 2025 Wat밥</span>
    </div>
    <div class="footer-right">
      <span class="footer-contact-label"></span>
      <a href="mailto:socra710@naver.com" class="footer-mail">
        <svg
          width="18"
          height="25"
          viewBox="0 0 24 24"
          fill="none"
          style="vertical-align: middle; margin-right: 3px;"
        >
          <rect width="24" height="24" rx="6" fill="#ff8c00" />
          <path d="M5 7h14v10H5z" fill="#fff" />
          <path
            d="M5 7l7 6 7-6"
            stroke="#ff8c00"
            stroke-width="2"
            fill="none"
          />
        </svg>
        문의
      </a>
    </div>
  </div>
</footer>

<style>
  footer {
    margin-top: 2rem;
    background: #eee;
    color: #444;
    font-family: 'Pretendard', 'Noto Sans KR', Arial, sans-serif;
    padding: 1.2rem 1rem 1rem 1rem;
    font-size: 1rem;
    border-radius: 1rem 1rem 0 0;
    box-shadow: 0 -2px 10px 0 #8882;
  }
  .footer-inner {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
  .footer-left {
    display: flex;
    align-items: center;
    gap: 0.7em;
    font-weight: bold;
    font-size: 1.1rem;
  }
  .footer-logo {
    font-size: 1.7em;
    vertical-align: middle;
  }
  .footer-title {
    letter-spacing: 1px;
    font-family: inherit;
  }
  .footer-copy {
    font-size: 0.98em;
    font-weight: normal;
    opacity: 0.7;
    /* margin-left: 0.7em; */
  }
  .footer-right {
    display: flex;
    align-items: center;
    gap: 0.4em;
    font-size: 1em;
  }
  .footer-contact-label {
    color: #888;
    font-weight: 500;
    margin-right: 0.2em;
  }
  .footer-mail {
    display: inline-flex;
    align-items: center;
    color: #ff8c00;
    background: #fff;
    padding: 0.18em 0.7em 0.18em 0.4em;
    border-radius: 7px;
    text-decoration: none;
    font-weight: 500;
    transition:
      background 0.2s,
      color 0.2s;
    box-shadow: 0 1px 4px 0 #8881;
    word-break: break-all;
    font-size: 1em;
  }
  .footer-mail:hover {
    background: #ff8c00;
    color: #fff;
    text-decoration: underline;
  }
</style>
