let adminData = getSiteData();
let editingEventId = null;

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
  $('#instagram-url').value = adminData.social.instagram || '';
  $('#facebook-url').value = adminData.social.facebook || '';
  $('#youtube-url').value = adminData.social.youtube || '';
  $('#site-form').onsubmit = (event) => {
    event.preventDefault();
    adminData.siteName = $('#site-name').value.trim() || 'Zelous for Jesus';
    adminData.tagline = $('#site-tagline').value.trim();
    adminData.social.instagram = $('#instagram-url').value.trim() || '#';
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
      <td><button class="btn soft small" data-edit-event="${adminEscape(event.id)}">Edit</button> <button class="btn danger small" data-delete-event="${adminEscape(event.id)}">Delete</button></td>
    </tr>`).join('');

  $all('[data-edit-event]').forEach(button => {
    button.onclick = () => startEventEdit(button.dataset.editEvent);
  });

  $all('[data-delete-event]').forEach(button => {
    button.onclick = () => {
      adminData.events = adminData.events.filter(e => e.id !== button.dataset.deleteEvent);
      if (editingEventId === button.dataset.deleteEvent) resetEventForm();
      saveAndRefresh('Event deleted');
    };
  });

  $('#event-cancel').onclick = () => resetEventForm();

  const imageFileInput = $('#event-image-file');
  if (imageFileInput) {
    imageFileInput.onchange = () => {
      const file = imageFileInput.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        $('#event-image').value = reader.result;
        renderEventPosterPreview();
      };
      reader.readAsDataURL(file);
    };
  }
  $('#event-image').oninput = renderEventPosterPreview;

  $('#event-form').onsubmit = (event) => {
    event.preventDefault();
    const title = $('#event-title').value.trim();
    const date = $('#event-date').value;
    if (!title || !date) return;
    const highlight = $('#event-highlight').checked;
    if (highlight) adminData.events = adminData.events.map(e => ({ ...e, highlight: false }));
    const values = {
      title,
      date,
      time: $('#event-time').value,
      location: $('#event-location').value.trim(),
      description: $('#event-description').value.trim(),
      image: $('#event-image').value.trim(),
      highlight
    };
    if (editingEventId) {
      adminData.events = adminData.events.map(e => e.id === editingEventId ? { ...e, ...values } : e);
      resetEventForm();
      saveAndRefresh('Event updated');
    } else {
      adminData.events.push({ id: `event-${Date.now()}`, ...values });
      resetEventForm();
      saveAndRefresh('Event added');
    }
  };
}

function renderEventPosterPreview() {
  const preview = $('#event-image-preview');
  if (!preview) return;
  const url = $('#event-image').value.trim();
  preview.innerHTML = url ? `<img src="${adminEscape(url)}" alt="Poster preview">` : '';
}

function startEventEdit(id) {
  const event = adminData.events.find(e => e.id === id);
  if (!event) return;
  editingEventId = id;
  $('#event-title').value = event.title || '';
  $('#event-location').value = event.location || '';
  $('#event-date').value = event.date || '';
  $('#event-time').value = event.time || '';
  $('#event-image').value = event.image || '';
  $('#event-description').value = event.description || '';
  $('#event-highlight').checked = !!event.highlight;
  $('#event-form-title').textContent = 'Edit event';
  $('#event-submit').textContent = 'Update event';
  $('#event-cancel').style.display = '';
  renderEventPosterPreview();
  $('#event-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetEventForm() {
  editingEventId = null;
  $('#event-form').reset();
  $('#event-form-title').textContent = 'Add event';
  $('#event-submit').textContent = 'Add event';
  $('#event-cancel').style.display = 'none';
  renderEventPosterPreview();
}

function renderGalleryAdmin() {
  const tbody = $('#gallery-table tbody');
  if (!tbody) return;
  tbody.innerHTML = adminData.gallery.map((item, index) => `
    <tr>
      <td><img class="admin-thumb" src="${adminEscape(item.image)}" alt="${adminEscape(item.title)}"></td>
      <td>${adminEscape(item.title)}</td>
      <td><span class="help">${String(item.image || '').startsWith('data:') ? 'Uploaded photo' : adminEscape(item.image)}</span></td>
      <td><button class="btn danger small" data-delete-photo="${index}">Delete</button></td>
    </tr>`).join('') || '<tr><td colspan="4">No photos yet.</td></tr>';

  $all('[data-delete-photo]').forEach(button => {
    button.onclick = () => {
      adminData.gallery.splice(Number(button.dataset.deletePhoto), 1);
      saveAndRefresh('Photo deleted');
    };
  });

  $('#gallery-upload').onchange = (event) => {
    const imageFiles = [...event.target.files].filter(file => file.type.startsWith('image/'));
    if (!imageFiles.length) return;
    let pending = imageFiles.length;
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        adminData.gallery.push({ title: file.name.replace(/\.[^.]+$/, ''), image: reader.result });
        pending -= 1;
        if (pending === 0) {
          try { saveAndRefresh('Photos uploaded'); }
          catch (error) { toast('Photos too large to store'); }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  $('#gallery-form').onsubmit = (event) => {
    event.preventDefault();
    const url = $('#gallery-url').value.trim();
    if (!url) return;
    adminData.gallery.push({ title: $('#gallery-title').value.trim() || 'Gallery photo', image: url });
    $('#gallery-form').reset();
    saveAndRefresh('Photo added');
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
  renderGalleryAdmin();
  renderBibleAdmin();
  renderPrayersAdmin();
}

setupTabs();
setupPrayerTools();
setupReset();
renderAdmin();
