// ============================================================
// Dashboard Page
// ============================================================

// Get the student record for the currently logged-in student
function getCurrentStudent() {
  const user = getCurrentUser();
  const uid  = (user.id || '').toLowerCase();
  return AppData.students.find(s => s.id.toLowerCase() === uid)
      || AppData.students.find(s => s.name.toLowerCase() === uid)
      || AppData.students[0]; // fallback to first student for demo
}

// ---- Student EMS Dashboard ----
function renderStudentDashboard() {
  const user = getCurrentUser();
  const s    = getCurrentStudent();

  const actions = [
    { label:'Student Details',       icon:'👤', color:'#1d4ed8', onclick:"navigate('students')" },
    { label:'Exam Registration',     icon:'📝', color:'#166534', onclick:"navigate('exams')" },
    { label:'Challan Generation',    icon:'🧾', color:'#0e7490', onclick:"navigate('fees')" },
    { label:'Challan Payment',       icon:'💳', color:'#b45309', onclick:"navigate('fees')" },
    { label:'Payment Status',        icon:'✅', color:'#1d4ed8', onclick:"navigate('fees')" },
    { label:'Print Receipt',         icon:'🖨️', color:'#b91c1c', onclick:"navigate('fees')" },
    { label:'Download Hall-Ticket',  icon:'🎫', color:'#0e7490', onclick:"navigate('exams')" },
    { label:'Results',               icon:'📊', color:'#4d7c0f', onclick:"navigate('exams')" },
    { label:'Download SEF Form',     icon:'📄', color:'#166534', onclick:"navigate('certificates')" },
    { label:'Tuition Fees',          icon:'💰', color:'#ea580c', onclick:"navigate('fees')" },
    { label:'Check Backlog Subjects',icon:'📋', color:'#1d4ed8', onclick:"navigate('exams')" },
    { label:'Feedback for Faculty',  icon:'💬', color:'#b91c1c', onclick:"navigate('faculty')" },
  ];

  return `
  <div class="p-6 max-w-4xl mx-auto space-y-5">

    <!-- Welcome Banner -->
    <div class="rounded-2xl p-5 text-white shadow-lg flex items-center justify-between" style="background:linear-gradient(135deg,#0f172a 0%,#1e40af 40%,#1d4ed8 70%,#1e3a8a 100%)">
      <div>
        <div class="text-xs font-semibold mb-1" style="color:#fde047">Andhra University · Spring 2026</div>
        <div class="text-lg font-black">Welcome, ${s ? s.name : user.name}</div>
        <div class="text-sm mt-0.5" style="color:#bae6fd">${s ? s.id : user.id.toUpperCase()} · ${s ? s.dept + ' Dept · Year ' + s.year : ''}</div>
      </div>
      <div class="text-right text-xs" style="color:#fde047">
        <div class="text-2xl mb-1">🎓</div>
        <div>AU EMS</div>
      </div>
    </div>

    <!-- Action Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      ${actions.map(a => `
        <button onclick="${a.onclick}"
          class="flex flex-col items-center justify-center gap-2 rounded-2xl p-5 text-white font-semibold text-sm shadow hover:opacity-90 active:scale-95 transition-all"
          style="background:${a.color}; min-height:90px">
          <span class="text-2xl">${a.icon}</span>
          <span class="text-center leading-tight">${a.label}</span>
        </button>
      `).join('')}
    </div>

  </div>
  `;
}

