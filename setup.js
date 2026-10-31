// 첫 접속: 방문자 이름 + 인스타 아이디 입력
import { CONFIG } from './config.js';
import { el, esc } from './dom.js';
import { withJosa } from './josa.js';
import { suggestIds, cleanId } from './romanize.js';
import { setVisitor } from './store.js';

export function createSetup({ onDone }) {
  const ph = CONFIG.visitorPlaceholder;
  const root = el(`
    <div class="layer setup">
      <div class="setup-inner">
        <p class="setup-kicker">${esc(CONFIG.owner.nickname)}의 iPhone</p>
        <h1 class="setup-title">선배 휴대폰,<br>잠깐 구경해 볼까요?</h1>
        <p class="setup-desc">먼저 당신의 이름을 알려주세요.<br>휴대폰 속 여자친구 자리에 이 이름이 들어가요.</p>

        <label class="field">
          <span class="field-label">이름 <small>(성 빼고)</small></span>
          <input class="field-input" id="su-name" maxlength="10" autocomplete="off" placeholder="예: ${esc(ph)}" enterkeyhint="next">
        </label>
        <p class="setup-preview" id="su-preview">&nbsp;</p>

        <label class="field">
          <span class="field-label">인스타그램 아이디</span>
          <span class="field-at"><span>@</span><input class="field-input" id="su-id" maxlength="30" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="영문 아이디" enterkeyhint="done"></span>
        </label>
        <div class="chips" id="su-chips"></div>

        <button class="setup-btn" id="su-go" disabled>휴대폰 켜기</button>
        <p class="setup-note">입력한 이름과 아이디는 이 브라우저에만 저장되고 어디로도 전송되지 않아요.<br>설정 앱에서 언제든 바꿀 수 있어요.</p>
      </div>
    </div>`);

  const $name = root.querySelector('#su-name');
  const $id = root.querySelector('#su-id');
  const $chips = root.querySelector('#su-chips');
  const $prev = root.querySelector('#su-preview');
  const $go = root.querySelector('#su-go');
  let idTouched = false;

  function update() {
    const name = $name.value.trim();
    const ids = suggestIds(name);
    if (!idTouched) $id.value = ids[0] || '';
    $chips.innerHTML = ids.map((s) => `<button type="button" class="chip${s === $id.value ? ' on' : ''}" data-id="${esc(s)}">@${esc(s)}</button>`).join('');
    $prev.innerHTML = name
      ? `선배는 당신을 <b>‘${esc(withJosa(name, '아/야'))}’</b>라고 불러요`
      : '&nbsp;';
    $go.disabled = !name || !cleanId($id.value);
  }

  $name.addEventListener('input', update);
  $id.addEventListener('input', () => {
    idTouched = true;
    const c = cleanId($id.value);
    if (c !== $id.value) $id.value = c;
    update();
  });
  $chips.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    $id.value = b.dataset.id;
    idTouched = true;
    update();
  });
  $name.addEventListener('keydown', (e) => { if (e.key === 'Enter') $id.focus(); });
  $id.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !$go.disabled) $go.click(); });

  $go.addEventListener('click', () => {
    setVisitor({ name: $name.value.trim(), igId: cleanId($id.value) });
    document.activeElement?.blur();
    root.classList.add('leaving');
    setTimeout(() => onDone(), 650);
  });

  return {
    el: root,
    reset() {
      $name.value = ''; $id.value = ''; idTouched = false;
      root.classList.remove('leaving');
      update();
    },
  };
}
