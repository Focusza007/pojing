let autoClickActive = localStorage.getItem("autoClickActive") === "true";
let autoClickInterval, autoClickTimer;

// ✅ โหลดค่าเวลาเริ่มต้นและเวลาที่เหลือ
let defaultTime = parseInt(localStorage.getItem("defaultTime")) || 5;
let timeLeft = parseInt(localStorage.getItem("timeLeft")) || defaultTime;

// 🚀 เริ่มหรือหยุด Auto Click เมื่อกดปุ่ม
document.getElementById("autoClickButton").addEventListener("click", () => { 
    if (autoClickActive) {
        stopAutoClick();  // ⏸️ หยุด Auto Click และบันทึกเวลาที่เหลือ
    } else if (timeLeft > 0) {
        startAutoClick(); // ▶️ เริ่ม Auto Click จากเวลาที่เหลือ (ถ้าเหลือเวลา)
    }
});

// ✅ ฟังก์ชันเริ่ม Auto Click
function startAutoClick() {
    autoClickActive = true;
    localStorage.setItem("autoClickActive", "true");
    localStorage.setItem("timeLeft", timeLeft); // บันทึกเวลาปัจจุบัน

    const button = document.getElementById("autoClickButton");
    button.style.backgroundColor = "green";
    button.textContent = `Auto Click (${timeLeft}s)`;
    button.disabled = false; // เปิดปุ่มในกรณีที่เคยถูกปิด

    // ⚡ เริ่มคลิกอัตโนมัติ
    autoClickInterval = setInterval(() => {
        document.querySelectorAll(".cell.green").forEach(cell => {
            cell.click();
        });
    }, 100);

    // ⏱️ นับถอยหลัง
    autoClickTimer = setInterval(() => {
        timeLeft--;
        button.textContent = `Auto Click (${timeLeft}s)`;
        localStorage.setItem("timeLeft", timeLeft); // บันทึกเวลาที่เหลือทุกวินาที

        if (timeLeft <= 0) {
            stopAutoClick();
            disableAutoClickButton(); // 🔒 ปิดปุ่มเมื่อหมดเวลา
        }
    }, 1000);
}

// ✅ ฟังก์ชันหยุด Auto Click
function stopAutoClick() {
    clearInterval(autoClickInterval);
    clearInterval(autoClickTimer);
    autoClickActive = false;
    
    localStorage.setItem("autoClickActive", "false");
    localStorage.setItem("timeLeft", timeLeft);

    updateAutoClickButton(true); // ส่งค่า true เพื่อแสดงเวลาที่เหลือ
    syncAcrossPages();
}


// ✅ ฟังก์ชันปิดปุ่มเมื่อหมดเวลา
function disableAutoClickButton() {
    const button = document.getElementById("autoClickButton");
    button.disabled = true; // 🔒 ปิดปุ่ม
    timeLeft = 0;
    button.textContent = "โปรดเพื่มเวลาauto"; 
    localStorage.setItem("buttonDisabled", "true"); // บันทึกสถานะปุ่ม
    localStorage.setItem("timeLeft", timeLeft);
}

// ✅ เพิ่มเวลา
document.getElementById("increaseDefaultTimeButton").addEventListener("click", () => {
    if (autoClickActive) {
        alert("ไม่สามารถเพิ่มเวลาได้ขณะ Auto Click กำลังทำงาน!");
        return; // ❌ หยุดการทำงานถ้า Auto Click กำลังทำงาน
    }
   
    timeLeft += 5;
    saveDefaultTime();
    updateAutoClickButton();
    syncAcrossPages();
    enableAutoClickButton();
});

// ✅ ลดเวลา
document.getElementById("decreaseDefaultTimeButton").addEventListener("click", () => {
    if (autoClickActive) {
        alert("ไม่สามารถลดเวลาได้ขณะ Auto Click กำลังทำงาน!");
        return; // ❌ หยุดการทำงานถ้า Auto Click กำลังทำงาน
    }
    if (defaultTime > -1) {
        
        timeLeft = Math.max(timeLeft - 5, 0);
        saveDefaultTime();
        updateAutoClickButton();
        syncAcrossPages();
        if (timeLeft === 0) disableAutoClickButton();
    } else {
        alert("ไม่สามารถลดเวลาได้ต่ำกว่า 5 วินาที!");
    }
});


