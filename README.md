# 🎓 Andhra University Smart Campus App

<div align="center">

![Andhra University](https://img.shields.io/badge/Andhra%20University-Est.%201926-8b1a1a?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Ready-4285F4?style=for-the-badge&logo=googlechrome)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A secure, scalable digital campus platform for Andhra University, Visakhapatnam**

[Live Demo](#running-locally) · [Features](#features) · [Screenshots](#screenshots) · [Tech Stack](#tech-stack)

</div>

---

## 📌 Overview

The **Andhra University Smart Campus App** is a single-page web application (PWA) that brings academics, administration, and student services into one secure platform. Built for students, faculty, admins, and the Dean — it replaces manual processes with a clean, fast digital experience.

> **One-line pitch:** A secure, scalable digital campus platform for Andhra University.

---

## ✨ Features

### 🏠 Dashboard
- University-wide stats (students, faculty, departments, courses)
- Upcoming events and exam reminders
- Department strength progress bars
- Recent student records

### 🎓 Students
- Full student directory with search & filters (dept, year, GPA)
- Detailed student profile — courses, advisor, GPA chart, contact info

### 👩‍🏫 Faculty
- Faculty directory with department filters
- Faculty profiles — qualifications, office hours, courses taught

### 🕐 Class Timings
- Weekly timetable for all departments
- Room assignments and faculty details

### 💰 Fee Structure
- Department-wise fee breakdown (tuition, exam, library, sports, hostel)
- Online payment simulation (UPI, Net Banking, Card, DD)
- Scholarship information

### 📝 Exam Timings
- Mid-term and end-semester exam schedules
- Department and type filters

### 📅 Events & Schedules
- Campus events — fests, seminars, workshops, sports
- Upcoming / past event filters

### 🏢 Placements & Careers
- Company-wise placement data (2026 batch)
- Internship listings with apply functionality
- Hackathon & competition registrations
- Year-wise placement trend charts

### 📜 Certificates
- Request certificates (Bonafide, Transcript, Degree, Character, Migration)
- Download issued certificates
- Track request status

### 🏛️ Departments
- All 12 engineering departments
- Dept-wise student strength, faculty count, head of department

### 🗺️ Campus Navigation Map
- Interactive SVG campus map
- Animated route from Main Gate to any department
- Search departments by name
- Walking time & distance estimates

### 📈 Analytics
- Enrollment trends (2020–2026)
- Department strength comparison
- GPA distribution
- High-demand courses (ML, Cloud, Robotics, etc.)
- Year-wise placement statistics

### 📚 Library
- 85,420 books catalogue
- Section-wise availability
- Borrow & reserve books
- Library timings and rules

### 🏠 Hostel
- Block-wise occupancy (Boys / Girls / PG)
- Mess menu
- Room application form

### 🌟 Alumni Portal
- 12,000+ notable alumni directory
- Filter by department and batch
- Alumni registration form
- Connect with seniors

### 🔐 Role-Based Login
| Role | Access |
|------|--------|
| Student | Personal pages, fees, library, hostel, placements |
| Faculty | Students, classes, exams, library |
| Admin | All pages + analytics |
| Dean | All pages + analytics |

### 🔔 Real Notifications
- Exam alerts, fee reminders, placement drives, event updates
- Unread badge counter
- Mark all as read

---

## 🛠️ Tech Stack

| Technology | Usage |
|-----------|-------|
| HTML5 | Structure |
| Tailwind CSS (CDN v3) | Styling & layout |
| Vanilla JavaScript (ES5) | Logic, routing, rendering |
| Chart.js 4.4 | Analytics charts |
| SVG | Campus map, AU logo |
| PWA (manifest + service worker) | Installable app, offline support |

> **No Node.js, no build step, no frameworks.** Opens directly in the browser as a `file://` URL or via any local server.

---

## 🚀 Running Locally

### Option 1 — Double-click (recommended)
```
Double-click:  Start App.bat
```
This launches a PowerShell HTTP server at `http://localhost:8080` and opens the browser automatically.

### Option 2 — VS Code Live Server
1. Install the **Live Server** extension (Ritwick Dey)
2. Right-click `index.html` → **Open with Live Server**

### Option 3 — Python
```bash
cd university-app
python -m http.server 8080
# Open http://localhost:8080
```

### Install as Desktop App
After opening in Chrome/Edge at `http://localhost:8080`:
- **Chrome:** Click ⊕ in address bar → Install
- **Edge:** `...` menu → Apps → Install this site as an app

---

## 🔑 Demo Credentials

| Role | Password |
|------|----------|
| Admin | `admin123` |
| Dean | `dean123` |
| Faculty | `faculty123` |
| Student | `student123` |

---

## 📁 Project Structure

```
university-app/
├── index.html                  # Main shell & layout
├── manifest.json               # PWA manifest
├── sw.js                       # Service worker (offline)
├── Start App.bat               # One-click local server launcher
├── server.ps1                  # PowerShell HTTP server
├── css/
│   └── style.css               # Custom styles
├── js/
│   ├── data.js                 # All mock data (AppData)
│   ├── app.js                  # Router, nav, login, notifications
│   └── pages/
│       ├── dashboard.js
│       ├── students.js
│       ├── faculty.js
│       ├── classes.js
│       ├── fees.js
│       ├── exams.js
│       ├── events.js
│       ├── placements.js
│       ├── certificates.js
│       ├── departments.js
│       ├── map.js
│       ├── analytics.js
│       ├── library.js
│       ├── hostel.js
│       └── alumni.js
└── icons/
    ├── icon.svg                # AU emblem icon (PWA)
    ├── icon-192.png            # PWA icon 192×192
    └── icon-512.png            # PWA icon 512×512
```

---

## 🏫 About Andhra University

Andhra University (ఆంధ్ర విశ్వవిద్యాలయం) was established in **1926** in **Visakhapatnam, Andhra Pradesh, India**. It is one of the oldest and most prestigious universities in South India, offering programs across 12 engineering departments.

- 🎓 **12,450+** enrolled students
- 👩‍🏫 **417** faculty members
- 🏛️ **12** engineering departments
- 📚 **280** active courses

---

## 🔮 Future Scope

- [ ] Backend integration (Node.js / Firebase)
- [ ] Real OTP-based authentication
- [ ] Student result portal
- [ ] Attendance tracking
- [ ] Alumni donation portal
- [ ] Hostel complaint management
- [ ] Real-time notifications (WebSocket)
- [ ] Mobile app (Capacitor / React Native)

---

## 👨‍💻 Author

**Samuel Premm**
- GitHub: [@samuelpremmm](https://github.com/samuelpremmm)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Built with ❤️ for Andhra University · Visakhapatnam
</div>
