// ============================================================
// Exam Registration Form (student role)
// ============================================================
function renderExamRegistration() {
  const s   = getCurrentStudent();
  const reg = s ? s.id.replace('S','322506402') : '322506402001';
  const dept = s ? AppData.departments.find(d => d.code === s.dept) : null;

  return `
  <div class="p-4 max-w-3xl mx-auto">
    <!-- Header bar -->
    <div style="background:#1976d2;color:white;padding:10px 16px;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:space-between">
      <span style="font-weight:700;font-size:14px">📝 Examination Registration for ${reg}</span>
      <button onclick="navigate('dashboard')" style="background:rgba(255,255,255,0.2);border:none;color:white;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer">✕ Close</button>
    </div>

    <div style="background:white;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px">
      <table style="width:100%;border-collapse:collapse">

        <!-- Registration Number -->
        <tr style="border-bottom:1px solid #e2e8f0">
          <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#374151;width:38%;vertical-align:middle">Registration Number</td>
          <td style="padding:12px 16px">
            <input type="text" value="${reg}" readonly
              style="width:100%;border:1px solid #d1d5db;border-radius:6px;padding:8px 12px;font-size:13px;background:#f8fafc;color:#374151"/>
          </td>
        </tr>

        <!-- Year / Semester -->
        <tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0">
          <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#374151;vertical-align:middle">Select appearing year/semester</td>
          <td style="padding:12px 16px">
            <select style="width:100%;border:1px solid #d1d5db;border-radius:6px;padding:8px 12px;font-size:13px;background:white;color:#374151">
              <option value="">-- Select --</option>
              <option value="1-1">1-1</option>
              <option value="1-2">1-2</option>
              <option value="2-1">2-1</option>
              <option value="2-2">2-2</option>
              <option value="3-1">3-1</option>
              <option value="3-2">3-2</option>
              <option value="4-1">4-1</option>
              <option value="4-2" ${s && s.year === 4 ? 'selected' : ''}>4-2</option>
            </select>
          </td>
        </tr>

        <!-- Years of Study -->
        <tr style="border-bottom:1px solid #e2e8f0">
          <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#374151;vertical-align:middle">Years of Study</td>
          <td style="padding:12px 16px">
            <select style="width:100%;border:1px solid #d1d5db;border-radius:6px;padding:8px 12px;font-size:13px;background:white;color:#374151">
              <option value="">-- Select --</option>
              <option value="3">3 Years</option>
              <option value="4">4 Years</option>
              <option value="5" selected>5 Years</option>
            </select>
          </td>
        </tr>

        <!-- Registered Month-Year -->
        <tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0">
          <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#374151;vertical-align:middle">Registered month-year</td>
          <td style="padding:12px 16px">
            <select style="width:100%;border:1px solid #d1d5db;border-radius:6px;padding:8px 12px;font-size:13px;background:white;color:#374151">
              <option value="">Select</option>
              <option value="nov-2022">November 2022</option>
              <option value="apr-2023">April 2023</option>
              <option value="nov-2023">November 2023</option>
              <option value="apr-2024">April 2024</option>
              <option value="nov-2024">November 2024</option>
              <option value="apr-2025" selected>April 2025</option>
              <option value="nov-2025">November 2025</option>
              <option value="apr-2026">April 2026</option>
            </select>
          </td>
        </tr>

        <!-- Select Specialization -->
        <tr style="border-bottom:1px solid #e2e8f0">
          <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#374151;vertical-align:middle">Select Specialization</td>
          <td style="padding:12px 16px">
            <select style="width:100%;border:1px solid #d1d5db;border-radius:6px;padding:8px 12px;font-size:13px;background:white;color:#374151">
              <option value="">Choose</option>
              ${AppData.departments.map(d =>
                `<option value="${d.code}" ${s && s.dept === d.code ? 'selected' : ''}>${d.code} — ${d.name}</option>`
              ).join('')}
            </select>
          </td>
        </tr>

      </table>

      <!-- Submit -->
      <div style="margin-top:20px;text-align:center">
        <button onclick="submitExamRegistration()"
          style="background:#1976d2;color:white;border:none;padding:11px 48px;border-radius:6px;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 2px 8px rgba(25,118,210,0.3)">
          Submit
        </button>
      </div>
    </div>
  </div>`;
}

function submitExamRegistration() {
  const btn = event.target;
  btn.textContent = '✅ Submitted!';
  btn.style.background = '#166534';
  setTimeout(() => { btn.textContent = 'Submit'; btn.style.background = '#1976d2'; }, 3000);
}