// ✅ บันทึกเวลาเริ่มต้น
function saveDefaultTime() {
    localStorage.setItem("defaultTime", defaultTime);
    localStorage.setItem("timeLeft", timeLeft);
}

// ✅ อัปเดตปุ่มแสดงเวลา
function updateAutoClickButton(showTimeLeft = false) {
    const button = document.getElementById("autoClickButton");
    button.style.backgroundColor = autoClickActive ? "green" : "gray";

    // ✅ แสดงเวลาที่เหลือถ้าได้รับพารามิเตอร์ showTimeLeft = true
    const displayTime = showTimeLeft ? timeLeft : (autoClickActive ? timeLeft : defaultTime);
    button.textContent = `Auto Click (${timeLeft}s)`;

    if (timeLeft <= 0) {
        disableAutoClickButton(); // 🔒 ปิดปุ่มถ้าเวลา = 0
    }
}

// ✅ เปิดปุ่มใหม่ (ใช้หลังเพิ่มเวลา)
function enableAutoClickButton() {
    const button = document.getElementById("autoClickButton");
    button.disabled = false;
    button.style.backgroundColor = "gray";
    button.textContent = `Auto Click (${timeLeft}s)`;

    localStorage.setItem("buttonDisabled", "false"); // บันทึกสถานะปุ่ม
}

// ✅ ซิงค์ระหว่างหน้า
function syncAcrossPages() {
    localStorage.setItem("syncTime", Date.now());
}

window.addEventListener("storage", (event) => {
    if (event.key === "defaultTime") {
        defaultTime = parseInt(localStorage.getItem("defaultTime")) || 0;
        updateAutoClickButton();
    }
    if (event.key === "autoClickActive" || event.key === "timeLeft") {
        autoClickActive = localStorage.getItem("autoClickActive") === "true";
        timeLeft = parseInt(localStorage.getItem("timeLeft")) || defaultTime;
        updateAutoClickButton();
    }
});

// ✅ โหลดค่าจาก localStorage เมื่อหน้าเว็บโหลด
window.onload = () => {
    defaultTime = parseInt(localStorage.getItem("defaultTime")) || 0;
    timeLeft = parseInt(localStorage.getItem("timeLeft")) || defaultTime;
    autoClickActive = localStorage.getItem("autoClickActive") === "true";

    if (localStorage.getItem("buttonDisabled") === "true" || timeLeft <= 0) {
        disableAutoClickButton(); // 🔒 ปิดปุ่มถ้าเคยหมดเวลา
    } else if (autoClickActive && timeLeft > 0) {
       startAutoClick(); // เริ่ม Auto Click ต่อจากเวลาที่เหลือ
    } else {
        updateAutoClickButton();
    }
};


// เมื่อกดเลือก <option>

  function nextLevel() {
     
     let currentLevel = parseInt(localStorage.getItem('level')) || 1;  location.reload()
     if (currentLevel >= 1 && currentLevel < 5) {
       let nextLevel = currentLevel + 1;
       document.getElementById('levelSelect').value = nextLevel;
       setLevel(nextLevel.toString());
     }
    
   }
  // ค่าตั้งต้น
let maxScorePerLevel = 1;

// ดึงค่าจาก localStorage หรือใช้ค่าตั้งต้น
let coinsEarned = parseInt(localStorage.getItem('coinsEarned')) || 5;
let SHOW_TIME = parseFloat(localStorage.getItem('SHOW_TIME')) || 0.5;
let HIDE_TIME = parseFloat(localStorage.getItem('HIDE_TIME')) || 0.5;
let SHOW_CLL = parseFloat(localStorage.getItem('SHOW_CLL')) || 0.3;
let level = localStorage.getItem('level') || "1";

