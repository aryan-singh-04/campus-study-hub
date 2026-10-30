/*
  Campus Study Hub — frontend-only demo.
  To add content: edit STUDY_DATA below and put the matching PDF inside /pdfs/.
  No backend or database is used.
*/
const STUDY_DATA = [
  {
    name: "Engineering & Technology",
    icon: "⚙",
    courses: [
      {
        name: "MCA",
        semesters: [
          { name: "Semester 1", subjects: [
            { name: "Database Management Systems (DBMS)", resources: {
              papers: [{ title: "DBMS Previous Year Paper — Sample", year: "2025", file: "pdfs/question-papers/dbms-sample.pdf" }],
              important: [{ title: "DBMS Important Questions — Sample", detail: "Unit-wise revision questions", file: "pdfs/important-questions/dbms-important-sample.pdf" }],
              notes: [{ title: "DBMS Study Notes — Sample", detail: "Introduction, keys and normalization", file: "pdfs/notes/dbms-notes-sample.pdf" }]
            }},
            { name: "Programming in C", resources: {
              papers: [{ title: "Programming in C Question Paper — Sample", year: "2025", file: "pdfs/question-papers/c-programming-sample.pdf" }],
              important: [{ title: "C Programming Important Questions — Sample", detail: "Basics, loops, arrays and functions", file: "pdfs/important-questions/c-programming-important-sample.pdf" }],
              notes: [{ title: "C Programming Notes — Sample", detail: "Basic syntax and programming concepts", file: "pdfs/notes/c-programming-notes-sample.pdf" }]
            }},
            { name: "Operating Systems", resources: {
              papers: [{ title: "Operating Systems Question Paper — Sample", year: "2025", file: "pdfs/question-papers/os-sample.pdf" }],
              important: [{ title: "Operating Systems Important Questions — Sample", detail: "Processes, scheduling and memory", file: "pdfs/important-questions/os-important-sample.pdf" }],
              notes: [{ title: "Operating Systems Notes — Sample", detail: "Processes and memory management", file: "pdfs/notes/os-notes-sample.pdf" }]
            }}
          ]},
          { name: "Semester 2", subjects: [
            { name: "Data Structures", resources: { papers: [], important: [], notes: [] } },
            { name: "Computer Networks", resources: { papers: [], important: [], notes: [] } },
            { name: "Object-Oriented Programming", resources: { papers: [], important: [], notes: [] } }
          ]}
        ]
      },
      {
        name: "B.Tech",
        semesters: [
          { name: "Semester 1", subjects: [
            { name: "Engineering Mathematics", resources: { papers: [], important: [], notes: [] } },
            { name: "Fundamentals of Computing", resources: { papers: [], important: [], notes: [] } }
          ]},
          { name: "Semester 2", subjects: [
            { name: "Data Structures", resources: { papers: [], important: [], notes: [] } },
            { name: "Digital Electronics", resources: { papers: [], important: [], notes: [] } }
          ]}
        ]
      }
    ]
  },
  {
    name: "Computer Applications",
    icon: "💻",
    courses: [
      {
        name: "BCA",
        semesters: [
          { name: "Semester 1", subjects: [
            { name: "Computer Fundamentals", resources: { papers: [], important: [], notes: [] } },
            { name: "Programming in C", resources: { papers: [], important: [], notes: [] } }
          ]},
          { name: "Semester 2", subjects: [
            { name: "Data Structures", resources: { papers: [], important: [], notes: [] } },
            { name: "Web Development Basics", resources: { papers: [], important: [], notes: [] } }
          ]}
        ]
      }
    ]
  },
  {
    name: "Management",
    icon: "📊",
    courses: [
      {
        name: "MBA",
        semesters: [
          { name: "Semester 1", subjects: [
            { name: "Principles of Management", resources: { papers: [], important: [], notes: [] } },
            { name: "Business Communication", resources: { papers: [], important: [], notes: [] } }
          ]},
          { name: "Semester 2", subjects: [
            { name: "Marketing Management", resources: { papers: [], important: [], notes: [] } },
            { name: "Financial Management", resources: { papers: [], important: [], notes: [] } }
          ]}
        ]
      }
    ]
  }
];

