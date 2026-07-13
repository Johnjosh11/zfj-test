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
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.52.01-4.76.07-.9.04-1.38.19-1.7.32-.43.16-.73.36-1.06.68-.32.33-.52.63-.68 1.06-.13.32-.28.8-.32 1.7C3.21 8.48 3.2 8.85 3.2 12s.01 3.52.07 4.76c.04.9.19 1.38.32 1.7.16.43.36.73.68 1.06.33.32.63.52 1.06.68.32.13.8.28 1.7.32 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c.9-.04 1.38-.19 1.7-.32.43-.16.73-.36 1.06-.68.32-.33.52-.63.68-1.06.13-.32.28-.8.32-1.7.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.04-.9-.19-1.38-.32-1.7a2.86 2.86 0 0 0-.68-1.06 2.86 2.86 0 0 0-1.06-.68c-.32-.13-.8-.28-1.7-.32C15.52 4.01 15.15 4 12 4Zm0 3.06A4.94 4.94 0 1 1 7.06 12 4.94 4.94 0 0 1 12 7.06Zm0 8.14A3.2 3.2 0 1 0 8.8 12 3.2 3.2 0 0 0 12 15.2Zm6.28-8.34a1.15 1.15 0 1 1-1.15-1.15 1.15 1.15 0 0 1 1.15 1.15Z"/></svg>',
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
        <a class="soc soc-instagram" href="${escapeHtml(data.social.instagram)}" target="_blank" rel="noopener" aria-label="Instagram">${icons('instagram')}</a>
        <a class="soc soc-youtube" href="${escapeHtml(data.social.youtube)}" target="_blank" rel="noopener" aria-label="YouTube">${icons('youtube')}</a>
        <a class="soc soc-facebook" href="${escapeHtml(data.social.facebook)}" target="_blank" rel="noopener" aria-label="Facebook">${icons('facebook')}</a>
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
        <div class="event-highlight ${event.image ? 'has-poster' : ''}">
          <div class="event-main">
            <div class="event-date"><div><span>${date.toLocaleDateString(undefined, { day: '2-digit' })}</span><small>${date.toLocaleDateString(undefined, { month: 'short' })}</small></div></div>
            <div class="event-info">
              <h3>${escapeHtml(event.title)}</h3>
              <p>${formatDate(event.date)} ${event.time ? `at ${formatTime(event.time)}` : ''}${event.location ? ` • ${escapeHtml(event.location)}` : ''}</p>
              <p>${escapeHtml(event.description)}</p>
              <a class="btn" href="events.html">View events</a>
            </div>
          </div>
          ${event.image ? `<div class="event-poster"><img src="${escapeHtml(event.image)}" alt="${escapeHtml(event.title)} poster" loading="lazy"></div>` : ''}
        </div>
      </div>
    </section>`;
}

function renderMonthEvents() {
  const el = document.getElementById('month-events');
  if (!el) return;
  const weekdayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function monthLabel(month) {
    return formatDate(`${month}-01`, { month: 'long', year: 'numeric' });
  }

  // Build the list of selectable months from events, plus the current month.
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const months = [...new Set([...data.events.map(e => e.date.slice(0, 7)), currentMonth])].sort();
  // Default to the current month if it has events, otherwise the next upcoming
  // month with events, otherwise the latest month that has events.
  const monthsWithEvents = new Set(data.events.map(e => e.date.slice(0, 7)));
  let selectedMonth = monthsWithEvents.has(currentMonth)
    ? currentMonth
    : (months.filter(m => m >= currentMonth && monthsWithEvents.has(m))[0]
      || [...monthsWithEvents].sort().pop()
      || currentMonth);

  el.innerHTML = `
    <section class="section month-events">
      <div class="container">
        <div class="month-events-head">
          <h2 class="month-events-title">Events for the Month:</h2>
          <div class="month-select" id="month-select">
            <button class="month-select-btn" type="button" aria-haspopup="listbox" aria-expanded="false">
              <span class="month-select-label"></span>
              <span class="month-select-caret" aria-hidden="true">▾</span>
            </button>
            <div class="month-select-panel" role="listbox" hidden>
              <input class="month-select-search" type="text" placeholder="Search" aria-label="Search months">
              <div class="month-select-options"></div>
            </div>
          </div>
        </div>
        <div class="month-calendar" id="month-calendar"></div>
      </div>
    </section>`;

  const selectRoot = el.querySelector('#month-select');
  const button = selectRoot.querySelector('.month-select-btn');
  const label = selectRoot.querySelector('.month-select-label');
  const panel = selectRoot.querySelector('.month-select-panel');
  const search = selectRoot.querySelector('.month-select-search');
  const optionsWrap = selectRoot.querySelector('.month-select-options');
  const calendar = el.querySelector('#month-calendar');

  function paintOptions(filter = '') {
    const term = filter.trim().toLowerCase();
    const visible = months.filter(m => monthLabel(m).toLowerCase().includes(term));
    optionsWrap.innerHTML = visible.length
      ? visible.map(m => `<button type="button" class="month-select-option ${m === selectedMonth ? 'active' : ''}" role="option" data-month="${m}">${escapeHtml(monthLabel(m))}</button>`).join('')
      : '<div class="month-select-empty">No months found</div>';
    optionsWrap.querySelectorAll('[data-month]').forEach(option => {
      option.addEventListener('click', () => {
        selectedMonth = option.dataset.month;
        closePanel();
        paintCalendar();
      });
    });
  }

  function paintCalendar() {
    label.textContent = monthLabel(selectedMonth);
    const today = new Date();
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const [year, month] = selectedMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstWeekday = new Date(year, month - 1, 1).getDay();

    const headRow = weekdayShort
      .map(name => `<div class="mc-head-cell">${name}</div>`)
      .join('');

    const cells = [];
    // Leading blanks so the 1st lands under the correct weekday.
    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push('<div class="mc-cell is-empty"></div>');
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const weekday = new Date(year, month - 1, day).getDay();
      const iso = `${selectedMonth}-${String(day).padStart(2, '0')}`;
      const dayEvents = data.events
        .filter(e => e.date === iso)
        .sort((a, b) => `${a.time}`.localeCompare(`${b.time}`));
      cells.push(`
        <div class="mc-cell ${weekday === 0 || weekday === 6 ? 'is-weekend' : ''} ${iso === todayIso ? 'is-today' : ''} ${dayEvents.length ? 'has-events' : ''}">
          <span class="mc-daynum">${day}</span>
          <div class="mc-events">
            ${dayEvents.map(event => `
              <div class="mc-event ${event.highlight ? 'is-highlight' : ''}" title="${escapeHtml(event.title)}${event.time ? ` at ${escapeHtml(formatTime(event.time))}` : ''}${event.location ? ` • ${escapeHtml(event.location)}` : ''}">
                <span class="mc-event-title">${escapeHtml(event.title)}</span>
                ${event.time ? `<span class="mc-event-time">${escapeHtml(formatTime(event.time))}</span>` : ''}
              </div>`).join('')}
          </div>
        </div>`);
    }
    // Trailing blanks so the final week is a full row.
    while (cells.length % 7 !== 0) {
      cells.push('<div class="mc-cell is-empty"></div>');
    }
    calendar.innerHTML = `<div class="mc-head">${headRow}</div><div class="mc-grid">${cells.join('')}</div>`;
  }

  function openPanel() {
    panel.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    search.value = '';
    paintOptions();
    search.focus();
  }
  function closePanel() {
    panel.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  }

  button.addEventListener('click', () => {
    if (panel.hidden) openPanel(); else closePanel();
  });
  search.addEventListener('input', () => paintOptions(search.value));
  document.addEventListener('click', (event) => {
    if (!selectRoot.contains(event.target)) closePanel();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closePanel();
  });

  paintCalendar();
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

function renderHomeGallery() {
  const el = document.getElementById('home-gallery');
  if (!el) return;
  const items = getSiteData().gallery || [];
  if (!items.length) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <section class="section section-soft">
      <div class="container">
        <p class="eyebrow center">Gallery</p>
        <h2 class="section-title center">Moments from our church family</h2>
        <p class="section-copy center">A glimpse of worship, fellowship, outreach and celebration.</p>
        <div class="gallery-carousel">
          <button class="gallery-arrow prev" type="button" aria-label="Previous photo">‹</button>
          <div class="gallery-scroll">
            ${items.map(item => `
              <figure class="gallery-slide">
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy">
                <figcaption>${escapeHtml(item.title)}</figcaption>
              </figure>`).join('')}
          </div>
          <button class="gallery-arrow next" type="button" aria-label="Next photo">›</button>
        </div>
        <div class="center" style="margin-top:26px"><a class="btn" href="gallery.html">More photos</a></div>
      </div>
    </section>`;

  const scroller = el.querySelector('.gallery-scroll');
  const prev = el.querySelector('.gallery-arrow.prev');
  const next = el.querySelector('.gallery-arrow.next');

  function step() {
    const slide = scroller.querySelector('.gallery-slide');
    return slide ? slide.getBoundingClientRect().width + 18 : scroller.clientWidth;
  }
  function scrollByStep(direction) {
    const atEnd = Math.ceil(scroller.scrollLeft + scroller.clientWidth) >= scroller.scrollWidth - 2;
    if (direction > 0 && atEnd) {
      scroller.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (direction < 0 && scroller.scrollLeft <= 2) {
      scroller.scrollTo({ left: scroller.scrollWidth, behavior: 'smooth' });
    } else {
      scroller.scrollBy({ left: direction * step(), behavior: 'smooth' });
    }
  }

  prev.addEventListener('click', () => { scrollByStep(-1); restart(); });
  next.addEventListener('click', () => { scrollByStep(1); restart(); });

  let timer = null;
  function start() { timer = setInterval(() => scrollByStep(1), 5000); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function restart() { stop(); start(); }
  const carousel = el.querySelector('.gallery-carousel');
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  start();
}

function renderGalleryPage() {
  const el = document.getElementById('gallery-grid');
  if (!el) return;
  const input = document.getElementById('gallery-file');

  function paint() {
    const items = getSiteData().gallery || [];
    el.innerHTML = items.length
      ? items.map((item, index) => `
        <figure class="gallery-item">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
          <figcaption>${escapeHtml(item.title)}</figcaption>
          <button class="gallery-remove" type="button" data-remove-photo="${index}" aria-label="Remove photo">&times;</button>
        </figure>`).join('')
      : '<p>No photos yet. Use the upload box above to add your church photos.</p>';
    el.querySelectorAll('[data-remove-photo]').forEach(button => {
      button.addEventListener('click', () => {
        const current = getSiteData();
        current.gallery.splice(Number(button.dataset.removePhoto), 1);
        saveSiteData(current);
        paint();
      });
    });
  }

  if (input) {
    input.addEventListener('change', () => {
      const imageFiles = [...input.files].filter(file => file.type.startsWith('image/'));
      if (!imageFiles.length) return;
      let pending = imageFiles.length;
      const current = getSiteData();
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          current.gallery.push({ title: file.name.replace(/\.[^.]+$/, ''), image: reader.result });
          pending -= 1;
          if (pending === 0) {
            try {
              saveSiteData(current);
            } catch (error) {
              alert('These photos are too large to store in the browser. Try smaller images or fewer at a time, or use the admin page to add online photo links instead.');
            }
            input.value = '';
            paint();
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }

  paint();
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
renderMonthEvents();
renderPrayerCta();
renderMission();
renderMinistries(currentPage === 'index.html' ? 4 : null);
renderLatestSermon();
renderBibleResources(currentPage === 'index.html' ? 4 : null);
renderHomeGallery();
renderEventsPage();
renderPrayerForm();
renderSermonsPage();
renderGalleryPage();
renderMinistryDetail();
