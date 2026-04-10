// ============================================================
// Campus Navigation Map
// ============================================================

// Department positions on the SVG map (cx, cy) and route path from main gate
const DEPT_MAP_INFO = {
  CSE:    { x:80,  y:65,  walk:'3 min',  dist:'200m', gate_path:'M350,490 L350,260 L162,260 L162,132 L80,132 L80,105',    color:'#1d4ed8' },
  ITCA:   { x:230, y:65,  walk:'4 min',  dist:'280m', gate_path:'M350,490 L350,260 L230,260 L230,132 L230,105',           color:'#0e7490' },
  MECH:   { x:440, y:65,  walk:'4 min',  dist:'300m', gate_path:'M350,490 L350,260 L440,260 L440,132 L440,105',           color:'#b91c1c' },
  EEE:    { x:610, y:65,  walk:'6 min',  dist:'420m', gate_path:'M350,490 L350,260 L532,260 L532,132 L610,132 L610,105',  color:'#b45309' },
  CIVIL:  { x:80,  y:185, walk:'4 min',  dist:'260m', gate_path:'M350,490 L350,260 L162,260 L162,185 L80,185',            color:'#92400e' },
  MARINE: { x:610, y:185, walk:'7 min',  dist:'480m', gate_path:'M350,490 L350,260 L532,260 L532,185 L610,185',           color:'#1e3a8a' },
  CHEM:   { x:80,  y:325, walk:'3 min',  dist:'180m', gate_path:'M350,490 L350,382 L162,382 L162,325 L80,325',            color:'#ea580c' },
  ENV:    { x:230, y:325, walk:'3 min',  dist:'200m', gate_path:'M350,490 L350,382 L230,382 L230,325',                    color:'#166534' },
  ARCH:   { x:440, y:325, walk:'3 min',  dist:'210m', gate_path:'M350,490 L350,382 L440,382 L440,325',                    color:'#7c3aed' },
  META:   { x:610, y:325, walk:'5 min',  dist:'380m', gate_path:'M350,490 L350,382 L532,382 L532,325 L610,325',           color:'#334155' },
  GEO:    { x:230, y:430, walk:'2 min',  dist:'130m', gate_path:'M350,490 L350,430 L230,430',                             color:'#4d7c0f' },
  INST:   { x:440, y:430, walk:'2 min',  dist:'140m', gate_path:'M350,490 L350,430 L440,430',                             color:'#9d174d' },
};

