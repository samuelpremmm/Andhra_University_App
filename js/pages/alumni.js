// ============================================================
// Alumni Portal
// ============================================================
function renderAlumni() {
  const alumni = AppData.alumni;

  return `
  <div class="p-6 space-y-5">

    <!-- Banner -->
    <div class="rounded-2xl p-6 text-white shadow-xl relative overflow-hidden" style="background:linear-gradient(135deg,#0f172a 0%,#1e40af 40%,#1d4ed8 70%,#1e3a8a 100%)">
      <h2 class="text-2xl font-bold mb-1">AU Alumni Network</h2>
      <p class="text-sm" style="color:#fde047">Connecting graduates since 1926 · ${alumni.length}+ Notable Alumni listed</p>
      <div class="mt-4 flex gap-3 flex-wrap">
        <button onclick="showAlumniRegister()" class="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">Register as Alumni</button>
        <button onclick="alert('Coming soon: Alumni Connect feature')" class="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">Connect with Seniors</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      ${[
        { label:"Total Alumni",    value:"50,000+", icon:"🎓" },
        { label:"Countries",       value:"32",      icon:"🌍" },
        { label:"Top Companies",   value:"200+",    icon:"🏢" },
        { label:"Entrepreneurs",   value:"800+",    icon:"🚀" },
      ].map(s => `
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div class="text-2xl mb-1">${s.icon}</div>
          <div class="text-xl font-black text-primary-600">${s.value}</div>
          <div class="text-xs font-semibold text-gray-500 mt-0.5">${s.label}</div>
        </div>
      `).join('')}
    </div>

    <!-- Alumni Grid -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <h2 class="font-bold text-gray-800">Notable Alumni</h2>
        <div class="flex gap-2">
          <input id="alumni-search" type="text" placeholder="Search alumni..."
            class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-400 w-44"
            oninput="filterTable('alumni-search','alumni-tbody')"/>
          <select id="alumni-dept-filter" onchange="filterAlumni()" class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-400 bg-white">
            <option value="">All Depts</option>
            ${AppData.departments.map(d => `<option value="${d.code}">${d.code}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th class="px-5 py-3 text-left">Alumni</th>
              <th class="px-4 py-3 text-left">Batch</th>
              <th class="px-4 py-3 text-left">Dept</th>
              <th class="px-4 py-3 text-left">Current Role</th>
              <th class="px-4 py-3 text-left">Company</th>
              <th class="px-4 py-3 text-left">Location</th>
              <th class="px-4 py-3 text-center">Connect</th>
            </tr>
          </thead>
          <tbody id="alumni-tbody">
            ${alumni.map(a => `
            <tr class="data-row border-t border-gray-50" data-dept="${a.dept}">
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style="background:${deptColor(a.dept)}">${a.img}</div>
                  <div>
                    <div class="font-semibold text-gray-800">${a.name}</div>
                    <div class="text-xs text-gray-400">${a.id}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-600 font-medium">${a.batch}</td>
              <td class="px-4 py-3"><span class="badge text-xs" style="background:${deptBg(a.dept)};color:${deptColor(a.dept)}">${a.dept}</span></td>
              <td class="px-4 py-3 text-gray-700 text-xs font-medium">${a.role}</td>
              <td class="px-4 py-3 text-gray-600 text-xs">${a.company}</td>
              <td class="px-4 py-3 text-gray-400 text-xs">📍 ${a.location}</td>
              <td class="px-4 py-3 text-center">
                <button onclick="alert('Connection request sent to ${a.name}!')" class="text-xs font-semibold px-3 py-1 rounded-lg" style="background:#eff6ff;color:#1d4ed8" onmouseover="this.style.background='#1d4ed8';this.style.color='white'" onmouseout="this.style.background='#eff6ff';this.style.color='#1d4ed8'">Connect</button>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `;
}

function filterAlumni() {
  const dept = document.getElementById('alumni-dept-filter').value;
  document.querySelectorAll('#alumni-tbody tr').forEach(row => {
    row.style.display = !dept || row.dataset.dept === dept ? '' : 'none';
  });
}

function showAlumniRegister() {
  showModal(`
    <div class="p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-black text-gray-800">Alumni Registration</h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
      </div>
      <div class="space-y-3">
        <input type="text" placeholder="Full Name" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>
        <div class="grid grid-cols-2 gap-3">
          <input type="text" placeholder="Batch Year (e.g. 2020)" class="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>
          <select class="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 bg-white">
            <option>Department</option>
            ${AppData.departments.map(d => `<option>${d.code} – ${d.name}</option>`).join('')}
          </select>
        </div>
        <input type="text" placeholder="Current Company" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>
        <input type="text" placeholder="Current Role / Designation" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>
        <input type="email" placeholder="Email Address" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>
        <button onclick="document.getElementById('modal-content').innerHTML='<div class=\'p-8 text-center\'><div class=\'text-4xl mb-3\'>🎓</div><h2 class=\'text-xl font-black text-gray-800 mb-2\'>Registered!</h2><p class=\'text-sm text-gray-500 mb-5\'>Welcome to the AU Alumni Network. Your profile is under review.</p><button onclick=\'closeModal()\' class=\'px-6 py-2.5 rounded-xl text-white font-semibold text-sm\' style=\'background:#1d4ed8\'>Close</button></div>'"
          class="w-full py-2.5 rounded-xl text-white font-bold text-sm" style="background:#1d4ed8">
          Register
        </button>
      </div>
    </div>
  `);
}
