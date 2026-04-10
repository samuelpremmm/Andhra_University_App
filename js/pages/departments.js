// ============================================================
// Departments Page
// ============================================================
function renderDepartments() {
  const depts = AppData.departments;

  return `
  <div class="p-6 space-y-5">

    <!-- Header stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-primary-600">${depts.length}</div>
        <div class="text-xs font-semibold text-gray-500">Departments</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-emerald-600">${depts.reduce((a,d)=>a+d.students,0).toLocaleString()}</div>
        <div class="text-xs font-semibold text-gray-500">Total Students</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-amber-600">${depts.reduce((a,d)=>a+d.faculty,0)}</div>
        <div class="text-xs font-semibold text-gray-500">Total Faculty</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-rose-600">${AppData.university.courses}</div>
        <div class="text-xs font-semibold text-gray-500">Total Courses</div>
      </div>
    </div>

    <!-- Department Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      ${depts.map(dept => {
        const pct = Math.round((dept.students / AppData.university.totalStudents) * 100);
        const facultyInDept = AppData.faculty.filter(f => f.dept === dept.code);
        return `
          <div class="dept-card bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" onclick="navigate('departments','${dept.code}')">
            <!-- Header -->
            <div class="h-3" style="background:${dept.color}"></div>
            <div class="p-5">
              <!-- Icon + Name -->
              <div class="flex items-start justify-between mb-3">
                <div class="text-4xl">${dept.icon}</div>
                <span class="badge" style="background:${dept.bg};color:${dept.color}">${dept.code}</span>
              </div>
              <h3 class="font-bold text-gray-800 text-base leading-tight mb-0.5">${dept.name}</h3>
              <p class="text-xs text-gray-400 mb-3">${dept.building}</p>

              <!-- Stats -->
              <div class="grid grid-cols-2 gap-2 mb-3">
                <div class="bg-gray-50 rounded-lg p-2 text-center">
                  <div class="font-black text-lg" style="color:${dept.color}">${dept.students.toLocaleString()}</div>
                  <div class="text-xs text-gray-400">Students</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-2 text-center">
                  <div class="font-black text-lg text-gray-700">${dept.faculty}</div>
                  <div class="text-xs text-gray-400">Faculty</div>
                </div>
              </div>

              <!-- Progress -->
              <div class="mb-3">
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-gray-400">Share of total</span>
                  <span class="font-semibold" style="color:${dept.color}">${pct}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${pct}%;background:${dept.color}"></div>
                </div>
              </div>

              <!-- Head -->
              <div class="flex items-center gap-2 pt-3 border-t border-gray-100">
                <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style="background:${dept.color}">
                  ${dept.head.split(' ').slice(-1)[0][0]}
                </div>
                <div class="min-w-0">
                  <div class="text-xs font-semibold text-gray-600 truncate">${dept.head}</div>
                  <div class="text-xs text-gray-400">Department Head</div>
                </div>
              </div>
            </div>
            <div class="px-5 pb-4">
              <button class="w-full text-center text-xs font-semibold py-2 rounded-lg transition-colors" style="background:${dept.bg};color:${dept.color}">
                View Department →
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  </div>
  `;
}

// ---- Department Detail ----
function renderDeptDetail(code) {
  const dept = AppData.departments.find(d => d.code === code);
  if (!dept) return `<div class="p-8 text-center text-gray-400">Department not found.</div>`;

  const students = AppData.students.filter(s => s.dept === code);
  const faculty  = AppData.faculty.filter(f => f.dept === code);
  const classes  = AppData.classes.filter(c => c.dept === code);
  const exams    = AppData.exams.filter(x => x.dept === code);

  const byYear = [1,2,3,4].map(y => ({ year: y, count: students.filter(s=>s.year===y).length }));
  const avgGpa = students.length ? (students.reduce((a,s)=>a+s.gpa,0)/students.length).toFixed(2) : 'N/A';

  return `
  <div class="p-6 max-w-5xl mx-auto space-y-5">

    <!-- Back -->
    <button onclick="navigate('departments')" class="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-medium">
      ← Back to Departments
    </button>

    <!-- Header -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="h-3" style="background:${dept.color}"></div>
      <div class="p-6">
        <div class="flex items-center gap-5">
          <div class="text-5xl">${dept.icon}</div>
          <div>
            <h1 class="text-2xl font-black text-gray-800">${dept.name}</h1>
            <p class="text-gray-500 text-sm mt-0.5">Department Code: ${dept.code} · ${dept.building}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mt-5">
          <div class="text-center p-3 rounded-xl" style="background:${dept.bg}">
            <div class="text-2xl font-black" style="color:${dept.color}">${dept.students.toLocaleString()}</div>
            <div class="text-xs text-gray-400 mt-0.5">Students</div>
          </div>
          <div class="text-center p-3 rounded-xl bg-gray-50">
            <div class="text-2xl font-black text-gray-700">${dept.faculty}</div>
            <div class="text-xs text-gray-400 mt-0.5">Faculty</div>
          </div>
          <div class="text-center p-3 rounded-xl bg-gray-50">
            <div class="text-2xl font-black text-gray-700">${classes.length}</div>
            <div class="text-xs text-gray-400 mt-0.5">Classes</div>
          </div>
          <div class="text-center p-3 rounded-xl bg-gray-50">
            <div class="text-2xl font-black text-emerald-600">${avgGpa}</div>
            <div class="text-xs text-gray-400 mt-0.5">Avg GPA</div>
          </div>
          <div class="text-center p-3 rounded-xl bg-gray-50">
            <div class="text-2xl font-black text-amber-600">${exams.length}</div>
            <div class="text-xs text-gray-400 mt-0.5">Exams</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

      <!-- Year-wise Strength -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="font-bold text-gray-800 mb-4">Year-wise Student Strength</h3>
        <div class="space-y-3">
          ${byYear.map(row => {
            const pct = students.length ? Math.round((row.count/students.length)*100) : 0;
            return `
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-medium text-gray-700">Year ${row.year}</span>
                  <span class="font-bold" style="color:${dept.color}">${row.count} students</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${pct}%;background:${dept.color}"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Faculty -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex justify-between mb-4">
          <h3 class="font-bold text-gray-800">Faculty (${faculty.length})</h3>
          <button onclick="navigate('faculty')" class="text-xs text-primary-600 hover:text-primary-800 font-medium">View all →</button>
        </div>
        <div class="space-y-2">
          ${faculty.map(f => `
            <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onclick="navigate('faculty','${f.id}')">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style="background:${dept.color}">
                ${f.name.split(' ').filter(n=>!['Dr.','Prof.'].includes(n)).map(n=>n[0]).join('').slice(0,2)}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold text-gray-800 truncate">${f.name}</div>
                <div class="text-xs text-gray-400 truncate">${f.title} · ${f.specialization}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Classes -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex justify-between mb-4">
          <h3 class="font-bold text-gray-800">Active Classes (${classes.length})</h3>
          <button onclick="navigate('classes')" class="text-xs text-primary-600 hover:text-primary-800 font-medium">View timetable →</button>
        </div>
        <div class="space-y-2">
          ${classes.map(c => `
            <div class="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
              <div class="min-w-0">
                <div class="text-sm font-semibold text-gray-800 truncate">${c.course}</div>
                <div class="text-xs text-gray-400">${c.day} · ${c.startTime} – ${c.endTime}</div>
              </div>
              <div class="text-right flex-shrink-0 ml-3">
                <div class="text-sm font-bold text-gray-700">${c.enrolled}</div>
                <div class="text-xs text-gray-400">enrolled</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Students sample -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex justify-between mb-4">
          <h3 class="font-bold text-gray-800">Students Sample (${students.length})</h3>
          <button onclick="navigate('students')" class="text-xs text-primary-600 hover:text-primary-800 font-medium">View all →</button>
        </div>
        <div class="space-y-2">
          ${students.slice(0,6).map(s => `
            <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onclick="navigate('students','${s.id}')">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style="background:${dept.color}">
                ${s.name.split(' ').map(n=>n[0]).join('')}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold text-gray-800 truncate">${s.name}</div>
                <div class="text-xs text-gray-400">Year ${s.year} · GPA ${s.gpa}</div>
              </div>
              ${statusBadge(s.status)}
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  </div>
  `;
}
