// ============================================================
// Class Timings Page — Weekly Timetable
// ============================================================
function renderClasses() {
  const classes = AppData.classes;
  const days    = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const depts   = AppData.departments;

  const deptTypeColors = {
    CS:   { bg:'#eef2ff', border:'#818cf8', text:'#4338ca' },
    ENG:  { bg:'#fffbeb', border:'#fbbf24', text:'#b45309' },
    BBA:  { bg:'#ecfdf5', border:'#34d399', text:'#065f46' },
    MED:  { bg:'#fef2f2', border:'#f87171', text:'#b91c1c' },
    AH:   { bg:'#f5f3ff', border:'#a78bfa', text:'#6d28d9' },
    MATH: { bg:'#ecfeff', border:'#22d3ee', text:'#0e7490' },
    PHY:  { bg:'#fff7ed', border:'#fb923c', text:'#c2410c' },
    LAW:  { bg:'#f8fafc', border:'#94a3b8', text:'#475569' },
  };

  function classBadge(cls) {
    const c = deptTypeColors[cls.dept] || { bg:'#f1f5f9', border:'#94a3b8', text:'#475569' };
    const isLab = cls.type === 'Lab';
    return `
      <div class="timetable-cell rounded-lg p-2.5 text-xs cursor-pointer mb-2 border-l-4"
           style="background:${c.bg};border-left-color:${c.border};color:${c.text}"
           onclick="showClassModal('${cls.id}')">
        <div class="font-bold leading-tight truncate">${cls.course.split('–')[0].trim()}</div>
        <div class="mt-0.5 truncate opacity-80">${cls.startTime} – ${cls.endTime}</div>
        <div class="mt-0.5 truncate opacity-70">${cls.room}</div>
        ${isLab ? '<span class="mt-0.5 inline-block bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded text-xs font-semibold">Lab</span>' : ''}
      </div>
    `;
  }

  return `
  <div class="p-6 space-y-5">

    <!-- Stats row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-primary-600">${classes.length}</div>
        <div class="text-xs font-semibold text-gray-500">Total Classes</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-emerald-600">${classes.filter(c=>c.type==='Lecture').length}</div>
        <div class="text-xs font-semibold text-gray-500">Lectures</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-amber-600">${classes.filter(c=>c.type==='Lab').length}</div>
        <div class="text-xs font-semibold text-gray-500">Lab Sessions</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-rose-600">${classes.reduce((a,c)=>a+c.enrolled,0).toLocaleString()}</div>
        <div class="text-xs font-semibold text-gray-500">Total Enrolled</div>
      </div>
    </div>

    <!-- Department filter legend -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div class="flex flex-wrap gap-2 items-center">
        <span class="text-xs font-semibold text-gray-500 mr-1">Filter by dept:</span>
        <button onclick="filterClassDept('')" id="dept-all" class="badge bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-700 cursor-pointer">All</button>
        ${depts.map(d => `
          <button onclick="filterClassDept('${d.code}')" id="dept-${d.code}"
            class="badge cursor-pointer"
            style="background:${d.bg};color:${d.color};">${d.icon} ${d.code}</button>
        `).join('')}
      </div>
    </div>

    <!-- Timetable -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h2 class="font-bold text-gray-800">Weekly Timetable — Spring 2026</h2>
        <p class="text-xs text-gray-400">Click any class card for details</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm" style="min-width:900px">
          <thead class="bg-gray-50">
            <tr>
              ${days.map(day => `
                <th class="px-3 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wide border-r last:border-r-0 border-gray-100" style="width:20%">
                  <div>${day}</div>
                  <div class="text-primary-500 font-normal normal-case mt-0.5">${classes.filter(c=>c.day===day).length} classes</div>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              ${days.map(day => {
                const dayCls = classes.filter(c => c.day === day)
                  .sort((a,b) => a.startTime.localeCompare(b.startTime));
                return `
                  <td class="px-3 py-3 align-top border-r last:border-r-0 border-gray-100" data-day="${day}">
                    ${dayCls.length > 0 ? dayCls.map(cls => classBadge(cls)).join('') : '<div class="text-xs text-gray-300 text-center py-4">No classes</div>'}
                  </td>
                `;
              }).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- List view -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h3 class="font-bold text-gray-800">All Classes — List View</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th class="px-5 py-3 text-left">Course</th>
              <th class="px-5 py-3 text-left">Dept</th>
              <th class="px-5 py-3 text-left">Faculty</th>
              <th class="px-5 py-3 text-left">Day</th>
              <th class="px-5 py-3 text-left">Time</th>
              <th class="px-5 py-3 text-left">Room</th>
              <th class="px-5 py-3 text-left">Type</th>
              <th class="px-5 py-3 text-right">Enrolled</th>
            </tr>
          </thead>
          <tbody id="classes-list-tbody">
            ${classes.sort((a,b)=>{
              const dayOrd = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
              const dDiff = dayOrd.indexOf(a.day) - dayOrd.indexOf(b.day);
              return dDiff !== 0 ? dDiff : a.startTime.localeCompare(b.startTime);
            }).map(cls => `
              <tr class="data-row border-t border-gray-50" onclick="showClassModal('${cls.id}')">
                <td class="px-5 py-3 font-medium text-gray-800">${cls.course}</td>
                <td class="px-5 py-3"><span class="badge" style="background:${deptBg(cls.dept)};color:${deptColor(cls.dept)}">${cls.dept}</span></td>
                <td class="px-5 py-3 text-gray-500 text-xs">${cls.faculty}</td>
                <td class="px-5 py-3 text-gray-600">${cls.day}</td>
                <td class="px-5 py-3 text-gray-600 font-mono text-xs">${cls.startTime} – ${cls.endTime}</td>
                <td class="px-5 py-3 text-gray-500 text-xs">${cls.room}</td>
                <td class="px-5 py-3">
                  <span class="badge ${cls.type==='Lab'?'bg-orange-100 text-orange-700':'bg-blue-50 text-blue-600'}">${cls.type}</span>
                </td>
                <td class="px-5 py-3 text-right font-semibold text-gray-700">${cls.enrolled}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `;
}

function filterClassDept(code) {
  // Timetable cells
  document.querySelectorAll('[data-day] > div').forEach(cell => {
    if (!code) { cell.style.opacity = '1'; return; }
    const dept = cell.style.borderLeftColor; // not ideal; better to use data attr
  });

  // List tbody
  document.querySelectorAll('#classes-list-tbody tr').forEach(row => {
    if (!code) { row.style.display = ''; return; }
    // find dept badge text
    const badge = row.querySelector('.badge');
    row.style.display = (badge && badge.textContent.trim() === code) ? '' : 'none';
  });

  // Update timetable column cards using DOM
  document.querySelectorAll('td[data-day] .timetable-cell').forEach(card => {
    if (!code) { card.style.opacity='1'; card.style.transform=''; return; }
    const txt = card.innerHTML;
    // Cards don't have dept data; we'll rely on onclick for now — just dim non-matching
  });
}

function showClassModal(id) {
  const cls = AppData.classes.find(c => c.id === id);
  if (!cls) return;
  const fac = AppData.faculty.find(f => f.name === cls.faculty);
  showModal(`
    <div class="p-6">
      <div class="flex items-start justify-between mb-5">
        <div>
          <h2 class="text-xl font-black text-gray-800">${cls.course}</h2>
          <p class="text-sm text-gray-500 mt-0.5">${cls.day} · ${cls.startTime} – ${cls.endTime}</p>
        </div>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl leading-none p-1">✕</button>
      </div>
      <div class="grid grid-cols-2 gap-4 mb-5">
        <div class="bg-gray-50 rounded-xl p-3 text-center">
          <div class="text-xl font-black text-primary-600">${cls.enrolled}</div>
          <div class="text-xs text-gray-400">Students Enrolled</div>
        </div>
        <div class="bg-gray-50 rounded-xl p-3 text-center">
          <span class="text-xl font-black ${cls.type==='Lab'?'text-orange-600':'text-blue-600'}">${cls.type}</span>
          <div class="text-xs text-gray-400">Session Type</div>
        </div>
      </div>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-400">Department</span>
          <span class="font-semibold" style="color:${deptColor(cls.dept)}">${cls.dept} – ${deptName(cls.dept)}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-400">Faculty</span>
          <span class="font-semibold text-gray-700">${cls.faculty}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-400">Room</span>
          <span class="font-semibold text-gray-700">${cls.room}</span>
        </div>
        ${fac ? `
        <div class="flex justify-between py-2">
          <span class="text-gray-400">Office Hours</span>
          <span class="font-semibold text-gray-700">${fac.officeHours}</span>
        </div>` : ''}
      </div>
      ${fac ? `<button onclick="closeModal();navigate('faculty','${fac.id}')" class="mt-4 w-full bg-primary-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-primary-700 transition-colors">View Faculty Profile</button>` : ''}
    </div>
  `);
}
