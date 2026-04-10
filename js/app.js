// ============================================================
// Andhra University Portal — App Router & Shell
// ============================================================

const ROLES = {
  student: { label:'Student', nav:['dashboard','students','faculty','classes','fees','exams','events','placements','certificates','departments','map','library','hostel','alumni','analytics'], color:'#1d4ed8' },
  faculty: { label:'Faculty', nav:['dashboard','students','faculty','classes','exams','events','departments','map','library','analytics'], color:'#166534' },
  admin:   { label:'Admin',   nav:['dashboard','students','faculty','classes','fees','exams','events','placements','certificates','departments','map','analytics','library','hostel','alumni'], color:'#8b1a1a' },
  dean:    { label:'Dean',    nav:['dashboard','students','faculty','classes','fees','exams','events','placements','certificates','departments','map','analytics','library','hostel','alumni'], color:'#7c3aed' },
};

const NAV_ITEMS = [
  { page:'dashboard',    label:'Dashboard',            icon:'🏠', title:'Dashboard',             subtitle:'University overview & quick stats' },
  { page:'students',     label:'Students',             icon:'🎓', title:'Students',              subtitle:'Student directory & records' },
  { page:'faculty',      label:'Faculty',              icon:'👩‍🏫', title:'Faculty',              subtitle:'Faculty directory & profiles' },
  { page:'classes',      label:'Class Timings',        icon:'🕐', title:'Class Timings',         subtitle:'Weekly timetable & schedule' },
  { page:'fees',         label:'Fee Structure',        icon:'💰', title:'Fee Structure',         subtitle:'Department fees & online payment' },
  { page:'exams',        label:'Exam Timings',         icon:'📝', title:'Exam Timings',          subtitle:'Mid-term and final exam schedule' },
  { page:'events',       label:'Events & Schedules',   icon:'📅', title:'Events & Schedules',    subtitle:'Campus events and activities' },
  { page:'placements',   label:'Placements & Careers', icon:'🏢', title:'Placements & Careers',  subtitle:'Placements, internships & hackathons' },
  { page:'certificates', label:'Certificates',         icon:'📜', title:'Certificates',          subtitle:'Request & download certificates' },
  { page:'departments',  label:'Departments',          icon:'🏛️', title:'Departments',           subtitle:'Navigate academic departments' },
  { page:'map',          label:'Campus Map',           icon:'🗺️', title:'Campus Map',            subtitle:'Navigate department buildings' },
  { page:'analytics',    label:'Analytics',            icon:'📈', title:'Analytics',             subtitle:'Student strength & course demand' },
  { page:'library',      label:'Library',              icon:'📚', title:'Library',               subtitle:'Books, catalogue & borrow' },
  { page:'hostel',       label:'Hostel',               icon:'🏠', title:'Hostel',                subtitle:'Accommodation & mess info' },
  { page:'alumni',       label:'Alumni Portal',        icon:'🌟', title:'Alumni Portal',         subtitle:'AU alumni network & connect' },
];

// ---- Build Navigation ----
function buildNav() {
  const role    = getCurrentRole();
  const allowed = ROLES[role] ? ROLES[role].nav : NAV_ITEMS.map(n => n.page);
  const nav     = document.getElementById('nav-menu');
  nav.innerHTML = NAV_ITEMS
    .filter(item => allowed.includes(item.page))
    .map(item => `
      <a class="nav-item" data-page="${item.page}" onclick="navigate('${item.page}')" href="javascript:void(0)">
        <span class="nav-icon">${item.icon}</span>
        <span>${item.label}</span>
      </a>
    `).join('');
}

// ---- Role Helpers ----
function getCurrentRole() { return sessionStorage.getItem('au_role') || 'admin'; }
function getCurrentUser()  { return JSON.parse(sessionStorage.getItem('au_user') || '{"name":"Admin User","id":"admin@andhrauniv.ac.in"}'); }

// ---- Navigate ----
function navigate(page, params) {
  const hash = params ? `#${page}/${params}` : `#${page}`;
  if (window.location.hash !== hash) window.location.hash = hash;
  else renderCurrentPage();
}

