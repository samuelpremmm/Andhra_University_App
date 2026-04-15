// ============================================================
// Hostel Module
// ============================================================
function renderHostel() {
  const h = AppData.hostel;
  const occupancyPct = Math.round((h.occupied / h.totalCapacity) * 100);

  return `
  <div class="p-6 space-y-5">

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-primary-600">${h.totalCapacity.toLocaleString()}</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Total Capacity</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-emerald-600">${h.occupied.toLocaleString()}</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Occupied</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-blue-600">${(h.totalCapacity - h.occupied).toLocaleString()}</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Vacant</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-amber-600">${occupancyPct}%</div>
        <div class="text-xs font-semibold text-gray-500 mt-0.5">Occupancy</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Block Cards -->
      <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        ${h.blocks.map(b => {
          const pct = Math.round((b.occupied / b.capacity) * 100);
          const vacant = b.capacity - b.occupied;
          const typeColor = b.type === 'Girls' ? '#9d174d' : b.type === 'PG' ? '#1d4ed8' : '#1d4ed8';
          const typeBg    = b.type === 'Girls' ? '#fdf2f8' : b.type === 'PG' ? '#eff6ff' : '#eff6ff';
          return `
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h4 class="font-bold text-gray-800 text-sm">${b.block}</h4>
                <p class="text-xs text-gray-400">${b.warden}</p>
              </div>
              <span class="badge text-xs" style="background:${typeBg};color:${typeColor}">${b.type}</span>
            </div>
            <div class="grid grid-cols-3 gap-2 mb-3 text-center">
              <div class="p-2 rounded-lg" style="background:${typeBg}">
                <div class="text-sm font-black" style="color:${typeColor}">${b.capacity}</div>
                <div class="text-xs text-gray-400">Capacity</div>
              </div>
              <div class="p-2 rounded-lg bg-gray-50">
                <div class="text-sm font-black text-gray-700">${b.occupied}</div>
                <div class="text-xs text-gray-400">Occupied</div>
              </div>
              <div class="p-2 rounded-lg" style="background:${vacant > 10 ? '#f0fdf4' : '#fef2f2'}">
                <div class="text-sm font-black" style="color:${vacant > 10 ? '#166534' : '#b91c1c'}">${vacant}</div>
                <div class="text-xs text-gray-400">Vacant</div>
              </div>
            </div>
            <div class="mb-3">
              <div class="flex justify-between text-xs mb-1">
                <span class="text-gray-500">Occupancy</span>
                <span class="font-bold" style="color:${typeColor}">${pct}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${pct}%;background:${typeColor}"></div>
              </div>
            </div>
            <div class="flex flex-wrap gap-1">
              ${b.amenities.map(a => `<span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">${a}</span>`).join('')}
            </div>
          </div>`;
        }).join('')}
      </div>

      <!-- Mess Menu + Apply -->
      <div class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="font-bold text-gray-800 mb-4">🍽️ Today's Mess Menu</h3>
          <div class="space-y-3">
            ${Object.entries(h.messMenu).map(([meal, menu]) => `
              <div class="p-3 rounded-xl bg-gray-50">
                <div class="text-xs font-bold text-gray-500 uppercase mb-1">${meal}</div>
                <div class="text-sm text-gray-700">${menu}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="font-bold text-gray-800 mb-3">Apply for Hostel</h3>
          <div class="space-y-3">
            <input type="text" placeholder="Student ID" class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400"/>
            <select class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 bg-white">
              <option>Select Block Type</option>
              <option>Boys Hostel</option>
              <option>Girls Hostel</option>
              <option>PG Block</option>
            </select>
            <select class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 bg-white">
              <option>Room Type</option>
              <option>Single Room — ₹60,000/yr</option>
              <option>Double Sharing — ₹48,000/yr</option>
              <option>Triple Sharing — ₹38,000/yr</option>
            </select>
            <button onclick="submitHostelApp()" class="w-full py-2.5 rounded-xl text-white font-bold text-sm" style="background:#1d4ed8" onmouseover="this.style.background='#1e40af'" onmouseout="this.style.background='#1d4ed8'">
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

function submitHostelApp() {
  showModal(`
    <div class="p-6 text-center">
      <div class="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3" style="background:#dcfce7">✅</div>
      <h2 class="text-lg font-black text-gray-800 mb-2">Application Submitted!</h2>
      <p class="text-sm text-gray-500 mb-1">Ref: HSTL${Date.now().toString().slice(-6)}</p>
      <p class="text-xs text-gray-400 mb-5">You will be allotted a room within 3 working days. Check your AU email for confirmation.</p>
      <button onclick="closeModal()" class="px-6 py-2.5 rounded-xl text-white font-semibold text-sm" style="background:#1d4ed8">Close</button>
    </div>
  `);
}
