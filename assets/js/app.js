const data = getSiteData();
const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

function formatDate(dateString, options = { day: '2-digit', month: 'short', year: 'numeric' }) {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, options);
}

function formatTime(timeString) {
  if (!timeString) return '';
  const [h, m] = timeString.split(':');
  const date = new Date();
  date.setHours(Number(h), Number(m || 0));
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function youtubeEmbed(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    let id = '';
    if (parsed.hostname.includes('youtu.be')) id = parsed.pathname.slice(1);
    if (parsed.searchParams.get('v')) id = parsed.searchParams.get('v');
    if (parsed.pathname.includes('/embed/')) id = parsed.pathname.split('/embed/')[1];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  } catch {
    return url;
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function icons(name) {
  const items = {
    twitter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.965 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47h-1.25c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.9h-2.34V22C18.34 21.24 22 17.08 22 12.06Z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.55 3.58 12 3.58 12 3.58s-7.55 0-9.4.5A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.85.5 9.4.5 9.4.5s7.55 0 9.4-.5a3 3 0 0 0 2.1-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z"/></svg>'
  };
  return items[name] || '';
}

function renderCommon() {
  const header = document.getElementById('site-header');
  if (header) {
    const nav = [
      ['index.html', 'Home'],
      ['about.html', 'About us'],
      ['events.html', 'Events'],
      ['ministries.html', 'Ministries'],
      ['sermons.html', 'Sermons'],
      ['bible-resources.html', 'Bible resources'],
      ['gallery.html', 'Gallery'],
      ['contact.html', 'Contact']
    ];
    header.innerHTML = `
      <header class="site-header">
        <div class="container nav-wrap">
          <a class="brand" href="index.html" aria-label="${escapeHtml(data.siteName)} home">
            <span class="brand-mark">ZJ</span>
            <span>${escapeHtml(data.siteName)}</span>
          </a>
          <button class="nav-toggle" aria-label="Open menu" aria-expanded="false">☰</button>
          <nav class="nav-menu" aria-label="Main navigation">
            ${nav.map(([url, label]) => `<a href="${url}" class="${currentPage === url || (currentPage === '' && url === 'index.html') ? 'active' : ''}">${label}</a>`).join('')}
          </nav>
        </div>
      </header>`;
    const toggle = header.querySelector('.nav-toggle');
    const menu = header.querySelector('.nav-menu');
    toggle?.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  const social = document.getElementById('floating-social');
  if (social) {
    social.innerHTML = `
      <div class="floating-social" aria-label="Social media links">
        <a href="${escapeHtml(data.social.twitter)}" target="_blank" rel="noopener" aria-label="Twitter / X">${icons('twitter')}</a>
        <a href="${escapeHtml(data.social.facebook)}" target="_blank" rel="noopener" aria-label="Facebook">${icons('facebook')}</a>
        <a href="${escapeHtml(data.social.youtube)}" target="_blank" rel="noopener" aria-label="YouTube">${icons('youtube')}</a>
      </div>`;
  }

  const live = document.getElementById('live-banner');
  if (live) {
    live.innerHTML = `<a class="live-pill ${data.live.isLive ? 'show' : ''}" href="${escapeHtml(data.live.url)}" target="_blank" rel="noopener"><span class="live-dot"></span>${escapeHtml(data.live.label)}</a>`;
  }

  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div class="brand" style="color:white"><span class="brand-mark">ZJ</span><span>${escapeHtml(data.siteName)}</span></div>
              <p>${escapeHtml(data.tagline)}</p>
              <p><strong>Service:</strong> Sunday 10:30 AM</p>
            </div>
            <div>
              <h3>Quick Links</h3>
              <p><a href="prayer.html">Prayer request</a></p>
              <p><a href="events.html">Upcoming events</a></p>
              <p><a href="sermons.html">Latest sermons</a></p>
            </div>
            <div>
              <h3>Contact</h3>
              <p>Email: hello@zelousforjesus.org</p>
              <p>Phone: +44 0000 000000</p>
              <p>Address: Your church address here</p>
            </div>
          </div>
          <div class="footer-bottom">© <span id="year"></span> ${escapeHtml(data.siteName)}. Built with HTML, CSS and JavaScript.</div>
        </div>
      </footer>`;
    footer.querySelector('#year').textContent = new Date().getFullYear();
  }
}

function renderHero() {
  const el = document.getElementById('hero-slider');
  if (!el) return;
  el.innerHTML = `
    <section class="hero" aria-label="Welcome slider">
      <div class="hero-track">
        ${data.heroSlides.map(slide => `
          <article class="hero-slide">
            <img src="${escapeHtml(slide.image)}" alt="" loading="eager">
            <div class="hero-content">
              <div class="hero-kicker">Welcome</div>
              <h1>${escapeHtml(slide.title)}</h1>
              <p>${escapeHtml(slide.subtitle)}</p>
              <a class="btn" href="${escapeHtml(slide.ctaUrl)}">${escapeHtml(slide.ctaText)}</a>
            </div>
          </article>`).join('')}
      </div>
      <div class="hero-dots"></div>
    </section>`;
  const track = el.querySelector('.hero-track');
  const dots = el.querySelector('.hero-dots');
  let index = 0;
  data.heroSlides.forEach((_, i) => {
    const button = document.createElement('button');
    button.setAttribute('aria-label', `Show slide ${i + 1}`);
    button.addEventListener('click', () => { index = i; update(); });
    dots.appendChild(button);
  });
  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.querySelectorAll('button').forEach((button, i) => button.classList.toggle('active', i === index));
  }
  update();
  setInterval(() => { index = (index + 1) % data.heroSlides.length; update(); }, 5000);
}

function nextEvent() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const future = [...data.events]
    .filter(item => new Date(`${item.date}T00:00:00`) >= today)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  return future.find(e => e.highlight) || future[0] || [...data.events].sort((a,b) => b.date.localeCompare(a.date))[0];
}

function renderUpcomingEvent() {
  const el = document.getElementById('upcoming-event');
  if (!el) return;
  const event = nextEvent();
  if (!event) {
    el.innerHTML = '<p class="center">No upcoming events added yet.</p>';
    return;
  }
  const date = new Date(`${event.date}T00:00:00`);
  el.innerHTML = `
    <section class="section">
      <div class="container">
        <p class="eyebrow center">Next upcoming event</p>
        <h2 class="section-title center">Join us next</h2>
        <div class="event-highlight">
          <div class="event-date"><div><span>${date.toLocaleDateString(undefined, { day: '2-digit' })}</span><small>${date.toLocaleDateString(undefined, { month: 'short' })}</small></div></div>
          <div>
            <h3>${escapeHtml(event.title)}</h3>
            <p>${formatDate(event.date)} ${event.time ? `at ${formatTime(event.time)}` : ''}${event.location ? ` • ${escapeHtml(event.location)}` : ''}</p>
            <p>${escapeHtml(event.description)}</p>
          </div>
          <a class="btn" href="events.html">View events</a>
        </div>
      </div>
    </section>`;
}

function renderPrayerCta() {
  const el = document.getElementById('prayer-cta');
  if (!el) return;
  el.innerHTML = `
    <section class="section section-soft">
      <div class="container">
        <div class="prayer-cta">
          <p class="eyebrow">Prayer request</p>
          <h2 class="section-title">Need Prayer?</h2>
          <p class="section-copy">There are moments when life feels overwhelming. Our prayer volunteers will be happy to lift up your request before God.</p>
          <a class="btn accent" href="prayer.html">Ask for Prayer</a>
        </div>
      </div>
    </section>`;
}

function renderMission() {
  const el = document.getElementById('mission-section');
  if (!el) return;
  const m = data.mission;
  el.innerHTML = `
    <section class="section">
      <div class="container">
        <p class="eyebrow center">${escapeHtml(m.title)}</p>
        <h2 class="section-title center">Our mission is Jesus</h2>
        <p class="section-copy center">Reaching people, serving our community and growing disciples who love God and love people.</p>
        <div class="mission-panel">
          <div class="mission-text">
            <h2>${escapeHtml(m.heading)}</h2>
            <p>${escapeHtml(m.text)}</p>
            <a class="btn secondary" href="${escapeHtml(m.ctaUrl)}">${escapeHtml(m.ctaText)}</a>
          </div>
          <div class="mission-image" style="background-image:url('${escapeHtml(m.image)}')"></div>
        </div>
      </div>
    </section>`;
}

function renderMinistries(limit) {
  const el = document.getElementById('ministries-section');
  if (!el) return;
  const items = limit ? data.ministries.slice(0, limit) : data.ministries;
  el.innerHTML = `
    <section class="section section-soft">
      <div class="container">
        <p class="eyebrow center">Ministries</p>
        <h2 class="section-title center">A place for everyone</h2>
        <p class="section-copy center">Find a ministry where you can belong, grow and serve.</p>
        <div class="grid four-col">
          ${items.map(item => `
            <article class="card">
              <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
              <div class="card-body">
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.intro)}</p>
                <a class="btn soft" href="${escapeHtml(item.page)}">More</a>
              </div>
            </article>`).join('')}
        </div>
      </div>
    </section>`;
}

function renderLatestSermon() {
  const el = document.getElementById('latest-sermon');
  if (!el) return;
  const s = data.latestSermon;
  el.innerHTML = `
    <section class="section">
      <div class="container grid two-col">
        <div>
          <p class="eyebrow">Latest sermon</p>
          <h2 class="section-title">${escapeHtml(s.title)}</h2>
          <p class="section-copy" style="margin-left:0">${escapeHtml(s.description)}</p>
          <p><strong>${escapeHtml(s.speaker)}</strong> • ${formatDate(s.date)}</p>
          <a class="btn" href="sermons.html">More sermons</a>
        </div>
        <div class="sermon-frame">
          <iframe src="${escapeHtml(youtubeEmbed(s.youtubeUrl))}" title="Latest sermon video" allowfullscreen loading="lazy"></iframe>
        </div>
      </div>
    </section>`;
}

function renderBibleResources(limit) {
  const el = document.getElementById('bible-resources-section');
  if (!el) return;
  const items = limit ? data.bibleResources.slice(0, limit) : data.bibleResources;
  el.innerHTML = `
    <section class="section section-soft">
      <div class="container">
        <p class="eyebrow center">Bible resources</p>
        <h2 class="section-title center">Grow in God’s Word</h2>
        <p class="section-copy center">These links open in a new tab so you can keep this website open.</p>
        <div class="grid four-col">
          ${items.map(item => `
            <a class="resource-card" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">
              <span>${escapeHtml(item.title)}</span><span>↗</span>
            </a>`).join('')}
        </div>
      </div>
    </section>`;
}

function renderEventsPage() {
  const el = document.getElementById('events-list');
  if (!el) return;
  const monthFilter = document.getElementById('month-filter');
  const months = [...new Set(data.events.map(e => e.date.slice(0, 7)))].sort();
  monthFilter.innerHTML = '<option value="">All months</option>' + months.map(m => `<option value="${m}">${formatDate(`${m}-01`, { month: 'long', year: 'numeric' })}</option>`).join('');
  function paint() {
    const selected = monthFilter.value;
    const events = data.events
      .filter(e => !selected || e.date.startsWith(selected))
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
    el.innerHTML = events.length ? `<div class="grid three-col">${events.map(event => `
      <article class="card">
        <div class="card-body">
          <span class="badge ${event.highlight ? 'warning' : ''}">${event.highlight ? 'Highlighted' : 'Event'}</span>
          <h3 style="margin-top:12px">${escapeHtml(event.title)}</h3>
          <p><strong>${formatDate(event.date)}</strong>${event.time ? ` • ${formatTime(event.time)}` : ''}</p>
          <p>${event.location ? escapeHtml(event.location) : ''}</p>
          <p>${escapeHtml(event.description)}</p>
        </div>
      </article>`).join('')}</div>` : '<p>No events found for this month.</p>';
  }
  monthFilter.addEventListener('change', paint);
  paint();
}

function renderPrayerForm() {
  const form = document.getElementById('prayer-form');
  if (!form) return;
  const success = document.getElementById('prayer-success');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const request = {
      id: `prayer-${Date.now()}`,
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      request: form.request.value.trim(),
      dateTime: new Date().toISOString(),
      answered: false
    };
    if (!request.name || !request.request) return;
    const existing = getPrayerRequests();
    existing.unshift(request);
    savePrayerRequests(existing);
    form.reset();
    success.classList.add('show');
    window.scrollTo({ top: success.offsetTop - 120, behavior: 'smooth' });
  });
}

function renderSermonsPage() {
  const el = document.getElementById('sermons-list');
  if (!el) return;
  const sermons = [...data.sermons].sort((a, b) => b.date.localeCompare(a.date));
  el.innerHTML = sermons.map((s, index) => `
    <article class="card" style="margin-bottom:26px">
      <div class="grid two-col" style="gap:0">
        <div class="card-body">
          <span class="badge ${index === 0 ? 'success' : ''}">${index === 0 ? 'Latest' : 'Sermon'}</span>
          <h3 style="font-size:1.8rem;margin-top:12px">${escapeHtml(s.title)}</h3>
          <p><strong>${escapeHtml(s.speaker)}</strong> • ${formatDate(s.date)}</p>
          <p>${escapeHtml(s.description)}</p>
          <a class="btn soft" href="${escapeHtml(s.youtubeUrl)}" target="_blank" rel="noopener">Watch on YouTube</a>
        </div>
        <div class="sermon-frame" style="border-radius:0;box-shadow:none;min-height:280px">
          <iframe src="${escapeHtml(youtubeEmbed(s.youtubeUrl))}" title="${escapeHtml(s.title)}" allowfullscreen loading="lazy"></iframe>
        </div>
      </div>
    </article>`).join('');
}

function renderGalleryPage() {
  const el = document.getElementById('gallery-grid');
  if (!el) return;
  el.innerHTML = data.gallery.map(item => `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">`).join('');
}

function renderMinistryDetail() {
  const el = document.getElementById('ministry-detail');
  if (!el) return;
  const id = el.dataset.ministry;
  const item = data.ministries.find(m => m.id === id) || data.ministries[0];
  document.querySelector('[data-ministry-title]').textContent = item.title;
  document.querySelector('[data-ministry-intro]').textContent = item.intro;
  el.innerHTML = `
    <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
    <div>
      <p class="eyebrow">${escapeHtml(item.title)}</p>
      <h2 class="section-title">Grow, serve and belong</h2>
      <p>${escapeHtml(item.intro)}</p>
      <p>This page is ready for your own ministry details. Add the meeting times, team leader name, what visitors can expect, and any photos from your church.</p>
      <p>Sample activities: prayer, Bible study, worship, group discussion, team games, outreach preparation and fellowship.</p>
      <a class="btn" href="contact.html">Contact us</a>
    </div>`;
}

renderCommon();
renderHero();
renderUpcomingEvent();
renderPrayerCta();
renderMission();
renderMinistries(currentPage === 'index.html' ? 4 : null);
renderLatestSermon();
renderBibleResources(currentPage === 'index.html' ? 4 : null);
renderEventsPage();
renderPrayerForm();
renderSermonsPage();
renderGalleryPage();
renderMinistryDetail();
