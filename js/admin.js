/**
 * admin.js — 管理画面ロジック
 */

const ADMIN_PASSWORD = 'bunbun';
const SESSION_KEY = 'tsuoki_admin_auth';

const loginScreen  = document.getElementById('login-screen');
const adminScreen  = document.getElementById('admin-screen');
const loginForm    = document.getElementById('login-form');
const loginError   = document.getElementById('login-error');
const passwordInput= document.getElementById('password-input');
const logoutBtn    = document.getElementById('logout-btn');

const newPostBtn   = document.getElementById('new-post-btn');
const postFormWrap = document.getElementById('post-form-wrap');
const postForm     = document.getElementById('post-form');
const formTitle    = document.getElementById('form-title');
const cancelBtn    = document.getElementById('cancel-btn');
const editIdInput  = document.getElementById('edit-id');
const fDate        = document.getElementById('f-date');
const fCategory    = document.getElementById('f-category');
const fTitle       = document.getElementById('f-title');
const fBody        = document.getElementById('f-body');
const postsTbody   = document.getElementById('posts-tbody');
const emptyMsg     = document.getElementById('empty-msg');

const confirmOverlay = document.getElementById('confirm-overlay');
const confirmCancel  = document.getElementById('confirm-cancel');
const confirmDelete  = document.getElementById('confirm-delete');

let pendingDeleteId = null;

// ---- 認証 ----

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

function showAdmin() {
  loginScreen.hidden = true;
  adminScreen.hidden = false;
  renderTable();
}

function showLogin() {
  adminScreen.hidden = true;
  loginScreen.hidden = false;
}

if (isLoggedIn()) {
  showAdmin();
}

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  if (passwordInput.value === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, '1');
    loginError.hidden = true;
    showAdmin();
  } else {
    loginError.hidden = false;
    passwordInput.value = '';
    passwordInput.focus();
  }
});

logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY);
  showLogin();
});

// ---- テーブル描画 ----

const CATEGORY_LABEL = { important: '重要', notice: 'お知らせ', hours: '診療時間' };
const CATEGORY_CLASS = { important: 'badge-important', notice: 'badge-notice', hours: 'badge-hours' };

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${y}年${parseInt(m)}月${parseInt(d)}日`;
}

function renderTable() {
  const posts = getNews().sort((a, b) => b.date.localeCompare(a.date));
  postsTbody.innerHTML = '';

  if (posts.length === 0) {
    emptyMsg.hidden = false;
    return;
  }
  emptyMsg.hidden = true;

  posts.forEach(post => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="col-date">${formatDate(post.date)}</td>
      <td><span class="admin-badge ${CATEGORY_CLASS[post.category] || ''}">${CATEGORY_LABEL[post.category] || post.category}</span></td>
      <td class="col-title">${escapeHtml(post.title)}</td>
      <td class="col-actions">
        <button class="btn-icon btn-edit" data-id="${post.id}" title="編集">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn-icon btn-delete" data-id="${post.id}" title="削除">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    postsTbody.appendChild(tr);
  });

  postsTbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => openEdit(btn.dataset.id));
  });
  postsTbody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => openConfirm(btn.dataset.id));
  });
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ---- フォーム ----

function today() {
  return new Date().toISOString().slice(0, 10);
}

function openNew() {
  formTitle.textContent = '新規投稿';
  editIdInput.value = '';
  fDate.value = today();
  fCategory.value = 'notice';
  fTitle.value = '';
  fBody.value = '';
  postFormWrap.hidden = false;
  fTitle.focus();
  postFormWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openEdit(id) {
  const posts = getNews();
  const post = posts.find(p => p.id === id);
  if (!post) return;
  formTitle.textContent = '投稿を編集';
  editIdInput.value = post.id;
  fDate.value = post.date;
  fCategory.value = post.category;
  fTitle.value = post.title;
  fBody.value = post.body;
  postFormWrap.hidden = false;
  postFormWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeForm() {
  postFormWrap.hidden = true;
  postForm.reset();
}

newPostBtn.addEventListener('click', openNew);
cancelBtn.addEventListener('click', closeForm);

postForm.addEventListener('submit', e => {
  e.preventDefault();
  const posts = getNews();
  const id = editIdInput.value;

  if (id) {
    const idx = posts.findIndex(p => p.id === id);
    if (idx !== -1) {
      posts[idx] = { id, date: fDate.value, category: fCategory.value, title: fTitle.value.trim(), body: fBody.value.trim() };
    }
  } else {
    posts.unshift({ id: generateId(), date: fDate.value, category: fCategory.value, title: fTitle.value.trim(), body: fBody.value.trim() });
  }

  saveNews(posts);
  closeForm();
  renderTable();
});

// ---- 削除確認 ----

function openConfirm(id) {
  pendingDeleteId = id;
  confirmOverlay.hidden = false;
}

confirmCancel.addEventListener('click', () => {
  confirmOverlay.hidden = true;
  pendingDeleteId = null;
});

confirmDelete.addEventListener('click', () => {
  if (!pendingDeleteId) return;
  const posts = getNews().filter(p => p.id !== pendingDeleteId);
  saveNews(posts);
  confirmOverlay.hidden = true;
  pendingDeleteId = null;
  renderTable();
});