// ตั้งค่าด่านที่เลือก
document.getElementById('levelSelect').value = level;

 // ฟังก์ชันแสดงผล
 function updateDisplay() {
    document.getElementById('values').innerText = 
      `SHOW_TIME: ${SHOW_TIME}, HIDE_TIME: ${HIDE_TIME}, SHOW_CLL: ${SHOW_CLL}, coinsEarned: ${coinsEarned}, maxScorePerLevel: ${maxScorePerLevel}`;
  }

  // เรียกครั้งแรกเพื่อแสดงค่าเริ่มต้น
  updateDisplay();

  // ฟังก์ชันเปิด-ปิดการแสดงผล
  const toggleButton = document.getElementById('toggleButton');
  const valuesDiv = document.getElementById('values');

  toggleButton.addEventListener('click', function() {
    if (valuesDiv.style.display === 'none') {
      valuesDiv.style.display = 'block'; // แสดงผล
      toggleButton.classList.add('rotate-down'); // หมุนลูกศรลง
    } else {
      valuesDiv.style.display = 'none'; // ซ่อนผล
      toggleButton.classList.remove('rotate-down'); // หมุนลูกศรกลับขึ้น
    }
  });
  function goHome() {
    window.location.href = "index.html"; // เปลี่ยนลิงก์ไปหน้าที่ต้องการ
}
function setLevel(level) {
    if (level === "2") {
        coinsEarned = 600;
        SHOW_TIME = 0.7;
        HIDE_TIME = 0.5;
        SHOW_CLL = 0.5;
        maxScorePerLevel = 170; // ด่าน 2
    } else if (level === "3") {
        coinsEarned = 700;
        SHOW_TIME = 0.7;
        HIDE_TIME = 0.5;
        SHOW_CLL = 0.4;
        maxScorePerLevel = 180; // ตัวอย่างสำหรับด่าน 3
    } else if (level === "4") {
        coinsEarned = 800;
        SHOW_TIME = 0.6;
        HIDE_TIME = 0.6;
        SHOW_CLL = 0.4;
        maxScorePerLevel = 190; // ตัวอย่างสำหรับด่าน 4
    } else if (level === "5") {
        coinsEarned = 1500;
        SHOW_TIME = 0.6;
        HIDE_TIME = 0.4;
        SHOW_CLL = 0.4;
        maxScorePerLevel = 200; // ตัวอย่างสำหรับด่าน 5
    } else {
        coinsEarned = 500;
        SHOW_TIME = 0.8;
        HIDE_TIME = 0.5;
        SHOW_CLL = 0.4;
        maxScorePerLevel = 160; // ด่านเริ่มต้น
    }

    // บันทึกค่าไว้ใน localStorage
    localStorage.setItem('coinsEarned', coinsEarned);
    localStorage.setItem('SHOW_TIME', SHOW_TIME);
    localStorage.setItem('HIDE_TIME', HIDE_TIME);
    localStorage.setItem('SHOW_CLL', SHOW_CLL);
    localStorage.setItem('level', level);
    localStorage.setItem('maxScorePerLevel', maxScorePerLevel); // เก็บค่า maxScorePerLevel

    updateDisplay();
}

// โหลดค่า maxScorePerLevel จาก localStorage ถ้ามี
maxScorePerLevel = parseInt(localStorage.getItem('maxScorePerLevel')) || 1;
updateDisplay();
        function resetSettings() {
           

            SHOW_TIME = 0.5;
            HIDE_TIME = 0.5;
            SHOW_CLL = 0.3;
            coinsEarned = 5;

            document.getElementById('levelSelect').value = "1";
            localStorage.setItem('SHOW_TIME', SHOW_TIME);
    localStorage.setItem('HIDE_TIME', HIDE_TIME);
    localStorage.setItem('SHOW_CLL', SHOW_CLL);
    localStorage.setItem('level', "1");
    localStorage.setItem('coinsEarned', coinsEarned);

            updateDisplay();
        }

        document.getElementById('levelSelect').addEventListener('change', function() {
            setLevel(this.value);
        });

      

    document.getElementById('levelSelect').addEventListener('change', function() {
      setLevel(this.value);
    });

    updateDisplay();
   

    // อ้างอิงองค์ประกอบ DOM
    const grid = document.getElementById('grid');
    
    const scoreDisplay = document.getElementById('score');
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const countdownDisplay = document.getElementById('countdown');
   
    
    // ตัวแปรเกม
    let score = 0;
    let isPlaying = false;
    let intervalId;
    let activeCells = new Set();
    let lives = 5;
    let totalClicks = 0;
    let missedClicks = 0;
    let wrongClicks = 0;
    let startTime;
    let elapsedTime = 0;
    let timerInterval;
    let protectedHearts = 0; // จำนวนหัวใจที่ได้รับการป้องกัน
    let protectedSpecialHearts = 0; // จำนวนหัวใจที่ได้รับการป้องกันพิเศษ
    let isCooldown = false; // ตัวแปรเช็คสถานะ cooldown
    let currentShowTime = SHOW_TIME;
   
    function spawnBlueDot() {
    const cells = document.querySelectorAll('.cell');
    const randomIndex = Math.floor(Math.random() * cells.length);
    const selectedCell = cells[randomIndex];

    // ลบจุดเก่าก่อนสร้างใหม่
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('blue-dot'));

    // เพิ่มคลาสให้เป็นจุดสีฟ้า
    selectedCell.classList.add('blue-dot');
  }

