import { el } from '../dom.js';
import { GLYPH, batteryGlyph } from '../icons.js';
import { storyTime } from '../clock.js';

export function createStatusBar() {
  const root = el(`
    <div class="statusbar sb-light" aria-hidden="true">
      <span class="sb-time"></span>
      <span></span>
      <span class="sb-icons">${GLYPH.signal}${GLYPH.wifi}${batteryGlyph()}</span>
    </div>`);
  const time = root.querySelector('.sb-time');
  const tick = () => (time.textContent = storyTime());
  tick();
  setInterval(tick, 10000);

  return {
    el: root,
    setStyle(style) { // 'light' = 흰 글씨, 'dark' = 검은 글씨
      root.classList.toggle('sb-light', style === 'light');
      root.classList.toggle('sb-dark', style !== 'light');
    },
    // 잠금화면에서는 시간이 크게 나오므로 상단 시간은 숨김
    hideTime(hide) { root.classList.toggle('sb-notime', !!hide); },
  };
}
