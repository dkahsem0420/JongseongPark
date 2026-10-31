// 시계 앱 — 세계 시계, 알람, 스톱워치(실제 작동), 타이머(실제 작동)
import { ALARMS, WORLD_CLOCKS } from './data-clock.js';
import { el, esc } from './dom.js';
import { storyMinutes } from './clock.js';

const S = (inner, w = 26) => `<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const I = {
  world: S('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>'),
  alarm: S('<circle cx="12" cy="13" r="7.5"/><path d="M12 9.5V13l2.5 1.5M4.5 4.5l3-2M19.5 4.5l-3-2"/>'),
  stopwatch: S('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.5M10 2.5h4M18 6.5l1.5-1.5"/>'),
  timer: S('<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5h4"/>'),
  plus: S('<path d="M12 5v14M5 12h14"/>', 24),
};
const pad = (n) => String(n).padStart(2, '0');
const ko = (h, m) => ({ ap: h < 12 ? '오전' : '오후', hm: `${h % 12 || 12}:${pad(m)}` });

// 상태 (앱을 닫아도 유지)
const st = {
  tab: 'alarm',
  alarms: ALARMS.map((a) => ({ ...a })),
  sw: { running: false, base: 0, start: 0, laps: [] },
  tm: { total: 15 * 60, left: 15 * 60, running: false, endAt: 0 },
};
let raf = null;

export default function create() {
  function page() {
    const p = el(`
      <div class="page clk">
        <div class="clk-content"></div>
        <nav class="ios-tabs clk-tabs">
          ${[['world', '세계 시계'], ['alarm', '알람'], ['stopwatch', '스톱워치'], ['timer', '타이머']]
            .map(([k, l]) => `<button data-tab="${k}">${I[k]}<small>${l}</small></button>`).join('')}
        </nav>
      </div>`);
    const box = p.querySelector('.clk-content');

    function render() {
      cancelAnimationFrame(raf);
      p.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === st.tab));
      if (st.tab === 'world') box.innerHTML = worldHtml();
      if (st.tab === 'alarm') box.innerHTML = alarmHtml();
      if (st.tab === 'stopwatch') { box.innerHTML = swHtml(); raf = requestAnimationFrame(loop); }
      if (st.tab === 'timer') { box.innerHTML = tmHtml(); raf = requestAnimationFrame(loop); }
    }

    function worldHtml() {
      const base = storyMinutes();
      return `
        <div class="clk-head"><span class="clk-tint">편집</span><span class="clk-tint">${I.plus}</span></div>
        <h1 class="large-title">세계 시계</h1>
        <div class="clk-list">
          ${WORLD_CLOCKS.map((w) => {
            let x = base + w.offset * 60, day = '오늘';
            if (x < 0) { x += 1440; day = '어제'; } else if (x >= 1440) { x -= 1440; day = '내일'; }
            const t = ko(Math.floor(x / 60), x % 60);
            return `<div class="clk-row"><span class="clk-l"><small>${day}, ${w.offset >= 0 ? '+' : ''}${w.offset}시간</small><b>${esc(w.city)}</b></span><span class="clk-big"><small>${t.ap}</small>${t.hm}</span></div>`;
          }).join('')}
        </div>`;
    }

    function alarmHtml() {
      return `
        <div class="clk-head"><span class="clk-tint">편집</span><span class="clk-tint">${I.plus}</span></div>
        <h1 class="large-title">알람</h1>
        <p class="clk-sec">기타</p>
        <div class="clk-list">
          ${st.alarms.map((a, i) => {
            const [h, m] = a.time.split(':').map(Number);
            const t = ko(h, m);
            return `
            <div class="clk-row${a.on ? '' : ' off'}">
              <span class="clk-l"><span class="clk-big"><small>${t.ap}</small>${t.hm}</span><small>${esc(a.label)}${a.days ? `, ${esc(a.days)}` : ''}</small></span>
              <button class="switch${a.on ? ' on' : ''}" data-alarm="${i}" aria-label="알람 켜기/끄기"></button>
            </div>`;
          }).join('')}
        </div>`;
    }

    const swTime = () => st.sw.base + (st.sw.running ? Date.now() - st.sw.start : 0);
    const fmtSw = (ms) => `${pad(Math.floor(ms / 60000))}:${pad(Math.floor((ms % 60000) / 1000))}.${pad(Math.floor((ms % 1000) / 10))}`;
    function swHtml() {
      return `
        <div class="clk-sw"><span class="clk-digits" data-sw>${fmtSw(swTime())}</span></div>
        <div class="clk-btns">
          <button class="clk-btn gray" data-sw-left>${st.sw.running ? '랩' : '재설정'}</button>
          <button class="clk-btn ${st.sw.running ? 'red' : 'green'}" data-sw-main>${st.sw.running ? '중단' : '시작'}</button>
        </div>
        <div class="clk-laps">${st.sw.laps.map((l, i) => `<div><span>랩 ${st.sw.laps.length - i}</span><span>${fmtSw(l)}</span></div>`).join('')}</div>`;
    }

    const tmLeft = () => (st.tm.running ? Math.max(0, (st.tm.endAt - Date.now()) / 1000) : st.tm.left);
    const fmtTm = (s) => { s = Math.ceil(s); return `${Math.floor(s / 60)}:${pad(s % 60)}`; };
    function tmHtml() {
      const ratio = tmLeft() / st.tm.total;
      return `
        <div class="clk-tm">
          <svg viewBox="0 0 200 200" class="clk-ring"><circle cx="100" cy="100" r="92" class="bg"/><circle cx="100" cy="100" r="92" class="fg" data-tm-ring style="stroke-dashoffset:${578 * (1 - ratio)}"/></svg>
          <span class="clk-digits" data-tm>${fmtTm(tmLeft())}</span>
        </div>
        <div class="clk-btns">
          <button class="clk-btn gray" data-tm-cancel>취소</button>
          <button class="clk-btn ${st.tm.running ? 'orange' : 'green'}" data-tm-main>${st.tm.running ? '일시 정지' : st.tm.left < st.tm.total ? '재개' : '시작'}</button>
        </div>`;
    }

    function loop() {
      const sw = box.querySelector('[data-sw]');
      if (sw) sw.textContent = fmtSw(swTime());
      const tm = box.querySelector('[data-tm]');
      if (tm) {
        const left = tmLeft();
        tm.textContent = fmtTm(left);
        box.querySelector('[data-tm-ring]').style.strokeDashoffset = 578 * (1 - left / st.tm.total);
        if (st.tm.running && left <= 0) { st.tm.running = false; st.tm.left = st.tm.total; navigator.vibrate?.([200, 100, 200]); render(); return; }
      }
      if (document.body.contains(p)) raf = requestAnimationFrame(loop);
    }

    p.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-tab]');
      if (tab) { st.tab = tab.dataset.tab; render(); return; }
      const al = e.target.closest('[data-alarm]');
      if (al) { const a = st.alarms[al.dataset.alarm]; a.on = !a.on; render(); return; }
      if (e.target.closest('[data-sw-main]')) {
        if (st.sw.running) { st.sw.base = swTime(); st.sw.running = false; }
        else { st.sw.start = Date.now(); st.sw.running = true; }
        render(); return;
      }
      if (e.target.closest('[data-sw-left]')) {
        if (st.sw.running) st.sw.laps.unshift(swTime());
        else { st.sw.base = 0; st.sw.laps = []; }
        render(); return;
      }
      if (e.target.closest('[data-tm-main]')) {
        if (st.tm.running) { st.tm.left = tmLeft(); st.tm.running = false; }
        else { st.tm.endAt = Date.now() + st.tm.left * 1000; st.tm.running = true; }
        render(); return;
      }
      if (e.target.closest('[data-tm-cancel]')) { st.tm.running = false; st.tm.left = st.tm.total; render(); }
    });

    render();
    return p;
  }

  return { statusStyle: 'dark', page };
}
