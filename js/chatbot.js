// ============================================================
// Andhra University — AI Chat Assistant
// ============================================================

var CHAT_KB = [
  {
    keywords: ['hello','hi','hey','helo','namaste','vanakkam','నమస్కారం'],
    answer: '👋 Namaste! I\'m <b>AU Bot</b>, your Andhra University smart assistant.<br>Ask me about <b>fees, exams, departments, hostel, library, placements</b> or anything about campus life!'
  },
  {
    keywords: ['fee','fees','tuition','amount','pay','payment','challan'],
    answer: '💰 <b>Fee Structure</b><br>Fees vary by department and semester. Go to the <b>Fee Structure</b> page for semester-wise breakdown per department.<br><br>📅 Due Date: <b>15 June 2026</b><br>💳 Modes: UPI · Net Banking · Card · DD<br>🎓 SC/ST: full waiver · OBC: 50% waiver'
  },
  {
    keywords: ['semester','sem','b.tech','btech','year','programme'],
    answer: '📚 B.Tech is <b>4 years / 8 semesters</b>.<br>Current: <b>Spring 2026 (Sem VIII)</b><br><br>Each semester: 5–6 core subjects + lab sessions. Check <b>Fee Structure</b> for semester-wise fee breakdown by department.'
  },
  {
    keywords: ['exam','schedule','date','mid','end','midterm','endterm'],
    answer: '📝 <b>Exam Schedule 2026</b><br>• Mid-term: <b>Apr 14–20</b><br>• End-Semester: <b>May 5–22</b><br>• Supplementary: Jul 10–20<br><br>Check the <b>Exam Timings</b> page for department-wise timetable.'
  },
  {
    keywords: ['hostel','accommodation','room','mess','block','pg'],
    answer: '🏠 <b>AU Hostels</b><br>6 blocks · 4,800 capacity<br>• Boys: Block A, B, C<br>• Girls: Block D, E<br>• PG: Block F<br><br>🍽️ Mess: Breakfast 7–9 · Lunch 12–2 · Dinner 7–9<br><br>Apply via the <b>Hostel</b> page.'
  },
  {
    keywords: ['library','book','borrow','catalogue','reserve','journal'],
    answer: '📚 <b>AU Central Library</b><br>85,420+ books · 6 sections<br><br>⏰ Mon–Sat: 8AM–8PM · Sun: 9AM–5PM<br>📖 Borrow: 3 books · 14 days<br>💻 Digital resources & IEEE journals available<br><br>Visit the <b>Library</b> page to browse & borrow.'
  },
  {
    keywords: ['placement','company','job','recruit','salary','package','lpa','hire'],
    answer: '🏢 <b>Placements 2026</b><br>✅ 78% placement rate<br>💰 Highest: ₹42 LPA (Google)<br>💰 Average: ₹12.4 LPA<br><br>Top recruiters: Google, Microsoft, TCS, Infosys, Wipro, Amazon<br><br>Visit the <b>Placements</b> page for full data.'
  },
  {
    keywords: ['internship','intern'],
    answer: '💼 <b>Internship Opportunities</b><br>Currently listed: DRDO, ISRO, Google Summer of Code, Microsoft INIT, Deloitte, Wipro Digital, Mahindra iChoose, ONGC.<br><br>Visit <b>Placements → Internships</b> tab to apply.'
  },
  {
    keywords: ['hackathon','competition','contest','coding','sih','icpc'],
    answer: '💻 <b>Active Competitions</b><br>• Smart India Hackathon<br>• Google Solution Challenge<br>• ICPC Regionals<br>• Topcoder Open<br>• AU Internal Hackathon<br><br>Register via <b>Placements → Hackathons</b> tab.'
  },
  {
    keywords: ['department','dept','branch','cse','mech','civil','eee','itca','marine','arch','chem','meta','inst','env','geo'],
    answer: '🏛️ <b>12 Engineering Departments</b><br>CSE · MECH · CIVIL · EEE · CHEM · ITCA · MARINE · META · INST · ENV · GEO · ARCH<br><br>Total students: 12,450 · Faculty: 417<br><br>Visit the <b>Departments</b> page for strength, HOD & details.'
  },
  {
    keywords: ['class','timetable','timing','lecture','schedule'],
    answer: '🕐 <b>Class Timings</b><br>Mon–Sat: 8:30 AM – 4:30 PM<br>Lecture: 55 min each<br>Breaks: 10:25 AM · 1:00 PM (lunch)<br><br>Check <b>Class Timings</b> page for your dept schedule + room assignments.'
  },
  {
    keywords: ['faculty','professor','teacher','hod','head','staff','guide'],
    answer: '👩‍🏫 <b>Faculty</b><br>AU has <b>417 faculty members</b> across 12 departments.<br><br>Visit the <b>Faculty</b> page to view profiles, qualifications, office hours, and contact details.'
  },
  {
    keywords: ['certificate','bonafide','transcript','degree','migration','character'],
    answer: '📜 <b>Certificate Requests</b><br>Available: Bonafide · Transcript · Degree · Character · Migration<br><br>⏳ Processing: 3–7 working days<br>💡 Rush: same day for Bonafide<br><br>Apply via the <b>Certificates</b> page.'
  },
  {
    keywords: ['event','fest','festival','seminar','workshop','sport','cultural'],
    answer: '📅 <b>Upcoming Events</b><br>• AU Tech Fest 2026 — Apr 15<br>• Science Symposium — Apr 20<br>• Sports Day — May 1<br>• Alumni Meet — May 15<br><br>Check <b>Events & Schedules</b> for full list & registrations.'
  },
  {
    keywords: ['alumni','notable','famous','senior','connect','network'],
    answer: '🌟 <b>Alumni Network</b><br>12,000+ notable alumni in science, engineering, civil services & arts.<br><br>Visit the <b>Alumni Portal</b> to browse profiles, connect with seniors, and register as an alumnus.'
  },
  {
    keywords: ['map','navigate','location','building','block','direction','route'],
    answer: '🗺️ <b>Campus Navigation</b><br>Use the <b>Campus Map</b> page for animated walking directions from the Main Gate to any department.<br><br>Walking time: 2–8 min · All 12 dept buildings marked · Compass included.'
  },
  {
    keywords: ['scholarship','waiver','financial','aid','sc','st','obc'],
    answer: '🎓 <b>Scholarships 2026</b><br>• SC/ST → Full fee waiver (AP Govt scheme)<br>• OBC → 50% tuition waiver<br>• Merit (GPA ≥ 3.8) → ₹15,000/semester<br>• Sports excellence → ₹10,000<br><br>Apply via scholarship portal before <b>30 May 2026</b>.'
  },
  {
    keywords: ['analytics','stats','statistics','data','trend','graph','chart'],
    answer: '📈 <b>Analytics</b><br>The <b>Analytics</b> page shows:<br>• Enrollment trends 2020–2026<br>• Department strength comparison<br>• GPA distribution<br>• High-demand courses (ML, Cloud, Robotics)<br>• Year-wise placement stats'
  },
  {
    keywords: ['password','login','credential','access','forgot','reset'],
    answer: '🔑 <b>Demo Login Credentials</b><br>• Admin → <b>admin123</b><br>• Dean → <b>dean123</b><br>• Faculty → <b>faculty123</b><br>• Student → <b>student123</b><br><br>Use the role selector on the login screen.'
  },
  {
    keywords: ['contact','phone','email','address','office','registrar'],
    answer: '📍 <b>Contact Andhra University</b><br>Visakhapatnam – 530003, AP, India<br>📞 0891-2844000<br>📧 registrar@andhrauniv.ac.in<br>🌐 andhrauniversity.edu.in<br><br>Office hrs: Mon–Fri 9AM–5PM'
  },
  {
    keywords: ['thank','thanks','thankyou','ok','okay','great','good','perfect','nice','awesome'],
    answer: '😊 You\'re welcome! I\'m always here to help. Is there anything else you\'d like to know about Andhra University?'
  },
  {
    keywords: ['bye','goodbye','exit','close','later'],
    answer: '👋 Goodbye! Come back anytime you need help. Best of luck with your studies! 📚'
  },
  {
    keywords: ['established','founded','history','1926','old'],
    answer: '🏛️ <b>About Andhra University</b><br>Founded in <b>1926</b> in Visakhapatnam, AU is one of South India\'s oldest & most prestigious universities.<br><br>✅ 12 engineering departments<br>✅ 12,450+ students · 417 faculty<br>✅ NAAC A+ Accredited'
  },
  {
    keywords: ['admission','apply','eamcet','entrance','criteria','eligibility','join'],
    answer: '📋 <b>Admissions</b><br>B.Tech admission via <b>AP EAMCET</b> (Engineering, Agriculture, Medical Common Entrance Test).<br><br>📅 EAMCET 2026: May 2026<br>Eligibility: 10+2 with Physics, Maths, Chemistry (min 45%)<br><br>Contact admissions@andhrauniv.ac.in'
  },
];

