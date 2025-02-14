    
     const ko = document.getElementById('ok');
 document.addEventListener('DOMContentLoaded', () => { 
    let coins = parseInt(localStorage.getItem('coins')) || 0;
    let coinBonus = parseInt(localStorage.getItem('coinBonus')) || 0;
    let upgradeCost = localStorage.getItem('upgradeCost') ? parseInt(localStorage.getItem('upgradeCost')) : 40;

    const coinDisplay = document.getElementById('coin-display');
    const upgradeCostDisplay = document.getElementById('upgrade-cost-display');
    const upgradeButton = document.getElementById('upgrade-coin-btn');
    const resetBonusButton = document.getElementById('reset-bonus-btn');
  
    
    function updateDisplay() {
        coinDisplay.textContent = `เหรียญ: ${coins} (โบนัส: ${coinBonus}%)`;

        if (coinBonus >= 200) {
            upgradeCostDisplay.textContent = "ถึงขีดจำกัดแล้ว";
            upgradeButton.disabled = true; // ปิดปุ่มอัปเกรด
        } else {
            upgradeCostDisplay.textContent = `ราคา: ${upgradeCost} เหรียญ`;
            upgradeButton.disabled = false;
        }
    }

    upgradeButton.addEventListener('click', () => {  
        if (coinBonus >= 200) {
            alert('โบนัสถึงขีดสุดแล้ว!');
            return;
        }

        if (coins >= upgradeCost) {
            coins -= upgradeCost;
            localStorage.setItem('coins', coins);
            updateDisplay();

            coinBonus += 25;
            if (coinBonus > 200) coinBonus = 200;
            localStorage.setItem('coinBonus', coinBonus);
            updateDisplay();

            upgradeCost *= 2;
            localStorage.setItem('upgradeCost', upgradeCost);
            updateDisplay();
        } else {
            alert('เหรียญไม่พอ!');
        }
    });

    resetBonusButton.addEventListener('click', () => {
        coinBonus = 0;
        localStorage.setItem('coinBonus', coinBonus);

        upgradeCost = 20;
        localStorage.setItem('upgradeCost', upgradeCost);

        upgradeButton.disabled = false;
        updateDisplay();
    });
    
    updateDisplay();
});

offButton.addEventListener('click', () => {
      deductButton.disabled = false; // เปิดการใช้งานปุ่ม deductButton
      homeButton.disabled = true; // ปิดการใช้งานปุ่ม homeButton
  });
function updateCoinDisplay() {
  let coins = parseInt(localStorage.getItem('coins')) || 0;
  document.getElementById("coin-count").textContent = coins; // ✅ แสดงเหรียญล่าสุด

  let protectionMultiplier = parseInt(localStorage.getItem('protectionMultiplier')) || 2;
  let nextCost = 40 * protectionMultiplier; 
  document.getElementById("protect-cost-display").textContent = `ราคา: ${nextCost} เหรียญ`;
}

// ฟังก์ชันสำหรับอัปเดต UI ของหัวใจและแถบพลัง
function updateProtectedHeartsUI() {
  const protectedHearts = parseInt(localStorage.getItem('protectedHearts')) || 0;
  const protectionMultiplier = parseInt(localStorage.getItem('protectionMultiplier')) || 2;
  const cost = 40 * protectionMultiplier; // ราคาที่ต้องจ่ายครั้งถัดไป
  const lifeElements = document.querySelectorAll('.life');
  const protectButton = document.getElementById("protectHeartButton");
  const protectionBar = document.getElementById("protectionBar");
  const priceTag = document.getElementById("protectionPrice"); // ✅ เพิ่มตัวเลือก id ใหม่

  // อัปเดตราคาใน UI
  priceTag.textContent = `ราคา: ${cost} เหรียญ`;

  // ✅ อัปเดตสถานะหัวใจ
  lifeElements.forEach((life, index) => {
      if (index < protectedHearts) {
          life.style.backgroundColor = 'blue';
          life.setAttribute("data-protected", "true");
      } else {
          life.style.backgroundColor = 'transparent';
          life.removeAttribute("data-protected");
      }
  });

  // ✅ คำนวณแถบความคืบหน้า6จาก protectedHearts โดยตรง
  const progressPercentage = (protectedHearts / 5) * 100;
  protectionBar.style.width = `${progressPercentage}%`;

  // ✅ ตรวจสอบและแสดงข้อความ "ป้องกันเต็มแล้ว!" เมื่อโหลดหน้า
  if (protectedHearts >= 5) {
      protectButton.disabled = true;
      protectButton.textContent = "ป้องกันเต็มแล้ว!";
  } else {
      protectButton.disabled = false;
      protectButton.textContent = "ป้องกันหัวใจ";
  }
}

// ฟังก์ชันสำหรับเพิ่มการป้องกันหัวใจ


let protectionMultiplier = parseInt(localStorage.getItem('protectionMultiplier')) || 2;

document.getElementById("protectHeartButton").addEventListener("click", function() {
  let protectedHearts = parseInt(localStorage.getItem('protectedHearts')) || 0;
  let coins = parseInt(localStorage.getItem('coins')) || 0;
  let cost = 40* protectionMultiplier; // ราคาตามลำดับ x2, x4, x8...

  if (coins >= cost) {
      coins -= cost;
      protectedHearts++;

      localStorage.setItem('coins', coins);
      localStorage.setItem('protectedHearts', protectedHearts);

      

      protectionMultiplier *= 2; // คูณ 2 ในแต่ละครั้ง
      localStorage.setItem('protectionMultiplier', protectionMultiplier); // บันทึกค่าตัวคูณ

      updateProtectedHeartsUI();
      location.reload(); // รีหน้าใหม่ทันที
  } else {
      alert("เหรียญไม่พอ!");
  }
});

