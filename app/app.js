// app/app.js
const ROOT = (typeof ROOT_URL !== 'undefined') ? ROOT_URL : '';
const saveEndpoint = '/api/saveScore';
const leaderboardEndpoint = '/api/leaderboard';

const playBtn = document.getElementById('playBtn');
const leaderBtn = document.getElementById('leaderBtn');
const home = document.getElementById('home');
const game = document.getElementById('game');
const grid = document.getElementById('grid');
const target = document.getElementById('target');
const timerEl = document.getElementById('timer');
const end = document.getElementById('end');
const endMsg = document.getElementById('endMsg');
const scoreText = document.getElementById('scoreText');
const retry = document.getElementById('retry');
const toHome = document.getElementById('toHome');
const leader = document.getElementById('leader');
const leaderList = document.getElementById('leaderList');
const backFromLeader = document.getElementById('backFromLeader');
const bestEl = document.getElementById('best');
const shareArea = document.getElementById('shareArea');

let letters = [];
let nextIdx = 0;
let startTime = 0;
let timerId = null;
let best = localStorage.getItem('az_best') ? parseFloat(localStorage.getItem('az_best')) : null;
if (best) bestEl.innerText = `Best: ${best.toFixed(3)} s`;

function makeLetters() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
  // shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars;
}

function showHome() {
  home.classList.remove('hidden');
  game.classList.add('hidden');
  end.classList.add('hidden');
  leader.classList.add('hidden');
}

function startGame() {
  home.classList.add('hidden');
  game.classList.remove('hidden');
  end.classList.add('hidden');
  leader.classList.add('hidden');

  letters = makeLetters();
  nextIdx = 0;
  renderGrid();
  target.innerText = `Next: ${String.fromCharCode(65 + nextIdx)}`;
  startTime = performance.now();
  timerEl.innerText = "0.000 s";
  timerId = requestAnimationFrame(tick);
}

function tick() {
  const t = (performance.now() - startTime) / 1000;
  timerEl.innerText = `${t.toFixed(3)} s`;
  timerId = requestAnimationFrame(tick);
}

function renderGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < letters.length; i++) {
    const d = document.createElement('div');
    d.className = 'letter';
    d.innerText = letters[i];
    d.dataset.letter = letters[i];
    d.addEventListener('click', onLetterClick);
    grid.appendChild(d);
  }
}

function onLetterClick(e) {
  const chosen = e.currentTarget.dataset.letter;
  const needed = String.fromCharCode(65 + nextIdx);
  if (chosen !== needed) {
    gameOver(false);
    return;
  }
  // correct
  e.currentTarget.classList.add('disabled');
  nextIdx++;
  if (nextIdx >= 26) {
    const total = (performance.now() - startTime) / 1000;
    gameOver(true, total);
    return;
  } else {
    target.innerText = `Next: ${String.fromCharCode(65 + nextIdx)}`;
  }
}

async function gameOver(won, totalSeconds = null) {
  cancelAnimationFrame(timerId);
  game.classList.add('hidden');
  end.classList.remove('hidden');
  if (won) {
    endMsg.innerText = 'You completed A → Z!';
    scoreText.innerText = `Time: ${totalSeconds.toFixed(3)} s`;
    // update best
    if (!best || totalSeconds < best) {
      best = totalSeconds;
      localStorage.setItem('az_best', best);
      bestEl.innerText = `Best: ${best.toFixed(3)} s`;
    }
    // save to server (ask for name)
    const name = prompt("Enter name for leaderboard (max 20 chars)", "Player") || "Player";
    try {
      await fetch(saveEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_name: name.substring(0,20),
          score_seconds: totalSeconds,
          letters_completed: 26,
          mode: 'normal'
        })
      });
    } catch (e) {
      console.warn('save failed', e);
    }
    shareArea.innerHTML = `<button id="shareBtn">Share Score</button>`;
    document.getElementById('shareBtn').addEventListener('click', () => {
      const text = `I completed A→Z in ${totalSeconds.toFixed(3)} s on A→Z Tap Rush!`;
      if (navigator.share) {
        navigator.share({ title: 'A→Z Tap Rush', text, url: location.href });
      } else {
        alert(text);
      }
    });
  } else {
    endMsg.innerText = 'Wrong letter — Game Over';
    scoreText.innerText = `Reached: ${String.fromCharCode(65 + Math.max(0, nextIdx-1))}`;
    shareArea.innerHTML = '';
  }
}

retry.addEventListener('click', () => startGame());
toHome.addEventListener('click', () => showHome());
playBtn.addEventListener('click', () => startGame());
leaderBtn.addEventListener('click', () => loadLeaderboard());
backFromLeader.addEventListener('click', () => showHome());

async function loadLeaderboard() {
  home.classList.add('hidden');
  game.classList.add('hidden');
  end.classList.add('hidden');
  leader.classList.remove('hidden');
  leaderList.innerHTML = '<li>Loading...</li>';
  try {
    const r = await fetch(leaderboardEndpoint);
    const rows = await r.json();
    leaderList.innerHTML = '';
    if (!rows || rows.length === 0) {
      leaderList.innerHTML = '<li>No scores yet</li>';
      return;
    }
    rows.forEach((rw) => {
      const li = document.createElement('li');
      li.innerText = `${rw.player_name} — ${parseFloat(rw.score_seconds).toFixed(3)} s`;
      leaderList.appendChild(li);
    });
  } catch (e) {
    leaderList.innerHTML = `<li>Error loading</li>`;
  }
}

// initial
showHome();
