// ============================================================
// Analytics Page — Charts & Insights
// ============================================================
function renderAnalytics() {
  const a = AppData.analytics;
  const depts = AppData.departments;

  return `
  <div class="p-6 space-y-6">

    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-950 to-primary-900 rounded-2xl p-6 text-white">
      <h2 class="text-xl font-black mb-1">University Analytics</h2>
      <p class="text-slate-300 text-sm">Student strength, enrollment trends, and high-demand courses · Spring 2026</p>
      <div class="flex gap-6 mt-4">
        <div><div class="text-2xl font-black">${AppData.university.totalStudents.toLocaleString()}</div><div class="text-slate-400 text-xs">Total Students</div></div>
        <div><div class="text-2xl font-black">${AppData.university.totalFaculty}</div><div class="text-slate-400 text-xs">Faculty</div></div>
        <div><div class="text-2xl font-black">${AppData.university.departments}</div><div class="text-slate-400 text-xs">Departments</div></div>
        <div><div class="text-2xl font-black">${AppData.university.courses}</div><div class="text-slate-400 text-xs">Courses</div></div>
      </div>
    </div>

    <!-- Row 1: Year-wise + Enrollment trend -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

      <!-- Year-wise strength -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="font-bold text-gray-800 mb-1">Year-wise Student Strength</h3>
        <p class="text-xs text-gray-400 mb-4">Students per academic year — Spring 2026</p>
        <div class="chart-container" style="height:220px">
          <canvas id="chartYearStrength"></canvas>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-3">
          ${a.yearwiseStrength.map(y => `
            <div class="bg-gray-50 rounded-xl p-3 text-center">
              <div class="text-xl font-black text-primary-600">${y.students.toLocaleString()}</div>
              <div class="text-xs text-gray-400">${y.year}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Enrollment trend -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="font-bold text-gray-800 mb-1">Enrollment Trend (5 Years)</h3>
        <p class="text-xs text-gray-400 mb-4">Total student enrollment per academic year</p>
        <div class="chart-container" style="height:220px">
          <canvas id="chartEnrollment"></canvas>
        </div>
        <div class="mt-4 flex items-center justify-between text-xs text-gray-500 rounded-xl p-3" style="background:#fef9c3">
          <span class="font-medium font-medium" style="color:#8b1a1a">Growth since 2026</span>
          <span class="font-black text-base" style="color:#ca8a04">+27.0%</span>
        </div>
      </div>
    </div>

    <!-- Row 2: Dept distribution + GPA -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

      <!-- Department strength doughnut -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="font-bold text-gray-800 mb-1">Department-wise Enrollment</h3>
        <p class="text-xs text-gray-400 mb-4">Share of students per department</p>
        <div class="flex gap-4 items-center">
          <div class="chart-container flex-shrink-0" style="height:200px;width:200px">
            <canvas id="chartDeptPie"></canvas>
          </div>
          <div class="flex-1 space-y-2">
            ${depts.map(d => {
              const pct = Math.round((d.students / AppData.university.totalStudents) * 100);
              return `
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full flex-shrink-0" style="background:${d.color}"></div>
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between text-xs">
                      <span class="text-gray-600 truncate">${d.icon} ${d.code}</span>
                      <span class="font-bold text-gray-700 ml-1">${pct}%</span>
                    </div>
                    <div class="progress-bar mt-0.5">
                      <div class="progress-fill" style="width:${pct}%;background:${d.color}"></div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- GPA distribution -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="font-bold text-gray-800 mb-1">GPA Distribution</h3>
        <p class="text-xs text-gray-400 mb-4">Number of students by GPA range</p>
        <div class="chart-container" style="height:220px">
          <canvas id="chartGpa"></canvas>
        </div>
        <div class="mt-3 flex items-center gap-2 text-xs rounded-xl p-3" style="background:#fef9c3;color:#8b1a1a"">
          <span>🏆</span>
          <span class="font-medium">Dean's List (GPA 3.5+): <strong>${AppData.analytics.gpaDistribution[0].count.toLocaleString()} students</strong></span>
        </div>
      </div>
    </div>

    <!-- High Demand Courses -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 class="font-bold text-gray-800 mb-1">High Demand Courses — 5 Year Trend</h3>
      <p class="text-xs text-gray-400 mb-4">Course enrollment demand by year (2022–2026)</p>
      <div class="chart-container" style="height:300px">
        <canvas id="chartHighDemand"></canvas>
      </div>
    </div>

    <!-- Demand Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100">
        <h3 class="font-bold text-gray-800">Course Demand Rankings (2026)</h3>
        <p class="text-xs text-gray-400">Sorted by current enrollment demand</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th class="px-5 py-3 text-left">Rank</th>
              <th class="px-5 py-3 text-left">Course</th>
              <th class="px-5 py-3 text-left">Dept</th>
              <th class="px-5 py-3 text-right">2022</th>
              <th class="px-5 py-3 text-right">2023</th>
              <th class="px-5 py-3 text-right">2024</th>
              <th class="px-5 py-3 text-right">2025</th>
              <th class="px-5 py-3 text-right">2026</th>
              <th class="px-5 py-3 text-right">Growth</th>
            </tr>
          </thead>
          <tbody>
            ${a.highDemandCourses
              .sort((a,b) => b.y2026 - a.y2026)
              .map((c, i) => {
                const growth = Math.round(((c.y2026 - c.y2022) / c.y2022) * 100);
                return `
                  <tr class="border-t border-gray-50">
                    <td class="px-5 py-3">
                      <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white inline-flex" style="background:${deptColor(c.dept)}">${i+1}</span>
                    </td>
                    <td class="px-5 py-3 font-semibold text-gray-800">${c.icon} ${c.course}</td>
                    <td class="px-5 py-3"><span class="badge" style="background:${deptBg(c.dept)};color:${deptColor(c.dept)}">${c.dept}</span></td>
                    <td class="px-5 py-3 text-right text-gray-500">${c.y2022}</td>
                    <td class="px-5 py-3 text-right text-gray-500">${c.y2023}</td>
                    <td class="px-5 py-3 text-right text-gray-500">${c.y2024}</td>
                    <td class="px-5 py-3 text-right text-gray-500">${c.y2025}</td>
                    <td class="px-5 py-3 text-right font-black" style="color:${deptColor(c.dept)}">${c.y2026.toLocaleString()}</td>
                    <td class="px-5 py-3 text-right">
                      <span class="badge bg-green-100 text-green-700">+${growth}%</span>
                    </td>
                  </tr>
                `;
              }).join('')}
          </tbody>
        </table>
      </div>
    </div>

  </div>
  `;
}

// ---- Initialize Charts (called after DOM render) ----
function initCharts() {
  window._charts = window._charts || [];
  const a     = AppData.analytics;
  const depts = AppData.departments;

  const defaultFont = { family: 'ui-sans-serif, system-ui, sans-serif', size: 12 };
  Chart.defaults.font = defaultFont;

  // 1. Year-wise strength — horizontal bar
  const ctx1 = document.getElementById('chartYearStrength');
  if (ctx1) {
    window._charts.push(new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: a.yearwiseStrength.map(y => y.year),
        datasets: [{
          label: 'Students',
          data:  a.yearwiseStrength.map(y => y.students),
          backgroundColor: ['#8b1a1a','#b81c1c','#e89090','#faeaea'],
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color:'#f1f5f9' }, ticks: { font: defaultFont } },
          y: { grid: { display: false }, ticks: { font: defaultFont } }
        }
      }
    }));
  }

  // 2. Enrollment trend — line
  const ctx2 = document.getElementById('chartEnrollment');
  if (ctx2) {
    window._charts.push(new Chart(ctx2, {
      type: 'line',
      data: {
        labels: a.enrollmentTrend.map(x => x.year),
        datasets: [{
          label: 'Total Students',
          data:  a.enrollmentTrend.map(x => x.students),
          borderColor: '#ca8a04',
          backgroundColor: 'rgba(202,138,4,0.08)',
          borderWidth: 3,
          pointBackgroundColor: '#ca8a04',
          pointRadius: 5,
          tension: 0.4,
          fill: true,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: defaultFont } },
          y: { grid: { color:'#f1f5f9' }, ticks: { font: defaultFont } }
        }
      }
    }));
  }

  // 3. Dept pie/doughnut
  const ctx3 = document.getElementById('chartDeptPie');
  if (ctx3) {
    window._charts.push(new Chart(ctx3, {
      type: 'doughnut',
      data: {
        labels: depts.map(d => d.code),
        datasets: [{
          data: depts.map(d => d.students),
          backgroundColor: depts.map(d => d.color),
          borderWidth: 2,
          borderColor: '#fff',
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed.toLocaleString()} students` }}
        },
        cutout: '65%'
      }
    }));
  }

  // 4. GPA distribution — bar
  const ctx4 = document.getElementById('chartGpa');
  if (ctx4) {
    window._charts.push(new Chart(ctx4, {
      type: 'bar',
      data: {
        labels: a.gpaDistribution.map(g => g.range),
        datasets: [{
          label: 'Students',
          data:  a.gpaDistribution.map(g => g.count),
          backgroundColor: ['#8b1a1a','#b81c1c','#ca8a04','#d97706','#f59e0b'],
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: defaultFont } },
          y: { grid: { color:'#f1f5f9' }, ticks: { font: defaultFont } }
        }
      }
    }));
  }

  // 5. High demand courses — multi-line
  const ctx5 = document.getElementById('chartHighDemand');
  if (ctx5) {
    const colors = ['#8b1a1a','#ca8a04','#6b1010','#d97706','#b81c1c','#a16207'];
    const years  = ['2022','2023','2024','2025','2026'];
    const courses = AppData.analytics.highDemandCourses;
    window._charts.push(new Chart(ctx5, {
      type: 'line',
      data: {
        labels: years,
        datasets: courses.map((c, i) => ({
          label: c.course,
          data: [c.y2022, c.y2023, c.y2024, c.y2025, c.y2026],
          borderColor: colors[i % colors.length],
          backgroundColor: 'transparent',
          borderWidth: 2.5,
          pointBackgroundColor: colors[i % colors.length],
          pointRadius: 4,
          tension: 0.4,
        }))
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position:'bottom', labels: { font: defaultFont, usePointStyle: true, padding: 16 } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: defaultFont } },
          y: { grid: { color:'#f1f5f9' }, ticks: { font: defaultFont }, title: { display: true, text: 'Enrollments', font: defaultFont } }
        }
      }
    }));
  }
}