// รีเซ็ตตัวคูณเมื่อกดรีเซ็ตการป้องกัน


// ✅ โหลดค่าที่บันทึกไว้เมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', () => {
  updateProtectedHeartsUI();
  updateCoinDisplay(); // เรียกแสดงเหรียญเมื่อโหลดหน้า
});
let isDoubleScoreActive = localStorage.getItem('isDoubleScoreActive') === 'true';
let coins = parseInt(localStorage.getItem('coins')) || 0;

const doubleScoreButton = document.getElementById('doubleScoreButton');

const coinDisplay = document.getElementById('coin-count');

const doubleScoreCost = 10000; // ✅ ราคาการซื้อคะแนนคูณ 2

// อัปเดตแสดงจำนวนเหรียญ
function updateCoinDisplay() {
  coinDisplay.textContent = coins;
}

doubleScoreButton.disabled = isDoubleScoreActive;


// ดึงสถานะการซื้อจาก localStorage
window.onload = () => {
  const purchaseStatus = localStorage.getItem('purchaseStatus');
  const isDoubleScoreActive = localStorage.getItem('isDoubleScoreActive') === 'true';
  const doubleScoreButton = document.getElementById('doubleScoreButton');
  const purchaseStatusElement = document.getElementById('purchaseStatus');

  if (isDoubleScoreActive) {
      doubleScoreButton.textContent = "🔥 คะแนน x2 ถูกเปิดใช้งานแล้ว";
      doubleScoreButton.disabled = true;
      purchaseStatusElement.textContent = "การซื้อสำเร็จ!";
  } else {
      doubleScoreButton.textContent = "🔥 เพิ่มคะแนน x2";
      doubleScoreButton.disabled = false;  // เปิดให้กดได้ถ้ายังไม่เปิดใช้งาน
      purchaseStatusElement.textContent = ""; // ลบข้อความแจ้งเตือนเก่า
  }
};

// ✅ ฟังก์ชันสำหรับการกดปุ่มซื้อคะแนน x2
document.getElementById('doubleScoreButton').onclick = () => { 
  const doubleScoreCost = 10000;  // สมมติว่าต้องการ 30,000 เหรียญ
  let coins = parseInt(localStorage.getItem('coins')) || 0;

  if (coins >= doubleScoreCost) { // ✅ ตรวจสอบเหรียญเพียงพอ
      coins -= doubleScoreCost;   // ✅ หักเหรียญ
      localStorage.setItem('coins', coins);
      updateCoinDisplay();        // ✅ อัปเดตการแสดงผลเหรียญทันที

      localStorage.setItem('isDoubleScoreActive', 'true');
      localStorage.setItem('purchaseStatus', 'success');

      document.getElementById('purchaseStatus').textContent = "การซื้อสำเร็จ!";
      document.getElementById('doubleScoreButton').textContent = "🔥 คะแนน x2 ถูกเปิดใช้งานแล้ว";
      document.getElementById('doubleScoreButton').disabled = true;  // ปิดปุ่มหลังซื้อ

      alert("✅ เปิดคะแนนคูณ 2 สำเร็จ!");
  } else {
      alert("❌ เหรียญไม่พอ! ต้องการ 30,000 เหรียญ");
  }
};

// ✅ แสดงเหรียญเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', updateCoinDisplay);
let remainingClicks = parseInt(localStorage.getItem("remainingClicks")) || 0;
let protectedHearts = 5;
let protectedSpecialHearts = parseInt(localStorage.getItem("protectedSpecialHearts")) || 0;

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





doubleScoreButton.disabled = isDoubleScoreActive;


document.getElementById("addLimitButton").addEventListener("click", function() {
  let coins = parseInt(localStorage.getItem('coins')) || 0;
  let cost = 70; // ราคาหักเหรียญ

  if (coins >= cost) {
      coins -= cost;
      localStorage.setItem('coins', coins);
      updateCoinDisplay();
  } else {
      alert("เหรียญไม่พอ!");
  }
  location.reload(); // รีเฟรชหน้าใหม่ทันที
});
// ฟังก์ชันเพิ่มจำนวนครั้ง (หน้าอื่นก็สามารถใช้ได้)
if (addLimitButton) {
  addLimitButton.addEventListener("click", function () {
      remainingClicks += 1;
      localStorage.setItem("remainingClicks", remainingClicks);
  });
}

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
  location.reload(); // รีเฟรชหน้าใหม่ทันที
  let coins = parseInt(localStorage.getItem('coins')) || 0; // ✅ โหลดเหรียญปัจจุบัน
  const coinCost = 500; // ✅ ค่าใช้จ่าย 50 เหรียญ

  if (coins < coinCost) {
      alert("เหรียญไม่เพียงพอ! ต้องการอย่างน้อย 50 เหรียญ");
      return; // ❌ หยุดถ้าเหรียญไม่พอ
  }

  // ✅ หักเหรียญ 50 เหรียญ
  coins -= coinCost;
  localStorage.setItem('coins', coins); // บันทึกค่าใหม่

  // ✅ เพิ่มเวลา
  timeLeft += 5;
  saveDefaultTime();
  updateAutoClickButton();
  syncAcrossPages();
  enableAutoClickButton();

  updateCoinDisplay(); // ✅ อัปเดตแสดงผลเหรียญใหม่
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
  ko.textContent = `Auto Click (${timeLeft}s)`;

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