var QUICK_QUESTIONS = [
  'What are the fees?',
  'Exam schedule?',
  'Hostel facilities?',
  'Placements 2026?',
  'Library timings?',
  'Scholarship info?',
];

var chatOpen = false;

function initChatbot() {
  var widget = document.getElementById('chatbot-widget');
  if (!widget) return;

  // Add welcome message after short delay
  setTimeout(function() {
    addBotMessage('👋 Hi! I\'m <b>AU Bot</b>. How can I help you today?<br><span style="font-size:11px;color:#9ca3af">Ask me anything about fees, exams, hostel, placements...</span>');
  }, 500);
}

function toggleChat() {
  var win = document.getElementById('chat-window');
  var btn = document.getElementById('chat-toggle-btn');
  chatOpen = !chatOpen;
  if (chatOpen) {
    win.style.display = 'flex';
    win.style.opacity = '0';
    win.style.transform = 'translateY(12px) scale(0.97)';
    setTimeout(function() {
      win.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
      win.style.opacity = '1';
      win.style.transform = 'translateY(0) scale(1)';
    }, 10);
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>';
    document.getElementById('chat-input').focus();
    scrollChatBottom();
  } else {
    win.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
    win.style.opacity = '0';
    win.style.transform = 'translateY(12px) scale(0.97)';
    setTimeout(function() { win.style.display = 'none'; }, 180);
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>';
  }
}

