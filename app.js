const state = {
  roles: [],
  categories: [],
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

function render() {
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
        <span class="badge">${escapeHtml(role.level)}</span>
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
  `;
  els.modal.hidden = false;
  document.body.style.overflow = "hidden";
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
