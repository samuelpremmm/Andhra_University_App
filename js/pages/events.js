// ============================================================
// Events & Schedules Page
// ============================================================
function renderEvents() {
  const events = AppData.events;
  const upcoming  = events.filter(e => e.status === 'Upcoming');
  const completed = events.filter(e => e.status === 'Completed');

  const typeMap = {
    Academic: { bg:'#dbeafe', color:'#1d4ed8', emoji:'🎓' },
    Sports:   { bg:'#dcfce7', color:'#15803d', emoji:'🏆' },
    Cultural: { bg:'#fce7f3', color:'#be185d', emoji:'🎭' },
    Career:   { bg:'#e0f2fe', color:'#a16207', emoji:'💼' },
    Workshop: { bg:'#ede9fe', color:'#7c3aed', emoji:'🛠️' },
    Social:   { bg:'#ffedd5', color:'#c2410c', emoji:'🤝' },
  };

  function eventCard(e) {
    const t = typeMap[e.type] || { bg:'#f1f5f9', color:'#475569', emoji:'📌' };
    const dateObj = new Date(e.date);
    const dayNum  = dateObj.getDate();
    const mon     = dateObj.toLocaleDateString('en-US', { month:'short' });
    const weekday = dateObj.toLocaleDateString('en-US', { weekday:'short' });
    return `
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex">
        <!-- Date column -->
        <div class="flex flex-col items-center justify-center px-4 py-5 min-w-[70px]" style="background:${t.bg}">
          <div class="text-xs font-semibold uppercase" style="color:${t.color}">${mon}</div>
          <div class="text-3xl font-black" style="color:${t.color}">${dayNum}</div>
          <div class="text-xs" style="color:${t.color}">${weekday}</div>
        </div>
        <!-- Content -->
        <div class="flex-1 p-4">
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-bold text-gray-800 text-base leading-tight">${e.title}</h3>
            <span class="badge flex-shrink-0" style="background:${t.bg};color:${t.color}">${t.emoji} ${e.type}</span>
          </div>
          <p class="text-sm text-gray-500 mt-1 line-clamp-2">${e.description}</p>
          <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-400">
            <span>🕐 ${e.time}</span>
            <span>📍 ${e.location}</span>
            <span>👤 ${e.organizer}</span>
          </div>
        </div>
        <!-- Status -->
        <div class="flex items-center pr-4">
          ${statusBadge(e.status)}
        </div>
      </div>
    `;
  }

  return `
  <div class="p-6 space-y-6">

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-primary-600">${events.length}</div>
        <div class="text-xs font-semibold text-gray-500">Total Events</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-blue-600">${upcoming.length}</div>
        <div class="text-xs font-semibold text-gray-500">Upcoming</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-gray-400">${completed.length}</div>
        <div class="text-xs font-semibold text-gray-500">Completed</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <div class="text-2xl font-black text-amber-600">${[...new Set(events.map(e=>e.type))].length}</div>
        <div class="text-xs font-semibold text-gray-500">Event Types</div>
      </div>
    </div>

    <!-- Type legend -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3">
      <div class="flex flex-wrap gap-2 items-center">
        <span class="text-xs text-gray-400 mr-1 font-medium">Types:</span>
        ${Object.entries(typeMap).map(([type, t]) =>
          `<span class="badge" style="background:${t.bg};color:${t.color}">${t.emoji} ${type}</span>`
        ).join('')}
      </div>
    </div>

    <!-- Upcoming Events -->
    <div>
      <h2 class="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span class="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
        Upcoming Events (${upcoming.length})
      </h2>
      <div class="space-y-3">
        ${upcoming.map(eventCard).join('')}
      </div>
    </div>

    <!-- Past Events -->
    <div>
      <h2 class="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span class="w-2 h-2 bg-gray-300 rounded-full inline-block"></span>
        Past Events (${completed.length})
      </h2>
      <div class="space-y-3 opacity-70">
        ${completed.map(eventCard).join('')}
      </div>
    </div>

  </div>
  `;
}
