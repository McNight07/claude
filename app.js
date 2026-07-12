const ICONS = {
  headset: '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/><path d="M19 19v1a3 3 0 0 1-3 3h-2"/>',
  ticket: '<path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><line x1="12" y1="7" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="17"/>',
  report: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2z"/>',
  mobile: '<rect x="7" y="2" width="10" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/>',
  gauge: '<path d="M4 15a8 8 0 1 1 16 0"/><line x1="12" y1="15" x2="16" y2="10"/><circle cx="12" cy="15" r="1"/>',
  network: '<circle cx="6" cy="6" r="2.3"/><circle cx="18" cy="6" r="2.3"/><circle cx="12" cy="18" r="2.3"/><line x1="7.7" y1="7.7" x2="10.5" y2="16"/><line x1="16.3" y1="7.7" x2="13.5" y2="16"/><line x1="8.3" y1="6" x2="15.7" y2="6"/>',
  shield: '<path d="M12 3l7 3v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6z"/><polyline points="9 12 11 14 15 10"/>',
  magnifier: '<circle cx="10.5" cy="10.5" r="6.5"/><line x1="20" y1="20" x2="15.2" y2="15.2"/>',
  alert: '<path d="M12 4 3 20h18z"/><line x1="12" y1="10" x2="12" y2="15"/><circle cx="12" cy="17.5" r="0.6" fill="currentColor" stroke="none"/>',
  chart: '<line x1="4" y1="21" x2="20" y2="21"/><rect x="6" y="13" width="3.4" height="8"/><rect x="10.3" y="8" width="3.4" height="13"/><rect x="14.6" y="4" width="3.4" height="17"/>',
  cloud: '<path d="M7 18a4.5 4.5 0 0 1-1-8.9A5.5 5.5 0 0 1 16.6 8 4 4 0 0 1 17 16H7z"/>',
  server: '<rect x="4" y="4" width="16" height="6" rx="1.5"/><rect x="4" y="14" width="16" height="6" rx="1.5"/><circle cx="7.5" cy="7" r="0.6" fill="currentColor" stroke="none"/><circle cx="7.5" cy="17" r="0.6" fill="currentColor" stroke="none"/>',
  code: '<polyline points="9 8 4 12 9 16"/><polyline points="15 8 20 12 15 16"/>',
  database: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  rocket: '<path d="M12 2c3 2 4.5 5.5 4.5 9.5S13.5 20 12 22c-1.5-2-4.5-6-4.5-10.5S9 4 12 2z"/><circle cx="12" cy="11" r="1.6"/><path d="M8.5 16 5 18l1-4"/><path d="M15.5 16 19 18l-1-4"/>',
  people: '<circle cx="8.5" cy="8" r="2.6"/><circle cx="16" cy="9" r="2.2"/><path d="M3.5 19c.5-3 2.4-5 5-5s4.5 2 5 5"/><path d="M13.5 14.3c2 .2 3.5 2 4 4.7"/>',
  whiteboard: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><line x1="12" y1="16" x2="12" y2="20"/><line x1="8" y1="20" x2="16" y2="20"/><polyline points="6 12 10 8 13 10.5 18 6"/>',
};

function iconSvg(name) {
  const inner = ICONS[name] || ICONS.report;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

const state = {
  roles: [],
  categories: [],
  majorDetails: {},
  activeCategory: "all",
  activeLevel: "all",
  sortBy: "title",
  query: "",
};

const els = {
  search: document.getElementById("search-input"),
  tabs: document.getElementById("category-tabs"),
  level: document.getElementById("level-filter"),
  sort: document.getElementById("sort-select"),
  majorOverview: document.getElementById("major-overview"),
  results: document.getElementById("results"),
  count: document.getElementById("result-count"),
  noResults: document.getElementById("no-results"),
  modal: document.getElementById("detail-modal"),
  modalBody: document.getElementById("modal-body"),
};

init();

async function init() {
  const res = await fetch("data/job-roles.json");
  const data = await res.json();
  state.roles = data.roles;
  state.categories = data.categories;
  state.majorDetails = data.majorDetails || {};

  renderTabs();
  bindEvents();
  render();
}

function renderTabs() {
  els.tabs.innerHTML = "";
  state.categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "category-tab";
    btn.textContent = cat.name;
    btn.dataset.id = cat.id;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", cat.id === state.activeCategory ? "true" : "false");
    btn.addEventListener("click", () => {
      state.activeCategory = cat.id;
      [...els.tabs.children].forEach((c) =>
        c.setAttribute("aria-selected", c.dataset.id === cat.id ? "true" : "false")
      );
      render();
    });
    els.tabs.appendChild(btn);
  });
}

