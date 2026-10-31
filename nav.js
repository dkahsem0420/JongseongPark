// iOS 스타일 상단 내비게이션 바 + 큰 제목
import { esc } from '../dom.js';
import { GLYPH } from '../icons.js';

/**
 * @param {object} o
 * @param {string} o.title      제목
 * @param {string} [o.back]     뒤로 버튼 글자 (없으면 뒤로 버튼 없음)
 * @param {string} [o.right]    오른쪽 버튼 HTML
 * @param {boolean} [o.large]   큰 제목 사용 (스크롤하면 작은 제목으로)
 */
export function navBar({ title, back, right = '', large = false }) {
  return `
    <div class="page-head${large ? ' has-large' : ''}">
      <div class="nav">
        <div class="nav-left">${back != null ? `<button class="nav-back" data-nav="back">${GLYPH.chevronLeft}<span>${esc(back)}</span></button>` : ''}</div>
        <div class="nav-title">${esc(title)}</div>
        <div class="nav-right">${right}</div>
      </div>
    </div>`;
}

export const largeTitle = (title) => `<h1 class="large-title">${esc(title)}</h1>`;

// 큰 제목이 스크롤로 사라지면 상단에 작은 제목 표시
export function wireLargeTitle(page) {
  const head = page.querySelector('.page-head.has-large');
  const body = page.querySelector('.page-body');
  if (!head || !body) return;
  const on = () => head.classList.toggle('scrolled', body.scrollTop > 38);
  body.addEventListener('scroll', on, { passive: true });
  on();
}
