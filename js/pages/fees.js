// ============================================================
// Fee Structure — Semester-wise Per Department
// ============================================================

var FEE_TUITION = {
  CSE:    42500, ITCA:   40000, MECH:   38500, EEE:    38000,
  CIVIL:  36000, CHEM:   37000, MARINE: 39000, META:   35000,
  INST:   37500, ENV:    34000, GEO:    33000, ARCH:   41000
};

var FEE_FIXED = { exam: 2500, library: 1500, sports: 1000, misc: 2000 };

// Lab/practical fees per semester (higher in mid-years)
var FEE_LAB = [3000, 3500, 4500, 5000, 5500, 5500, 4000, 2500];

// Year multiplier per semester (advanced curriculum = higher tuition)
var FEE_MULT = [1.00, 1.00, 1.04, 1.04, 1.08, 1.08, 1.12, 1.12];

// Session labels
var SEM_SESSION = [
  'Fall 2022','Spring 2023','Fall 2023','Spring 2024',
  'Fall 2024','Spring 2025','Fall 2025','Spring 2026'
];
var SEM_YEAR_LABEL = [
  'Year I','Year I','Year II','Year II',
  'Year III','Year III','Year IV','Year IV'
];

// Mock payment status for a current final-year student
// Sems 1–7 paid; Sem 8 is due now (Spring 2026)
var SEM_STATUS = ['paid','paid','paid','paid','paid','paid','paid','due'];

var _feesDept = 'CSE';

function renderFees() {
  var depts = AppData.departments;

  return [
    '<div class="p-6 space-y-5">',

    // ── Top bar ──────────────────────────────────────────────
    '<div class="flex flex-wrap items-center justify-between gap-3 mb-1">',
      '<div>',
        '<h2 class="text-lg font-black text-gray-800">Semester-wise Fee Structure</h2>',
        '<p class="text-xs text-gray-400 mt-0.5">Select your department to see per-semester fee breakdown</p>',
      '</div>',
      '<span class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style="background:#e0f2fe;color:#a16207">',
        '⚠️ Current Due: 15 June 2026',
      '</span>',
    '</div>',

    // ── Dept selector ────────────────────────────────────────
    '<div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">',
      '<div class="flex flex-wrap gap-3 items-center">',
        '<label class="text-sm font-semibold text-gray-600 whitespace-nowrap">Select Department:</label>',
        '<select id="fees-dept-select" onchange="switchFeesDept(this.value)"',
          ' class="border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-primary-400 bg-white">',
          depts.map(function(d) {
            return '<option value="' + d.code + '"' + (d.code === _feesDept ? ' selected' : '') + '>' +
              d.icon + ' ' + d.code + ' — ' + d.name + '</option>';
          }).join(''),
        '</select>',
        '<div class="flex gap-2 ml-auto">',
          '<span id="fees-dept-badge" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style="background:#eff6ff;color:#1d4ed8">',
            '💻 CSE',
          '</span>',
          '<button onclick="showFeesSummary()" class="text-xs font-semibold px-3 py-1.5 rounded-xl text-white" style="background:#1d4ed8" onmouseover="this.style.background=\'#1e40af\'" onmouseout="this.style.background=\'#1d4ed8\'">',
            '📊 Fee Summary',
          '</button>',
        '</div>',
      '</div>',
    '</div>',

    // ── Semester cards ────────────────────────────────────────
    '<div id="fees-sem-grid" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">',
      renderSemCards(_feesDept),
    '</div>',

    // ── Legend + Info ─────────────────────────────────────────
    '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">',

      // Status legend
      '<div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">',
        '<h3 class="font-bold text-gray-700 mb-3 text-sm">Payment Status</h3>',
        '<div class="space-y-2">',
          '<div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full" style="background:#22c55e"></span><span class="text-xs text-gray-600">Paid — fee cleared</span></div>',
          '<div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full" style="background:#ef4444"></span><span class="text-xs text-gray-600">Due — payment pending</span></div>',
          '<div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full" style="background:#94a3b8"></span><span class="text-xs text-gray-600">Upcoming — future semester</span></div>',
        '</div>',
      '</div>',

      // Payment modes
      '<div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">',
        '<h3 class="font-bold text-gray-700 mb-3 text-sm">Payment Methods</h3>',
        '<div class="grid grid-cols-2 gap-1.5">',
          [['📱','UPI / GPay'],['🏦','Net Banking'],['💳','Debit/Credit Card'],['📄','DD / Challan']].map(function(p){
            return '<div class="flex items-center gap-1.5 p-2 bg-gray-50 rounded-lg"><span>' + p[0] + '</span><span class="text-xs text-gray-600">' + p[1] + '</span></div>';
          }).join(''),
        '</div>',
      '</div>',

      // Scholarship
      '<div class="rounded-2xl p-4" style="background:#e0f2fe;border:1px solid #fde047">',
        '<h3 class="font-bold text-amber-800 mb-2 text-sm">🎓 Scholarships</h3>',
        '<ul class="text-xs text-amber-700 space-y-1">',
          '<li>• SC/ST → <b>Full tuition waiver</b></li>',
          '<li>• OBC → <b>50% tuition waiver</b></li>',
          '<li>• Merit (GPA ≥ 3.8) → ₹15,000/sem</li>',
          '<li>• Sports excellence → ₹10,000/sem</li>',
          '<li>📅 Apply before <b>30 May 2026</b></li>',
        '</ul>',
      '</div>',

    '</div>',

    '</div>'
  ].join('');
}