const SECTION_INFO = {
  papers: { title: "Question Papers", eyebrow: "PRACTICE WITH PAST PAPERS", singular: "question paper", icon: "📄" },
  important: { title: "Important Questions & Topics", eyebrow: "FOCUS YOUR REVISION", singular: "important resource", icon: "🎯" },
  notes: { title: "Study Notes", eyebrow: "LEARN AT YOUR PACE", singular: "study note", icon: "📘" }
};

const state = { section: null, department: null, course: null, semester: null, subject: null, search: "" };
const $ = (selector) => document.querySelector(selector);
const resourceSection = $("#resources");
const browseSection = $("#browseSection");
const browseContent = $("#browseContent");
const breadcrumbs = $("#breadcrumbs");
const searchInput = $("#searchInput");
const resultCount = $("#resultCount");
let toastTimer;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function getSelectedDepartment() { return STUDY_DATA[state.department]; }
function getSelectedCourse() { return getSelectedDepartment()?.courses[state.course]; }
function getSelectedSemester() { return getSelectedCourse()?.semesters[state.semester]; }
function getSelectedSubject() { return getSelectedSemester()?.subjects[state.subject]; }

function openSection(section) {
  state.section = section;
  state.department = state.course = state.semester = state.subject = null;
  state.search = "";
  searchInput.value = "";
  $("#clearSearch").hidden = true;
  browseSection.hidden = false;
  $("#browseTitle").textContent = SECTION_INFO[section].title;
  $("#browseEyebrow").textContent = SECTION_INFO[section].eyebrow;
  render();
  // Scroll directly to the resource browser so users see the selected section immediately.
  requestAnimationFrame(() => browseSection.scrollIntoView({ behavior: "smooth", block: "start" }));
}
function goHome() {
  state.section = null;
  state.department = state.course = state.semester = state.subject = null;
  state.search = "";
  browseSection.hidden = true;
  searchInput.value = "";
  resourceSection.scrollIntoView({ behavior: "smooth", block: "start" });
}
function setLevel(level, index = null) {
  if (level === "department") { state.department = index; state.course = state.semester = state.subject = null; }
  if (level === "course") { state.course = index; state.semester = state.subject = null; }
  if (level === "semester") { state.semester = index; state.subject = null; }
  if (level === "subject") { state.subject = index; }
  state.search = "";
  searchInput.value = "";
  $("#clearSearch").hidden = true;
  render();
}
function getBreadcrumbItems() {
  const items = [{ label: "Home", level: "home" }];
  if (!state.section) return items;
  items.push({ label: SECTION_INFO[state.section].title, level: "section" });
  if (state.department !== null) items.push({ label: getSelectedDepartment().name, level: "department" });
  if (state.course !== null) items.push({ label: getSelectedCourse().name, level: "course" });
  if (state.semester !== null) items.push({ label: getSelectedSemester().name, level: "semester" });
  if (state.subject !== null) items.push({ label: getSelectedSubject().name, level: "subject" });
  return items;
}
function renderBreadcrumbs() {
  breadcrumbs.innerHTML = getBreadcrumbItems().map((item, i, arr) => {
    const isLast = i === arr.length - 1;
    const label = escapeHtml(item.label);
    const crumb = isLast
      ? `<span aria-current="page">${label}</span>`
      : `<button data-crumb="${item.level}">${label}</button>`;
    return `${i ? '<span class="crumb-sep">/</span>' : ""}${crumb}`;
  }).join("");
}
function renderChoiceCards(items, type) {
  if (!items.length) return renderEmpty("No matches found", "Try another search term.");
  const icons = type === "department" ? ["🏛", "💻", "📊", "🔬", "📐"] :
    type === "course" ? ["🎓", "📚", "🧑‍💻", "📈"] :
    type === "semester" ? ["1", "2", "3", "4", "5", "6", "7", "8"] : ["📖", "🧠", "📝", "💡"];
  return `<div class="choice-grid">${items.map(({ item, index }) => `
    <button class="choice-card ${type === "subject" ? "subject-card" : ""}" data-level="${type}" data-index="${index}">
      <span class="choice-icon">${type === "department" ? escapeHtml(item.icon || icons[index % icons.length]) : icons[index % icons.length]}</span>
      <span class="choice-copy"><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(type === "department" ? `${item.courses.length} course${item.courses.length === 1 ? "" : "s"}` : type === "course" ? `${item.semesters.length} semester${item.semesters.length === 1 ? "" : "s"}` : type === "semester" ? `${item.subjects.length} subjects` : "View available resources")}</small></span>
      <span class="choice-arrow">›</span>
    </button>`).join("")}</div>`;
}
function renderEmpty(title, message) {
  return `<div class="empty-state"><div class="empty-emoji">🔎</div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(message)}</p></div>`;
}
function renderResourceList(subject) {
  const resources = subject.resources?.[state.section] || [];
  if (!resources.length) {
    return renderEmpty("Resources coming soon", `No ${SECTION_INFO[state.section].singular}s have been added for this subject yet. Add a PDF in script.js to make it available here.`);
  }
  return `<div class="resource-list">${resources.map((item) => `
    <article class="resource-row">
      <div class="pdf-icon">PDF</div>
      <div class="resource-meta"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.year || item.detail || "PDF document")} · PDF file</small></div>
      <div class="resource-actions">
        <a class="small-btn" href="${escapeHtml(item.file)}" target="_blank" rel="noopener">Preview</a>
        <a class="small-btn primary" href="${escapeHtml(item.file)}" download>Download ↓</a>
      </div>
    </article>`).join("")}</div>`;
}
function renderSearchResults() {
  const query = state.search.trim().toLowerCase();
  const matches = [];
  STUDY_DATA.forEach((department, di) => department.courses.forEach((course, ci) =>
    course.semesters.forEach((semester, si) => semester.subjects.forEach((subject, subi) => {
      const haystack = [department.name, course.name, semester.name, subject.name].join(" ").toLowerCase();
      const available = (subject.resources?.[state.section] || []).length;
      if (haystack.includes(query)) matches.push({ department, course, semester, subject, di, ci, si, subi, available });
    }))
  ));
  resultCount.textContent = `${matches.length} subject${matches.length === 1 ? "" : "s"} found`;
  if (!matches.length) { browseContent.innerHTML = renderEmpty("No results found", "Try searching for MCA, BCA, Semester 1, DBMS, or another subject."); return; }
  browseContent.innerHTML = `<p class="content-intro">Matching subjects in ${escapeHtml(SECTION_INFO[state.section].title)}. Select a result to open its resources.</p><div class="choice-grid">${matches.map(m => `
    <button class="choice-card subject-card" data-search-subject="${m.di},${m.ci},${m.si},${m.subi}">
      <span class="choice-icon">📘</span><span class="choice-copy"><strong>${escapeHtml(m.subject.name)}</strong><small>${escapeHtml(m.department.name)} · ${escapeHtml(m.course.name)} · ${escapeHtml(m.semester.name)} · ${m.available} resource(s)</small></span><span class="choice-arrow">›</span>
    </button>`).join("")}</div>`;
}
function render() {
  renderBreadcrumbs();
  if (!state.section) return;
  if (state.search.trim()) { renderSearchResults(); return; }
  const intro = (text) => `<p class="content-intro">${text}</p>`;
  if (state.department === null) {
    const items = STUDY_DATA.map((item, index) => ({ item, index })).filter(({ item }) => item.name.toLowerCase().includes(state.search.toLowerCase()));
    resultCount.textContent = `${items.length} department${items.length === 1 ? "" : "s"}`;
    browseContent.innerHTML = intro("Choose your department to continue.") + renderChoiceCards(items, "department");
  } else if (state.course === null) {
    const d = getSelectedDepartment();
    resultCount.textContent = `${d.courses.length} course${d.courses.length === 1 ? "" : "s"}`;
    browseContent.innerHTML = intro(`Courses available in ${escapeHtml(d.name)}.`) + renderChoiceCards(d.courses.map((item, index) => ({ item, index })), "course");
  } else if (state.semester === null) {
    const c = getSelectedCourse();
    resultCount.textContent = `${c.semesters.length} semester${c.semesters.length === 1 ? "" : "s"}`;
    browseContent.innerHTML = intro(`Choose a semester in ${escapeHtml(c.name)}.`) + renderChoiceCards(c.semesters.map((item, index) => ({ item, index })), "semester");
  } else if (state.subject === null) {
    const s = getSelectedSemester();
    resultCount.textContent = `${s.subjects.length} subject${s.subjects.length === 1 ? "" : "s"}`;
    browseContent.innerHTML = intro(`Select a subject to view ${escapeHtml(SECTION_INFO[state.section].title.toLowerCase())}.`) + renderChoiceCards(s.subjects.map((item, index) => ({ item, index })), "subject");
  } else {
    const subject = getSelectedSubject();
    const resources = subject.resources?.[state.section] || [];
    resultCount.textContent = `${resources.length} resource${resources.length === 1 ? "" : "s"}`;
    browseContent.innerHTML = intro(`Available ${escapeHtml(SECTION_INFO[state.section].title.toLowerCase())} for ${escapeHtml(subject.name)}.`) + renderResourceList(subject);
  }
}

