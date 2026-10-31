// 잠금화면: 위로 쓸어올리거나 탭 → (암호가 있으면) 암호 입력 → 홈
import { CONFIG } from './config.js';
import { el, esc, screenScale } from './dom.js';
import { T } from './text.js';
import { personName } from './people.js';
import { ICONS, GLYPH } from './icons.js';
import { storyTime, storyDateLabel } from './clock.js';

const KEYS = [['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'], ['0', '']];

export function createLock({ onUnlock, onPasscode = () => {} }) {
  const PASS = String(CONFIG.lock?.passcode || '');
  const root = el(`<div class="layer lock" aria-label="잠금화면"></div>`);
  let face, pass, dots, cancelBtn, hintEl;
  let mode = 'face';         // 'face' = 잠금화면, 'pass' = 암호 입력
  let entered = '';
  let wrong = 0;
  let pendingTarget = null;

  function render() {
    const n = CONFIG.lockNotification;
    root.innerHTML = `
      <div class="lock-dim"></div>
      ${PASS ? `
      <div class="lock-pass" aria-label="암호 입력">
        <p class="pass-title">암호 입력</p>
        <div class="pass-dots">${PASS.split('').map(() => '<span class="dot"></span>').join('')}</div>
        <p class="pass-hint"></p>
        <div class="keypad">
          ${KEYS.map(([d, l]) => `<button class="key${d === '0' ? ' zero' : ''}" data-key="${d}"><b>${d}</b>${l ? `<small>${l}</small>` : ''}</button>`).join('')}
        </div>
        <div class="pass-bottom">
          <button class="pass-text" data-act="emergency">긴급</button>
          <button class="pass-text" data-act="cancel">취소</button>
        </div>
      </div>` : ''}
      <div class="lock-face">
        <div class="lock-head">
          <div class="lock-pad">${GLYPH.padlock}</div>
          <div class="lock-date">${esc(storyDateLabel())}</div>
          <div class="lock-time">${esc(storyTime())}</div>
        </div>
        <div class="lock-notifs">
          <div class="notif" data-target="${esc(n.target)}">
            <span class="n-icon">${(ICONS[n.icon] || ICONS.messages)()}</span>
            <span class="n-main">
              <span class="n-top"><b>${esc(personName(n.title))}</b><span class="n-time">${esc(n.time)}</span></span>
              <span class="n-body">${T(n.body)}</span>
            </span>
          </div>
        </div>
        <div class="lock-actions">
          <button class="lock-btn" data-act="flash" aria-label="손전등">${GLYPH.flashlight}</button>
          <button class="lock-btn" data-act="camera" aria-label="카메라">${GLYPH.camera}</button>
        </div>
        <div class="lock-hint">위로 쓸어올려 열기</div>
      </div>`;
    face = root.querySelector('.lock-face');
    pass = root.querySelector('.lock-pass');
    dots = root.querySelector('.pass-dots');
    cancelBtn = root.querySelector('[data-act="cancel"]');
    hintEl = root.querySelector('.pass-hint');
  }

  setInterval(() => {
    const t = root.querySelector('.lock-time');
    if (t) t.textContent = storyTime();
  }, 10000);

  // ── 잠금화면 쓸어올리기 ──
  let startY = null, dy = 0, t0 = 0, moved = false, target = null;
  const busy = () => mode !== 'face' || root.classList.contains('unlocking');

  root.addEventListener('pointerdown', (e) => {
    if (busy() || e.target.closest('.lock-btn')) return;
    startY = e.clientY; dy = 0; t0 = performance.now(); moved = false;
    target = e.target.closest('.notif')?.dataset.target || null;
    root.setPointerCapture?.(e.pointerId);
    face.style.transition = 'none';
    if (pass) pass.style.transition = 'none';
  });
  root.addEventListener('pointermove', (e) => {
    if (startY == null) return;
    dy = Math.max(0, (startY - e.clientY) / screenScale());
    if (dy > 8) moved = true;
    face.style.transform = `translateY(${-dy}px)`;
    face.style.opacity = String(Math.max(0, 1 - dy / 400));
    if (pass) pass.style.opacity = String(Math.min(1, dy / 260));
  });
  const end = () => {
    if (startY == null) return;
    const v = dy / Math.max(1, performance.now() - t0);
    startY = null;
    face.style.transition = '';
    if (pass) pass.style.transition = '';
    if (!moved || dy > 90 || v > 0.5) unlock(target);
    else resetFace();
  };
  root.addEventListener('pointerup', end);
  root.addEventListener('pointercancel', () => { if (startY != null) { startY = null; resetFace(); } });

  function resetFace() {
    face.style.transition = '';
    face.style.transform = '';
    face.style.opacity = '';
    if (pass) { pass.style.transition = ''; pass.style.opacity = ''; }
  }

  // ── 버튼 ──
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    e.stopPropagation();
    if (b.dataset.act === 'flash') b.classList.toggle('on');
    else if (b.dataset.act === 'camera') { b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); }
    else if (b.dataset.act === 'cancel') entered ? del() : cancelPass();
    else if (b.dataset.act === 'emergency') shake();
  });
  // 키패드는 누르는 즉시 반응하도록 pointerdown 사용
  root.addEventListener('pointerdown', (e) => {
    const k = e.target.closest('.key');
    if (!k || mode !== 'pass') return;
    k.classList.add('press');
    setTimeout(() => k.classList.remove('press'), 160);
    press(k.dataset.key);
  });

  // PC 키보드: 숫자, Backspace, Esc
  window.addEventListener('keydown', (e) => {
    if (root.hidden || mode !== 'pass') return;
    if (/^[0-9]$/.test(e.key)) press(e.key);
    else if (e.key === 'Backspace') del();
    else if (e.key === 'Escape') cancelPass();
  });

  // ── 암호 입력 ──
  function updateDots() {
    dots.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('on', i < entered.length));
    cancelBtn.textContent = entered ? '삭제' : '취소';
  }
  function press(d) {
    if (entered.length >= PASS.length) return;
    entered += d;
    updateDots();
    if (entered.length === PASS.length) {
      if (entered === PASS) setTimeout(finish, 120);
      else {
        wrong++;
        setTimeout(() => {
          shake();
          entered = '';
          updateDots();
          const h = CONFIG.lock?.hint;
          if (h && wrong >= (CONFIG.lock.hintAfter || 1)) hintEl.textContent = h;
        }, 120);
      }
    }
  }
  function del() { entered = entered.slice(0, -1); updateDots(); }
  function shake() {
    dots.classList.remove('shake'); void dots.offsetWidth; dots.classList.add('shake');
    navigator.vibrate?.(80);
  }

  function showPass() {
    mode = 'pass';
    entered = '';
    updateDots();
    face.style.transform = 'translateY(-40%)';
    face.style.opacity = '0';
    pass.style.opacity = '';
    pass.classList.add('on');
    onPasscode(true);
  }
  function cancelPass() {
    mode = 'face';
    pendingTarget = null;
    pass.classList.remove('on');
    resetFace();
    onPasscode(false);
  }

  function unlock(tgt) {
    if (busy()) return;
    pendingTarget = tgt;
    if (PASS) showPass();
    else {
      face.style.transform = 'translateY(-50%)';
      face.style.opacity = '0';
      finish();
    }
  }

  function finish() {
    mode = 'done';
    root.classList.add('unlocking');
    onUnlock(pendingTarget);
    pendingTarget = null;
    setTimeout(() => { root.hidden = true; }, 450);
  }

  return {
    el: root,
    show() {
      render();
      mode = 'face'; entered = ''; wrong = 0; pendingTarget = null;
      root.classList.remove('unlocking');
      root.hidden = false;
    },
    hide() { root.hidden = true; },
    unlock: () => unlock(null),
    refresh() { if (mode === 'face') render(); },
    get visible() { return !root.hidden; },
  };
}
