// 홈화면: 앱 아이콘, 디데이 위젯, 독
import { CONFIG } from '../../data/config.js';
import { HOME_LAYOUT, appById } from '../../data/apps.js';
import { el, esc } from '../dom.js';
import { T } from '../text.js';
import { appIconHtml, GLYPH } from '../icons.js';
import { ddayCount, formatDot } from '../clock.js';

export function createHome({ onOpen }) {
  const root = el(`
    <div class="layer home">
      <div class="home-grid"></div>
      <div class="home-search">${GLYPH.search}<span>검색</span></div>
      <div class="dock"></div>
    </div>`);
  const grid = root.querySelector('.home-grid');
  const dock = root.querySelector('.dock');

  const iconCell = (app, withLabel = true) => `
    <button class="app-icon" data-open="${app.id}" aria-label="${esc(app.name)}">
      <span class="icon-wrap">
        <span class="icon">${appIconHtml(app)}</span>
        ${app.badge ? `<span class="badge">${app.badge}</span>` : ''}
      </span>
      ${withLabel ? `<span class="label">${esc(app.name)}</span>` : ''}
    </button>`;

  function widgetDday() {
    const w = CONFIG.ddayWidget;
    const bg = w.image ? ` style="background-image:linear-gradient(rgba(0,0,0,.05),rgba(0,0,0,.35)),url('${esc(w.image)}')"` : '';
    return `
      <button class="widget-cell" data-open="${esc(w.opens)}" aria-label="디데이 위젯">
        <span class="widget dday${w.image ? ' has-img' : ''}"${bg}>
          <span class="dday-title">${T(w.title)}</span>
          <span class="dday-bottom">
            <span class="dday-num">+${ddayCount()}<small>일</small></span>
            <span class="dday-date">${formatDot(CONFIG.couple.startDate)} ~</span>
          </span>
        </span>
        <span class="label">디데이</span>
      </button>`;
  }

  function render() {
    grid.innerHTML = HOME_LAYOUT.page
      .map((item) => (item === 'widget:dday' ? widgetDday() : appById(item) ? iconCell(appById(item)) : ''))
      .join('');
    dock.innerHTML = HOME_LAYOUT.dock.map((id) => (appById(id) ? iconCell(appById(id), false) : '')).join('');
  }
  render();

  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]');
    if (b) onOpen(b.dataset.open, b.querySelector('.icon, .widget'));
  });

  return { el: root, refresh: render };
}