function renderSemCards(dept) {
  var baseTuition = FEE_TUITION[dept] || 38000;
  var cards = '';
  for (var i = 0; i < 8; i++) {
    var sem    = i + 1;
    var status = SEM_STATUS[i];
    var tuition = Math.round(baseTuition * FEE_MULT[i]);
    var lab     = FEE_LAB[i];
    var total   = tuition + lab + FEE_FIXED.exam + FEE_FIXED.library + FEE_FIXED.sports + FEE_FIXED.misc;
    var totalWithHostel = total + 24000;

    var statusColor = status === 'paid' ? '#166534' : status === 'due' ? '#991b1b' : '#475569';
    var statusBg    = status === 'paid' ? '#dcfce7' : status === 'due' ? '#fee2e2' : '#f1f5f9';
    var statusLabel = status === 'paid' ? '✅ Paid' : status === 'due' ? '🔴 Due' : '⏳ Upcoming';
    var borderStyle = status === 'due' ? 'border:2px solid #ef4444' : status === 'paid' ? 'border:1px solid #bbf7d0' : 'border:1px solid #e2e8f0';

    cards += [
      '<div class="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-2 transition-all hover:shadow-md" style="' + borderStyle + '">',

        // Header
        '<div class="flex items-start justify-between">',
          '<div>',
            '<div class="text-base font-black text-gray-800">Sem ' + sem + '</div>',
            '<div class="text-xs font-semibold" style="color:#1d4ed8">' + SEM_YEAR_LABEL[i] + '</div>',
            '<div class="text-xs text-gray-400">' + SEM_SESSION[i] + '</div>',
          '</div>',
          '<span class="text-xs font-bold px-2.5 py-1 rounded-full" style="background:' + statusBg + ';color:' + statusColor + '">' + statusLabel + '</span>',
        '</div>',

        // Fee breakdown
        '<div class="space-y-1 border-t border-gray-50 pt-2 mt-1">',
          feeRow('Tuition', tuition, '#1d4ed8'),
          feeRow('Lab / Practical', lab, '#7c3aed'),
          feeRow('Examination', FEE_FIXED.exam, '#d97706'),
          feeRow('Library', FEE_FIXED.library, '#0e7490'),
          feeRow('Sports', FEE_FIXED.sports, '#166534'),
          feeRow('Miscellaneous', FEE_FIXED.misc, '#6b7280'),
        '</div>',

        // Total
        '<div class="flex items-center justify-between pt-2 border-t border-gray-100">',
          '<span class="text-xs font-semibold text-gray-500">Day Scholar Total</span>',
          '<span class="text-base font-black text-gray-800">₹' + total.toLocaleString() + '</span>',
        '</div>',
        '<div class="flex items-center justify-between -mt-1">',
          '<span class="text-xs text-gray-400">With Hostel</span>',
          '<span class="text-xs font-bold" style="color:#7c3aed">₹' + totalWithHostel.toLocaleString() + '</span>',
        '</div>',

        // Action
        (status === 'due' ?
          '<button onclick="showPayModal(\'' + dept + ' Sem-' + sem + '\', ' + total + ')" class="mt-2 w-full py-2 rounded-xl text-white text-xs font-bold transition-colors" style="background:#1d4ed8" onmouseover="this.style.background=\'#1e40af\'" onmouseout="this.style.background=\'#1d4ed8\'">🔒 Pay Now — ₹' + total.toLocaleString() + '</button>' :
        status === 'paid' ?
          '<div class="mt-2 w-full py-2 rounded-xl text-center text-xs font-semibold" style="background:#f0fdf4;color:#166534">✅ Payment Complete</div>' :
          '<div class="mt-2 w-full py-2 rounded-xl text-center text-xs font-semibold" style="background:#f8fafc;color:#94a3b8">⏳ Not Yet Due</div>'
        ),

      '</div>'
    ].join('');
  }
  return cards;
}