// ดึงค่าจำนวนครั้งที่เหลือจาก localStorage ถ้าไม่มีให้ใช้ค่าเริ่มต้น 10
// ดึงค่าจำนวนครั้งที่เหลือจาก localStorage ถ้าไม่มีให้ใช้ค่าเริ่มต้น 10
let remainingClicks = parseInt(localStorage.getItem("remainingClicks")) || 0;


const button = document.getElementById("protectSpecialHeartButton");
const addLimitButton = document.getElementById("addLimitButton");

// อัปเดตข้อความปุ่ม (เฉพาะเมื่อมีปุ่มป้องกันพิเศษ)
function updateButtonText() {
    if (button) {
        button.textContent = `ป้องกันพิเศษ (${remainingClicks} ครั้ง)`;
        button.disabled = remainingClicks === 0 || protectedSpecialHearts >= document.querySelectorAll('.life').length;
    }
}

// โหลดค่าเริ่มต้น
updateButtonText();

// ฟังก์ชันเมื่อกดปุ่มป้องกันพิเศษ
if (button) {
    button.addEventListener("click", function () {
        const lifeElements = document.querySelectorAll('.life');

        if (protectedSpecialHearts < lifeElements.length && remainingClicks > 0) {
            lifeElements[protectedSpecialHearts].style.backgroundColor = 'purple';
            lifeElements[protectedSpecialHearts].setAttribute("data-special-protected", "true");
            protectedSpecialHearts++;

            remainingClicks--;
            localStorage.setItem("remainingClicks", remainingClicks);
            localStorage.setItem("protectedSpecialHearts", protectedSpecialHearts);
            updateButtonText();
        }
    });
}

// ฟังก์ชันเพิ่มจำนวนครั้ง (หน้าอื่นก็สามารถใช้ได้)
if (addLimitButton) {
    addLimitButton.addEventListener("click", function () {
        remainingClicks += 5;
        localStorage.setItem("remainingClicks", remainingClicks);
    });
}

    // เปลี่ยนหน้าเมื่อเลือกเลเวล
  
// ฟังก์ชันเปิด/ปิดการป้องกันหัวใจ
// เก็บค่าการป้องกันหัวใจใน localStorage
function toggleProtectedHearts() {
  const toggleButton = document.getElementById("toggleProtectedHeartsButton");

  if (protectedHearts > 0 ) {
    protectedHearts = 0; // ปิดการป้องกัน
    toggleButton.textContent = "เปิดการป้องกันหัวใจ";
  }
  
  // เก็บค่าลงใน localStorage
  localStorage.setItem('protectedHearts', protectedHearts);
  
  updateProtectedHeartsUI();
}
document.getElementById("protectHeartButton").addEventListener("click", function() {
    const lifeElements = document.querySelectorAll('.life');
    if (protectedHearts < lifeElements.length) {
        lifeElements[protectedHearts].style.backgroundColor = 'blue';
        lifeElements[protectedHearts].setAttribute("data-protected", "true"); 
        protectedHearts++; 
    }
    localStorage.setItem('protectedHearts', protectedHearts);
  
  updateProtectedHeartsUI();
});
// ฟังก์ชันอัพเดต UI ของการป้องกันหัวใจ
function updateProtectedHeartsUI() {
  document.querySelectorAll('.life').forEach((life, index) => {
    if (index < protectedHearts) {
      life.style.backgroundColor = 'blue';
      life.setAttribute("data-protected", "true");
    } else {
      life.style.backgroundColor = 'transparent';
      life.removeAttribute("data-protected");
    }
  });
}

