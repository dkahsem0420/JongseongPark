// 잠금화면: 스와이프하거나 탭하면 해제 (비밀번호 없음)
import { CONFIG } from '../../data/config.js';
import { el, esc, screenScale } from '../dom.js';
import { T } from '../text.js';
import { ICONS, GLYPH } from '../icons.js';
import { storyTime, storyDateLabel } from '../clock.js';

export function createLock({ onUnlock }) {
  const root = el(`<div class="layer lock" aria-label="잠금화면"></div>`);

  function render() {
    const n = CONFIG.lockNotification;
    root.innerHTML = `
      <div class="lock-dim"></div>
      <div class="lock-head">
        <div class="lock-pad">${GLYPH.padlock}</div>
        <div class="lock-date">${esc(storyDateLabel())}</div>
        <div class="lock-time">${esc(storyTime())}</div>
      </div>
      <div class="lock-notifs">
        <div class="notif" data-target="${esc(n.target)}">
          <span class="n-icon">${(ICONS[n.icon] || ICONS.messages)()}</span>
          <span class="n-main">
            <span class="n-top"><b>${T(n.title)}</b><span class="n-time">${esc(n.time)}</span></span>
            <span class="n-body">${T(n.body)}</span>
          </span>
        </div>
      </div>
      <div class="lock-actions">
        <button class="lock-btn" data-act="flash" aria-label="손전등">${GLYPH.flashlight}</button>
        <button class="lock-btn" data-act="camera" aria-label="카메라">${GLYPH.camera}</button>
      </div>
      <div class="lock-hint">위로 쓸어올려 열기</div>`;
  }

  setInterval(() => {
    const t = root.querySelector('.lock-time');
    if (t) t.textContent = storyTime();
  }, 10000);

  // ── 제스처 ──
  let startY = null, dy = 0, t0 = 0, moved = false, target = null;

  root.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.lock-btn') || root.classList.contains('unlocking')) return;
    startY = e.clientY; dy = 0; t0 = performance.now(); moved = false;
    target = e.target.closest('.notif')?.dataset.target || null;
    root.setPointerCapture?.(e.pointerId);
    root.style.transition = 'none';
  });
  root.addEventListener('pointermove', (e) => {
    if (startY == null) return;
    dy = Math.max(0, (startY - e.clientY) / screenScale());
    if (dy > 8) moved = true;
    root.style.transform = `translateY(${-dy}px)`;
  });
  const end = () => {
    if (startY == null) return;
    const v = dy / Math.max(1, performance.now() - t0);
    startY = null;
    root.style.transition = '';
    if (!moved || dy > 90 || v > 0.5) unlock(target);
    else root.style.transform = '';
  };
  root.addEventListener('pointerup', end);
  root.addEventListener('pointercancel', () => { startY = null; root.style.transition = ''; root.style.transform = ''; });

  root.addEventListener('click', (e) => {
    const b = e.target.closest('.lock-btn');
    if (!b) return;
    e.stopPropagation();
    if (b.dataset.act === 'flash') b.classList.toggle('on');
    else { b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); }
  });

  function unlock(tgt) {
    if (root.classList.contains('unlocking')) return;
    root.classList.add('unlocking');
    root.style.transform = 'translateY(-100%)';
    onUnlock(tgt);
    setTimeout(() => { root.hidden = true; }, 480);
  }

  return {
    el: root,
    show() {
      render();
      root.classList.remove('unlocking');
      root.style.transition = 'none';
      root.style.transform = '';
      root.hidden = false;
      requestAnimationFrame(() => (root.style.transition = ''));
    },
    hide() { root.hidden = true; },
    unlock: () => unlock(null),
    refresh: render,
    get visible() { return !root.hidden; },
  };
}