function feeRow(label, amount, color) {
  return '<div class="flex items-center justify-between text-xs">' +
    '<span class="text-gray-500">' + label + '</span>' +
    '<span class="font-semibold" style="color:' + color + '">₹' + amount.toLocaleString() + '</span>' +
    '</div>';
}

function switchFeesDept(dept) {
  _feesDept = dept;
  var d     = AppData.departments.find(function(x){ return x.code === dept; }) || {};
  var badge = document.getElementById('fees-dept-badge');
  if (badge) {
    badge.textContent  = (d.icon || '') + ' ' + dept;
    badge.style.color  = d.color  || '#1d4ed8';
    badge.style.background = d.bg || '#eff6ff';
  }
  var grid = document.getElementById('fees-sem-grid');
  if (grid) grid.innerHTML = renderSemCards(dept);
}

function showFeesSummary() {
  var dept      = _feesDept;
  var base      = FEE_TUITION[dept] || 38000;
  var d         = AppData.departments.find(function(x){ return x.code === dept; }) || { name: dept, icon:'🏛️' };
  var rows      = '';
  var totalPaid = 0, totalDue = 0, totalUpcoming = 0;

  for (var i = 0; i < 8; i++) {
    var tuition = Math.round(base * FEE_MULT[i]);
    var sem_total = tuition + FEE_LAB[i] + FEE_FIXED.exam + FEE_FIXED.library + FEE_FIXED.sports + FEE_FIXED.misc;
    var status  = SEM_STATUS[i];
    var stColor = status === 'paid' ? '#166534' : status === 'due' ? '#991b1b' : '#64748b';
    var stBg    = status === 'paid' ? '#dcfce7' : status === 'due' ? '#fee2e2' : '#f1f5f9';
    var stLabel = status === 'paid' ? 'Paid' : status === 'due' ? 'Due' : 'Upcoming';

    if (status === 'paid')     totalPaid     += sem_total;
    if (status === 'due')      totalDue      += sem_total;
    if (status === 'upcoming') totalUpcoming += sem_total;

    rows += '<tr class="border-t border-gray-50">' +
      '<td class="px-4 py-2 text-sm text-gray-700 font-medium">Sem ' + (i+1) + '</td>' +
      '<td class="px-4 py-2 text-xs text-gray-400">' + SEM_YEAR_LABEL[i] + '</td>' +
      '<td class="px-4 py-2 text-xs text-gray-400">' + SEM_SESSION[i] + '</td>' +
      '<td class="px-4 py-2 text-sm font-bold text-gray-800 text-right">₹' + sem_total.toLocaleString() + '</td>' +
      '<td class="px-4 py-2 text-center"><span class="text-xs font-semibold px-2 py-0.5 rounded-full" style="background:' + stBg + ';color:' + stColor + '">' + stLabel + '</span></td>' +
    '</tr>';
  }

  for (var j = 0; j < 8; j++) {
    if (SEM_STATUS[j] === 'upcoming') {
      var t2 = Math.round(base * FEE_MULT[j]) + FEE_LAB[j] + FEE_FIXED.exam + FEE_FIXED.library + FEE_FIXED.sports + FEE_FIXED.misc;
      totalUpcoming += t2;
    }
  }

  showModal('<div class="p-6">' +
    '<div class="flex items-center justify-between mb-5">' +
      '<div>' +
        '<h2 class="text-xl font-black text-gray-800">' + d.icon + ' ' + d.name + '</h2>' +
        '<p class="text-xs text-gray-400 mt-0.5">Complete 4-Year Fee Summary</p>' +
      '</div>' +
      '<button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>' +
    '</div>' +

    '<div class="grid grid-cols-3 gap-3 mb-5">' +
      '<div class="text-center p-3 rounded-xl" style="background:#dcfce7"><div class="text-lg font-black" style="color:#166534">₹' + totalPaid.toLocaleString() + '</div><div class="text-xs text-green-700">Total Paid</div></div>' +
      '<div class="text-center p-3 rounded-xl" style="background:#fee2e2"><div class="text-lg font-black" style="color:#991b1b">₹' + totalDue.toLocaleString() + '</div><div class="text-xs text-red-700">Currently Due</div></div>' +
      '<div class="text-center p-3 rounded-xl" style="background:#f1f5f9"><div class="text-lg font-black text-gray-600">₹' + totalUpcoming.toLocaleString() + '</div><div class="text-xs text-gray-500">Upcoming</div></div>' +
    '</div>' +

    '<div class="overflow-x-auto rounded-xl border border-gray-100">' +
      '<table class="w-full text-sm">' +
        '<thead class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">' +
          '<tr><th class="px-4 py-2 text-left">Semester</th><th class="px-4 py-2 text-left">Year</th><th class="px-4 py-2 text-left">Session</th><th class="px-4 py-2 text-right">Amount</th><th class="px-4 py-2 text-center">Status</th></tr>' +
        '</thead>' +
        '<tbody>' + rows + '</tbody>' +
        '<tfoot><tr class="border-t-2 border-gray-200 bg-gray-50">' +
          '<td colspan="3" class="px-4 py-3 text-sm font-black text-gray-800">Grand Total (Day Scholar)</td>' +
          '<td class="px-4 py-3 text-right text-base font-black" style="color:#1d4ed8">₹' + (totalPaid + totalDue + totalUpcoming).toLocaleString() + '</td>' +
          '<td></td>' +
        '</tr></tfoot>' +
      '</table>' +
    '</div>' +

    '<p class="text-xs text-gray-400 mt-3 text-center">* Add ₹24,000/semester for hostel accommodation</p>' +
  '</div>');
}

