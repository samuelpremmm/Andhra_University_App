// ============================================================
// Students Page
// ============================================================
function renderStudents() {
  const students = AppData.students;
  const depts = AppData.departments;
  const totalByYear = [1,2,3,4].map(y => students.filter(s => s.year === y).length);

  return `
  <div class="p-6 space-y-5">

    <!-- Top stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      ${[1,2,3,4].map(y => `
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div class="text-2xl font-black text-primary-600">${totalByYear[y-1]}</div>
          <div class="text-xs font-semibold text-gray-500 mt-0.5">Year ${y} Students</div>
        </div>
      `).join('')}
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h2 class="font-bold text-gray-800">Student Directory</h2>
          <p class="text-xs text-gray-400">${students.length} students enrolled · Spring 2026</p>
        </div>
        <div class="flex gap-2 flex-wrap">
          <input id="student-search" type="text" placeholder="Search students..."
            class="search-input border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-400 w-48"
            oninput="filterStudents()" />
          <select id="dept-filter" onchange="filterStudents()"
            class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-400 bg-white">
            <option value="">All Depts</option>
            ${depts.map(d => `<option value="${d.code}">${d.code}</option>`).join('')}
          </select>
          <select id="year-filter" onchange="filterStudents()"
            class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-400 bg-white">
            <option value="">All Years</option>
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="4">Year 4</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th class="px-5 py-3 text-left">Student</th>
              <th class="px-5 py-3 text-left">Dept</th>
              <th class="px-5 py-3 text-left">Year</th>
              <th class="px-5 py-3 text-left">GPA</th>
              <th class="px-5 py-3 text-left">Advisor</th>
              <th class="px-5 py-3 text-left">Status</th>
              <th class="px-5 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody id="students-tbody">
            ${students.map(s => studentRow(s)).join('')}
          </tbody>
        </table>
      </div>
      <div id="no-results-msg" class="hidden text-center py-8 text-gray-400 text-sm">No students match your filters.</div>
    </div>
  </div>
  `;
}

function studentRow(s) {
  return `
    <tr class="data-row border-t border-gray-50" data-dept="${s.dept}" data-year="${s.year}"
        data-name="${s.name.toLowerCase()}" data-id="${s.id.toLowerCase()}"
        onclick="navigate('students','${s.id}')">
      <td class="px-5 py-3">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style="background:${deptColor(s.dept)}">
            ${s.name.split(' ').map(n=>n[0]).join('')}
          </div>
          <div>
            <div class="font-semibold text-gray-800">${s.name}</div>
            <div class="text-xs text-gray-400">${s.id} · ${s.email}</div>
          </div>
        </div>
      </td>
      <td class="px-5 py-3">
        <span class="badge" style="background:${deptBg(s.dept)};color:${deptColor(s.dept)}">${s.dept}</span>
      </td>
      <td class="px-5 py-3 text-gray-600 font-medium">Year ${s.year}</td>
      <td class="px-5 py-3 font-bold ${gpaColor(s.gpa)}">${s.gpa}</td>
      <td class="px-5 py-3 text-gray-500 text-xs">${s.advisor}</td>
      <td class="px-5 py-3">${statusBadge(s.status)}</td>
      <td class="px-5 py-3">
        <button class="text-primary-600 hover:text-primary-800 text-xs font-medium hover:underline">View →</button>
      </td>
    </tr>
  `;
}

function filterStudents() {
  const q    = document.getElementById('student-search').value.toLowerCase();
  const dept = document.getElementById('dept-filter').value;
  const year = document.getElementById('year-filter').value;
  let count = 0;

  document.querySelectorAll('#students-tbody tr').forEach(row => {
    const matchQ    = !q    || row.dataset.name.includes(q) || row.dataset.id.includes(q);
    const matchDept = !dept || row.dataset.dept === dept;
    const matchYear = !year || row.dataset.year === year;
    const show = matchQ && matchDept && matchYear;
    row.style.display = show ? '' : 'none';
    if (show) count++;
  });

  document.getElementById('no-results-msg').classList.toggle('hidden', count > 0);
}

