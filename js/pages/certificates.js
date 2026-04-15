// ============================================================
// Certificates Page
// ============================================================
function renderCertificates() {
  const certs = AppData.certificates;
  const issued     = certs.filter(c => c.status === 'Issued').length;
  const pending    = certs.filter(c => c.status === 'Pending').length;
  const processing = certs.filter(c => c.status === 'Processing').length;

  return `
  <div class="p-6 space-y-5">

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-emerald-600">${issued}</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Issued</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-amber-600">${processing}</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Processing</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-red-600">${pending}</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Pending</div>
      </div>
    </div>

    <!-- Request New Certificate -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 class="font-bold text-gray-800 mb-4">Request New Certificate</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input type="text" id="cert-sid" placeholder="Student ID (e.g. AU2023001)"
          class="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 md:col-span-1"/>
        <select id="cert-type" class="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 bg-white md:col-span-1">
          <option value="">Select Certificate Type</option>
          <option>Bonafide</option>
          <option>Transcript</option>
          <option>Degree Certificate</option>
          <option>Character</option>
          <option>Migration</option>
          <option>Provisional</option>
        </select>
        <select id="cert-purpose" class="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 bg-white md:col-span-1">
          <option>Purpose</option>
          <option>Visa Application</option>
          <option>Job Application</option>
          <option>Higher Studies</option>
          <option>Bank Loan</option>
          <option>Other</option>
        </select>
        <button onclick="submitCertRequest()" class="py-2.5 px-4 rounded-lg text-white font-semibold text-sm transition-colors md:col-span-1" style="background:#1d4ed8" onmouseover="this.style.background='#1e40af'" onmouseout="this.style.background='#1d4ed8'">
          Submit Request
        </button>
      </div>
      <p class="text-xs text-gray-400 mt-2">Processing time: Bonafide/Character — 2 working days · Transcript/Degree — 5–7 working days</p>
    </div>

    <!-- Certificate Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 class="font-bold text-gray-800">Certificate Records</h2>
          <p class="text-xs text-gray-400">${certs.length} records · Spring 2026</p>
        </div>
        <input type="text" placeholder="Search student..." oninput="filterTable('cert-search','certs-tbody')"
          id="cert-search" class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-400 w-44"/>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th class="px-5 py-3 text-left">Cert ID</th>
              <th class="px-5 py-3 text-left">Student</th>
              <th class="px-4 py-3 text-left">Type</th>
              <th class="px-4 py-3 text-left">Issued Date</th>
              <th class="px-4 py-3 text-left">Validity</th>
              <th class="px-4 py-3 text-center">Status</th>
              <th class="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody id="certs-tbody">
            ${certs.map(c => {
              const statusStyle = {
                'Issued':     'background:#dcfce7;color:#166534',
                'Pending':    'background:#e0f2fe;color:#a16207',
                'Processing': 'background:#dbeafe;color:#1d4ed8',
              }[c.status] || 'background:#f1f5f9;color:#475569';
              return `
              <tr class="data-row border-t border-gray-50">
                <td class="px-5 py-3 font-mono text-xs text-gray-500">${c.id}</td>
                <td class="px-5 py-3">
                  <div class="font-semibold text-gray-800">${c.student}</div>
                  <div class="text-xs text-gray-400">${c.sid}</div>
                </td>
                <td class="px-4 py-3 text-gray-600 text-xs font-medium">${c.type}</td>
                <td class="px-4 py-3 text-gray-500 text-xs">${c.issued ? formatDate(c.issued) : '—'}</td>
                <td class="px-4 py-3 text-gray-500 text-xs">${c.validity}</td>
                <td class="px-4 py-3 text-center"><span class="badge" style="${statusStyle}">${c.status}</span></td>
                <td class="px-4 py-3 text-center">
                  ${c.status === 'Issued'
                    ? `<button onclick="downloadCert('${c.id}','${c.student}','${c.type}')" class="text-xs font-semibold px-3 py-1 rounded-lg text-white" style="background:#1d4ed8">⬇ Download</button>`
                    : `<span class="text-xs text-gray-400">—</span>`}
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `;
}

function submitCertRequest() {
  const sid  = document.getElementById('cert-sid').value.trim();
  const type = document.getElementById('cert-type').value;
  if (!sid || !type) { alert('Please fill in Student ID and Certificate Type.'); return; }
  showModal(`
    <div class="p-6 text-center">
      <div class="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4" style="background:#dbeafe">📋</div>
      <h2 class="text-xl font-black text-gray-800 mb-2">Request Submitted!</h2>
      <p class="text-sm text-gray-600 mb-1">Certificate Type: <strong>${type}</strong></p>
      <p class="text-sm text-gray-600 mb-1">Student ID: <strong>${sid}</strong></p>
      <p class="text-xs text-gray-400 mb-5">You will be notified via your registered email when ready.</p>
      <p class="text-xs font-mono font-bold text-gray-700 mb-5">Ref: CERT${Date.now().toString().slice(-6)}</p>
      <button onclick="closeModal()" class="px-6 py-2.5 rounded-xl text-white font-semibold text-sm" style="background:#1d4ed8">Close</button>
    </div>
  `);
}

function downloadCert(id, name, type) {
  showModal(`
    <div class="p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-lg font-black text-gray-800">${type}</h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
      </div>
      <div class="border-4 border-double p-6 rounded-xl text-center mb-5" style="border-color:#0ea5e9;background:#fffef8">
        <div class="text-xs font-semibold mb-2" style="color:#0ea5e9">ANDHRA UNIVERSITY · VISAKHAPATNAM</div>
        <div class="text-xl font-black text-gray-800 mb-1">CERTIFICATE</div>
        <div class="text-sm font-semibold mb-3" style="color:#1d4ed8">${type.toUpperCase()}</div>
        <hr style="border-color:#0ea5e9" class="mb-3"/>
        <p class="text-sm text-gray-700">This is to certify that <strong>${name}</strong> is a bonafide student of Andhra University, Visakhapatnam, enrolled in the current academic year 2025–2026.</p>
        <div class="mt-4 text-xs text-gray-400">Ref: ${id} · Issued: ${new Date().toLocaleDateString('en-IN')}</div>
      </div>
      <button onclick="alert('Certificate downloaded as PDF!')" class="w-full py-2.5 rounded-xl text-white font-bold text-sm" style="background:#1d4ed8">⬇ Download PDF</button>
    </div>
  `);
}
