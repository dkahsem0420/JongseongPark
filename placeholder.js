// 아직 만들지 않은 앱 — 단계별로 실제 앱으로 교체됩니다
import { el, esc } from './dom.js';
import { appIconHtml } from './icons.js';
import { navBar } from './nav.js';

export default function create(ctx) {
  return {
    page() {
      const a = ctx.app;
      return el(`
        <div class="page">
          ${navBar({ title: a.name })}
          <div class="page-body ph">
            <span class="ph-icon">${appIconHtml(a)}</span>
            <p class="ph-title">${esc(a.name)}</p>
            <p class="ph-sub">${a.stage ? `${a.stage}단계에서 채워질 화면이에요.` : '준비 중인 화면이에요.'}</p>
            <button class="ph-home" data-nav="home">홈으로</button>
          </div>
        </div>`);
    },
  };
}
