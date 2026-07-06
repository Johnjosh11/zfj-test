let adminData = getSiteData();

function $(selector) { return document.querySelector(selector); }
function $all(selector) { return [...document.querySelectorAll(selector)]; }

function adminEscape(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function toast(message) {
  const box = $('#admin-toast');
  box.textContent = message;
  box.classList.add('show');
  setTimeout(() => box.classList.remove('show'), 2500);
}

function saveAndRefresh(message = 'Saved') {
  saveSiteData(adminData);
  renderAdmin();
  toast(message);
}

function setupTabs() {
  $all('.admin-tab').forEach(button => {
    button.addEventListener('click', () => {
      $all('.admin-tab').forEach(b => b.classList.remove('active'));
      $all('.admin-section').forEach(s => s.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(button.dataset.tab).classList.add('active');
    });
  });
}

function renderLiveSettings() {
  $('#live-toggle').checked = !!adminData.live.isLive;
  $('#live-label').value = adminData.live.label || '';
  $('#live-url').value = adminData.live.url || '';
  $('#live-form').onsubmit = (event) => {
    event.preventDefault();
    adminData.live.isLive = $('#live-toggle').checked;
    adminData.live.label = $('#live-label').value.trim() || 'Live Service Now';
    adminData.live.url = $('#live-url').value.trim() || '#';
    saveAndRefresh('Live settings saved');
  };
}

function renderSocialSettings() {
  $('#site-name').value = adminData.siteName || '';
  $('#site-tagline').value = adminData.tagline || '';
  $('#twitter-url').value = adminData.social.twitter || '';
  $('#facebook-url').value = adminData.social.facebook || '';
  $('#youtube-url').value = adminData.social.youtube || '';
  $('#site-form').onsubmit = (event) => {
    event.preventDefault();
    adminData.siteName = $('#site-name').value.trim() || 'Zelous for Jesus';
    adminData.tagline = $('#site-tagline').value.trim();
    adminData.social.twitter = $('#twitter-url').value.trim() || '#';
    adminData.social.facebook = $('#facebook-url').value.trim() || '#';
    adminData.social.youtube = $('#youtube-url').value.trim() || '#';
    saveAndRefresh('Site settings saved');
  };
}

function renderEventsAdmin() {
  const tbody = $('#events-table tbody');
  const events = [...adminData.events].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  tbody.innerHTML = events.map(event => `
    <tr>
      <td><strong>${adminEscape(event.title)}</strong><br><span class="help">${adminEscape(event.description)}</span></td>
      <td>${adminEscape(event.date)}<br><span class="help">${adminEscape(event.time)}</span></td>
      <td>${adminEscape(event.location)}</td>
      <td>${event.highlight ? '<span class="badge warning">Yes</span>' : '<span class="badge">No</span>'}</td>
      <td><button class="btn danger small" data-delete-event="${adminEscape(event.id)}">Delete</button></td>
    </tr>`).join('');

  $all('[data-delete-event]').forEach(button => {
    button.onclick = () => {
      adminData.events = adminData.events.filter(e => e.id !== button.dataset.deleteEvent);
      saveAndRefresh('Event deleted');
    };
  });

  $('#event-form').onsubmit = (event) => {
    event.preventDefault();
    const item = {
      id: `event-${Date.now()}`,
      title: $('#event-title').value.trim(),
      date: $('#event-date').value,
      time: $('#event-time').value,
      location: $('#event-location').value.trim(),
      description: $('#event-description').value.trim(),
      highlight: $('#event-highlight').checked
    };
    if (!item.title || !item.date) return;
    if (item.highlight) adminData.events = adminData.events.map(e => ({ ...e, highlight: false }));
    adminData.events.push(item);
    $('#event-form').reset();
    saveAndRefresh('Event added');
  };
}

function renderSermonAdmin() {
  $('#sermon-title').value = adminData.latestSermon.title || '';
  $('#sermon-speaker').value = adminData.latestSermon.speaker || '';
  $('#sermon-date').value = adminData.latestSermon.date || '';
  $('#sermon-url').value = adminData.latestSermon.youtubeUrl || '';
  $('#sermon-description').value = adminData.latestSermon.description || '';
  $('#sermon-form').onsubmit = (event) => {
    event.preventDefault();
    const latest = {
      title: $('#sermon-title').value.trim(),
      speaker: $('#sermon-speaker').value.trim(),
      date: $('#sermon-date').value,
      youtubeUrl: $('#sermon-url').value.trim(),
      description: $('#sermon-description').value.trim()
    };
    adminData.latestSermon = latest;
    const exists = adminData.sermons.some(s => s.title === latest.title && s.date === latest.date);
    if (!exists) adminData.sermons.unshift(latest);
    saveAndRefresh('Latest sermon saved');
  };
}

function renderBibleAdmin() {
  const tbody = $('#resources-table tbody');
  tbody.innerHTML = adminData.bibleResources.map((item, index) => `
    <tr>
      <td><strong>${adminEscape(item.title)}</strong><br><span class="help">${adminEscape(item.description)}</span></td>
      <td>${adminEscape(item.url)}</td>
      <td><button class="btn danger small" data-delete-resource="${index}">Delete</button></td>
    </tr>`).join('');

  $all('[data-delete-resource]').forEach(button => {
    button.onclick = () => {
      adminData.bibleResources.splice(Number(button.dataset.deleteResource), 1);
      saveAndRefresh('Resource deleted');
    };
  });

  $('#resource-form').onsubmit = (event) => {
    event.preventDefault();
    adminData.bibleResources.push({
      title: $('#resource-title').value.trim(),
      description: $('#resource-description').value.trim(),
      url: $('#resource-url').value.trim()
    });
    $('#resource-form').reset();
    saveAndRefresh('Resource added');
  };
}

function getFilteredPrayers() {
  const search = $('#prayer-search').value.toLowerCase();
  const filter = $('#prayer-filter').value;
  const sort = $('#prayer-sort').value;
  let items = getPrayerRequests();
  if (search) {
    items = items.filter(item => [item.name, item.email, item.phone, item.request].some(v => String(v || '').toLowerCase().includes(search)));
  }
  if (filter === 'answered') items = items.filter(item => item.answered);
  if (filter === 'unanswered') items = items.filter(item => !item.answered);
  items.sort((a, b) => sort === 'oldest' ? a.dateTime.localeCompare(b.dateTime) : b.dateTime.localeCompare(a.dateTime));
  return items;
}

function renderPrayersAdmin() {
  const tbody = $('#prayers-table tbody');
  const items = getFilteredPrayers();
  tbody.innerHTML = items.map(item => `
    <tr>
      <td><strong>${adminEscape(item.name)}</strong><br><span class="help">${adminEscape(item.email)}<br>${adminEscape(item.phone)}</span></td>
      <td>${adminEscape(item.request)}</td>
      <td>${new Date(item.dateTime).toLocaleString()}</td>
      <td>${item.answered ? '<span class="badge success">Answered</span>' : '<span class="badge warning">Not answered</span>'}</td>
      <td>
        <button class="btn small soft" data-toggle-prayer="${adminEscape(item.id)}">${item.answered ? 'Mark not answered' : 'Mark answered'}</button>
        <button class="btn danger small" data-delete-prayer="${adminEscape(item.id)}">Delete</button>
      </td>
    </tr>`).join('') || '<tr><td colspan="5">No prayer requests found.</td></tr>';

  $all('[data-toggle-prayer]').forEach(button => {
    button.onclick = () => {
      const all = getPrayerRequests().map(item => item.id === button.dataset.togglePrayer ? { ...item, answered: !item.answered } : item);
      savePrayerRequests(all);
      renderPrayersAdmin();
      toast('Prayer request updated');
    };
  });
  $all('[data-delete-prayer]').forEach(button => {
    button.onclick = () => {
      const all = getPrayerRequests().filter(item => item.id !== button.dataset.deletePrayer);
      savePrayerRequests(all);
      renderPrayersAdmin();
      toast('Prayer request deleted');
    };
  });
}

function setupPrayerTools() {
  ['#prayer-search', '#prayer-filter', '#prayer-sort'].forEach(selector => {
    $(selector).addEventListener('input', renderPrayersAdmin);
  });
  $('#export-prayers').onclick = () => {
    const items = getFilteredPrayers();
    const headers = ['Name', 'Email', 'Phone', 'Prayer Request', 'Date and Time', 'Prayer Answered'];
    const csv = [headers, ...items.map(item => [item.name, item.email, item.phone, item.request, item.dateTime, item.answered ? 'Yes' : 'No'])]
      .map(row => row.map(cell => `"${String(cell || '').replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `prayer-requests-${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
}

function setupReset() {
  $('#reset-site').onclick = () => {
    if (!confirm('Reset all editable website settings back to sample content?')) return;
    localStorage.removeItem(ZFJ_STORAGE_KEY);
    adminData = getSiteData();
    saveAndRefresh('Site reset to sample content');
  };
}

function renderAdmin() {
  adminData = getSiteData();
  renderLiveSettings();
  renderSocialSettings();
  renderEventsAdmin();
  renderSermonAdmin();
  renderBibleAdmin();
  renderPrayersAdmin();
}

setupTabs();
setupPrayerTools();
setupReset();
renderAdmin();