// ---- Student Detail ----
function renderStudentDetail(id) {
  const s = AppData.students.find(x => x.id === id);
  if (!s) return `<div class="p-8 text-center text-gray-400">Student not found.</div>`;

  const dept = AppData.departments.find(d => d.code === s.dept);
  const facultyAdvisor = AppData.faculty.find(f => f.name === s.advisor);

  const gpaPercent = Math.round((s.gpa / 4) * 100);

  return `
  <div class="p-6 max-w-4xl mx-auto space-y-5">

    <!-- Back -->
    <button onclick="navigate('students')" class="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-medium mb-2">
      ← Back to Students
    </button>

    <!-- Profile Header -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="h-24 bg-gradient-to-r from-primary-800 to-primary-950"></div>
      <div class="px-6 pb-6">
        <div class="flex items-end gap-4 -mt-10 mb-4">
          <div class="w-20 h-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white text-2xl font-black"
               style="background:${dept ? dept.color : '#6366f1'}">
            ${s.name.split(' ').map(n=>n[0]).join('')}
          </div>
          <div class="pb-1">
            <h1 class="text-2xl font-black text-gray-800">${s.name}</h1>
            <p class="text-gray-500 text-sm">${s.id} · Year ${s.year} · ${dept ? dept.name : s.dept}</p>
          </div>
          <div class="ml-auto pb-1">${statusBadge(s.status)}</div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div class="text-center p-3 bg-gray-50 rounded-xl">
            <div class="text-2xl font-black ${gpaColor(s.gpa)}">${s.gpa}</div>
            <div class="text-xs text-gray-400 mt-0.5">GPA</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-xl">
            <div class="text-2xl font-black text-primary-600">${s.courses.length}</div>
            <div class="text-xs text-gray-400 mt-0.5">Courses</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-xl">
            <div class="text-2xl font-black text-gray-800">${s.year}</div>
            <div class="text-xs text-gray-400 mt-0.5">Year</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-xl">
            <div class="text-2xl font-black text-gray-800">${s.age}</div>
            <div class="text-xs text-gray-400 mt-0.5">Age</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

      <!-- Contact Info -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="font-bold text-gray-800 mb-4">Contact Information</h3>
        <div class="space-y-3 text-sm">
          <div class="flex items-center gap-3">
            <span class="text-gray-400 w-5 text-base">📧</span>
            <span class="text-gray-600">${s.email}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-gray-400 w-5 text-base">📞</span>
            <span class="text-gray-600">${s.phone}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-gray-400 w-5 text-base">🏛️</span>
            <span class="text-gray-600">${dept ? dept.name : s.dept} Department</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-gray-400 w-5 text-base">📅</span>
            <span class="text-gray-600">Joined: ${s.joined}</span>
          </div>
        </div>
      </div>

      <!-- Academic Advisor -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="font-bold text-gray-800 mb-4">Academic Advisor</h3>
        ${facultyAdvisor ? `
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style="background:${deptColor(facultyAdvisor.dept)}">
              ${facultyAdvisor.name.split(' ').slice(-1)[0][0]}
            </div>
            <div>
              <div class="font-semibold text-gray-800 text-sm">${facultyAdvisor.name}</div>
              <div class="text-xs text-gray-400">${facultyAdvisor.title}</div>
            </div>
          </div>
          <div class="space-y-2 text-xs text-gray-500">
            <div>📧 ${facultyAdvisor.email}</div>
            <div>🏢 Office: ${facultyAdvisor.office}</div>
            <div>🕐 Office Hours: ${facultyAdvisor.officeHours}</div>
          </div>
          <button onclick="navigate('faculty','${facultyAdvisor.id}')" class="mt-3 text-xs text-primary-600 hover:text-primary-800 font-medium">View Profile →</button>
        ` : `<p class="text-sm text-gray-400">Advisor: ${s.advisor}</p>`}
      </div>

      <!-- GPA Progress -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="font-bold text-gray-800 mb-4">Academic Performance</h3>
        <div class="mb-3">
          <div class="flex justify-between text-sm mb-1">
            <span class="text-gray-600">Current GPA</span>
            <span class="font-bold ${gpaColor(s.gpa)}">${s.gpa} / 4.0</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill bg-primary-500" style="width:${gpaPercent}%"></div>
          </div>
        </div>
        <div class="text-xs text-gray-400 mt-2">
          ${s.gpa >= 3.7 ? '🏆 Dean\'s List eligible' : s.gpa >= 3.0 ? '✅ Good academic standing' : '⚠️ Academic review recommended'}
        </div>
      </div>

      <!-- Enrolled Courses -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="font-bold text-gray-800 mb-4">Enrolled Courses (${s.courses.length})</h3>
        <div class="space-y-2">
          ${s.courses.map(c => {
            const cls = AppData.classes.find(cl => cl.course.startsWith(c));
            return `
              <div class="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                <div>
                  <div class="text-sm font-semibold text-gray-800">${c}</div>
                  ${cls ? `<div class="text-xs text-gray-400">${cls.faculty} · ${cls.room}</div>` : ''}
                </div>
                ${cls ? `<span class="text-xs text-gray-400">${cls.day}</span>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>

    </div>
  </div>
  `;
}
