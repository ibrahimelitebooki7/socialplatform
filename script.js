(() => {
  const nav = document.getElementById('site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const grid = document.getElementById('user-posts');
  const form = document.getElementById('post-form');
  const KEY = 'xroga-blog-posts-v1';

  toggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  function showHome() {
    document.querySelectorAll('.post-full').forEach((el) => el.classList.add('hidden'));
    document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' });
  }

  document.querySelectorAll('[data-home]').forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault();
    showHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }));

  document.querySelectorAll('a[href^="#post-"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')?.slice(1);
      if (!id) return;
      e.preventDefault();
      document.querySelectorAll('.post-full').forEach((el) => el.classList.add('hidden'));
      document.getElementById(id)?.classList.remove('hidden');
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-back]').forEach((btn) => {
    btn.addEventListener('click', showHome);
  });

  function loadPosts() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  }
  function savePosts(posts) {
    localStorage.setItem(KEY, JSON.stringify(posts));
  }
  function renderUserPosts() {
    if (!grid) return;
    const posts = loadPosts();
    grid.innerHTML = posts.map((p, i) => `
      <article class="post-card">
        <div class="post-meta"><span class="tag">Yours</span><time>${p.date}</time></div>
        <h3>${p.title}</h3>
        <p>${p.body}</p>
        <button type="button" class="read-more" data-del="${i}">Delete</button>
      </article>`).join('');
    grid.querySelectorAll('[data-del]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-del'));
        const next = loadPosts().filter((_, i) => i !== idx);
        savePosts(next);
        renderUserPosts();
      });
    });
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const title = String(fd.get('title') || '').trim();
    const body = String(fd.get('body') || '').trim();
    if (!title || !body) return;
    const posts = loadPosts();
    posts.unshift({ title, body, date: new Date().toLocaleDateString() });
    savePosts(posts);
    form.reset();
    renderUserPosts();
    document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' });
  });

  renderUserPosts();
})();