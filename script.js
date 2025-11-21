// 10問分の問題データ
// sentence: 画面に表示される文（(        ) が1ブロック）
// answer: カッコ内に入る語句（1〜3語のフレーズ）
const questions = [
  {
    audio: "audio/q1.mp3",
    sentence: "I (                 ) you later.",
    answer: "wanna talk to",
  },
  {
    audio: "audio/q2.mp3",
    sentence: "I'm gonna (                 ) tomorrow.",
    answer: "send it out",
  },
  {
    audio: "audio/q3.mp3",
    sentence: "Could you (                 ) the details?",
    answer: "give me",
  },
  {
    audio: "audio/q4.mp3",
    sentence: "I'll (                 ) know if anything changes.",
    answer: "let you",
  },
  {
    audio: "audio/q5.mp3",
    sentence: "We (                 ) ready by noon.",
    answer: "need to be",
  },
  {
    audio: "audio/q6.mp3",
    sentence: "She has (                 ) the report.",
    answer: "already sent",
  },
  {
    audio: "audio/q7.mp3",
    sentence: "It's (                 ) I expected.",
    answer: "better than",
  },
  {
    audio: "audio/q8.mp3",
    sentence: "Do you (                 ) coffee?",
    answer: "want some more",
  },
  {
    audio: "audio/q9.mp3",
    sentence: "I (                 ) him yesterday.",
    answer: "talked to",
  },
  {
    audio: "audio/q10.mp3",
    sentence: "We'll (                 ) you soon.",
    answer: "get back to",
  },
];

let currentIndex = 0;
let correctCount = 0;

const correctSound = new Audio("audio/correct.mp3");
const wrongSound = new Audio("audio/wrong.mp3");

const progressEl = document.getElementById("progress");
const sentenceEl = document.getElementById("sentence");
const audioEl = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const answerInput = document.getElementById("answerInput");
const checkBtn = document.getElementById("checkBtn");
const resultEl = document.getElementById("result");
const nextBtn = document.getElementById("nextBtn");
const finalArea = document.getElementById("final-area");
const quizArea = document.getElementById("quiz-area");
const finalScoreEl = document.getElementById("finalScore");
const finalCommentEl = document.getElementById("finalComment");
const retryBtn = document.getElementById("retryBtn");

// テキスト正規化：前後の空白削除・小文字化・空白を1つにまとめる
function normalize(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function showQuestion(index) {
  const q = questions[index];
  progressEl.textContent = `第 ${index + 1} 問 / ${questions.length} 問`;
  sentenceEl.textContent = q.sentence;
  audioEl.src = q.audio;
  answerInput.value = "";
  answerInput.disabled = false;
  answerInput.focus();
  resultEl.textContent = "";
  resultEl.className = "result";
  checkBtn.disabled = false;
  nextBtn.style.display = "none";
}

function showResult(isCorrect, userAnswer, correctAnswer) {
  if (isCorrect) {
    resultEl.textContent = `正解！ ${correctAnswer}`;
    resultEl.className = "result correct";
  } else {
    resultEl.textContent = `不正解… ${correctAnswer} ／ あなたの回答：${userAnswer || "(空欄)"}`;
    resultEl.className = "result incorrect";
  }
}

function handleCheck() {
  const q = questions[currentIndex];
  const userAnswerRaw = answerInput.value;
  const userNorm = normalize(userAnswerRaw);
  const correctNorm = normalize(q.answer);

  const isCorrect = userNorm === correctNorm;
  if (isCorrect) correctCount++;

 if (isCorrect) {
    correctSound.currentTime = 0; // 途中だったら頭に戻す
    correctSound.play();
  } else {
    wrongSound.currentTime = 0;
    wrongSound.play();
  }

  showResult(isCorrect, userAnswerRaw, q.answer);

  // この問題は回答終了
  answerInput.disabled = true;
  checkBtn.disabled = true;
  nextBtn.style.display = "inline-block";

  // 最終問題なら数秒後に結果画面でもOKだが、ここでは明示ボタンで進める
  if (currentIndex === questions.length - 1) {
    nextBtn.textContent = "結果を見る";
  } else {
    nextBtn.textContent = "次の問題へ";
  }
}

function showFinal() {
  quizArea.style.display = "none";
  finalArea.style.display = "block";

  const total = questions.length;
  const scorePercent = Math.round((correctCount / total) * 100);

  finalScoreEl.textContent = `正解数：${correctCount} / ${total}問（正答率：${scorePercent}%）`;

  let comment = "";
  if (scorePercent <= 40) {
    comment = "もう一歩！ ゆっくり音を区切りながら何度か聞いてみましょう。";
  } else if (scorePercent <= 70) {
    comment = "Good！ 細かい音の変化に意識を向けると、さらに精度が上がります。";
  } else {
    comment = "Excellent！ かなり細かい音の違いまで聞き取れています。長めの文にも挑戦できます。";
  }

  finalCommentEl.textContent = comment;
}

function resetQuiz() {
  currentIndex = 0;
  correctCount = 0;
  quizArea.style.display = "block";
  finalArea.style.display = "none";
  showQuestion(currentIndex);
}

// イベント設定
playBtn.addEventListener("click", () => {
  audioEl.currentTime = 0;
  audioEl.play();
});

checkBtn.addEventListener("click", handleCheck);

nextBtn.addEventListener("click", () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion(currentIndex);
  } else {
    showFinal();
  }
});

retryBtn.addEventListener("click", () => {
  resetQuiz();
});

// Enter で「正解を確認する」を押せるように
answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !checkBtn.disabled) {
    handleCheck();
  }
});

// 初期表示
showQuestion(currentIndex);