// โหลดค่าการป้องกันหัวใจจาก localStorage เมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
  const savedProtectedHearts = localStorage.getItem('protectedHearts');
  protectedHearts = savedProtectedHearts ? parseInt(savedProtectedHearts) : 0;
  updateProtectedHeartsUI();
});
// เพิ่ม event listener ให้กับปุ่ม
document.getElementById("toggleProtectedHeartsButton").addEventListener('click', toggleProtectedHearts);

    // อัปเดตตัวจับเวลา
    function updateTimer() {
      elapsedTime++;
      document.getElementById('timer').textContent = `เวลา: ${elapsedTime} วินาที`;
    }

    // สร้างตาราง
    function createGrid() {
      grid.innerHTML = '';
      for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
      }
    }

    // รีเซ็ตเกม
    function resetGame() {
  score = 0;
  lives = 5;
  totalClicks = 0;
  missedClicks = 0;
  wrongClicks = 0;
  
  document.querySelectorAll('.life').forEach(life => {
    if (!life.hasAttribute("data-special-protected")) { 
      life.removeAttribute("data-protected");
      life.style.backgroundColor = 'transparent';
    }
  });
  pauseButton.addEventListener('click', () => {
  location.reload(); // โหลดหน้าใหม่
});

    scoreDisplay.textContent = 'คะแนน: ' + score + '/' + maxScorePerLevel;
  activeCells.clear();
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.remove('warning', 'green', 'error');
  });
}

    // อัปเดต UI ของหัวใจ (ถ้าหัวใจถูกป้องกันจะเปลี่ยนเป็นสีน้ำเงิน)
    function updateLives() {
      const lifeElements = document.querySelectorAll('.life');
      lifeElements.forEach((life, index) => {
        life.style.backgroundColor = (index < lives) ? 'transparent' : 'red';
      });
      if (lives <= 0) {
        stopGame();
        grid.innerHTML = '<h3>ไอ่ไก่กุกๆ</h3>';
      }
    }

    // นับถอยหลังก่อนเริ่มเกม
    function startCountdown(callback) {
      let countdown = 3;
      countdownDisplay.textContent = countdown;
      startButton.disabled = true;
      const countdownInterval = setInterval(() => {
        countdown--;
        countdownDisplay.textContent = countdown;
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          countdownDisplay.textContent = '';
          callback();
        }
      }, 1000);
    }

    // เมื่อกด "เริ่มเกม" ให้ตั้งค่า protectedHearts เป็น 1
    function startGame() {
  if (isPlaying) return;
  isPlaying = true;
  startButton.disabled = true;
  pauseButton.disabled = false;
  
  resetGame();
 
  // ตั้งค่า protectedHearts = 5 เมื่อเริ่มเกม และอัปเดต UI ของหัวใจ
  
  document.querySelectorAll('.life').forEach((life, index) => {
    if (life.hasAttribute("data-special-protected")) {
      life.style.backgroundColor = 'purple';
    } else if (index < protectedHearts) {
      life.style.backgroundColor = 'blue';
      life.setAttribute("data-protected", "true");
    } else {
      life.style.backgroundColor = 'transparent';
      life.removeAttribute("data-protected");
    }
  });
  
  startTime = Date.now();
  elapsedTime = 0;
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
  createGrid();
  
  // ฟังก์ชันจัดการการทำงานของเซลล์
  const cells = document.querySelectorAll('.cell');
  intervalId = setInterval(() => {
    if (activeCells.size >= 9) return;
    const randomIndex = Math.floor(Math.random() * cells.length);
    const selectedCell = cells[randomIndex];
    if (activeCells.has(selectedCell)) return;
    activeCells.add(selectedCell);
    selectedCell.classList.add('warning');
    
    setTimeout(() => {
      if (activeCells.has(selectedCell)) {
        selectedCell.classList.remove('warning');
        selectedCell.classList.add('green');
        setTimeout(() => {
          if (selectedCell.classList.contains('green')) {
            missedClicks++;
            const protectedSpecialLife = document.querySelector('.life[data-special-protected="true"]');
if (protectedSpecialLife) {
    protectedSpecialLife.removeAttribute("data-special-protected");
    protectedSpecialLife.style.backgroundColor = 'blue'; // กลับเป็นป้องกันปกติ
    protectedSpecialHearts--;
} else {
    const protectedLife = document.querySelector('.life[data-protected="true"]');
    if (protectedLife) {
        protectedLife.removeAttribute("data-protected");
        protectedLife.style.backgroundColor = 'transparent';
        protectedHearts--;
    } else {
        lives--;
        updateLives();
    }
}
            selectedCell.classList.remove('green');
            activeCells.delete(selectedCell);
          }
        }, HIDE_TIME * 1000);
      }
    }, SHOW_TIME * 1000);
  }, SHOW_CLL * 1000);
  
  // เพิ่ม event listener สำหรับเซลล์ต่างๆ
  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      totalClicks++;
      if (cell.classList.contains('green')) {
        score+= isDoubleScoreActive ? 2 : 1;
     
    scoreDisplay.textContent = 'คะแนน: ' + score + '/' + maxScorePerLevel;
        cell.classList.remove('green');
        activeCells.delete(cell);
        if (score >= maxScorePerLevel) {
          stopGame();
          showSummary();
        }
      } else { 
        wrongClicks++;
        score--;
   

    scoreDisplay.textContent = 'คะแนน: ' + score + '/' + maxScore;
              cell.classList.add('error');
        setTimeout(() => {
          cell.classList.remove('error');
        }, 300);
      }
    });
  });
} 
// โหลดสถานะ x2 score จาก localStorage
let isDoubleScoreActive = localStorage.getItem('isDoubleScoreActive') === 'true';

