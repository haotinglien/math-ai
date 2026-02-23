// ===== 等網頁載入完成 =====
window.onload = function () {

let num1, num2;
let score = 0;
let time = 30;
let gameRunning = true;
let timerInterval;
let combo = 0;

// ===== 載入永久錯題記憶 =====
let saved = localStorage.getItem("wrongQuestions");
let wrongQuestions = saved ? JSON.parse(saved) : [];

// ===== 儲存記憶 =====
function saveMemory() {
    localStorage.setItem(
        "wrongQuestions",
        JSON.stringify(wrongQuestions)
    );

    updateWeakPanel(wrongQuestions);
}

function showCombo(){

    let box = document.getElementById("combo");

    if(combo < 2){
        box.innerText = "";
        return;
    }

    box.innerText = "🔥 COMBO x" + combo;

    // 動畫
    box.classList.add("combo-pop");

    setTimeout(()=>{
        box.classList.remove("combo-pop");
    },200);
}
// ===== AI 出題 =====
function newQuestion() {

    if (!gameRunning) return;

    let maxNumber =
        Number(document.getElementById("difficulty").value);

    // AI：40% 機率複習錯題
    if (wrongQuestions.length > 0 && Math.random() < 0.4) {

        let q =
            wrongQuestions[Math.floor(Math.random()
            * wrongQuestions.length)];

        num1 = q.a;
        num2 = q.b;

    } else {

        num1 = Math.floor(Math.random() * maxNumber) + 1;
        num2 = Math.floor(Math.random() * maxNumber) + 1;
    }

    document.getElementById("question").innerText =
        num1 + " × " + num2 + " = ?";

    let input = document.getElementById("answer");
    input.value = "";
    input.focus();
}


// ===== 檢查答案 =====
function checkAnswer() {

    if (!gameRunning) return;

    let userAnswer =
        Number(document.getElementById("answer").value);

    if (userAnswer === num1 * num2) {

    	combo++;   // ⭐連擊增加
        document.getElementById("result").innerText = "✅ 正確！";

    	// Combo加成分數
    	score += 1 + Math.floor(combo/3);

    	showCombo();

        // 從錯題移除
        wrongQuestions = wrongQuestions.filter(
            q => !(q.a === num1 && q.b === num2)
        );

        saveMemory();

    } else {
    	combo = 0; // ⭐連擊中斷

        document.getElementById("result").innerText =
            "❌ 答案是 " + (num1 * num2);

        wrongQuestions.push({ a: num1, b: num2 });
        saveMemory();
    }

    document.getElementById("score").innerText =
        "分數：" + score;

    newQuestion();
}

function updateWeakPanel(wrongQuestions){

    let box = document.getElementById("weakList");

    if(wrongQuestions.length === 0){
        box.innerHTML = "🎉 沒有弱點！";
        return;
    }

    // 計算錯誤次數
    let count = {};

    wrongQuestions.forEach(q=>{
        let key = q.a + "×" + q.b;
        count[key] = (count[key] || 0) + 1;
    });

    let html = "";

    Object.entries(count)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,5)
        .forEach(([k,v])=>{
            html += `<div class="weak-item">${k} ${"🔥".repeat(v)}</div>`;
        });

    box.innerHTML = html;
}


// ===== 計時器 =====
function startTimer() {

    timerInterval = setInterval(function () {

        time--;
        document.getElementById("timer").innerText =
            "時間：" + time;

        if (time <= 0) {

            clearInterval(timerInterval);
            gameRunning = false;

            document.getElementById("question").innerText =
                "⏰ 時間到！";

            document.getElementById("result").innerText =
                "最終分數：" + score;

            document.getElementById("restartBtn").style.display = "inline-block";
        }

    }, 1000);
}

function restartGame(){

    score = 0;
    combo = 0;
    time = 30;
    gameRunning = true;

    document.getElementById("score").innerText = 0;
    document.getElementById("timer").innerText = time;
    document.getElementById("result").innerText = "";
    document.getElementById("combo").innerText = "";

    document.getElementById("restartBtn").style.display = "none";

    clearInterval(timerInterval);
    startTimer();
    newQuestion();
}

// ===== Enter送出 =====
document.getElementById("answer")
.addEventListener("keydown", function (e) {
    if (e.key === "Enter") checkAnswer();
});

document.getElementById("checkBtn")
.addEventListener("click", checkAnswer);

document.getElementById("restartBtn")
.addEventListener("click", restartGame);

// ===== 開始遊戲 =====
newQuestion();
startTimer();
updateWeakPanel(wrongQuestions);

// ===== 啟用離線功能 =====
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}

};