document.querySelectorAll("[data-section]").forEach(button => button.addEventListener("click", () => openSection(button.dataset.section)));
$("#backHome").addEventListener("click", goHome);
$("#brandHome").addEventListener("click", (event) => { event.preventDefault(); goHome(); window.scrollTo({ top: 0, behavior: "smooth" }); });
const menuToggle = $("#menuToggle");
const topNav = $("#topNav");
const menuOverlay = $("#menuOverlay");
function setMenuOpen(open) {
  topNav.classList.toggle("open", open);
  menuOverlay.classList.toggle("visible", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  menuToggle.textContent = open ? "×" : "☰";
  menuOverlay.setAttribute("aria-hidden", String(!open));
}
menuToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  setMenuOpen(!topNav.classList.contains("open"));
});
menuOverlay.addEventListener("click", () => setMenuOpen(false));
topNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenuOpen(false);
});
document.addEventListener("click", (event) => {
  if (topNav.classList.contains("open") && !topNav.contains(event.target) && !menuToggle.contains(event.target)) {
    setMenuOpen(false);
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});
breadcrumbs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-crumb]");
  if (!button) return;
  const level = button.dataset.crumb;
  if (level === "home") { goHome(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  if (level === "section") { state.department = state.course = state.semester = state.subject = null; }
  if (level === "department") { state.course = state.semester = state.subject = null; }
  if (level === "course") { state.semester = state.subject = null; }
  if (level === "semester") { state.subject = null; }
  state.search = ""; searchInput.value = ""; $("#clearSearch").hidden = true; render();
});
browseContent.addEventListener("click", (event) => {
  const searchResult = event.target.closest("[data-search-subject]");
  if (searchResult) {
    const [di, ci, si, subi] = searchResult.dataset.searchSubject.split(",").map(Number);
    state.department = di; state.course = ci; state.semester = si; state.subject = subi;
    state.search = ""; searchInput.value = ""; $("#clearSearch").hidden = true; render(); return;
  }
  const button = event.target.closest("[data-level]");
  if (button) setLevel(button.dataset.level, Number(button.dataset.index));
});
searchInput.addEventListener("input", () => {
  state.search = searchInput.value;
  $("#clearSearch").hidden = !state.search;
  if (state.search.trim()) {
    browseContent.innerHTML = "";
    renderSearchResults();
  } else render();
});
$("#clearSearch").addEventListener("click", () => { searchInput.value = ""; state.search = ""; $("#clearSearch").hidden = true; render(); searchInput.focus(); });
$("#year").textContent = new Date().getFullYear();
render();