// ---- Get Current Route ----
function getRoute() {
  const hash = window.location.hash.slice(1);
  if (!hash) return { page:'dashboard', params:[] };
  const parts = hash.split('/');
  return { page:parts[0], params:parts.slice(1) };
}

// ---- Render Current Page ----
function renderCurrentPage() {
  const { page, params } = getRoute();
  const navInfo = NAV_ITEMS.find(n => n.page === page) || NAV_ITEMS[0];

  document.getElementById('page-title').textContent    = navInfo.title;
  document.getElementById('page-subtitle').textContent = navInfo.subtitle;
  document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.page === page));

  if (window._charts) { window._charts.forEach(c => { try { c.destroy(); } catch(e){} }); window._charts = []; }

  const content = document.getElementById('content-area');
  try {
    switch (page) {
      case 'dashboard':    content.innerHTML = renderDashboard(); break;
      case 'students':
        if (params[0]) content.innerHTML = renderStudentDetail(params[0]);
        else           content.innerHTML = renderStudents();
        break;
      case 'faculty':
        if (params[0]) content.innerHTML = renderFacultyDetail(params[0]);
        else           content.innerHTML = renderFaculty();
        break;
      case 'classes':      content.innerHTML = renderClasses(); break;
      case 'fees':         content.innerHTML = renderFees(); break;
      case 'events':       content.innerHTML = renderEvents(); break;
      case 'exams':        content.innerHTML = renderExams(); break;
      case 'placements':   content.innerHTML = renderPlacements(); break;
      case 'certificates': content.innerHTML = renderCertificates(); break;
      case 'map':          content.innerHTML = renderMap(); break;
      case 'library':      content.innerHTML = renderLibrary(); break;
      case 'hostel':       content.innerHTML = renderHostel(); break;
      case 'alumni':       content.innerHTML = renderAlumni(); break;
      case 'departments':
        if (params[0]) content.innerHTML = renderDeptDetail(params[0]);
        else           content.innerHTML = renderDepartments();
        break;
      case 'analytics':    content.innerHTML = renderAnalytics(); initCharts(); break;
      default:             content.innerHTML = renderDashboard(); break;
    }
  } catch(err) {
    content.innerHTML = `<div class="p-8 text-center text-red-500">Error loading page: ${err.message}</div>`;
    console.error(err);
  }
}

// ---- Modal ----
function showModal(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal(e) {
  if (!e || e.target === document.getElementById('modal-overlay')) {
    document.getElementById('modal-overlay').classList.add('hidden');
  }
}

// ---- Sidebar Toggle ----
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('collapsed'); }

