// ============================================================
// Placements, Internships & Hackathons Page
// ============================================================
function renderPlacements() {
  const placements   = AppData.placements;
  const internships  = AppData.internships;
  const hackathons   = AppData.hackathons;
  const stats        = AppData.analytics.placementStats;
  const totalPlaced  = placements.reduce((s, p) => s + p.students, 0);
  const avgPkg       = (placements.reduce((s, p) => s + p.package * p.students, 0) / totalPlaced).toFixed(1);
  const highestPkg   = Math.max(...placements.map(p => p.package));

  return `
  <div class="p-6 space-y-6">

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      ${[
        { label:"Students Placed",  value: totalPlaced,       icon:"🎓", color:"text-primary-600" },
        { label:"Companies Visited",value: placements.length, icon:"🏢", color:"text-emerald-600" },
        { label:"Avg Package",      value: "₹"+avgPkg+"L",    icon:"💰", color:"text-amber-600"   },
        { label:"Highest Package",  value: "₹"+highestPkg+"L",icon:"🏆", color:"text-blue-600"    },
      ].map(s => `
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div class="text-2xl mb-1">${s.icon}</div>
          <div class="text-2xl font-black ${s.color}">${s.value}</div>
          <div class="text-xs font-semibold text-gray-500 mt-0.5">${s.label}</div>
        </div>
      `).join('')}
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="border-b border-gray-100 px-5 flex gap-0">
        <button onclick="switchPlacementTab('placements')" id="tab-placements" class="placement-tab active-tab px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors" style="border-color:#1d4ed8;color:#1d4ed8">🏢 Placements</button>
        <button onclick="switchPlacementTab('internships')" id="tab-internships" class="placement-tab px-5 py-3.5 text-sm font-semibold border-b-2 border-transparent text-gray-400 transition-colors">📋 Internships</button>
        <button onclick="switchPlacementTab('hackathons')" id="tab-hackathons" class="placement-tab px-5 py-3.5 text-sm font-semibold border-b-2 border-transparent text-gray-400 transition-colors">💻 Hackathons</button>
      </div>

      <!-- Placements Tab -->
      <div id="panel-placements" class="placement-panel">
        <div class="px-5 py-3 border-b border-gray-50 flex flex-wrap gap-2 items-center justify-between">
          <p class="text-xs text-gray-400">Placement drive results · 2026 Batch</p>
          <div class="flex gap-2">
            <select id="place-type-filter" onchange="filterPlacements()" class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none">
              <option value="">All Types</option>
              <option value="Tech">Tech</option>
              <option value="IT">IT</option>
              <option value="Core">Core</option>
            </select>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th class="px-5 py-3 text-left">Company</th>
                <th class="px-4 py-3 text-left">Type</th>
                <th class="px-4 py-3 text-left">Dept</th>
                <th class="px-4 py-3 text-right">Package (LPA)</th>
                <th class="px-4 py-3 text-right">Students</th>
              </tr>
            </thead>
            <tbody id="placements-tbody">
              ${placements.map(p => {
                const typeColors = { Tech:'#1d4ed8', IT:'#166534', Core:'#b45309' };
                const typeBgs    = { Tech:'#eff6ff', IT:'#f0fdf4', Core:'#fffbeb' };
                return `
                <tr class="data-row border-t border-gray-50" data-type="${p.type}">
                  <td class="px-5 py-3">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0" style="background:#1d4ed8">${p.logo}</div>
                      <span class="font-semibold text-gray-800">${p.company}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3"><span class="badge text-xs" style="background:${typeBgs[p.type]};color:${typeColors[p.type]}">${p.type}</span></td>
                  <td class="px-4 py-3"><span class="badge text-xs" style="background:${deptBg(p.dept)};color:${deptColor(p.dept)}">${p.dept}</span></td>
                  <td class="px-4 py-3 text-right font-bold ${p.package >= 20 ? 'text-emerald-600' : 'text-gray-700'}">₹${p.package} L</td>
                  <td class="px-4 py-3 text-right font-semibold text-primary-600">${p.students}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Internships Tab -->
      <div id="panel-internships" class="placement-panel hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th class="px-5 py-3 text-left">Company</th>
                <th class="px-4 py-3 text-left">Role</th>
                <th class="px-4 py-3 text-left">Dept</th>
                <th class="px-4 py-3 text-left">Duration</th>
                <th class="px-4 py-3 text-right">Stipend/mo</th>
                <th class="px-4 py-3 text-left">Deadline</th>
                <th class="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              ${internships.map(i => `
              <tr class="data-row border-t border-gray-50">
                <td class="px-5 py-3 font-semibold text-gray-800">${i.company}</td>
                <td class="px-4 py-3 text-gray-600 text-xs">${i.role}</td>
                <td class="px-4 py-3"><span class="badge text-xs" style="background:${deptBg(i.dept)};color:${deptColor(i.dept)}">${i.dept}</span></td>
                <td class="px-4 py-3 text-gray-500 text-xs">${i.duration}</td>
                <td class="px-4 py-3 text-right font-semibold text-gray-700">₹${i.stipend.toLocaleString()}</td>
                <td class="px-4 py-3 text-xs text-gray-500">${formatDate(i.deadline)}</td>
                <td class="px-4 py-3 text-center">
                  ${i.status === 'Open'
                    ? `<button onclick="alert('Application submitted! Check your AU email.')" class="text-xs font-semibold px-3 py-1 rounded-lg text-white" style="background:#166534">Apply</button>`
                    : `<span class="badge text-xs" style="background:#f1f5f9;color:#64748b">Closed</span>`}
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Hackathons Tab -->
      <div id="panel-hackathons" class="placement-panel hidden">
        <div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          ${hackathons.map(h => `
          <div class="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-2">
              <h4 class="font-bold text-gray-800 text-sm">${h.name}</h4>
              <span class="badge text-xs flex-shrink-0 ml-2" style="${h.status === 'Upcoming' ? 'background:#dbeafe;color:#1d4ed8' : 'background:#f1f5f9;color:#64748b'}">${h.status}</span>
            </div>
            <div class="space-y-1.5 text-xs text-gray-500 mb-3">
              <div>📅 ${formatDate(h.date)}</div>
              <div>🏆 Prize: <span class="font-semibold text-gray-700">${h.prize}</span></div>
              <div>👥 Expected participants: ${h.participants}</div>
              <div>🏛️ Organiser: ${h.org}</div>
              <div>📂 Department: ${h.dept}</div>
            </div>
            ${h.status === 'Upcoming'
              ? `<button onclick="alert('Registered for ${h.name}! Check your email for confirmation.')" class="w-full text-xs font-semibold py-2 rounded-lg text-white transition-colors" style="background:#1d4ed8" onmouseover="this.style.background='#1e40af'" onmouseout="this.style.background='#1d4ed8'">Register Now</button>`
              : `<button disabled class="w-full text-xs font-semibold py-2 rounded-lg" style="background:#f1f5f9;color:#94a3b8">Event Completed</button>`}
          </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Year-wise Placement Chart area -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 class="font-bold text-gray-800 mb-4">Year-wise Placement Trend</h3>
      <canvas id="placementTrendChart" height="100"></canvas>
    </div>

  </div>
  `;
}

function switchPlacementTab(tab) {
  document.querySelectorAll('.placement-panel').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.placement-tab').forEach(t => {
    t.style.borderColor = 'transparent'; t.style.color = '#9ca3af';
  });
  document.getElementById('panel-' + tab).classList.remove('hidden');
  const btn = document.getElementById('tab-' + tab);
  btn.style.borderColor = '#1d4ed8'; btn.style.color = '#1d4ed8';

  if (tab === 'hackathons') initPlacementChart();
}

function filterPlacements() {
  const type = document.getElementById('place-type-filter').value;
  document.querySelectorAll('#placements-tbody tr').forEach(row => {
    row.style.display = !type || row.dataset.type === type ? '' : 'none';
  });
}

function initPlacementChart() {
  const stats = AppData.analytics.placementStats;
  const ctx = document.getElementById('placementTrendChart');
  if (!ctx) return;
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: stats.map(s => s.year),
      datasets: [
        { label:'Students Placed', data: stats.map(s => s.placed), backgroundColor:'#1d4ed8', borderRadius:6 },
        { label:'Avg Package (LPA)', data: stats.map(s => s.avg_package), backgroundColor:'#0ea5e9', borderRadius:6, yAxisID:'y1' },
      ]
    },
    options: {
      responsive:true,
      plugins:{ legend:{ position:'top' } },
      scales:{
        y:  { beginAtZero:true, title:{ display:true, text:'Students Placed' } },
        y1: { beginAtZero:true, position:'right', title:{ display:true, text:'Avg Package (LPA)' }, grid:{ drawOnChartArea:false } }
      }
    }
  });
  if (!window._charts) window._charts = [];
  window._charts.push(chart);
}