// ============================================================
// Exam Timings Page
// ============================================================
function renderExams() {
  if (getCurrentRole() === 'student') return renderExamRegistration();

  const exams   = AppData.exams;
  const midterm = exams.filter(x => x.type === 'Mid-Term');
  const finals  = exams.filter(x => x.type === 'Final');

  function examRow(x) {
    const isUpcomingExam = isUpcoming(x.date);
    return `
      <tr class="data-row border-t border-gray-50">
        <td class="px-5 py-3">
          <div class="font-semibold text-gray-800">${x.course}</div>
          <div class="text-xs text-gray-400 mt-0.5">Invigilator: ${x.invigilator}</div>
        </td>
        <td class="px-5 py-3">
          <span class="badge" style="background:${deptBg(x.dept)};color:${deptColor(x.dept)}">${x.dept}</span>
        </td>
        <td class="px-5 py-3">
          <span class="badge ${x.type==='Final'?'badge-final':'badge-midterm'}">${x.type}</span>
        </td>
        <td class="px-5 py-3">
          <div class="font-medium text-gray-700">${formatDate(x.date)}</div>
          <div class="text-xs text-gray-400">${x.time}</div>
        </td>
        <td class="px-5 py-3 text-gray-600 font-mono text-xs">${x.duration}</td>
        <td class="px-5 py-3 text-gray-500 text-xs">${x.room}</td>
        <td class="px-5 py-3 text-right">
          <span class="font-bold text-gray-700">${x.students}</span>
          <div class="text-xs text-gray-400">students</div>
        </td>
        <td class="px-5 py-3">
          ${isUpcomingExam
            ? '<span class="badge bg-blue-100 text-blue-700">Upcoming</span>'
            : '<span class="badge bg-gray-100 text-gray-400">Past</span>'}
        </td>
      </tr>
    `;
  }

  return `
  <div class="p-6 space-y-5">

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-primary-600">${exams.length}</div>
        <div class="text-xs font-semibold text-gray-500">Total Exams</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-blue-600">${midterm.length}</div>
        <div class="text-xs font-semibold text-gray-500">Mid-Terms</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-rose-600">${finals.length}</div>
        <div class="text-xs font-semibold text-gray-500">Finals</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-emerald-600">${exams.reduce((a,x)=>a+x.students,0).toLocaleString()}</div>
        <div class="text-xs font-semibold text-gray-500">Exam Seats</div>
      </div>
    </div>

    <!-- Alert for upcoming -->
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
      <span class="text-2xl">⚠️</span>
      <div>
        <div class="font-semibold text-amber-800">Mid-Term Exams Starting April 15, 2026</div>
        <div class="text-sm text-amber-600">Students must carry their ID cards. Arrive 15 minutes before exam time. No electronic devices allowed.</div>
      </div>
    </div>

    <!-- Mid-Term Exams -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
        <h2 class="font-bold text-gray-800">Mid-Term Exams (${midterm.length})</h2>
        <span class="text-xs text-gray-400">Apr 15 – Apr 18, 2026</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th class="px-5 py-3 text-left">Course</th>
              <th class="px-5 py-3 text-left">Dept</th>
              <th class="px-5 py-3 text-left">Type</th>
              <th class="px-5 py-3 text-left">Date & Time</th>
              <th class="px-5 py-3 text-left">Duration</th>
              <th class="px-5 py-3 text-left">Room</th>
              <th class="px-5 py-3 text-right">Students</th>
              <th class="px-5 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            ${midterm.sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)).map(examRow).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Final Exams -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
        <div class="w-3 h-3 rounded-full bg-rose-500"></div>
        <h2 class="font-bold text-gray-800">Final Exams (${finals.length})</h2>
        <span class="text-xs text-gray-400">Jun 2 – Jun 6, 2026</span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th class="px-5 py-3 text-left">Course</th>
              <th class="px-5 py-3 text-left">Dept</th>
              <th class="px-5 py-3 text-left">Type</th>
              <th class="px-5 py-3 text-left">Date & Time</th>
              <th class="px-5 py-3 text-left">Duration</th>
              <th class="px-5 py-3 text-left">Room</th>
              <th class="px-5 py-3 text-right">Students</th>
              <th class="px-5 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            ${finals.sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)).map(examRow).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Exam Guidelines -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 class="font-bold text-gray-800 mb-4">📋 Exam Guidelines</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
        <div class="space-y-2">
          <div class="flex items-start gap-2"><span class="text-green-500 mt-0.5">✓</span><span>Carry valid University ID card at all times</span></div>
          <div class="flex items-start gap-2"><span class="text-green-500 mt-0.5">✓</span><span>Arrive at least 15 minutes before the scheduled time</span></div>
          <div class="flex items-start gap-2"><span class="text-green-500 mt-0.5">✓</span><span>Permitted: pens, pencils, approved calculators</span></div>
          <div class="flex items-start gap-2"><span class="text-green-500 mt-0.5">✓</span><span>Check exam room allotments on the notice board</span></div>
        </div>
        <div class="space-y-2">
          <div class="flex items-start gap-2"><span class="text-red-500 mt-0.5">✗</span><span>No mobile phones or electronic devices</span></div>
          <div class="flex items-start gap-2"><span class="text-red-500 mt-0.5">✗</span><span>No textbooks or notes (unless open-book exam)</span></div>
          <div class="flex items-start gap-2"><span class="text-red-500 mt-0.5">✗</span><span>Late entry not permitted after 30 minutes</span></div>
          <div class="flex items-start gap-2"><span class="text-red-500 mt-0.5">✗</span><span>No communication between students during exam</span></div>
        </div>
      </div>
    </div>
  </div>
  `;
}
