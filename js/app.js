// ============================================================
// Andhra University Portal — App Router & Shell
// ============================================================

const ROLES = {
  student: { label:'Student', nav:['dashboard','students','exams','fees','events','classes','certificates','map','faculty'], color:'#1d4ed8' },
  faculty: { label:'Faculty', nav:['dashboard','students','faculty','classes','exams','events','departments','map','library','analytics'], color:'#166534' },
  admin:   { label:'Admin',   nav:['dashboard','students','faculty','classes','fees','exams','events','placements','certificates','departments','map','analytics','library','hostel','alumni'], color:'#1d4ed8' },
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
  // Auto-close sidebar on mobile after navigation
  if (window.innerWidth < 768) {
    document.getElementById('sidebar').classList.add('collapsed');
  }
}

// ---- Back button ----
function goBack() {
  if (window.history.length > 1) history.back();
  else navigate('dashboard');
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
function deptColor(code) { const d = AppData.departments.find(x => x.code === code); return d ? d.color : '#1d4ed8'; }
function deptBg(code)    { const d = AppData.departments.find(x => x.code === code); return d ? d.bg    : '#eff6ff'; }
function deptName(code)  { const d = AppData.departments.find(x => x.code === code); return d ? d.name  : code; }
function gpaColor(gpa) {
  if (gpa >= 3.7) return 'text-green-700';
  if (gpa >= 3.0) return 'text-amber-700';
  if (gpa >= 2.5) return 'text-orange-600';
  return 'text-red-700';
}
function statusBadge(status) {
  const styles = { 'Active':'background:#dcfce7;color:#166534','Probation':'background:#fef9c3;color:#a16207','Inactive':'background:#f1f5f9;color:#475569','Completed':'background:#f1f5f9;color:#6b7280','Upcoming':'background:#dbeafe;color:#1e40af' };
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
      <span class="text-xs font-semibold cursor-pointer" style="color:#1d4ed8" onclick="markAllRead()">Mark all read</span>
    </div>
    <div class="overflow-y-auto" style="max-height:380px">
      ${notifs.map(n => `
        <div class="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 ${n.read ? '' : 'bg-primary-50/30'}">
          <div class="flex gap-3">
            <span class="text-lg flex-shrink-0">${icons[n.type]||'ℹ️'}</span>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-semibold text-gray-800 flex items-center gap-2">
                ${n.title}
                ${!n.read ? `<span class="w-2 h-2 rounded-full flex-shrink-0" style="background:#1d4ed8"></span>` : ''}
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

// ============================================================
// AUTH — Sign In / Sign Up / OTP / Forgot Password
// ============================================================

// Role initial letters for avatars
const ROLE_LETTER = { student:'S', faculty:'F', admin:'A', dean:'D' };

// Built-in demo credentials (role → password)
const DEMO_CREDS = { faculty:'faculty123', student:'student123' };

// --- LocalStorage user store ---
function getUsers()          { return JSON.parse(localStorage.getItem('au_users') || '{}'); }
function saveUsers(users)    { localStorage.setItem('au_users', JSON.stringify(users)); }
function getRemembered()     { return JSON.parse(localStorage.getItem('au_remember') || 'null'); }
function saveRemembered(d)   { localStorage.setItem('au_remember', JSON.stringify(d)); }
function clearRemembered()   { localStorage.removeItem('au_remember'); }


// ---- CAPTCHA ----
var _captchaCode = '';
function generateCaptcha() {
  _captchaCode = String(Math.floor(10000 + Math.random() * 90000));
  const el = document.getElementById('captcha-text');
  if (el) el.textContent = _captchaCode;
}
function refreshCaptcha() { generateCaptcha(); }

// ---- EMS Role Switcher ----
const EMS_ROLE_LABELS = { student:'Student Login', faculty:'Faculty Login', admin:'Admin Login', dean:'Dean Login' };
const EMS_BANNER_LABELS = { student:'Student Portal Login', faculty:'Faculty Portal Login', admin:'Admin Portal Login', dean:'Dean Portal Login' };

function switchEmsRole(role) {
  document.getElementById('login-role').value = role;
  document.getElementById('ems-form-title').textContent = EMS_ROLE_LABELS[role] || 'Login';
  document.getElementById('ems-banner-text').textContent = EMS_BANNER_LABELS[role] || 'Portal Login';
  // Update tab styles
  ['student','faculty'].forEach(r => {
    const btn = document.getElementById('ems-tab-' + r);
    if (btn) {
      btn.style.background = r === role ? '#1976d2' : 'transparent';
      btn.style.color = r === role ? 'white' : '#64748b';
    }
  });
  // Update signup hidden role field
  const sr = document.getElementById('signup-role');
  if (sr) sr.value = role;
}

function showEmsSignup() {
  document.getElementById('signin-form').classList.add('hidden');
  document.getElementById('signup-form').classList.remove('hidden');
  const role = document.getElementById('login-role').value || 'student';
  document.getElementById('signup-role').value = role;
  document.getElementById('ems-form-title').textContent = 'Create Account';
}
function hideEmsSignup() {
  document.getElementById('signup-form').classList.add('hidden');
  document.getElementById('signin-form').classList.remove('hidden');
  const role = document.getElementById('login-role').value || 'student';
  document.getElementById('ems-form-title').textContent = EMS_ROLE_LABELS[role] || 'Login';
}

// ---- Show / Hide ----
function showLogin() {
  const overlay = document.getElementById('login-overlay');
  overlay.classList.remove('hidden');
  // Re-trigger card animation
  const card = overlay.querySelector('.login-card');
  if (card) { card.classList.remove('shake'); void card.offsetWidth; }
  // Restore to credentials step
  document.getElementById('login-step-1').classList.remove('hidden');
  document.getElementById('login-step-3').classList.add('hidden');
  document.getElementById('forgot-panel').classList.add('hidden');
  document.getElementById('signin-form').classList.remove('hidden');
  document.getElementById('signup-form').classList.add('hidden');
  // Generate CAPTCHA
  generateCaptcha();
  document.getElementById('captcha-input').value = '';
  // Pre-fill remembered credentials
  const rem = getRemembered();
  if (rem) {
    document.getElementById('login-role').value = rem.role || 'student';
    document.getElementById('login-id').value   = rem.id   || '';
    document.getElementById('remember-me').checked = true;
    switchEmsRole(rem.role || 'student');
  } else {
    switchEmsRole('student');
  }
  document.getElementById('login-error').textContent = '';
}

// ---- Legacy tab fn (kept for compatibility) ----
function switchLoginTab(tab) {
  document.getElementById('signin-form').classList.toggle('hidden', tab !== 'signin');
  document.getElementById('signup-form').classList.toggle('hidden', tab !== 'signup');
  document.getElementById('login-error').textContent  = '';
  document.getElementById('signup-error').textContent = '';
}

// ---- Password visibility toggle ----
function togglePwd(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈'; }
  else                          { inp.type = 'password'; btn.textContent = '👁'; }
}

// ---- Password strength ----
document.addEventListener('input', function(e) {
  if (e.target.id !== 'signup-pass') return;
  const v = e.target.value;
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  const bar = document.getElementById('pwd-strength-bar');
  const lbl = document.getElementById('pwd-strength-label');
  if (!bar) return;
  const configs = [
    {w:'0%',   bg:'#e5e7eb', label:'',         color:'#9ca3af'},
    {w:'25%',  bg:'#ef4444', label:'Weak',      color:'#ef4444'},
    {w:'50%',  bg:'#f97316', label:'Fair',      color:'#f97316'},
    {w:'75%',  bg:'#eab308', label:'Good',      color:'#eab308'},
    {w:'100%', bg:'#22c55e', label:'Strong ✓',  color:'#22c55e'},
  ];
  const cfg = configs[score];
  bar.style.width      = cfg.w;
  bar.style.background = cfg.bg;
  lbl.textContent      = cfg.label;
  lbl.style.color      = cfg.color;
});

// ---- Shake helper ----
function shakeCard() {
  const card = document.querySelector('.login-card');
  if (!card) return;
  card.classList.remove('shake');
  void card.offsetWidth;
  card.classList.add('shake');
}

// ============================================================
// SIGN IN
// ============================================================
function doLogin() {
  const role = document.getElementById('login-role').value;
  const id   = document.getElementById('login-id').value.trim();
  const pass = document.getElementById('login-pass').value;
  const err  = document.getElementById('login-error');
  err.textContent = '';

  const captchaVal = (document.getElementById('captcha-input').value || '').trim();
  if (!role || !id || !pass) { err.textContent = 'Please fill in all fields.'; shakeCard(); return; }
  if (!captchaVal) { err.textContent = 'Please enter the security code.'; shakeCard(); return; }
  if (captchaVal !== _captchaCode) { err.textContent = 'Incorrect security code. Please try again.'; generateCaptcha(); document.getElementById('captcha-input').value=''; shakeCard(); return; }

  // Check custom users first, then demo creds
  const users = getUsers();
  const userKey = `${role}:${id.toLowerCase()}`;
  let userName = id;
  let authOk   = false;

  if (users[userKey]) {
    authOk   = users[userKey].password === btoa(pass);
    userName = users[userKey].name;
  } else {
    // Demo built-in
    authOk = (DEMO_CREDS[role] === pass);
  }

  if (!authOk) {
    err.textContent = 'Incorrect credentials. Please try again.';
    shakeCard();
    return;
  }

  // Remember me
  if (document.getElementById('remember-me').checked) {
    saveRemembered({ role, id });
  } else {
    clearRemembered();
  }

  completeLogin(role, id, userName);
}

// ============================================================
// SIGN UP
// ============================================================
function doSignUp() {
  const role  = document.getElementById('signup-role').value;
  const name  = document.getElementById('signup-name').value.trim();
  const uid   = document.getElementById('signup-uid').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pass  = document.getElementById('signup-pass').value;
  const pass2 = document.getElementById('signup-pass2').value;
  const err   = document.getElementById('signup-error');
  err.textContent = '';

  if (!role || !name || !uid || !email || !pass || !pass2) {
    err.textContent = 'Please fill in all fields.'; shakeCard(); return;
  }
  if (pass.length < 8) {
    err.textContent = 'Password must be at least 8 characters.'; shakeCard(); return;
  }
  if (pass !== pass2) {
    err.textContent = 'Passwords do not match.'; shakeCard(); return;
  }
  if (!email.includes('@')) {
    err.textContent = 'Please enter a valid email address.'; shakeCard(); return;
  }

  const users   = getUsers();
  const userKey = `${role}:${uid.toLowerCase()}`;
  if (users[userKey]) {
    err.textContent = 'This ID is already registered. Please sign in.'; shakeCard(); return;
  }

  // Save user and log in directly
  const users2 = getUsers();
  users2[`${role}:${uid.toLowerCase()}`] = { name, email, password: btoa(pass), role };
  saveUsers(users2);
  completeLogin(role, uid.toLowerCase(), name);
}


function completeLogin(role, userId, name) {
  document.getElementById('login-step-1').classList.add('hidden');
  document.getElementById('login-step-3').classList.remove('hidden');
  document.getElementById('login-success-msg').textContent = `Signing you in as ${name} (${ROLES[role]?.label})…`;
  sessionStorage.setItem('au_role', role);
  sessionStorage.setItem('au_user', JSON.stringify({ name, id: userId }));

  setTimeout(() => {
    document.getElementById('login-overlay').classList.add('hidden');
    updateUserInfo();
    buildNav();
    renderCurrentPage();
  }, 1400);
}

// ============================================================
// FORGOT PASSWORD
// ============================================================
function showForgotPassword() {
  document.getElementById('login-step-1').classList.add('hidden');
  document.getElementById('login-tabs').classList.add('hidden');
  document.getElementById('forgot-panel').classList.remove('hidden');
  document.getElementById('forgot-step-1').classList.remove('hidden');
  document.getElementById('forgot-step-3').classList.add('hidden');
  document.getElementById('forgot-error').textContent = '';
  document.getElementById('forgot-email').value = '';
  document.getElementById('new-pass').value = '';
  document.getElementById('new-pass2').value = '';
}

function hideForgotPassword() {
  document.getElementById('forgot-panel').classList.add('hidden');
  document.getElementById('login-step-1').classList.remove('hidden');
  document.getElementById('login-tabs').classList.remove('hidden');
}

function doResetPassword() {
  const email    = document.getElementById('forgot-email').value.trim();
  const newPass  = document.getElementById('new-pass').value;
  const newPass2 = document.getElementById('new-pass2').value;
  const err      = document.getElementById('forgot-error');
  err.textContent = '';

  if (!email || !email.includes('@')) { err.textContent = 'Enter a valid email address.'; return; }
  if (newPass.length < 8)             { err.textContent = 'Password must be at least 8 characters.'; return; }
  if (newPass !== newPass2)           { err.textContent = 'Passwords do not match.'; shakeCard(); return; }

  const users = getUsers();
  let found = false;
  Object.keys(users).forEach(key => {
    if (users[key].email === email) { users[key].password = btoa(newPass); found = true; }
  });
  if (!found) { err.textContent = 'No account found with that email.'; shakeCard(); return; }
  saveUsers(users);

  document.getElementById('forgot-step-1').classList.add('hidden');
  document.getElementById('forgot-step-3').classList.remove('hidden');
}

// ---- Logout ----
function doLogout() {
  sessionStorage.removeItem('au_role');
  sessionStorage.removeItem('au_user');
  showLogin();
}

// ---- Update UI after login ----
function updateUserInfo() {
  const user   = getCurrentUser();
  const role   = getCurrentRole();
  const letter = ROLE_LETTER[role] || 'A';

  const el    = document.getElementById('user-name');
  const badge = document.getElementById('user-role-badge');
  const sAvt  = document.getElementById('sidebar-avatar');
  const hAvt  = document.getElementById('header-avatar');

  if (el)    el.textContent    = user.name;
  if (badge) { badge.textContent = ROLES[role]?.label || 'Admin'; badge.style.color = ROLES[role]?.color || '#1d4ed8'; }
  if (sAvt)  sAvt.textContent  = letter;
  if (hAvt)  hAvt.textContent  = letter;
}

// ---- Bottom nav highlight ----
function updateBottomNav(page) {
  document.querySelectorAll('.bottom-nav-btn').forEach(btn => {
    btn.style.color = btn.dataset.page === page ? '#1d4ed8' : '#94a3b8';
    btn.style.fontWeight = btn.dataset.page === page ? '700' : '500';
  });
}

// ---- Init ----
window.addEventListener('hashchange', () => {
  renderCurrentPage();
  updateBottomNav(getRoute().page);
});
window.addEventListener('load', () => {
  // Collapse sidebar on mobile by default
  if (window.innerWidth < 768) {
    document.getElementById('sidebar').classList.add('collapsed');
  }
  buildNav();
  buildBottomNav();
  updateDate();
  renderNotifications();
  updateUserInfo();
  if (!window.location.hash) window.location.hash = '#dashboard';
  renderCurrentPage();
  updateBottomNav(getRoute().page);
  if (!sessionStorage.getItem('au_role')) { showLogin(); }
});

// ---- Build bottom nav ----
function buildBottomNav() {
  const role = getCurrentRole();
  const allowed = ROLES[role] ? ROLES[role].nav : [];
  const priority = ['dashboard','exams','fees','events','certificates','students','classes','analytics','map'];
  const items = priority.filter(p => allowed.includes(p)).slice(0, 5);
  const nav = document.getElementById('bottom-nav');
  if (!nav) return;
  nav.innerHTML = items.map(page => {
    const info = NAV_ITEMS.find(n => n.page === page);
    if (!info) return '';
    return `<button class="bottom-nav-btn flex flex-col items-center gap-0.5 flex-1 py-2 border-none bg-transparent cursor-pointer" data-page="${page}" onclick="navigate('${page}')" style="color:#94a3b8;font-size:0.6rem;font-weight:500;min-width:0">
      <span style="font-size:1.35rem;line-height:1">${info.icon}</span>
      <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:54px">${info.label.split(' ')[0]}</span>
    </button>`;
  }).join('');
}
