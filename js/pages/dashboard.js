// ============================================================
// Dashboard Page
// ============================================================

function getCurrentStudent() {
  const user = getCurrentUser();
  const uid  = (user.id || '').toLowerCase();
  return AppData.students.find(s => s.id.toLowerCase() === uid)
      || AppData.students.find(s => s.name.toLowerCase() === uid)
      || AppData.students[0];
}

// ============================================================
// 1. STUDENT DETAILS
// ============================================================
function showStudentDetails() {
  const s = getCurrentStudent();
  if (!s) return;
  const dept = AppData.departments.find(d => d.code === s.dept);
  showModal(`
    <div class="p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-lg font-black text-gray-800">Student Details</h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
      </div>
      <div class="flex items-center gap-4 mb-5 p-4 rounded-2xl" style="background:${dept?.bg||'#eff6ff'}">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0" style="background:${dept?.color||'#1d4ed8'}">
          ${s.name.split(' ').map(n=>n[0]).join('')}
        </div>
        <div>
          <div class="text-xl font-black text-gray-800">${s.name}</div>
          <div class="text-sm font-semibold" style="color:${dept?.color||'#1d4ed8'}">${s.id} · ${dept?.name||s.dept}</div>
          <div class="mt-1">${statusBadge(s.status)}</div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="p-3 rounded-xl bg-gray-50">
          <div class="text-xs text-gray-400 mb-0.5">Department</div>
          <div class="font-bold text-gray-700">${s.dept}</div>
        </div>
        <div class="p-3 rounded-xl bg-gray-50">
          <div class="text-xs text-gray-400 mb-0.5">Year / Semester</div>
          <div class="font-bold text-gray-700">Year ${s.year} · Sem ${s.year*2}</div>
        </div>
        <div class="p-3 rounded-xl bg-gray-50">
          <div class="text-xs text-gray-400 mb-0.5">CGPA</div>
          <div class="font-bold ${gpaColor(s.gpa)}">${s.gpa} / 4.0</div>
        </div>
        <div class="p-3 rounded-xl bg-gray-50">
          <div class="text-xs text-gray-400 mb-0.5">Age</div>
          <div class="font-bold text-gray-700">${s.age} years</div>
        </div>
        <div class="p-3 rounded-xl bg-gray-50">
          <div class="text-xs text-gray-400 mb-0.5">Email</div>
          <div class="font-semibold text-gray-700 text-xs break-all">${s.email}</div>
        </div>
        <div class="p-3 rounded-xl bg-gray-50">
          <div class="text-xs text-gray-400 mb-0.5">Phone</div>
          <div class="font-semibold text-gray-700 text-xs">${s.phone}</div>
        </div>
        <div class="p-3 rounded-xl bg-gray-50 col-span-2">
          <div class="text-xs text-gray-400 mb-0.5">Academic Advisor</div>
          <div class="font-bold text-gray-700">${s.advisor}</div>
        </div>
        <div class="p-3 rounded-xl bg-gray-50 col-span-2">
          <div class="text-xs text-gray-400 mb-1">Enrolled Courses</div>
          <div class="flex flex-wrap gap-1">
            ${s.courses.map(c=>`<span class="badge" style="background:#eff6ff;color:#1d4ed8">${c}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="text-xs text-gray-400 text-center">Joined: ${new Date(s.joined).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
    </div>
  `);
}

// ============================================================
// 2. CHALLAN GENERATION
// ============================================================
function showChallanGeneration() {
  const s = getCurrentStudent();
  if (!s) return;
  const dept = AppData.departments.find(d => d.code === s.dept);
  const challanNo = 'AU2026' + s.id.replace('S','') + '108';
  const tuition   = dept ? Math.round(dept.students * 0.11 + 17500) : 24000;
  const examFee   = 1200;
  const library   = 500;
  const total     = tuition + examFee + library;

  showModal(`
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-black text-gray-800">Challan Generation</h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
      </div>
      <div class="rounded-xl p-4 mb-4 text-white text-center" style="background:linear-gradient(135deg,#1d4ed8,#0e7490)">
        <div class="font-black text-sm">ANDHRA UNIVERSITY</div>
        <div class="text-xs mt-0.5" style="color:#bae6fd">Fee Payment Challan — Spring 2026</div>
        <div class="mt-2 inline-block bg-white/20 rounded-lg px-4 py-1 text-sm font-bold">${challanNo}</div>
      </div>
      <div class="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div><span class="text-gray-400">Name:</span> <strong>${s.name}</strong></div>
        <div><span class="text-gray-400">ID:</span> <strong>${s.id}</strong></div>
        <div><span class="text-gray-400">Dept:</span> <strong>${s.dept}</strong></div>
        <div><span class="text-gray-400">Year/Sem:</span> <strong>Year ${s.year} · Sem ${s.year*2}</strong></div>
      </div>
      <div class="bg-gray-50 rounded-xl overflow-hidden mb-4">
        <table class="w-full text-sm">
          <thead><tr class="bg-gray-100">
            <th class="px-4 py-2 text-left text-xs text-gray-500 uppercase">Fee Head</th>
            <th class="px-4 py-2 text-right text-xs text-gray-500 uppercase">Amount (₹)</th>
          </tr></thead>
          <tbody>
            <tr class="border-t border-gray-100"><td class="px-4 py-2.5 text-gray-700">Tuition Fee</td><td class="px-4 py-2.5 text-right font-semibold">₹${tuition.toLocaleString()}</td></tr>
            <tr class="border-t border-gray-100"><td class="px-4 py-2.5 text-gray-700">Examination Fee</td><td class="px-4 py-2.5 text-right font-semibold">₹${examFee.toLocaleString()}</td></tr>
            <tr class="border-t border-gray-100"><td class="px-4 py-2.5 text-gray-700">Library Fee</td><td class="px-4 py-2.5 text-right font-semibold">₹${library.toLocaleString()}</td></tr>
            <tr class="border-t-2 border-gray-200 bg-blue-50">
              <td class="px-4 py-3 font-black text-gray-800">Total Amount</td>
              <td class="px-4 py-3 text-right font-black text-blue-700 text-base">₹${total.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="text-xs text-amber-600 bg-amber-50 rounded-lg p-3 mb-4">⚠️ Due Date: <strong>15 June 2026</strong> · Pay at university bank or online portal</div>
      <div class="flex gap-2">
        <button onclick="window.print()" class="flex-1 py-2.5 rounded-xl text-white font-bold text-sm" style="background:#1d4ed8">🖨️ Print Challan</button>
        <button onclick="closeModal()" class="flex-1 py-2.5 rounded-xl font-bold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50">Close</button>
      </div>
    </div>
  `);
}

// ============================================================
// 3. HALL TICKET
// ============================================================
function showHallTicket() {
  const s = getCurrentStudent();
  if (!s) return;
  const dept     = AppData.departments.find(d => d.code === s.dept);
  const myExams  = AppData.exams.filter(x => x.dept === s.dept).slice(0, 5);
  const color    = dept?.color || '#1d4ed8';

  showModal(`
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-black text-gray-800">Hall Ticket</h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
      </div>
      <div class="border-2 rounded-xl overflow-hidden mb-4" style="border-color:${color}">
        <div class="p-3 text-white text-center" style="background:${color}">
          <div class="font-black text-sm">ANDHRA UNIVERSITY — VISAKHAPATNAM</div>
          <div class="text-xs mt-0.5 opacity-80">HALL TICKET — SPRING SEMESTER EXAMINATIONS 2026</div>
        </div>
        <div class="p-4 flex items-center gap-4 border-b" style="border-color:${color}30">
          <div class="w-14 h-18 rounded-xl flex items-center justify-center text-xl font-black text-white flex-shrink-0" style="background:${color};min-height:72px;min-width:56px">
            ${s.name.split(' ').map(n=>n[0]).join('')}
          </div>
          <div class="flex-1 text-sm grid grid-cols-2 gap-1">
            <div><span class="text-gray-400 text-xs">Name:</span><br><strong>${s.name}</strong></div>
            <div><span class="text-gray-400 text-xs">Reg. No:</span><br><strong>${s.id}</strong></div>
            <div><span class="text-gray-400 text-xs">Department:</span><br><strong>${dept?.name||s.dept}</strong></div>
            <div><span class="text-gray-400 text-xs">Year/Sem:</span><br><strong>Year ${s.year} · Sem ${s.year*2}</strong></div>
          </div>
        </div>
        <div class="p-4">
          <div class="text-xs font-bold text-gray-500 uppercase mb-2">Examination Schedule</div>
          ${myExams.length > 0 ? `
          <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead><tr class="bg-gray-50">
              <th class="px-2 py-1.5 text-left text-gray-500">Subject</th>
              <th class="px-2 py-1.5 text-left text-gray-500">Date</th>
              <th class="px-2 py-1.5 text-left text-gray-500">Time</th>
              <th class="px-2 py-1.5 text-left text-gray-500">Room</th>
            </tr></thead>
            <tbody>
              ${myExams.map(x=>`
                <tr class="border-t border-gray-100">
                  <td class="px-2 py-2 font-semibold text-gray-700">${x.course.split(' - ')[0]}</td>
                  <td class="px-2 py-2 text-gray-600">${formatDate(x.date)}</td>
                  <td class="px-2 py-2 text-gray-600">${x.time}</td>
                  <td class="px-2 py-2 text-gray-600">${x.room}</td>
                </tr>`).join('')}
            </tbody>
          </table>
          </div>` : `<div class="text-center text-gray-400 py-4 text-sm">No exams scheduled for your department yet.</div>`}
        </div>
        <div class="px-4 pb-4">
          <div class="bg-amber-50 rounded-lg p-2 text-xs text-amber-700">
            ⚠️ Carry this hall ticket + valid ID card. Arrive 15 min early. No electronic devices allowed.
          </div>
        </div>
      </div>
      <button onclick="window.print()" class="w-full py-2.5 rounded-xl text-white font-bold text-sm" style="background:${color}">⬇️ Download / Print Hall Ticket</button>
    </div>
  `);
}

// ============================================================
// 4. RESULTS
// ============================================================
function showResults() {
  const s = getCurrentStudent();
  if (!s) return;

  const semCount   = s.year * 2 - 1;
  const semResults = [];
  for (let sem = 1; sem <= semCount; sem++) {
    semResults.push({ sem, subjects: _genSemSubjects(s.dept, sem, s.id, s.gpa) });
  }

  showModal(`
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-black text-gray-800">Semester Results</h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
      </div>
      <div class="rounded-xl p-4 mb-4 text-white flex items-center justify-between" style="background:linear-gradient(135deg,#166534,#4d7c0f)">
        <div>
          <div class="text-xs font-semibold opacity-80">Cumulative GPA</div>
          <div class="text-3xl font-black mt-0.5">${s.gpa} <span class="text-sm font-normal opacity-70">/ 4.0</span></div>
          <div class="text-xs opacity-70 mt-0.5">${s.name} · ${s.id} · Year ${s.year}</div>
        </div>
        <div class="text-5xl opacity-30">🎓</div>
      </div>
      <div class="flex gap-2 mb-4 overflow-x-auto pb-1">
        ${semResults.map((r,i)=>`
          <button onclick="showSemResult(${i})"
            id="sem-tab-${i}"
            class="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all"
            style="${i===semResults.length-1?'background:#1d4ed8;color:white;border-color:#1d4ed8':'background:white;color:#6b7280;border-color:#e5e7eb'}">
            Sem ${r.sem}
          </button>`).join('')}
      </div>
      ${semResults.map((r,i)=>`
        <div id="sem-result-${i}" style="display:${i===semResults.length-1?'block':'none'}">
          <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2.5 text-left text-xs text-gray-500 uppercase">Subject</th>
                  <th class="px-4 py-2.5 text-center text-xs text-gray-500 uppercase">Int.</th>
                  <th class="px-4 py-2.5 text-center text-xs text-gray-500 uppercase">Ext.</th>
                  <th class="px-4 py-2.5 text-center text-xs text-gray-500 uppercase">Total</th>
                  <th class="px-4 py-2.5 text-center text-xs text-gray-500 uppercase">Grade</th>
                </tr>
              </thead>
              <tbody>
                ${r.subjects.map(sub=>`
                  <tr class="border-t border-gray-50">
                    <td class="px-4 py-2.5 font-medium text-gray-700">${sub.name}</td>
                    <td class="px-4 py-2.5 text-center text-gray-600">${sub.internal}</td>
                    <td class="px-4 py-2.5 text-center text-gray-600">${sub.external}</td>
                    <td class="px-4 py-2.5 text-center font-bold text-gray-800">${sub.internal+sub.external}</td>
                    <td class="px-4 py-2.5 text-center">
                      <span class="badge ${sub.grade==='A+'||sub.grade==='A'?'bg-green-100 text-green-700':sub.grade.startsWith('B')?'bg-blue-100 text-blue-700':sub.grade==='F'?'bg-red-100 text-red-700':'bg-amber-100 text-amber-700'}">${sub.grade}</span>
                    </td>
                  </tr>`).join('')}
              </tbody>
              <tfoot class="border-t-2 border-gray-200 bg-gray-50">
                <tr>
                  <td colspan="4" class="px-4 py-2.5 font-black text-gray-700">Semester GPA</td>
                  <td class="px-4 py-2.5 text-center font-black text-blue-700">${_semGPA(r.subjects)}</td>
                </tr>
              </tfoot>
            </table>
            </div>
          </div>
        </div>`).join('')}
    </div>
  `);
}

function showSemResult(idx) {
  document.querySelectorAll('[id^="sem-result-"]').forEach((el,i) => el.style.display = i===idx?'block':'none');
  document.querySelectorAll('[id^="sem-tab-"]').forEach((el,i) => {
    el.style.background    = i===idx?'#1d4ed8':'white';
    el.style.color         = i===idx?'white':'#6b7280';
    el.style.borderColor   = i===idx?'#1d4ed8':'#e5e7eb';
  });
}

function _semGPA(subjects) {
  const avg = subjects.reduce((a,s)=>a+(s.internal+s.external),0) / subjects.length;
  if (avg >= 90) return '4.0';
  if (avg >= 80) return '3.7';
  if (avg >= 70) return '3.3';
  if (avg >= 60) return '3.0';
  if (avg >= 50) return '2.7';
  return '2.0';
}

function _genSemSubjects(dept, sem, sid, gpa) {
  const sets = {
    CSE:[
      ['Engineering Mathematics','Engineering Physics','Programming in C','English Communication','Engineering Drawing'],
      ['Data Structures','Digital Electronics','Object Oriented Programming','Maths II','Environmental Science'],
      ['Operating Systems','Computer Networks','Database Management','Software Engineering','Algorithms'],
      ['Machine Learning','Cloud Computing','Web Technologies','Compiler Design','Elective I'],
      ['AI & Deep Learning','Cryptography','Distributed Systems','Project Phase I','Seminar'],
      ['Big Data Analytics','IoT Systems','Capstone Project','Industrial Training','Elective II'],
      ['Major Project','Advanced Topics in CSE','Internship Report','Technical Communication','Open Elective'],
    ],
    MECH:[
      ['Engineering Mathematics','Engineering Physics','Engineering Drawing','English','Workshop Technology'],
      ['Fluid Mechanics','Thermodynamics I','Strength of Materials','Maths II','Manufacturing Processes'],
      ['Heat Transfer','Machine Design','Dynamics of Machinery','Control Systems','Metrology'],
      ['CAD/CAM','Robotics','Automobile Engineering','Industrial Management','Elective I'],
    ],
  };
  const defaults = [
    ['Engineering Mathematics','Engineering Physics','Engineering Chemistry','English','Workshop Practice'],
    ['Mathematics II','Core Subject I','Core Subject II','Core Lab I','Environmental Science'],
    ['Core Subject III','Core Subject IV','Core Lab II','Elective I','Mini Project'],
    ['Core Subject V','Core Subject VI','Project Work','Seminar','Industrial Training'],
  ];
  const pool = sets[dept] || defaults;
  const names = pool[Math.min(sem-1, pool.length-1)];

  // Deterministic marks using student ID + sem as seed
  const seed = parseInt(sid.replace(/\D/g,''),10) + sem * 7;
  return names.map((name, i) => {
    const base     = Math.round(gpa * 20); // ~60-80 range
    const variance = ((seed * (i+3)) % 20) - 10;
    const total    = Math.min(100, Math.max(35, base + variance));
    const internal = Math.min(30, Math.max(15, Math.floor(total * 0.32)));
    const external = total - internal;
    let grade;
    if (total >= 90) grade = 'A+';
    else if (total >= 80) grade = 'A';
    else if (total >= 70) grade = 'B+';
    else if (total >= 60) grade = 'B';
    else if (total >= 50) grade = 'C';
    else grade = 'F';
    return { name, internal, external, grade };
  });
}

// ============================================================
// 5. SEF FORM
// ============================================================
function showSEFForm() {
  const s = getCurrentStudent();
  if (!s) return;
  const questions = [
    'Overall satisfaction with this semester\'s academic experience',
    'Quality of teaching and instruction by faculty',
    'Availability of library and lab resources',
    'Campus infrastructure and cleanliness',
    'Effectiveness of student grievance redressal',
  ];

  showModal(`
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-black text-gray-800">Student Evaluation Form</h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
      </div>
      <div class="bg-blue-50 rounded-xl p-3 mb-4 text-sm text-blue-800">
        <strong>SEF — Spring 2026 · ${s.dept} · Year ${s.year}</strong><br>
        <span class="text-xs text-blue-600">Student: ${s.name} (${s.id})</span>
      </div>
      <div class="space-y-4 text-sm">
        ${questions.map((q,i)=>`
          <div>
            <label class="font-semibold text-gray-700 block mb-2">${i+1}. ${q}</label>
            <div class="flex flex-wrap gap-2">
              ${['Poor','Fair','Good','Very Good','Excellent'].map((opt,j)=>`
                <label class="flex items-center gap-1.5 cursor-pointer bg-gray-50 hover:bg-blue-50 rounded-lg px-3 py-1.5 transition-colors">
                  <input type="radio" name="sef-q${i}" value="${j+1}" class="accent-blue-600">
                  <span class="text-xs text-gray-600">${opt}</span>
                </label>`).join('')}
            </div>
          </div>`).join('')}
        <div>
          <label class="font-semibold text-gray-700 block mb-2">${questions.length+1}. Additional comments / suggestions</label>
          <textarea rows="3" placeholder="Your feedback helps improve the university..."
            class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"></textarea>
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button onclick="submitSEF(this)" class="flex-1 py-2.5 rounded-xl text-white font-bold text-sm" style="background:#1d4ed8">Submit SEF Form</button>
        <button onclick="window.print()" class="px-4 py-2.5 rounded-xl font-bold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50">🖨️ Print</button>
      </div>
    </div>
  `);
}

function submitSEF(btn) {
  btn.textContent = '✅ Submitted Successfully!';
  btn.style.background = '#166534';
  btn.disabled = true;
  setTimeout(() => closeModal(), 2000);
}

// ============================================================
// 6. TUITION FEES (Payment Status + Print Receipt + Pay)
// ============================================================
function showTuitionFees() {
  const s = getCurrentStudent();
  if (!s) return;
  const dept = AppData.departments.find(d => d.code === s.dept);
  const base = dept ? Math.round(dept.students * 0.11 + 17500) : 24000;

  const paidSems = [];
  for (let sem = 1; sem < s.year*2; sem++) {
    const yr  = 2022 + Math.floor((sem-1)/2);
    const mon = sem % 2 === 1 ? '09' : '02';
    paidSems.push({
      sem, amount: base + (sem%2===0?500:0),
      date: `${yr}-${mon}-10`,
      receipt: `AURCP${s.id.replace('S','')}${String(sem).padStart(2,'0')}`
    });
  }
  const pending = base + 1200 + 500;

  showModal(`
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-black text-gray-800">Tuition Fees</h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
      </div>
      <div id="fee-pending-box" class="rounded-xl p-4 mb-4" style="background:#fef2f2;border:1.5px solid #fecaca">
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="font-bold text-red-700">Pending Fee — Sem ${s.year*2}</div>
            <div class="text-2xl font-black text-red-800 mt-1">₹${pending.toLocaleString()}</div>
            <div class="text-xs text-red-400 mt-0.5">Due: 15 June 2026</div>
          </div>
          <button id="pay-now-btn" onclick="payFeeNow()" class="px-5 py-2.5 rounded-xl text-white font-bold text-sm flex-shrink-0" style="background:#dc2626">Pay Now</button>
        </div>
      </div>
      <div class="font-bold text-gray-700 text-sm mb-2">Payment History</div>
      <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2.5 text-left text-xs text-gray-500 uppercase">Sem</th>
              <th class="px-4 py-2.5 text-left text-xs text-gray-500 uppercase">Date</th>
              <th class="px-4 py-2.5 text-right text-xs text-gray-500 uppercase">Amount</th>
              <th class="px-4 py-2.5 text-center text-xs text-gray-500 uppercase">Receipt</th>
            </tr>
          </thead>
          <tbody>
            ${paidSems.map(p=>`
              <tr class="border-t border-gray-50">
                <td class="px-4 py-2.5 font-semibold text-gray-700">Sem ${p.sem}</td>
                <td class="px-4 py-2.5 text-gray-500 text-xs">${new Date(p.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                <td class="px-4 py-2.5 text-right font-bold text-green-700">₹${p.amount.toLocaleString()}</td>
                <td class="px-4 py-2.5 text-center">
                  <button onclick="printReceipt('${p.receipt}')" class="text-xs text-blue-600 hover:underline font-semibold">🖨️ ${p.receipt}</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  `);
}

function payFeeNow() {
  const btn = document.getElementById('pay-now-btn');
  const box = document.getElementById('fee-pending-box');
  if (!btn) return;
  btn.textContent = 'Processing…';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✅ Paid!';
    btn.style.background = '#166534';
    box.style.background = '#f0fdf4';
    box.style.borderColor = '#bbf7d0';
    box.querySelector('.font-bold').textContent = 'Fee Paid — Sem';
    box.querySelector('.font-bold').style.color = '#166534';
    box.querySelector('.text-2xl').style.color = '#15803d';
  }, 1800);
}

function printReceipt(id) {
  showModal(`
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-black text-gray-800">Fee Receipt</h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
      </div>
      <div class="border-2 border-green-200 rounded-xl overflow-hidden mb-4">
        <div class="p-3 text-white text-center" style="background:#166534">
          <div class="font-black text-sm">ANDHRA UNIVERSITY — FEE RECEIPT</div>
        </div>
        <div class="p-4 space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-gray-500">Receipt No:</span><strong>${id}</strong></div>
          <div class="flex justify-between"><span class="text-gray-500">Status:</span><span class="badge bg-green-100 text-green-700">✅ PAID</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Paid Via:</span><strong>Online / UPI</strong></div>
        </div>
      </div>
      <button onclick="window.print()" class="w-full py-2.5 rounded-xl text-white font-bold text-sm" style="background:#166534">🖨️ Print Receipt</button>
    </div>
  `);
}

// ============================================================
// 7. CHECK BACKLOGS
// ============================================================
function showBacklogs() {
  const s = getCurrentStudent();
  if (!s) return;

  const hasBacklogs = s.status === 'Probation' || s.gpa < 3.0;
  const backlogs = hasBacklogs ? [
    { subject:`${s.dept}201 — Core Subject II`, sem:3, type:'Theory', marks:38, max:100 },
    { subject:'Engineering Mathematics II',      sem:2, type:'Theory', marks:42, max:100 },
  ] : [];

  showModal(`
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-black text-gray-800">Check Backlog Subjects</h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
      </div>
      <div class="flex gap-3 items-center p-3 rounded-xl bg-gray-50 mb-4 text-sm">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style="background:#1d4ed8">
          ${s.name.split(' ').map(n=>n[0]).join('')}
        </div>
        <div class="flex-1">
          <div class="font-bold text-gray-800">${s.name}</div>
          <div class="text-xs text-gray-500">${s.id} · ${s.dept} · Year ${s.year} · CGPA: ${s.gpa}</div>
        </div>
        <div>${statusBadge(s.status)}</div>
      </div>
      ${backlogs.length === 0 ? `
        <div class="text-center py-8">
          <div class="text-5xl mb-3">🎉</div>
          <div class="font-bold text-green-700 text-lg">No Backlogs!</div>
          <div class="text-sm text-gray-500 mt-1">You have cleared all subjects. Keep it up!</div>
        </div>
      ` : `
        <div class="bg-red-50 border border-red-100 rounded-xl p-3 mb-3 text-sm text-red-700">
          ⚠️ You have <strong>${backlogs.length} backlog subject(s)</strong>. Register for supplementary exams before deadline.
        </div>
        <div class="bg-white rounded-xl border border-gray-100 overflow-hidden mb-3">
          <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2.5 text-left text-xs text-gray-500 uppercase">Subject</th>
                <th class="px-4 py-2.5 text-center text-xs text-gray-500 uppercase">Sem</th>
                <th class="px-4 py-2.5 text-center text-xs text-gray-500 uppercase">Marks</th>
                <th class="px-4 py-2.5 text-center text-xs text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              ${backlogs.map(b=>`
                <tr class="border-t border-gray-50">
                  <td class="px-4 py-2.5 font-medium text-gray-700">${b.subject}</td>
                  <td class="px-4 py-2.5 text-center text-gray-500">Sem ${b.sem}</td>
                  <td class="px-4 py-2.5 text-center font-bold text-red-600">${b.marks}/${b.max}</td>
                  <td class="px-4 py-2.5 text-center"><span class="badge bg-red-100 text-red-700">Backlog</span></td>
                </tr>`).join('')}
            </tbody>
          </table>
          </div>
        </div>
        <div class="text-xs bg-amber-50 text-amber-700 rounded-lg p-3">
          📅 Supplementary Registration: <strong>Jul 1–5, 2026</strong> · Exams: <strong>Jul 10–20, 2026</strong>
        </div>
      `}
    </div>
  `);
}

// ============================================================
// 8. FEEDBACK FOR FACULTY
// ============================================================
function showFacultyFeedback() {
  const s = getCurrentStudent();
  if (!s) return;
  const myFaculty = AppData.faculty.filter(f => f.dept === s.dept);
  const extra     = AppData.faculty.filter(f => f.dept !== s.dept).slice(0,2);
  const list      = [...myFaculty, ...extra];

  showModal(`
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-black text-gray-800">Feedback for Faculty</h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
      </div>
      <div class="text-xs text-gray-500 bg-gray-50 rounded-xl p-3 mb-4">
        🔒 Your feedback is <strong>anonymous</strong> and helps improve teaching quality. Please rate honestly.
      </div>
      <div class="space-y-4 overflow-y-auto" style="max-height:55vh">
        ${list.map((f,i)=>`
          <div id="fb-card-${i}" class="border border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-colors">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style="background:${deptColor(f.dept)}">
                ${f.name.split(' ').slice(-1)[0][0]}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-gray-800 text-sm truncate">${f.name}</div>
                <div class="text-xs text-gray-500 truncate">${f.title} · ${f.dept} · ${f.specialization}</div>
              </div>
            </div>
            <div class="mb-2">
              <div class="text-xs font-semibold text-gray-500 mb-1">Overall Rating</div>
              <div class="flex gap-1" id="stars-${i}" data-rating="0">
                ${[1,2,3,4,5].map(star=>`<span onclick="setRating(${i},${star})" class="text-2xl cursor-pointer select-none transition-transform hover:scale-110" style="color:#d1d5db">★</span>`).join('')}
              </div>
            </div>
            <textarea id="review-${i}" rows="2" placeholder="Write your review (optional)..."
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-400 resize-none mt-1"></textarea>
            <button id="fb-btn-${i}" onclick="submitFeedback(${i},'${f.name.replace(/'/g,'\\'')}')"
              class="mt-2 w-full py-2 rounded-lg text-white font-bold text-xs transition-all" style="background:#1d4ed8">
              Submit Feedback
            </button>
          </div>`).join('')}
      </div>
    </div>
  `);
}

function setRating(idx, val) {
  const container = document.getElementById('stars-' + idx);
  if (!container) return;
  container.dataset.rating = val;
  container.querySelectorAll('span').forEach((el, i) => {
    el.style.color = i < val ? '#f59e0b' : '#d1d5db';
  });
}

function submitFeedback(idx, name) {
  const rating = document.getElementById('stars-' + idx)?.dataset.rating;
  const btn    = document.getElementById('fb-btn-' + idx);
  if (!btn) return;
  if (!rating || rating === '0') {
    btn.textContent = '⚠️ Please give a star rating first!';
    btn.style.background = '#dc2626';
    setTimeout(() => { btn.textContent = 'Submit Feedback'; btn.style.background = '#1d4ed8'; }, 2000);
    return;
  }
  const shortName = name.split(' ').pop();
  btn.textContent  = `✅ Feedback submitted for ${shortName}!`;
  btn.style.background = '#166534';
  btn.disabled = true;
  document.getElementById('fb-card-' + idx).style.background = '#f0fdf4';
}

// ============================================================
// STUDENT EMS DASHBOARD
// ============================================================
function renderStudentDashboard() {
  const user = getCurrentUser();
  const s    = getCurrentStudent();

  const actions = [
    { label:'Student Details',        icon:'👤', color:'#1d4ed8', onclick:"showStudentDetails()" },
    { label:'Exam Registration',      icon:'📝', color:'#166534', onclick:"showModal(renderExamRegistration())" },
    { label:'Challan Generation',     icon:'🧾', color:'#0e7490', onclick:"showChallanGeneration()" },
    { label:'Challan Payment',        icon:'💳', color:'#b45309', onclick:"showTuitionFees()" },
    { label:'Payment Status',         icon:'✅', color:'#1d4ed8', onclick:"showTuitionFees()" },
    { label:'Print Receipt',          icon:'🖨️', color:'#b91c1c', onclick:"showTuitionFees()" },
    { label:'Download Hall-Ticket',   icon:'🎫', color:'#0e7490', onclick:"showHallTicket()" },
    { label:'Results',                icon:'📊', color:'#4d7c0f', onclick:"showResults()" },
    { label:'Download SEF Form',      icon:'📄', color:'#166534', onclick:"showSEFForm()" },
    { label:'Tuition Fees',           icon:'💰', color:'#ea580c', onclick:"showTuitionFees()" },
    { label:'Check Backlog Subjects', icon:'📋', color:'#9d174d', onclick:"showBacklogs()" },
    { label:'Feedback for Faculty',   icon:'💬', color:'#b91c1c', onclick:"showFacultyFeedback()" },
  ];

  return `
  <div class="p-6 max-w-4xl mx-auto space-y-5">

    <!-- Welcome Banner -->
    <div class="rounded-2xl p-5 text-white shadow-lg flex items-center justify-between"
      style="background:linear-gradient(135deg,#0f172a 0%,#1e40af 40%,#1d4ed8 70%,#1e3a8a 100%)">
      <div>
        <div class="text-xs font-semibold mb-1" style="color:#fde047">Andhra University · Spring 2026</div>
        <div class="text-lg font-black">Welcome, ${s ? s.name : user.name}</div>
        <div class="text-sm mt-0.5" style="color:#bae6fd">${s ? s.id : user.id.toUpperCase()} · ${s ? s.dept+' Dept · Year '+s.year : ''}</div>
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

// ============================================================
// MAIN DASHBOARD (Admin/Faculty/Dean)
// ============================================================
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
        <button onclick="navigate('students')" class="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">View Students</button>
        <button onclick="navigate('analytics')" class="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">View Analytics</button>
        <button onclick="navigate('events')" class="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">Upcoming Events</button>
      </div>
    </div>

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

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              </div>`;
          }).join('')}
        </div>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-800">Upcoming Events</h3>
            <button onclick="navigate('events')" class="text-xs text-primary-600 hover:text-primary-800 font-medium">View all →</button>
          </div>
          <div class="space-y-3">
            ${upcomingEvents.map(e => `
              <div class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onclick="navigate('events')">
                <div class="rounded-xl p-2.5 text-sm font-bold flex-shrink-0 text-center min-w-[50px]" style="background:#dbeafe;color:#1d4ed8">
                  <div class="text-lg leading-none">${new Date(e.date).getDate()}</div>
                  <div class="text-xs">${new Date(e.date).toLocaleDateString('en-US',{month:'short'})}</div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-gray-800 text-sm truncate">${e.title}</div>
                  <div class="text-xs text-gray-500 mt-0.5">${e.time} · ${e.location}</div>
                </div>
                <span class="badge badge-${e.type.toLowerCase()} flex-shrink-0">${e.type}</span>
              </div>`).join('')}
          </div>
        </div>

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
                <span class="badge ${x.type==='Final'?'badge-final':'badge-midterm'}">${x.type}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>

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
                <td class="px-5 py-3"><span class="badge" style="background:${deptBg(s.dept)};color:${deptColor(s.dept)}">${s.dept}</span></td>
                <td class="px-5 py-3 text-gray-600">Year ${s.year}</td>
                <td class="px-5 py-3 font-bold ${gpaColor(s.gpa)}">${s.gpa}</td>
                <td class="px-5 py-3">${statusBadge(s.status)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

  </div>
  `;
}
