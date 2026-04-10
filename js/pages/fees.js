// ============================================================
// Fee Structure Page
// ============================================================
function renderFees() {
  const fees = AppData.fees;

  return `
  <div class="p-6 space-y-5">

    <!-- Header Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-primary-600">₹85K</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Max Tuition/Year</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-emerald-600">₹48K</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Hostel Fee/Year</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-amber-600">Jun 15</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Due Date 2026</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-blue-600">12</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Departments</div>
      </div>
    </div>

    <!-- Fee Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="font-bold text-gray-800">Department-wise Fee Structure</h2>
          <p class="text-xs text-gray-400">Spring 2026 · All amounts in INR per academic year</p>
        </div>
        <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style="background:#fef9c3;color:#a16207">
          ⚠️ Due: 15 June 2026
        </span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th class="px-5 py-3 text-left">Department</th>
              <th class="px-4 py-3 text-right">Tuition</th>
              <th class="px-4 py-3 text-right">Exam</th>
              <th class="px-4 py-3 text-right">Library</th>
              <th class="px-4 py-3 text-right">Sports</th>
              <th class="px-4 py-3 text-right">Misc</th>
              <th class="px-4 py-3 text-right font-bold">Total (Day)</th>
              <th class="px-4 py-3 text-right" style="color:#1d4ed8">+Hostel</th>
              <th class="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            ${fees.map(f => {
              const total = f.tuition + f.exam + f.library + f.sports + f.misc;
              const withHostel = total + f.hostel;
              const color = deptColor(f.dept);
              const bg = deptBg(f.dept);
              return `
              <tr class="data-row border-t border-gray-50">
                <td class="px-5 py-3">
                  <div class="flex items-center gap-2">
                    <span class="badge text-xs font-bold" style="background:${bg};color:${color}">${f.dept}</span>
                    <span class="text-gray-700 text-xs hidden sm:block">${f.name}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-right text-gray-700">₹${f.tuition.toLocaleString()}</td>
                <td class="px-4 py-3 text-right text-gray-500">₹${f.exam.toLocaleString()}</td>
                <td class="px-4 py-3 text-right text-gray-500">₹${f.library.toLocaleString()}</td>
                <td class="px-4 py-3 text-right text-gray-500">₹${f.sports.toLocaleString()}</td>
                <td class="px-4 py-3 text-right text-gray-500">₹${f.misc.toLocaleString()}</td>
                <td class="px-4 py-3 text-right font-bold text-gray-800">₹${total.toLocaleString()}</td>
                <td class="px-4 py-3 text-right font-bold" style="color:#1d4ed8">₹${withHostel.toLocaleString()}</td>
                <td class="px-4 py-3 text-center">
                  <button onclick="showPayModal('${f.dept}', ${total})" class="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-colors" style="background:#8b1a1a" onmouseover="this.style.background='#6b1010'" onmouseout="this.style.background='#8b1a1a'">
                    Pay Now
                  </button>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Fee Breakdown Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

      <!-- Breakdown Card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="font-bold text-gray-800 mb-4">Fee Components Explained</h3>
        <div class="space-y-3">
          ${[
            { label:"Tuition Fee",   desc:"Core academic instruction charges",        color:"#8b1a1a" },
            { label:"Examination",   desc:"Mid-term and end-semester exam fees",       color:"#d97706" },
            { label:"Library",       desc:"Access to books, journals, digital resources",color:"#1d4ed8" },
            { label:"Sports",        desc:"Grounds, equipment, tournaments",           color:"#166534" },
            { label:"Miscellaneous", desc:"ID card, orientation, admin charges",       color:"#6b7280" },
            { label:"Hostel",        desc:"Accommodation + mess (optional)",           color:"#7c3aed" },
          ].map(item => `
            <div class="flex items-start gap-3">
              <div class="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" style="background:${item.color}"></div>
              <div>
                <div class="text-sm font-semibold text-gray-700">${item.label}</div>
                <div class="text-xs text-gray-400">${item.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="font-bold text-gray-800 mb-4">Payment Methods Accepted</h3>
        <div class="grid grid-cols-2 gap-3">
          ${[
            { method:"UPI / GPay / PhonePe", icon:"📱" },
            { method:"Net Banking",           icon:"🏦" },
            { method:"Debit / Credit Card",   icon:"💳" },
            { method:"DD / Challan",          icon:"📄" },
          ].map(p => `
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span class="text-2xl">${p.icon}</span>
              <span class="text-sm font-medium text-gray-700">${p.method}</span>
            </div>
          `).join('')}
        </div>
        <div class="mt-4 p-3 rounded-xl text-xs" style="background:#fef9c3;color:#a16207">
          <strong>Scholarship Note:</strong> SC/ST students eligible for full fee waiver under AP state scheme. OBC: 50% waiver. Apply via scholarship portal before May 30.
        </div>
      </div>
    </div>
  </div>
  `;
}

function showPayModal(dept, amount) {
  showModal(`
    <div class="p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-black text-gray-800">Pay Fee — ${dept}</h2>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
      </div>
      <div class="p-4 rounded-xl mb-5 text-center" style="background:#fdf3f3">
        <div class="text-3xl font-black" style="color:#8b1a1a">₹${amount.toLocaleString()}</div>
        <div class="text-sm text-gray-500 mt-1">Spring 2026 · Day Scholar (excl. hostel)</div>
      </div>
      <div class="space-y-3 mb-5">
        <input type="text" placeholder="Student ID (e.g. AU2023001)" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>
        <input type="text" placeholder="Full Name" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>
        <select class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 bg-white">
          <option>Select Payment Method</option>
          <option>UPI / GPay / PhonePe</option>
          <option>Net Banking</option>
          <option>Debit / Credit Card</option>
          <option>DD / Challan</option>
        </select>
      </div>
      <button onclick="simulatePayment()" class="w-full py-3 rounded-xl text-white font-bold text-sm transition-colors" style="background:#8b1a1a" onmouseover="this.style.background='#6b1010'" onmouseout="this.style.background='#8b1a1a'">
        🔒 Proceed to Secure Payment
      </button>
      <p class="text-center text-xs text-gray-400 mt-3">Secured by 256-bit SSL encryption</p>
    </div>
  `);
}

function simulatePayment() {
  document.getElementById('modal-content').innerHTML = `
    <div class="p-8 text-center">
      <div class="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4" style="background:#dcfce7">✅</div>
      <h2 class="text-xl font-black text-gray-800 mb-2">Payment Successful!</h2>
      <p class="text-sm text-gray-500 mb-1">Transaction ID: AU${Date.now().toString().slice(-8)}</p>
      <p class="text-xs text-gray-400 mb-5">Receipt will be sent to your registered email.</p>
      <button onclick="closeModal()" class="px-6 py-2.5 rounded-xl text-white font-semibold text-sm" style="background:#8b1a1a">Close</button>
    </div>
  `;
}
