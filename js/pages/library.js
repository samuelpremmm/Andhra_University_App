// ============================================================
// Library Module
// ============================================================
function renderLibrary() {
  const lib = AppData.library;
  const availPct = Math.round((lib.available / lib.totalBooks) * 100);

  return `
  <div class="p-6 space-y-5">

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-primary-600">${lib.totalBooks.toLocaleString()}</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Total Books</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-emerald-600">${lib.available.toLocaleString()}</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Available</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-amber-600">${lib.borrowed.toLocaleString()}</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Borrowed</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-blue-600">${lib.members.toLocaleString()}</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Members</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Section-wise availability -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="font-bold text-gray-800 mb-4">Section-wise Availability</h3>
        <div class="space-y-3">
          ${lib.sections.map(s => {
            const pct = Math.round((s.available / s.books) * 100);
            const color = pct > 70 ? '#166534' : pct > 40 ? '#d97706' : '#b91c1c';
            return `
            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="text-gray-600 font-medium">${s.name}</span>
                <span class="font-bold" style="color:${color}">${s.available.toLocaleString()} / ${s.books.toLocaleString()}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${pct}%;background:${color}"></div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Book Search -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <h3 class="font-bold text-gray-800">Book Catalogue</h3>
          <input id="lib-search" type="text" placeholder="Search title / author / dept..."
            class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-400 w-56"
            oninput="filterTable('lib-search','lib-tbody')"/>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th class="px-5 py-3 text-left">Book</th>
                <th class="px-4 py-3 text-left">Dept</th>
                <th class="px-4 py-3 text-center">Copies</th>
                <th class="px-4 py-3 text-center">Available</th>
                <th class="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody id="lib-tbody">
              ${lib.books.map(b => `
              <tr class="data-row border-t border-gray-50">
                <td class="px-5 py-3">
                  <div class="font-semibold text-gray-800 text-sm">${b.title}</div>
                  <div class="text-xs text-gray-400">${b.author} · ${b.id}</div>
                </td>
                <td class="px-4 py-3"><span class="badge text-xs" style="background:${deptBg(b.dept)};color:${deptColor(b.dept)}">${b.dept}</span></td>
                <td class="px-4 py-3 text-center text-gray-600">${b.copies}</td>
                <td class="px-4 py-3 text-center">
                  <span class="font-bold ${b.available > 0 ? 'text-emerald-600' : 'text-red-500'}">${b.available}</span>
                  ${b.available === 0 ? `<div class="text-xs text-gray-400">Due: ${formatDate(b.due)}</div>` : ''}
                </td>
                <td class="px-4 py-3 text-center">
                  ${b.available > 0
                    ? `<button onclick="borrowBook('${b.id}','${b.title}')" class="text-xs font-semibold px-3 py-1 rounded-lg text-white" style="background:#8b1a1a">Borrow</button>`
                    : `<button onclick="reserveBook('${b.id}','${b.title}')" class="text-xs font-semibold px-3 py-1 rounded-lg" style="background:#fef9c3;color:#a16207">Reserve</button>`}
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Timings -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 class="font-bold text-gray-800 mb-4">Library Timings & Rules</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div class="p-4 rounded-xl" style="background:#f0fdf4">
          <div class="font-bold text-emerald-700 mb-2">🕐 Timings</div>
          <div class="text-gray-600 space-y-1">
            <div>Mon–Fri: 8:00 AM – 9:00 PM</div>
            <div>Saturday: 9:00 AM – 5:00 PM</div>
            <div>Sunday: 10:00 AM – 2:00 PM</div>
          </div>
        </div>
        <div class="p-4 rounded-xl" style="background:#eff6ff">
          <div class="font-bold text-blue-700 mb-2">📋 Borrow Limits</div>
          <div class="text-gray-600 space-y-1">
            <div>Students: 3 books / 14 days</div>
            <div>Faculty: 10 books / 30 days</div>
            <div>Fine: ₹2 per book per day</div>
          </div>
        </div>
        <div class="p-4 rounded-xl" style="background:#fef9c3">
          <div class="font-bold text-amber-700 mb-2">ℹ️ Info</div>
          <div class="text-gray-600 space-y-1">
            <div>Carry valid AU ID card</div>
            <div>Silence must be maintained</div>
            <div>No food/drinks inside</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

function borrowBook(id, title) {
  showModal(`
    <div class="p-6 text-center">
      <div class="text-3xl mb-3">📚</div>
      <h2 class="text-lg font-black text-gray-800 mb-2">Borrow Request</h2>
      <p class="text-sm text-gray-600 mb-4"><strong>${title}</strong></p>
      <input type="text" placeholder="Your Student ID" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-primary-400"/>
      <button onclick="confirmBorrow('${title}')" class="w-full py-2.5 rounded-xl text-white font-bold text-sm" style="background:#8b1a1a">Confirm Borrow</button>
    </div>
  `);
}

function reserveBook(id, title) {
  showModal(`
    <div class="p-6 text-center">
      <div class="text-3xl mb-3">🔖</div>
      <h2 class="text-lg font-black text-gray-800 mb-2">Reserve Book</h2>
      <p class="text-sm text-gray-600 mb-4">Currently unavailable. Reserve <strong>${title}</strong>?</p>
      <input type="text" placeholder="Your Student ID" class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-primary-400"/>
      <button onclick="confirmBorrow('${title}','Reserved')" class="w-full py-2.5 rounded-xl text-white font-bold text-sm" style="background:#d97706">Reserve</button>
    </div>
  `);
}

function confirmBorrow(title, action) {
  action = action || 'Borrowed';
  document.getElementById('modal-content').innerHTML = `
    <div class="p-6 text-center">
      <div class="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3" style="background:#dcfce7">✅</div>
      <h2 class="text-lg font-black text-gray-800 mb-1">${action}!</h2>
      <p class="text-sm text-gray-500 mb-4">"${title}" has been ${action.toLowerCase()}. Due in 14 days.</p>
      <button onclick="closeModal()" class="px-6 py-2.5 rounded-xl text-white font-semibold text-sm" style="background:#8b1a1a">Done</button>
    </div>
  `;
}