const doubleScoreButton = document.getElementById('doubleScoreButton');
const disableDoubleButton = document.getElementById('disableDoubleButton');

// ตั้งค่าปุ่มตามสถานะที่บันทึกไว้
doubleScoreButton.disabled = isDoubleScoreActive;
disableDoubleButton.disabled = !isDoubleScoreActive;

// เปิดใช้งานคะแนนคูณ 2
doubleScoreButton.onclick = () => {
  isDoubleScoreActive = true;
  localStorage.setItem('isDoubleScoreActive', 'true');
  doubleScoreButton.disabled = true;
  disableDoubleButton.disabled = false;
};

// ปิดการใช้งานคะแนนคูณ 2
disableDoubleButton.onclick = () => {
  isDoubleScoreActive = false;
  localStorage.setItem('isDoubleScoreActive', 'false');
  doubleScoreButton.disabled = false;
  disableDoubleButton.disabled = true;
};

    function stopGame() {
      clearInterval(intervalId);
      clearInterval(timerInterval);
      isPlaying = false;
      startButton.disabled = true;
      pauseButton.disabled = false;
      activeCells.clear();
      const cells = document.querySelectorAll('.cell');
      cells.forEach(cell => {
        cell.classList.remove('warning', 'green', 'error');

      });

    }

    startButton.addEventListener('click', () => startCountdown(startGame));
    pauseButton.addEventListener('click', stopGame);

    function showSummary() { 


    const endTime = Date.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(2);

    
    let coinBonus = parseInt(localStorage.getItem('coinBonus')) || 0; // รับค่าโบนัสจาก localStorage

    // คำนวณเหรียญรวมหลังโบนัส
    let bonusMultiplier = 1 + (coinBonus / 100);
    let totalCoinsEarned = Math.floor(coinsEarned * bonusMultiplier);

    // อัปเดตเหรียญใน localStorage
    let currentCoins = parseInt(localStorage.getItem('coins')) || 0;
    currentCoins += totalCoinsEarned;
    localStorage.setItem('coins', currentCoins);


    
  
    const elements = document.body.children;



    // แสดงผลสรุป
    const summary = document.createElement('div');
    summary.innerHTML = `
        <h2>🎉 สรุปผลการเล่น 🎉</h2>
        <p>คะแนนรวม: <span class="summary-highlight">${score}</span></p>
        <p>จำนวนคลิกทั้งหมด: <span class="summary-highlight">${totalClicks}</span></p>
        <p>จำนวนครั้งที่กดไม่ทัน: <span class="summary-highlight">${missedClicks}</span></p>
        <p>จำนวนครั้งที่คลิกผิด: <span class="summary-highlight">${wrongClicks}</span></p>
        <p>เวลาที่ใช้ทั้งหมด: <span class="summary-highlight">${totalTime} วินาที</span></p>
        <p>💰 เหรียญที่ได้รับ: <span class="summary-highlight">${totalCoinsEarned} (โบนัส ${coinBonus}%)</span></p>
        <div id="summary-buttons">
          <button class="summary-btn" onclick="location.reload()">🔄 เล่นอีกครั้ง</button>
          
        </div>
    `;
    




    document.body.innerHTML = '';
    document.body.appendChild(summary);
    
}
 
    document.getElementById('reset-coin-btn').addEventListener('click', () => {
      localStorage.setItem('coins', 0);
      alert('เหรียญถูกรีเซ็ตเรียบร้อยแล้ว!');
      document.getElementById('coin-display').textContent = `เหรียญ: 0`;
    });

    document.getElementById('reset-coin-btn').addEventListener('click', () => {
    localStorage.setItem('coins', 0); // รีเซ็ตเหรียญเป็น 0
    alert('เหรียญถูกรีเซ็ตเรียบร้อยแล้ว!');
    const coinDisplay = document.getElementById('coin-display');
    coinDisplay.textContent = `เหรียญ: 0`; // อัปเดต UI
    function showLevelUpMessage() {
        const message = document.createElement("div");
        message.innerText = "ไอ่ควาย";
        message.classList.add("message");
        document.body.appendChild(message);
        DOMContentLoaded
        setTimeout(() => {
            message.remove();
        }, 2000); // ให้แน่ใจว่าหลังจบอนิเมชั่นจะลบออกจาก DOM
    }

    // เรียกใช้งาน
    showLevelUpMessage();
});
document.addEventListener('DOMContentLoaded', () => {
    let coins = parseInt(localStorage.getItem('coins')) || 0;
    let coinBonus = parseInt(localStorage.getItem('coinBonus')) || 0; // เริ่มที่ 0%
    
    const coinDisplay = document.getElementById('coin-display');
    
    
    
    function updateDisplay() {
        coinDisplay.textContent = `เหรียญ: ${coins} (โบนัส: ${coinBonus}%)`;
    }
   
    updateDisplay();
});