function renderMap() {
  const depts = AppData.departments;
  return `
  <div class="p-6 space-y-5">

    <!-- Search Bar -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="flex-1">
          <label class="text-xs font-semibold text-gray-500 uppercase mb-1 block">Navigate to Department</label>
          <div class="flex gap-2">
            <select id="nav-dept-select" onchange="navigateToDept(this.value)"
              class="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 bg-white font-medium">
              <option value="">🗺️ Select a department to navigate...</option>
              ${depts.map(d => `<option value="${d.code}">${d.icon} ${d.code} — ${d.name}</option>`).join('')}
            </select>
            <button onclick="clearNavigation()" class="px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">Clear</button>
          </div>
        </div>
        <div id="nav-info-box" class="hidden sm:min-w-48 p-3 rounded-xl text-sm" style="background:#fdf3f3">
          <div class="font-bold" style="color:#8b1a1a" id="nav-dept-name">—</div>
          <div class="text-xs text-gray-500 mt-1 space-y-0.5">
            <div>🚶 Walking: <span id="nav-walk" class="font-semibold text-gray-700">—</span></div>
            <div>📏 Distance: <span id="nav-dist" class="font-semibold text-gray-700">—</span></div>
            <div id="nav-building" class="text-gray-400"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-5">

      <!-- Map -->
      <div class="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-bold text-gray-800">Andhra University Campus</h2>
          <span class="text-xs text-gray-400">Visakhapatnam, AP · Click any block to navigate</span>
        </div>
        <div class="relative w-full rounded-xl overflow-hidden" style="background:linear-gradient(160deg,#e8f5e9 0%,#e3f2fd 60%,#fce4ec 100%)">
          <svg id="campus-svg" viewBox="0 0 700 510" xmlns="http://www.w3.org/2000/svg" class="w-full" style="min-height:320px">

            <!-- Ground texture -->
            <rect width="700" height="510" fill="#eef7ee"/>

            <!-- Green areas / lawns -->
            <ellipse cx="350" cy="250" rx="55" ry="38" fill="#a5d6a7" opacity="0.6"/>
            <rect x="55"  y="280" width="80" height="55" rx="10" fill="#c8e6c9" opacity="0.7"/>
            <rect x="565" y="280" width="80" height="55" rx="10" fill="#c8e6c9" opacity="0.7"/>
            <ellipse cx="80" cy="455" rx="55" ry="30" fill="#a5d6a7" opacity="0.8"/>
            <ellipse cx="620" cy="455" rx="50" ry="28" fill="#a5d6a7" opacity="0.8"/>

            <!-- Roads (main) -->
            <rect x="0"   y="248" width="700" height="14" fill="#b0bec5" opacity="0.8" rx="2"/>
            <rect x="343" y="0"   width="14"  height="510" fill="#b0bec5" opacity="0.8" rx="2"/>
            <!-- Roads (secondary horizontal) -->
            <rect x="0"   y="126" width="343" height="8" fill="#cfd8dc" opacity="0.7"/>
            <rect x="357" y="126" width="343" height="8" fill="#cfd8dc" opacity="0.7"/>
            <rect x="0"   y="378" width="343" height="8" fill="#cfd8dc" opacity="0.7"/>
            <rect x="357" y="378" width="343" height="8" fill="#cfd8dc" opacity="0.7"/>
            <!-- Roads (secondary vertical) -->
            <rect x="154" y="0"   width="8" height="248" fill="#cfd8dc" opacity="0.7"/>
            <rect x="516" y="0"   width="8" height="248" fill="#cfd8dc" opacity="0.7"/>
            <rect x="154" y="262" width="8" height="248" fill="#cfd8dc" opacity="0.7"/>
            <rect x="516" y="262" width="8" height="248" fill="#cfd8dc" opacity="0.7"/>

            <!-- Navigation route (drawn dynamically) -->
            <path id="nav-route" d="" fill="none" stroke="#8b1a1a" stroke-width="4"
              stroke-dasharray="10,6" stroke-linecap="round" opacity="0" style="transition:opacity 0.4s"/>

            <!-- Route arrows / dots along path -->
            <g id="nav-dots" opacity="0"></g>

            <!-- ── DEPARTMENT BLOCKS ── -->
            <!-- CSE -->
            <g class="dept-block" onclick="navigateToDept('CSE')" style="cursor:pointer">
              <rect x="30" y="25" width="100" height="80" rx="10" fill="#1d4ed8" opacity="0.88" id="block-CSE"/>
              <text x="80" y="60"  text-anchor="middle" font-size="11" fill="white" font-weight="bold">💻 CSE</text>
              <text x="80" y="74"  text-anchor="middle" font-size="8"  fill="#bfdbfe">CS Block</text>
              <text x="80" y="86"  text-anchor="middle" font-size="8"  fill="#bfdbfe">2,200 students</text>
            </g>

            <!-- ITCA -->
            <g class="dept-block" onclick="navigateToDept('ITCA')" style="cursor:pointer">
              <rect x="180" y="25" width="100" height="80" rx="10" fill="#0e7490" opacity="0.88" id="block-ITCA"/>
              <text x="230" y="60"  text-anchor="middle" font-size="11" fill="white" font-weight="bold">🖥️ ITCA</text>
              <text x="230" y="74"  text-anchor="middle" font-size="8"  fill="#a5f3fc">IT Center</text>
              <text x="230" y="86"  text-anchor="middle" font-size="8"  fill="#a5f3fc">1,650 students</text>
            </g>

            <!-- Library (centre-top) -->
            <g style="cursor:default">
              <rect x="273" y="25" width="104" height="70" rx="10" fill="#ca8a04" opacity="0.92"/>
              <text x="325" y="57"  text-anchor="middle" font-size="10" fill="white" font-weight="bold">📚 LIBRARY</text>
              <text x="325" y="70"  text-anchor="middle" font-size="8"  fill="#fef9c3">85,420 books</text>
            </g>

            <!-- MECH -->
            <g class="dept-block" onclick="navigateToDept('MECH')" style="cursor:pointer">
              <rect x="390" y="25" width="100" height="80" rx="10" fill="#b91c1c" opacity="0.88" id="block-MECH"/>
              <text x="440" y="60"  text-anchor="middle" font-size="11" fill="white" font-weight="bold">⚙️ MECH</text>
              <text x="440" y="74"  text-anchor="middle" font-size="8"  fill="#fecaca">Mech Block</text>
              <text x="440" y="86"  text-anchor="middle" font-size="8"  fill="#fecaca">1,820 students</text>
            </g>

            <!-- EEE -->
            <g class="dept-block" onclick="navigateToDept('EEE')" style="cursor:pointer">
              <rect x="560" y="25" width="110" height="80" rx="10" fill="#b45309" opacity="0.88" id="block-EEE"/>
              <text x="615" y="60"  text-anchor="middle" font-size="11" fill="white" font-weight="bold">⚡ EEE</text>
              <text x="615" y="74"  text-anchor="middle" font-size="8"  fill="#fef3c7">Electrical</text>
              <text x="615" y="86"  text-anchor="middle" font-size="8"  fill="#fef3c7">1,380 students</text>
            </g>

            <!-- CIVIL -->
            <g class="dept-block" onclick="navigateToDept('CIVIL')" style="cursor:pointer">
              <rect x="30" y="145" width="100" height="80" rx="10" fill="#92400e" opacity="0.88" id="block-CIVIL"/>
              <text x="80" y="180" text-anchor="middle" font-size="11" fill="white" font-weight="bold">🏛️ CIVIL</text>
              <text x="80" y="194" text-anchor="middle" font-size="8"  fill="#fde68a">Civil Block</text>
              <text x="80" y="206" text-anchor="middle" font-size="8"  fill="#fde68a">1,450 students</text>
            </g>

            <!-- Admin Block (centre) -->
            <g style="cursor:default">
              <rect x="273" y="205" width="154" height="75" rx="10" fill="#8b1a1a" opacity="0.95"/>
              <text x="350" y="238" text-anchor="middle" font-size="10" fill="white" font-weight="bold">🏛 ADMIN BLOCK</text>
              <text x="350" y="252" text-anchor="middle" font-size="8"  fill="#fde68a">Vice Chancellor's Office</text>
              <text x="350" y="264" text-anchor="middle" font-size="7"  fill="#fde68a">Registrar · Finance</text>
            </g>

            <!-- MARINE -->
            <g class="dept-block" onclick="navigateToDept('MARINE')" style="cursor:pointer">
              <rect x="560" y="145" width="110" height="80" rx="10" fill="#1e3a8a" opacity="0.88" id="block-MARINE"/>
              <text x="615" y="180" text-anchor="middle" font-size="11" fill="white" font-weight="bold">⚓ MARINE</text>
              <text x="615" y="194" text-anchor="middle" font-size="8"  fill="#bfdbfe">Marine Block</text>
              <text x="615" y="206" text-anchor="middle" font-size="8"  fill="#bfdbfe">560 students</text>
            </g>

            <!-- CHEM -->
            <g class="dept-block" onclick="navigateToDept('CHEM')" style="cursor:pointer">
              <rect x="30" y="285" width="100" height="80" rx="10" fill="#ea580c" opacity="0.88" id="block-CHEM"/>
              <text x="80" y="320" text-anchor="middle" font-size="11" fill="white" font-weight="bold">⚗️ CHEM</text>
              <text x="80" y="334" text-anchor="middle" font-size="8"  fill="#fed7aa">Chemical</text>
              <text x="80" y="346" text-anchor="middle" font-size="8"  fill="#fed7aa">720 students</text>
            </g>

            <!-- ENV -->
            <g class="dept-block" onclick="navigateToDept('ENV')" style="cursor:pointer">
              <rect x="180" y="285" width="100" height="80" rx="10" fill="#166534" opacity="0.88" id="block-ENV"/>
              <text x="230" y="320" text-anchor="middle" font-size="11" fill="white" font-weight="bold">🌿 ENV</text>
              <text x="230" y="334" text-anchor="middle" font-size="8"  fill="#bbf7d0">Env Block</text>
              <text x="230" y="346" text-anchor="middle" font-size="8"  fill="#bbf7d0">480 students</text>
            </g>

            <!-- ARCH -->
            <g class="dept-block" onclick="navigateToDept('ARCH')" style="cursor:pointer">
              <rect x="390" y="285" width="100" height="80" rx="10" fill="#7c3aed" opacity="0.88" id="block-ARCH"/>
              <text x="440" y="320" text-anchor="middle" font-size="11" fill="white" font-weight="bold">🏗️ ARCH</text>
              <text x="440" y="334" text-anchor="middle" font-size="8"  fill="#ddd6fe">Architecture</text>
              <text x="440" y="346" text-anchor="middle" font-size="8"  fill="#ddd6fe">580 students</text>
            </g>

            <!-- META -->
            <g class="dept-block" onclick="navigateToDept('META')" style="cursor:pointer">
              <rect x="560" y="285" width="110" height="80" rx="10" fill="#334155" opacity="0.88" id="block-META"/>
              <text x="615" y="320" text-anchor="middle" font-size="11" fill="white" font-weight="bold">🔩 META</text>
              <text x="615" y="334" text-anchor="middle" font-size="8"  fill="#cbd5e1">Metallurgy</text>
              <text x="615" y="346" text-anchor="middle" font-size="8"  fill="#cbd5e1">480 students</text>
            </g>

            <!-- GEO -->
            <g class="dept-block" onclick="navigateToDept('GEO')" style="cursor:pointer">
              <rect x="180" y="395" width="100" height="80" rx="10" fill="#4d7c0f" opacity="0.88" id="block-GEO"/>
              <text x="230" y="430" text-anchor="middle" font-size="11" fill="white" font-weight="bold">🌍 GEO</text>
              <text x="230" y="444" text-anchor="middle" font-size="8"  fill="#d9f99d">Geo Engg</text>
              <text x="230" y="456" text-anchor="middle" font-size="8"  fill="#d9f99d">420 students</text>
            </g>

            <!-- INST -->
            <g class="dept-block" onclick="navigateToDept('INST')" style="cursor:pointer">
              <rect x="390" y="395" width="100" height="80" rx="10" fill="#9d174d" opacity="0.88" id="block-INST"/>
              <text x="440" y="430" text-anchor="middle" font-size="11" fill="white" font-weight="bold">🔬 INST</text>
              <text x="440" y="444" text-anchor="middle" font-size="8"  fill="#fbcfe8">Instrument</text>
              <text x="440" y="456" text-anchor="middle" font-size="8"  fill="#fbcfe8">710 students</text>
            </g>

            <!-- Sports -->
            <g style="cursor:default">
              <ellipse cx="80" cy="455" rx="50" ry="28" fill="#4caf50" opacity="0.5" stroke="#388e3c" stroke-width="1.5"/>
              <text x="80" y="460" text-anchor="middle" font-size="9" fill="#166534" font-weight="bold">⚽ SPORTS</text>
            </g>

            <!-- Hostel -->
            <g style="cursor:default">
              <rect x="560" y="395" width="110" height="80" rx="10" fill="#0f766e" opacity="0.85"/>
              <text x="615" y="430" text-anchor="middle" font-size="10" fill="white" font-weight="bold">🏠 HOSTEL</text>
              <text x="615" y="445" text-anchor="middle" font-size="8"  fill="#99f6e4">Blocks A–E + PG</text>
            </g>

            <!-- Main Gate -->
            <rect x="315" y="494" width="70" height="14" rx="4" fill="#8b1a1a"/>
            <text x="350" y="505" text-anchor="middle" font-size="8" fill="white" font-weight="bold">MAIN GATE</text>
            <!-- Gate marker (start point) -->
            <circle id="gate-dot" cx="350" cy="490" r="7" fill="#8b1a1a" stroke="white" stroke-width="2"/>

            <!-- Destination marker (shown when navigating) -->
            <g id="dest-marker" opacity="0">
              <circle id="dest-circle" cx="0" cy="0" r="12" fill="white" stroke="#8b1a1a" stroke-width="3"/>
              <text id="dest-icon" x="0" y="5" text-anchor="middle" font-size="12">📍</text>
            </g>

            <!-- Compass -->
            <g transform="translate(672,472)">
              <circle r="22" fill="white" stroke="#e5e7eb" stroke-width="1.5"/>
              <text x="0" y="-7"  text-anchor="middle" font-size="11" fill="#8b1a1a" font-weight="bold">N</text>
              <path d="M0,-16 L5,2 L0,7 L-5,2 Z" fill="#8b1a1a"/>
              <path d="M0,18 L5,0 L0,-5 L-5,0 Z"  fill="#ccc"/>
            </g>

            <!-- Legend -->
            <g transform="translate(8,480)">
              <rect width="145" height="22" rx="4" fill="white" opacity="0.85"/>
              <circle cx="12" cy="11" r="4" fill="#8b1a1a"/>
              <text x="20" y="15" font-size="8" fill="#374151">Route from Main Gate</text>
              <line x1="80" y1="11" x2="100" y2="11" stroke="#8b1a1a" stroke-width="2.5" stroke-dasharray="4,3"/>
            </g>

          </svg>
        </div>
      </div>

      <!-- Department Directory -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div class="px-4 py-3 border-b border-gray-100">
          <h3 class="font-bold text-gray-800 text-sm">All Departments</h3>
          <input type="text" placeholder="Search..." id="dept-map-search"
            oninput="filterDeptList()"
            class="mt-2 w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary-400"/>
        </div>
        <div class="overflow-y-auto flex-1" id="dept-map-list">
          ${AppData.departments.map(d => `
            <div class="dept-map-item flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                 data-code="${d.code}" data-name="${d.name.toLowerCase()}"
                 onclick="navigateToDept('${d.code}')">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style="background:${d.bg}">${d.icon}</div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-bold" style="color:${d.color}">${d.code}</div>
                <div class="text-xs text-gray-400 truncate">${d.name}</div>
              </div>
              <div class="text-right flex-shrink-0">
                <div class="text-xs font-semibold text-gray-600">${DEPT_MAP_INFO[d.code]?.walk || '—'}</div>
                <div class="text-xs text-gray-400">${DEPT_MAP_INFO[d.code]?.dist || '—'}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </div>
  `;
}

// ---- Navigate to department ----
function navigateToDept(code) {
  if (!code) return;

  const info  = DEPT_MAP_INFO[code];
  const dept  = AppData.departments.find(d => d.code === code);
  if (!info || !dept) return;

  // Sync dropdown
  const sel = document.getElementById('nav-dept-select');
  if (sel) sel.value = code;

  // Highlight active in list
  document.querySelectorAll('.dept-map-item').forEach(el => {
    el.style.background = el.dataset.code === code ? dept.bg : '';
  });

  // Dim all blocks, highlight selected
  document.querySelectorAll('.dept-block rect[id^="block-"]').forEach(el => {
    el.style.opacity = el.id === 'block-' + code ? '1' : '0.3';
  });

  // Draw route
  const route = document.getElementById('nav-route');
  route.setAttribute('d', info.gate_path);
  route.setAttribute('stroke', info.color);
  route.style.opacity = '1';

  // Move destination marker
  const marker = document.getElementById('dest-marker');
  const circle = document.getElementById('dest-circle');
  const icon   = document.getElementById('dest-icon');
  marker.setAttribute('transform', `translate(${info.x},${info.y})`);
  circle.setAttribute('stroke', info.color);
  icon.textContent = dept.icon;
  marker.style.opacity = '1';

  // Animate route dash offset
  route.style.strokeDashoffset = '1000';
  route.animate([
    { strokeDashoffset: 1000 },
    { strokeDashoffset: 0 }
  ], { duration: 800, fill:'forwards', easing:'ease-in-out' });

  // Show info box
  const box = document.getElementById('nav-info-box');
  if (box) {
    box.classList.remove('hidden');
    document.getElementById('nav-dept-name').textContent  = dept.icon + ' ' + dept.name;
    document.getElementById('nav-dept-name').style.color  = info.color;
    document.getElementById('nav-walk').textContent       = info.walk;
    document.getElementById('nav-dist').textContent       = info.dist;
    document.getElementById('nav-building').textContent   = '🏢 ' + dept.building;
  }
}

// ---- Clear navigation ----
function clearNavigation() {
  document.getElementById('nav-dept-select').value = '';

  // Restore all blocks
  document.querySelectorAll('.dept-block rect[id^="block-"]').forEach(el => el.style.opacity = '1');

  // Hide route and marker
  document.getElementById('nav-route').style.opacity = '0';
  document.getElementById('dest-marker').style.opacity = '0';

  // Clear list highlights
  document.querySelectorAll('.dept-map-item').forEach(el => el.style.background = '');

  // Hide info box
  const box = document.getElementById('nav-info-box');
  if (box) box.classList.add('hidden');
}

// ---- Filter department list ----
function filterDeptList() {
  const q = document.getElementById('dept-map-search').value.toLowerCase();
  document.querySelectorAll('.dept-map-item').forEach(el => {
    el.style.display = (el.dataset.code.toLowerCase().includes(q) || el.dataset.name.includes(q)) ? '' : 'none';
  });
}

// ---- Highlight dept from departments page ----
function highlightDept(code) {
  const d = AppData.departments.find(x => x.code === code);
  if (!d) return;
  showModal(`
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style="background:${d.bg}">${d.icon}</div>
          <div>
            <h2 class="text-lg font-black text-gray-800">${d.name}</h2>
            <p class="text-sm text-gray-400">${d.code} · ${d.building}</p>
          </div>
        </div>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
      </div>
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="p-3 rounded-xl text-center" style="background:${d.bg}">
          <div class="text-xl font-black" style="color:${d.color}">${d.students.toLocaleString()}</div>
          <div class="text-xs text-gray-400">Students</div>
        </div>
        <div class="p-3 rounded-xl text-center" style="background:${d.bg}">
          <div class="text-xl font-black" style="color:${d.color}">${d.faculty}</div>
          <div class="text-xs text-gray-400">Faculty</div>
        </div>
      </div>
      <div class="space-y-2 text-sm text-gray-600 mb-4">
        <div>🏛️ Building: <strong>${d.building}</strong></div>
        <div>👨‍🏫 Head: <strong>${d.head}</strong></div>
        <div>🚶 From Main Gate: <strong>${DEPT_MAP_INFO[d.code]?.walk || '—'} · ${DEPT_MAP_INFO[d.code]?.dist || '—'}</strong></div>
      </div>
      <div class="flex gap-2">
        <button onclick="navigate('map');closeModal();setTimeout(()=>navigateToDept('${d.code}'),300)" class="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm" style="background:${d.color}">🗺️ Navigate</button>
        <button onclick="navigate('departments','${d.code}');closeModal()" class="flex-1 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50">View Dept →</button>
      </div>
    </div>
  `);
}
