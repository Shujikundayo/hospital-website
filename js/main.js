/**
 * main.js — ナビゲーション・共通JS
 * つおき高橋クリニック
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== ハンバーガーメニュー ===== */
  const hamburger = document.querySelector('.hamburger');
  const globalNav = document.querySelector('.global-nav');

  if (hamburger && globalNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('is-open');
      globalNav.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // ナビリンク クリックでメニューを閉じる
    globalNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-open');
        globalNav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ===== アクティブナビ ===== */
  const currentPath = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.global-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ===== ページトップボタン ===== */
  const pageTopBtn = document.querySelector('.page-top-btn');
  if (pageTopBtn) {
    pageTopBtn.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== スクロール時ヘッダー影 ===== */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 20px rgba(0, 0, 0, 0.12)'
        : '0 2px 12px rgba(0, 0, 0, 0.08)';
    }, { passive: true });
  }

  /* ===== フェードインアニメーション ===== */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

});
