// ============================================================
// Faculty Page
// ============================================================
function renderFaculty() {
  const faculty = AppData.faculty;
  const depts   = AppData.departments;

  return `
  <div class="p-6 space-y-5">

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-primary-600">${AppData.university.totalFaculty}</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Total Faculty</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-emerald-600">${faculty.filter(f=>f.title.includes('Professor &')).length}</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Dept. Heads</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-amber-600">${faculty.filter(f=>f.title.includes('Associate')).length}</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Assoc. Professors</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-rose-600">${faculty.filter(f=>f.title.includes('Assistant')).length}</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Asst. Professors</div>
      </div>
    </div>

    <!-- Faculty Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h2 class="font-bold text-gray-800">Faculty Directory</h2>
          <p class="text-xs text-gray-400">${faculty.length} faculty members shown</p>
        </div>
        <div class="flex gap-2 flex-wrap">
          <input id="faculty-search" type="text" placeholder="Search faculty..."
            class="search-input border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-400 w-48"
            oninput="filterFaculty()" />
          <select id="faculty-dept-filter" onchange="filterFaculty()"
            class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-400 bg-white">
            <option value="">All Depts</option>
            ${depts.map(d => `<option value="${d.code}">${d.code}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th class="px-5 py-3 text-left">Faculty</th>
              <th class="px-5 py-3 text-left">Title</th>
              <th class="px-5 py-3 text-left">Dept</th>
              <th class="px-5 py-3 text-left">Specialization</th>
              <th class="px-5 py-3 text-left">Office</th>
              <th class="px-5 py-3 text-left">Publications</th>
              <th class="px-5 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody id="faculty-tbody">
            ${faculty.map(f => facultyRow(f)).join('')}
          </tbody>
        </table>
      </div>
      <div id="no-faculty-msg" class="hidden text-center py-8 text-gray-400 text-sm">No faculty match your search.</div>
    </div>
  </div>
  `;
}

function facultyRow(f) {
  return `
    <tr class="data-row border-t border-gray-50" data-dept="${f.dept}"
        data-name="${f.name.toLowerCase()}" data-spec="${f.specialization.toLowerCase()}"
        onclick="navigate('faculty','${f.id}')">
      <td class="px-5 py-3">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style="background:${deptColor(f.dept)}">
            ${f.name.split(' ').filter(n=>n.length>2 && !['Dr.','Prof.'].includes(n)).map(n=>n[0]).join('').slice(0,2)}
          </div>
          <div>
            <div class="font-semibold text-gray-800">${f.name}</div>
            <div class="text-xs text-gray-400">${f.email}</div>
          </div>
        </div>
      </td>
      <td class="px-5 py-3 text-gray-600 text-xs">${f.title}</td>
      <td class="px-5 py-3">
        <span class="badge" style="background:${deptBg(f.dept)};color:${deptColor(f.dept)}">${f.dept}</span>
      </td>
      <td class="px-5 py-3 text-gray-600">${f.specialization}</td>
      <td class="px-5 py-3 text-gray-500 text-xs">${f.office}</td>
      <td class="px-5 py-3 text-center">
        <span class="font-bold text-gray-700">${f.publications}</span>
      </td>
      <td class="px-5 py-3">
        <button class="text-primary-600 hover:text-primary-800 text-xs font-medium hover:underline">View →</button>
      </td>
    </tr>
  `;
}

function filterFaculty() {
  const q    = document.getElementById('faculty-search').value.toLowerCase();
  const dept = document.getElementById('faculty-dept-filter').value;
  let count  = 0;

  document.querySelectorAll('#faculty-tbody tr').forEach(row => {
    const matchQ    = !q    || row.dataset.name.includes(q) || row.dataset.spec.includes(q);
    const matchDept = !dept || row.dataset.dept === dept;
    const show = matchQ && matchDept;
    row.style.display = show ? '' : 'none';
    if (show) count++;
  });
  document.getElementById('no-faculty-msg').classList.toggle('hidden', count > 0);
}

// ---- Faculty Detail ----
function renderFacultyDetail(id) {
  const f = AppData.faculty.find(x => x.id === id);
  if (!f) return `<div class="p-8 text-center text-gray-400">Faculty member not found.</div>`;

  const dept = AppData.departments.find(d => d.code === f.dept);
  const advisees = AppData.students.filter(s => s.advisor === f.name);

  return `
  <div class="p-6 max-w-4xl mx-auto space-y-5">

    <!-- Back -->
    <button onclick="navigate('faculty')" class="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-medium">
      ← Back to Faculty
    </button>

    <!-- Profile Header -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="h-24 bg-gradient-to-r from-primary-600 to-primary-800"></div>
      <div class="px-6 pb-6">
        <div class="flex items-end gap-4 -mt-10 mb-4">
          <div class="w-20 h-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white text-xl font-black"
               style="background:${dept ? dept.color : '#10b981'}">
            ${f.name.split(' ').filter(n=>!['Dr.','Prof.'].includes(n)).map(n=>n[0]).join('').slice(0,2)}
          </div>
          <div class="pb-1">
            <h1 class="text-2xl font-black text-gray-800">${f.name}</h1>
            <p class="text-gray-500 text-sm">${f.title} · ${dept ? dept.name : f.dept} Dept</p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div class="text-center p-3 bg-gray-50 rounded-xl">
            <div class="text-2xl font-black text-primary-600">${f.publications}</div>
            <div class="text-xs text-gray-400 mt-0.5">Publications</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-xl">
            <div class="text-2xl font-black text-emerald-600">${f.yearsExp}</div>
            <div class="text-xs text-gray-400 mt-0.5">Years Exp.</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-xl">
            <div class="text-2xl font-black text-amber-600">${f.courses.length}</div>
            <div class="text-xs text-gray-400 mt-0.5">Courses</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-xl">
            <div class="text-2xl font-black text-rose-600">${advisees.length}</div>
            <div class="text-xs text-gray-400 mt-0.5">Advisees</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

      <!-- Contact -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="font-bold text-gray-800 mb-4">Contact & Office</h3>
        <div class="space-y-3 text-sm">
          <div class="flex items-center gap-3"><span class="text-gray-400 w-5">📧</span><span class="text-gray-600">${f.email}</span></div>
          <div class="flex items-center gap-3"><span class="text-gray-400 w-5">📞</span><span class="text-gray-600">${f.phone}</span></div>
          <div class="flex items-center gap-3"><span class="text-gray-400 w-5">🏢</span><span class="text-gray-600">Office: ${f.office}</span></div>
          <div class="flex items-center gap-3"><span class="text-gray-400 w-5">🕐</span><span class="text-gray-600">Hours: ${f.officeHours}</span></div>
          <div class="flex items-center gap-3"><span class="text-gray-400 w-5">🔬</span><span class="text-gray-600">${f.specialization}</span></div>
        </div>
      </div>

      <!-- Courses -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="font-bold text-gray-800 mb-4">Teaching Courses</h3>
        <div class="space-y-2">
          ${f.courses.map(c => {
            const cls = AppData.classes.find(cl => cl.course.startsWith(c));
            return `
              <div class="p-2.5 bg-gray-50 rounded-lg">
                <div class="font-semibold text-gray-800 text-sm">${c}</div>
                ${cls ? `<div class="text-xs text-gray-400 mt-0.5">${cls.day} ${cls.startTime}–${cls.endTime} · ${cls.room} · ${cls.type}</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Advisees -->
      ${advisees.length > 0 ? `
      <div class="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="font-bold text-gray-800 mb-4">Student Advisees (${advisees.length})</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          ${advisees.map(s => `
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-primary-50 transition-colors" onclick="navigate('students','${s.id}')">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style="background:${deptColor(s.dept)}">
                ${s.name.split(' ').map(n=>n[0]).join('')}
              </div>
              <div class="min-w-0">
                <div class="text-sm font-semibold text-gray-800 truncate">${s.name}</div>
                <div class="text-xs text-gray-400">Year ${s.year} · GPA ${s.gpa}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

    </div>
  </div>
  `;
}