function bindEvents() {
  els.search.addEventListener("input", (e) => {
    state.query = e.target.value.trim().toLowerCase();
    render();
  });
  els.level.addEventListener("change", (e) => {
    state.activeLevel = e.target.value;
    render();
  });
  els.sort.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    render();
  });
  els.modal.addEventListener("click", (e) => {
    if (e.target.dataset.close !== undefined) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function salaryFloor(range) {
  const match = range.match(/\$([\d]+)K/);
  return match ? parseInt(match[1], 10) : 0;
}

function getFiltered() {
  let list = state.roles.filter((role) => {
    const matchesCategory = state.activeCategory === "all" || role.category === state.activeCategory;
    const matchesLevel = state.activeLevel === "all" || role.level === state.activeLevel;
    const haystack = [role.title, role.description, ...(role.skills || []), ...(role.certifications || [])]
      .join(" ")
      .toLowerCase();
    const matchesQuery = state.query === "" || haystack.includes(state.query);
    return matchesCategory && matchesLevel && matchesQuery;
  });

  if (state.sortBy === "title") {
    list = list.slice().sort((a, b) => a.title.localeCompare(b.title));
  } else if (state.sortBy === "salary") {
    list = list.slice().sort((a, b) => salaryFloor(b.salaryRange) - salaryFloor(a.salaryRange));
  }
  return list;
}

function categoryName(id) {
  return state.categories.find((c) => c.id === id)?.name || id;
}

function levelBadgeClass(level) {
  if (level === "Entry Level") return "badge--entry";
  if (level === "Mid Level") return "badge--mid";
  if (level === "Senior Level") return "badge--senior";
  return "";
}

function render() {
  renderMajorOverview();

  const filtered = getFiltered();
  els.results.innerHTML = "";
  els.count.textContent = `${filtered.length} job role${filtered.length === 1 ? "" : "s"} found`;
  els.noResults.hidden = filtered.length !== 0;

  filtered.forEach((role) => {
    const card = document.createElement("button");
    card.className = "role-card";
    card.innerHTML = `
      <div class="role-card-top">
        <h3 class="role-title">${escapeHtml(role.title)}</h3>
        <span class="badge ${levelBadgeClass(role.level)}">${escapeHtml(role.level)}</span>
      </div>
      <span class="role-category">${escapeHtml(categoryName(role.category))}</span>
      <p class="role-desc">${escapeHtml(role.description)}</p>
      <div class="role-meta">
        <span>Salary: <strong>${escapeHtml(role.salaryRange)}</strong></span>
      </div>
    `;
    card.addEventListener("click", () => openModal(role));
    els.results.appendChild(card);
  });
}

function renderMajorOverview() {
  const details = state.majorDetails[state.activeCategory];
  if (!details) {
    els.majorOverview.hidden = true;
    els.majorOverview.innerHTML = "";
    return;
  }

  let programTotal = 0;
  let yearTotal = 0;
  let yearNum = 1;
  const rows = [];

  details.semesterCosts.forEach((cost, idx) => {
    const semesterNum = idx + 1;
    rows.push(`<tr><td>Semester ${semesterNum}</td><td>${formatCurrency(cost)}</td></tr>`);
    programTotal += cost;
    yearTotal += cost;

    const isYearEnd = semesterNum % details.semestersPerYear === 0;
    const isLastSemester = semesterNum === details.semesterCosts.length;
    if (isYearEnd || isLastSemester) {
      rows.push(
        `<tr class="year-subtotal"><td>Year ${yearNum} annual subtotal</td><td>${formatCurrency(yearTotal)}</td></tr>`
      );
      yearNum += 1;
      yearTotal = 0;
    }
  });

  rows.push(`<tr class="program-total"><td>Program total</td><td>${formatCurrency(programTotal)}</td></tr>`);

  els.majorOverview.innerHTML = `
    <div class="major-overview-header">
      <h2 class="major-overview-title">${escapeHtml(categoryName(state.activeCategory))} Pathway</h2>
      <span class="major-duration">Duration: ${escapeHtml(details.duration)}</span>
    </div>
    <div class="major-overview-grid">
      <div>
        <div class="section-label">Required Certifications</div>
        <ul class="major-list">
          ${details.certifications.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}
        </ul>
        <div class="section-label">Required Courses</div>
        <ul class="major-list">
          ${details.courses.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}
        </ul>
      </div>
      <div>
        <div class="section-label">Estimated Tuition</div>
        <div class="cost-table-wrap">
          <table class="cost-table">
            <thead><tr><th>Term</th><th>Cost</th></tr></thead>
            <tbody>${rows.join("")}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  els.majorOverview.hidden = false;
}

function formatCurrency(amount) {
  return `$${amount.toLocaleString("en-US")}`;
}

function openModal(role) {
  els.modalBody.innerHTML = `
    <h2 id="modal-title">${escapeHtml(role.title)}</h2>
    <span class="role-category">${escapeHtml(categoryName(role.category))} &middot; ${escapeHtml(role.level)}</span>
    <p class="role-desc">${escapeHtml(role.description)}</p>
    <div class="detail-grid">
      <div><span>Salary Range</span>${escapeHtml(role.salaryRange)}</div>
      <div><span>Growth Outlook</span>${escapeHtml(role.growthOutlook)}</div>
    </div>
    <div class="section-label">Related Certifications</div>
    <div class="chip-list">
      ${(role.certifications || []).map((c) => `<span class="chip">${escapeHtml(c)}</span>`).join("")}
    </div>
    <div class="section-label">Key Skills</div>
    <div class="chip-list">
      ${(role.skills || []).map((s) => `<span class="chip">${escapeHtml(s)}</span>`).join("")}
    </div>
    ${renderDayInLife(role)}
  `;
  els.modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function renderDayInLife(role) {
  const moments = role.dayInLife || [];
  if (moments.length === 0) return "";

  const cards = moments
    .map(
      (m) => `
        <div class="day-card">
          <div class="day-card-picture">${iconSvg(m.icon)}</div>
          <span class="day-card-time">${escapeHtml(m.time)}</span>
          <h4 class="day-card-title">${escapeHtml(m.title)}</h4>
          <p class="day-card-text">${escapeHtml(m.text)}</p>
        </div>
      `
    )
    .join("");

  return `
    <div class="section-label">A Day in the Life</div>
    <div class="day-in-life-grid">${cards}</div>
  `;
}

function closeModal() {
  els.modal.hidden = true;
  document.body.style.overflow = "";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
