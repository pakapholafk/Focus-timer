let modes = {
  work: { time: 25 * 60, color: '#ba4949', title: 'ช่วงเวลาอ่านหนังสือ!' },
  shortBreak: { time: 5 * 60, color: '#388e3c', title: 'พักสายตาสั้นๆ' },
  longBreak: { time: 15 * 60, color: '#1976d2', title: 'พักผ่อนยาวๆ' }
};

let currentMode = 'work';
let timeLeft = modes[currentMode].time;
let timerId = null;
let isRunning = false;
let completedSessions = 0;

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const timeString = `${minutes}:${seconds}`;
  
  document.getElementById('timer').innerText = timeString;
  document.title = `${timeString} - ${modes[currentMode].title}`;
}

// ฟังก์ชันเพิ่ม/ลดเวลาด่วน (+/- นาที)
function adjustTime(minutes) {
  timeLeft += minutes * 60;
  if (timeLeft < 0) timeLeft = 0; // ป้องกันไม่ให้เวลาติดลบ
  updateDisplay();
}

// ฟังก์ชันอัปเดตเวลาเมื่อกรอกตัวเลขใหม่ในช่องตั้งค่า
function updateSettings() {
  const workMin = parseInt(document.getElementById('work-input').value) || 25;
  const shortMin = parseInt(document.getElementById('short-input').value) || 5;
  const longMin = parseInt(document.getElementById('long-input').value) || 15;

  modes.work.time = workMin * 60;
  modes.shortBreak.time = shortMin * 60;
  modes.longBreak.time = longMin * 60;

  // ถ้านาฬิกาไม่ได้วิ่งอยู่ ให้รีเซ็ตเวลาหน้าจอตามค่าใหม่ทันที
  if (!isRunning) {
    resetTimer();
  }
}

function toggleTimer() {
  const startBtn = document.getElementById('start-btn');

  if (isRunning) {
    clearInterval(timerId);
    isRunning = false;
    startBtn.innerText = 'ลุยต่อ';
  } else {
    isRunning = true;
    startBtn.innerText = 'หยุดชั่วคราว';
    
    timerId = setInterval(() => {
      timeLeft--;
      updateDisplay();

      if (timeLeft <= 0) {
        clearInterval(timerId);
        isRunning = false;
        playAlarm();
        
        if (currentMode === 'work') {
          completedSessions++;
          document.getElementById('session-count').innerText = completedSessions;
          alert('หมดเวลาอ่านแล้ว! พักสายตาได้ครับ');
          setMode('shortBreak');
        } else {
          alert('หมดเวลาพัก! พร้อมอ่านหนังสือต่อหรือยัง?');
          setMode('work');
        }
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerId);
  isRunning = false;
  timeLeft = modes[currentMode].time;
  document.getElementById('start-btn').innerText = 'เริ่มอ่าน';
  updateDisplay();
}

function setMode(mode) {
  currentMode = mode;
  document.body.style.backgroundColor = modes[mode].color;
  
  const btns = document.querySelectorAll('.mode-btn');
  btns.forEach(btn => btn.classList.remove('active'));
  
  const modeIndex = mode === 'work' ? 0 : mode === 'shortBreak' ? 1 : 2;
  btns[modeIndex].classList.add('active');

  resetTimer();
}

function playAlarm() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.6);
}

// เรียกให้แสดงผลครั้งแรก
updateDisplay();