function showPayModal(label, amount) {
  showModal('<div class="p-6">' +
    '<div class="flex items-center justify-between mb-5">' +
      '<h2 class="text-xl font-black text-gray-800">Pay Fee</h2>' +
      '<button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>' +
    '</div>' +
    '<div class="p-4 rounded-xl mb-2 text-center" style="background:#eff6ff">' +
      '<div class="text-xs font-semibold text-gray-500 mb-1">' + label + '</div>' +
      '<div class="text-3xl font-black" style="color:#1d4ed8">₹' + amount.toLocaleString() + '</div>' +
      '<div class="text-xs text-gray-400 mt-1">Day Scholar · Excl. hostel</div>' +
    '</div>' +
    '<div class="flex items-center justify-center gap-2 mb-4">' +
      '<label class="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" id="pay-hostel" onchange="updatePayTotal(' + amount + ')"> <span>Add Hostel Fee (₹24,000)</span></label>' +
    '</div>' +
    '<div id="pay-total-display" class="text-center font-bold text-lg mb-4" style="color:#1d4ed8">Total: ₹' + amount.toLocaleString() + '</div>' +
    '<div class="space-y-3 mb-5">' +
      '<input type="text" placeholder="Student ID (e.g. AU2023001)" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>' +
      '<input type="text" placeholder="Full Name" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>' +
      '<select class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 bg-white">' +
        '<option>Select Payment Method</option>' +
        '<option>📱 UPI / GPay / PhonePe</option>' +
        '<option>🏦 Net Banking</option>' +
        '<option>💳 Debit / Credit Card</option>' +
        '<option>📄 DD / Challan</option>' +
      '</select>' +
    '</div>' +
    '<button onclick="simulatePayment()" class="w-full py-3 rounded-xl text-white font-bold text-sm" style="background:#1d4ed8" onmouseover="this.style.background=\'#1e40af\'" onmouseout="this.style.background=\'#1d4ed8\'">🔒 Proceed to Secure Payment</button>' +
    '<p class="text-center text-xs text-gray-400 mt-3">Secured by 256-bit SSL encryption · NPCI Payment Gateway</p>' +
  '</div>');
}

function updatePayTotal(base) {
  var hostel = document.getElementById('pay-hostel') && document.getElementById('pay-hostel').checked ? 24000 : 0;
  var total  = base + hostel;
  var el     = document.getElementById('pay-total-display');
  if (el) el.textContent = 'Total: ₹' + total.toLocaleString();
}

function simulatePayment() {
  document.getElementById('modal-content').innerHTML =
    '<div class="p-8 text-center">' +
      '<div class="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4" style="background:#dcfce7">✅</div>' +
      '<h2 class="text-2xl font-black text-gray-800 mb-1">Payment Successful!</h2>' +
      '<p class="text-sm text-gray-500 mb-1">Transaction ID: <b>AUPY' + Date.now().toString().slice(-10) + '</b></p>' +
      '<p class="text-xs text-gray-400 mb-1">Date: ' + new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) + '</p>' +
      '<p class="text-xs text-gray-400 mb-6">Receipt sent to your registered email & mobile.</p>' +
      '<div class="p-3 rounded-xl text-xs mb-5" style="background:#f0fdf4;color:#166534">Fee payment recorded successfully for Spring 2026 semester.</div>' +
      '<button onclick="closeModal()" class="px-8 py-2.5 rounded-xl text-white font-semibold text-sm" style="background:#1d4ed8">Close</button>' +
    '</div>';
}
