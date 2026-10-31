// 앱 id → 앱 모듈 연결. 새 앱을 만들면 여기에 추가하세요.
//
// 앱 모듈 형식:
//   export default function create(ctx) {
//     return {
//       statusStyle: 'dark' | 'light',       // 상태 표시줄 글자색
//       page(sub) { return 화면 요소 }         // sub = 주소의 하위 경로 배열
//     };
//   }
// ctx 에서 쓸 수 있는 것: ctx.app, ctx.go('chat/1'), ctx.back('부모 경로'), ctx.home(), ctx.t(), ctx.T()

import placeholder from './placeholder.js';
import settings from './settings.js';

const MODULES = {
  settings,
  // 2단계: phone, kakao, messages, notes
  // 3단계: instagram
  // 4단계: photos, calendar, safari, music, clock
};

export const getAppModule = (id) => MODULES[id] || placeholder;
