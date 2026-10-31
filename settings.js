// 설정 앱 — 실제 iOS 설정처럼 보이되, '방문자 설정'만 실제로 동작
import { CONFIG } from './config.js';
import { el, esc } from './dom.js';
import { GLYPH, ROW_ICON } from './icons.js';
import { navBar, largeTitle, wireLargeTitle } from './nav.js';
import { getVisitor, setVisitor, clearVisitor } from './store.js';
import { withJosa } from './josa.js';
import { suggestIds, cleanId } from './romanize.js';

const row = ({ icon, color, label, value = '', go = '', act = '', chevron = true, toggle = null, danger = false }) => `
  <button class="row${danger ? ' danger' : ''}" ${go ? `data-go="${go}"` : ''} ${act ? `data-act="${act}"` : ''}>
    ${icon ? `<span class="ricon" style="background:${color}">${ROW_ICON[icon]}</span>` : ''}
    <span class="rbody">
      <span class="rlabel">${esc(label)}</span>
      <span class="rright">
        ${value ? `<span class="rvalue">${esc(value)}</span>` : ''}
        ${toggle != null ? `<span class="switch${toggle ? ' on' : ''}"></span>` : chevron ? `<span class="rchev">${GLYPH.chevronRight}</span>` : ''}
      </span>
    </span>
  </button>`;

export default function create(ctx) {
  function rootPage() {
    const v = getVisitor() || {};
    const o = CONFIG.owner;
    const p = el(`
      <div class="page grouped">
        ${navBar({ title: '설정', large: true })}
        <div class="page-body">
          ${largeTitle('설정')}
          <div class="search-field">${GLYPH.search}<span>검색</span></div>

          <div class="group">
            <button class="row profile">
              <span class="avatar">${esc(o.name.slice(1))}</span>
              <span class="rbody">
                <span class="rlabel"><b>${esc(o.name)}</b><small>Apple 계정, iCloud 및 기타 항목</small></span>
                <span class="rright"><span class="rchev">${GLYPH.chevronRight}</span></span>
              </span>
            </button>
          </div>

          <div class="group">
            ${row({ icon: 'airplane', color: '#FF9500', label: '에어플레인 모드', toggle: false })}
            ${row({ icon: 'wifi', color: '#007AFF', label: 'Wi-Fi', value: '연결됨' })}
            ${row({ icon: 'bluetooth', color: '#007AFF', label: 'Bluetooth', value: '켬' })}
            ${row({ icon: 'cellular', color: '#34C759', label: '셀룰러' })}
          </div>

          <div class="group">
            ${row({ icon: 'bell', color: '#FF3B30', label: '알림' })}
            ${row({ icon: 'sound', color: '#FF2D55', label: '사운드 및 햅틱' })}
            ${row({ icon: 'moon', color: '#5856D6', label: '집중 모드' })}
            ${row({ icon: 'hourglass', color: '#5856D6', label: '스크린 타임' })}
          </div>

          <div class="group">
            ${row({ icon: 'gear', color: '#8E8E93', label: '일반' })}
            ${row({ icon: 'wallpaper', color: '#34AADC', label: '배경화면' })}
          </div>

          <p class="group-header">이 휴대폰을 보는 사람</p>
          <div class="group">
            ${row({ icon: 'person', color: '#636366', label: '이름 · 인스타그램 아이디', value: v.name || '', go: 'visitor' })}
            ${row({ icon: 'lock', color: '#636366', label: '잠금화면 다시 보기', act: 'lock', chevron: false })}
            ${row({ icon: 'reset', color: '#FF3B30', label: '처음부터 다시 입력하기', act: 'reset', chevron: false, danger: true })}
          </div>
          <p class="group-footer">이름과 아이디는 이 브라우저에만 저장돼요.</p>
        </div>
      </div>`);

    p.addEventListener('click', (e) => {
      const r = e.target.closest('.row');
      if (!r) return;
      if (r.dataset.go) ctx.go(r.dataset.go);
      else if (r.dataset.act === 'lock') ctx.lock();
      else if (r.dataset.act === 'reset') {
        const label = r.querySelector('.rlabel');
        if (r.classList.contains('confirm')) { clearVisitor(); ctx.restart(); return; }
        r.classList.add('confirm');
        label.textContent = '한 번 더 누르면 초기화돼요';
        setTimeout(() => { r.classList.remove('confirm'); label.textContent = '처음부터 다시 입력하기'; }, 3000);
      } else {
        const sw = r.querySelector('.switch');
        if (sw) sw.classList.toggle('on');
      }
    });
    wireLargeTitle(p);
    return p;
  }

  function visitorPage() {
    const v = getVisitor() || { name: '', igId: '' };
    const p = el(`
      <div class="page grouped">
        ${navBar({ title: '이름 · 아이디', back: '설정', right: '<button class="nav-btn" data-act="save">완료</button>' })}
        <div class="page-body">
          <p class="group-header">이름 (성 빼고)</p>
          <div class="group"><label class="row input-row"><input id="vs-name" maxlength="10" autocomplete="off" value="${esc(v.name)}"></label></div>
          <p class="group-footer" id="vs-prev"></p>

          <p class="group-header">인스타그램 아이디</p>
          <div class="group"><label class="row input-row"><span class="at">@</span><input id="vs-id" maxlength="30" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(v.igId)}"></label></div>
          <div class="chips light" id="vs-chips"></div>
          <p class="group-footer">영문, 숫자, 마침표(.), 밑줄(_)만 쓸 수 있어요.</p>
        </div>
      </div>`);
    const $n = p.querySelector('#vs-name');
    const $i = p.querySelector('#vs-id');
    const $prev = p.querySelector('#vs-prev');
    const $chips = p.querySelector('#vs-chips');
    const $save = p.querySelector('[data-act="save"]');

    function update() {
      const n = $n.value.trim();
      $prev.innerHTML = n
        ? `예시: ${esc(withJosa(n, '아/야'))} · ${esc(withJosa(n, '이랑/랑'))} · ${esc(withJosa(n, '은/는'))} · ${esc(withJosa(n, '이/'))}`
        : '이름을 입력해 주세요.';
      $chips.innerHTML = suggestIds(n).map((s) => `<button type="button" class="chip" data-id="${esc(s)}">@${esc(s)}</button>`).join('');
      $save.disabled = !n || !cleanId($i.value);
    }
    $n.addEventListener('input', update);
    $i.addEventListener('input', () => { const c = cleanId($i.value); if (c !== $i.value) $i.value = c; update(); });
    $chips.addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (b) { $i.value = b.dataset.id; update(); } });
    $save.addEventListener('click', () => {
      if ($save.disabled) return;
      setVisitor({ name: $n.value.trim(), igId: cleanId($i.value) });
      ctx.back('');
    });
    update();
    return p;
  }

  return {
    statusStyle: 'dark',
    page(sub) {
      return sub[0] === 'visitor' ? visitorPage() : rootPage();
    },
  };
}