// ฟังก์ชันอัปเดต UI ของหัวใจ (ในที่นี้เราสมมุติให้แต่ละหัวใจแสดงเป็น div ที่มีคลาส life)
function updateLivesUI() {
  const livesContainer = document.getElementById("livesContainer");
  livesContainer.innerHTML = ''; // เคลียร์หัวใจเก่าออกก่อน
  for (let i = 0; i < lives; i++) {
    const life = document.createElement("div");
    life.classList.add("life");
    // ตั้งค่าสีของหัวใจ: ถ้าไม่มีการป้องกันจะเป็นโปร่งใส แต่หากมี protection อยู่ ให้สีตามที่ตั้งไว้
    // ตัวอย่างเช่น หากมี attribute data-protected ให้แสดงสีน้ำเงิน
    // (คุณอาจปรับปรุงการแสดงผลให้ตรงกับโปรเจคของคุณได้)
    life.style.backgroundColor = 'transparent';
    livesContainer.appendChild(life);
  }
}

// เมื่อโหลดหน้าเว็บให้แสดงหัวใจตามจำนวน lives
document.addEventListener('DOMContentLoaded', () => {
  updateLivesUI();
});

// ฟังก์ชันตรวจสอบว่ามีหัวใจใดถูกป้องกันอยู่หรือไม่
function hasAnyProtectedHeart() {
  const lifeElements = document.querySelectorAll('.life');
  let isProtected = false;
  lifeElements.forEach(life => {
    if (life.hasAttribute("data-protected") || life.hasAttribute("data-special-protected")) {
      isProtected = true;
    }
  });
  return isProtected;
}

// เพิ่ม event listener ให้กับปุ่มเพิ่มหัวใจ
document.getElementById("addHeartButton").addEventListener("click", function() {
  // ตรวจสอบว่ามีหัวใจที่ถูกป้องกันอยู่หรือไม่
  if (hasAnyProtectedHeart()) {
    alert("ไม่สามารถเพิ่มหัวใจได้ เนื่องจากมีการป้องกันอยู่");
    return;
  }
  
  // หากไม่มีการป้องกัน ให้เพิ่มหัวใจ (เพิ่มตัวแปร lives และอัปเดต UI)
  lives++;
  updateLivesUI();
});
let scoreMultiplier = 1; // ค่าเริ่มต้นคือ 1 (ปกติ)

// ฟังก์ชันเปิดใช้งานตัวคูณคะแนน x2
function enableDoubleScore() {
  scoreMultiplier = 2;
  document.getElementById("doubleScoreButton").disabled = true;
  document.getElementById("disableDoubleScoreButton").disabled = false;
}

// ฟังก์ชันปิดการใช้งานตัวคูณคะแนน x2
function disableDoubleScore() {
  scoreMultiplier = 1;
  document.getElementById("doubleScoreButton").disabled = false;
  document.getElementById("disableDoubleScoreButton").disabled = true;
}