function renderDashboard() {
  if (getCurrentRole() === 'student') return renderStudentDashboard();

  const d = AppData;
  const upcomingEvents = d.events.filter(e => e.status === 'Upcoming').slice(0, 4);
  const upcomingExams  = d.exams.filter(x => isUpcoming(x.date)).slice(0, 4);
  const recentStudents = d.students.slice(0, 6);

  const statCards = [
    { label:'Total Students', value: d.university.totalStudents.toLocaleString(), icon:'🎓', color:'bg-primary-600', light:'bg-primary-50', textColor:'text-primary-600', delta:'+3.8%', note:'vs last year' },
    { label:'Faculty Members', value: d.university.totalFaculty,                  icon:'👩‍🏫', color:'bg-emerald-500', light:'bg-emerald-50', textColor:'text-emerald-600',delta:'+5',    note:'new this term'  },
    { label:'Departments',     value: d.university.departments,                   icon:'🏛️', color:'bg-amber-500',   light:'bg-amber-50',  textColor:'text-amber-600',  delta:'',      note:'academic units'  },
    { label:'Active Courses',  value: d.university.courses,                       icon:'📚', color:'bg-rose-500',    light:'bg-rose-50',   textColor:'text-rose-600',   delta:'+12',   note:'this semester'   },
  ];

  return `
  <div class="p-6 space-y-6">

    <!-- Welcome Banner -->
    <div class="rounded-2xl p-6 text-white shadow-xl relative overflow-hidden" style="background:linear-gradient(135deg,#0f172a 0%,#1e40af 40%,#1d4ed8 70%,#1e3a8a 100%)">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold mb-1">Welcome back, Admin!</h2>
          <p class="text-sm" style="color:#fde047">Spring Semester 2026 · Andhra University, Visakhapatnam</p>
        </div>
        <div class="text-right hidden sm:block">
          <div class="text-3xl font-black">${d.university.totalStudents.toLocaleString()}</div>
          <div class="text-sm" style="color:#fde047">Total Enrolled Students</div>
        </div>
      </div>
      <div class="mt-4 flex flex-wrap gap-3">
        <button onclick="navigate('students')" class="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors backdrop-blur-sm">View Students</button>
        <button onclick="navigate('analytics')" class="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors backdrop-blur-sm">View Analytics</button>
        <button onclick="navigate('events')" class="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors backdrop-blur-sm">Upcoming Events</button>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      ${statCards.map(s => `
        <div class="stat-card bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div class="flex items-start justify-between mb-3">
            <div class="${s.light} w-11 h-11 rounded-xl flex items-center justify-center text-xl">${s.icon}</div>
            ${s.delta ? `<span class="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">${s.delta}</span>` : ''}
          </div>
          <div class="text-3xl font-black text-gray-800 mb-0.5">${s.value}</div>
          <div class="text-sm font-semibold text-gray-600">${s.label}</div>
          <div class="text-xs text-gray-400 mt-0.5">${s.note}</div>
        </div>
      `).join('')}
    </div>

    <!-- Two Column Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Department Strength -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-800">Department Strength</h3>
          <button onclick="navigate('departments')" class="text-xs text-primary-600 hover:text-primary-800 font-medium">View all →</button>
        </div>
        <div class="space-y-3">
          ${d.departments.map(dept => {
            const pct = Math.round((dept.students / d.university.totalStudents) * 100);
            return `
              <div>
                <div class="flex justify-between items-center mb-1">
                  <span class="text-sm font-medium text-gray-700 flex items-center gap-1.5">${dept.icon} ${dept.code}</span>
                  <span class="text-sm font-bold" style="color:${dept.color}">${dept.students.toLocaleString()}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${pct}%; background:${dept.color}"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Upcoming Events + Exams -->
      <div class="lg:col-span-2 space-y-6">

        <!-- Upcoming Events -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-800">Upcoming Events</h3>
            <button onclick="navigate('events')" class="text-xs text-primary-600 hover:text-primary-800 font-medium">View all →</button>
          </div>
          <div class="space-y-3">
            ${upcomingEvents.map(e => {
              const typeClass = `badge-${e.type.toLowerCase()}`;
              return `
                <div class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onclick="navigate('events')">
                  <div class="rounded-xl p-2.5 text-sm font-bold flex-shrink-0 text-center min-w-[50px]" style="background:#dbeafe;color:#1d4ed8">
                    <div class="text-lg leading-none">${new Date(e.date).getDate()}</div>
                    <div class="text-xs">${new Date(e.date).toLocaleDateString('en-US',{month:'short'})}</div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold text-gray-800 text-sm truncate">${e.title}</div>
                    <div class="text-xs text-gray-500 mt-0.5">${e.time} · ${e.location}</div>
                  </div>
                  <span class="badge ${typeClass} flex-shrink-0">${e.type}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Upcoming Exams -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-800">Upcoming Exams</h3>
            <button onclick="navigate('exams')" class="text-xs text-primary-600 hover:text-primary-800 font-medium">View all →</button>
          </div>
          <div class="space-y-2">
            ${upcomingExams.map(x => `
              <div class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onclick="navigate('exams')">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full flex-shrink-0" style="background:${deptColor(x.dept)}"></div>
                  <div>
                    <div class="text-sm font-medium text-gray-800">${x.course}</div>
                    <div class="text-xs text-gray-400">${formatDate(x.date)} · ${x.time}</div>
                  </div>
                </div>
                <span class="badge ${x.type === 'Final' ? 'badge-final' : 'badge-midterm'}">${x.type}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Students -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <h3 class="font-bold text-gray-800">Recent Students</h3>
        <button onclick="navigate('students')" class="text-xs text-primary-600 hover:text-primary-800 font-medium">View all →</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th class="px-5 py-3 text-left">Student</th>
              <th class="px-5 py-3 text-left">Department</th>
              <th class="px-5 py-3 text-left">Year</th>
              <th class="px-5 py-3 text-left">GPA</th>
              <th class="px-5 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            ${recentStudents.map(s => `
              <tr class="data-row border-t border-gray-50" onclick="navigate('students','${s.id}')">
                <td class="px-5 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style="background:${deptColor(s.dept)}">${s.name.split(' ').map(n=>n[0]).join('')}</div>
                    <div>
                      <div class="font-semibold text-gray-800">${s.name}</div>
                      <div class="text-xs text-gray-400">${s.id}</div>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-3">
                  <span class="badge" style="background:${deptBg(s.dept)};color:${deptColor(s.dept)}">${s.dept}</span>
                </td>
                <td class="px-5 py-3 text-gray-600">Year ${s.year}</td>
                <td class="px-5 py-3 font-bold ${gpaColor(s.gpa)}">${s.gpa}</td>
                <td class="px-5 py-3">${statusBadge(s.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

  </div>
  `;
}