// ---- Search filter helper ----
function filterTable(inputId, tableId) {
  const q = document.getElementById(inputId).value.toLowerCase();
  document.querySelectorAll(`#${tableId} tr`).forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

// ---- Update date ----
function updateDate() {
  const now  = new Date();
  const opts = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
  document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', opts);
}

// ---- Dept utilities ----
function deptColor(code) { const d = AppData.departments.find(x => x.code === code); return d ? d.color : '#8b1a1a'; }
function deptBg(code)    { const d = AppData.departments.find(x => x.code === code); return d ? d.bg    : '#fdf3f3'; }
function deptName(code)  { const d = AppData.departments.find(x => x.code === code); return d ? d.name  : code; }
function gpaColor(gpa) {
  if (gpa >= 3.7) return 'text-green-700';
  if (gpa >= 3.0) return 'text-amber-700';
  if (gpa >= 2.5) return 'text-orange-600';
  return 'text-red-700';
}
function statusBadge(status) {
  const styles = { 'Active':'background:#dcfce7;color:#166534','Probation':'background:#fef9c3;color:#a16207','Inactive':'background:#f1f5f9;color:#475569','Completed':'background:#f1f5f9;color:#6b7280','Upcoming':'background:#faeaea;color:#8b1a1a' };
  return `<span class="badge" style="${styles[status]||'background:#f1f5f9;color:#475569'}">${status}</span>`;
}

// ---- Date helpers ----
function isUpcoming(dateStr) { return new Date(dateStr) > new Date('2026-04-10'); }
function formatDate(dateStr) { return new Date(dateStr).toLocaleDateString('en-US',{ weekday:'short', month:'short', day:'numeric', year:'numeric' }); }

// ---- Notifications ----
function toggleNotifications() {
  const panel = document.getElementById('notif-panel');
  panel.classList.toggle('hidden');
  document.getElementById('notif-count').style.display = 'none';
}

function renderNotifications() {
  const notifs = AppData.notifications;
  const unread = notifs.filter(n => !n.read).length;
  const icons  = { exam:'📝', fee:'💰', placement:'🏢', event:'📅', general:'ℹ️' };
  document.getElementById('notif-panel').innerHTML = `
    <div class="p-4 border-b border-gray-100 flex items-center justify-between">
      <h3 class="font-bold text-gray-800">Notifications <span class="text-xs text-gray-400 font-normal">(${unread} unread)</span></h3>
      <span class="text-xs font-semibold cursor-pointer" style="color:#8b1a1a" onclick="markAllRead()">Mark all read</span>
    </div>
    <div class="overflow-y-auto" style="max-height:380px">
      ${notifs.map(n => `
        <div class="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 ${n.read ? '' : 'bg-primary-50/30'}">
          <div class="flex gap-3">
            <span class="text-lg flex-shrink-0">${icons[n.type]||'ℹ️'}</span>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-semibold text-gray-800 flex items-center gap-2">
                ${n.title}
                ${!n.read ? `<span class="w-2 h-2 rounded-full flex-shrink-0" style="background:#8b1a1a"></span>` : ''}
              </div>
              <div class="text-xs text-gray-500 mt-0.5 leading-relaxed">${n.msg}</div>
              <div class="text-xs text-gray-400 mt-1">${n.time}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  const badge = document.getElementById('notif-count');
  badge.textContent    = unread;
  badge.style.display  = unread > 0 ? 'flex' : 'none';
}

function markAllRead() {
  AppData.notifications.forEach(n => n.read = true);
  renderNotifications();
}

// ---- Login ----
function showLogin() { document.getElementById('login-overlay').classList.remove('hidden'); }

function doLogin() {
  const role = document.getElementById('login-role').value;
  const id   = document.getElementById('login-id').value.trim();
  const pass = document.getElementById('login-pass').value.trim();
  const err  = document.getElementById('login-error');

  if (!role || !id || !pass) { err.textContent = 'Please fill in all fields.'; return; }

  const creds = { admin:'admin123', dean:'dean123', faculty:'faculty123', student:'student123' };
  if (creds[role] !== pass) {
    err.textContent = `Wrong password. Hint: ${role}123`;
    return;
  }

  sessionStorage.setItem('au_role', role);
  sessionStorage.setItem('au_user', JSON.stringify({ name:id, id:id }));
  document.getElementById('login-overlay').classList.add('hidden');
  document.getElementById('user-name').textContent       = id;
  document.getElementById('user-role-badge').textContent = ROLES[role].label;
  document.getElementById('user-role-badge').style.color = ROLES[role].color;
  buildNav();
  renderCurrentPage();
}

function doLogout() {
  sessionStorage.removeItem('au_role');
  sessionStorage.removeItem('au_user');
  showLogin();
}

function updateUserInfo() {
  const user = getCurrentUser();
  const role = getCurrentRole();
  const el   = document.getElementById('user-name');
  const badge= document.getElementById('user-role-badge');
  if (el)    el.textContent    = user.name;
  if (badge) { badge.textContent = ROLES[role]?.label || 'Admin'; badge.style.color = ROLES[role]?.color || '#8b1a1a'; }
}

// ---- Init ----
window.addEventListener('hashchange', renderCurrentPage);
window.addEventListener('load', () => {
  buildNav();
  updateDate();
  renderNotifications();
  updateUserInfo();
  if (!window.location.hash) window.location.hash = '#dashboard';
  renderCurrentPage();
  if (!sessionStorage.getItem('au_role')) showLogin();
});