function sendChatMessage() {
  var input = document.getElementById('chat-input');
  var text = input.value.trim();
  if (!text) return;
  input.value = '';
  addUserMessage(text);
  showTyping();
  setTimeout(function() {
    removeTyping();
    var reply = getChatReply(text);
    addBotMessage(reply);
  }, 700 + Math.random() * 400);
}

function sendQuick(q) {
  document.getElementById('chat-input').value = q;
  sendChatMessage();
}

function getChatReply(text) {
  var lower = text.toLowerCase();
  for (var i = 0; i < CHAT_KB.length; i++) {
    var entry = CHAT_KB[i];
    for (var j = 0; j < entry.keywords.length; j++) {
      if (lower.indexOf(entry.keywords[j]) !== -1) {
        return entry.answer;
      }
    }
  }
  return '🤔 I\'m not sure about that. Try asking about:<br><b>fees · exams · hostel · library · placements · departments · faculty · certificates · events · alumni</b><br><br>Or visit the relevant page from the sidebar navigation.';
}

function addUserMessage(text) {
  var msgs = document.getElementById('chat-messages');
  var div = document.createElement('div');
  div.className = 'chat-msg-user';
  div.innerHTML = '<div class="chat-bubble-user">' + escapeHtml(text) + '</div>';
  msgs.appendChild(div);
  scrollChatBottom();
}

function addBotMessage(html) {
  var msgs = document.getElementById('chat-messages');
  var div = document.createElement('div');
  div.className = 'chat-msg-bot';
  div.innerHTML = '<div class="chat-avatar">🎓</div><div class="chat-bubble-bot">' + html + '</div>';
  msgs.appendChild(div);
  scrollChatBottom();
}

function showTyping() {
  var msgs = document.getElementById('chat-messages');
  var div = document.createElement('div');
  div.id = 'chat-typing';
  div.className = 'chat-msg-bot';
  div.innerHTML = '<div class="chat-avatar">🎓</div><div class="chat-bubble-bot chat-typing-dots"><span></span><span></span><span></span></div>';
  msgs.appendChild(div);
  scrollChatBottom();
}

function removeTyping() {
  var el = document.getElementById('chat-typing');
  if (el) el.remove();
}

function scrollChatBottom() {
  var msgs = document.getElementById('chat-messages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function chatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
}

// Auto-init when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  initChatbot();
}
