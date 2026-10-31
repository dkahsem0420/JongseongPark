// ─────────────────────────────────────────────
//  Safari — 즐겨찾기와 검색 기록
// ─────────────────────────────────────────────
//  검색 기록은 최신순으로 표시되고, 아래로 내릴수록 예전(썸 타던 시절) 기록이 나와요.
//  q      : 검색어
//  at     : 검색한 날짜·시간
//  engine : 'naver' 또는 'google' (누르면 실제 그 사이트 검색 결과가 새 창으로 열림)

export const FAVORITES = [
  { title: 'NAVER',  url: 'https://www.naver.com',  letter: 'N', color: '#03C75A' },
  { title: 'Google', url: 'https://www.google.com', letter: 'G', color: '#4285F4' },
];

export const HISTORY = [
  // ── 최근 ──
  { q: '여자친구 실내데이트',              at: '2026-11-01 20:58', engine: 'naver' },
  { q: '커플 향수 공방',                   at: '2026-10-31 13:47', engine: 'naver' },
  { q: 'Fender American Professional II 스트랫 셋업', at: '2026-10-31 16:02', engine: 'google' },
  { q: '생면 파스타 맛집',                  at: '2026-10-29 20:40', engine: 'naver' },
  { q: '밀라노 대성당',                    at: '2026-10-29 21:48', engine: 'google' },
  { q: '손목 얇은 여자 시계 사이즈',         at: '2026-10-28 01:05', engine: 'naver' },
  { q: '분위기 좋은 레스토랑',              at: '2026-10-28 00:31', engine: 'naver' },
  { q: '막스 베르스타펜 경기 결과',          at: '2026-10-26 07:12', engine: 'google' },
  { q: '조직행동론 동기부여 이론',           at: '2026-10-27 21:20', engine: 'google' },
  { q: '알리오올리오 맛있게 만드는 법',       at: '2026-10-21 22:10', engine: 'naver' },

  // ── 사귄 직후 ──
  { q: '여자친구 선물 추천',                at: '2026-10-15 00:47', engine: 'naver' },
  { q: '커플 데이트 코스',                  at: '2026-10-12 23:30', engine: 'naver' },
  { q: '기념일 레스토랑',                   at: '2026-10-09 01:14', engine: 'naver' },
  { q: '덜 무서운 공포영화 추천',            at: '2026-10-07 23:55', engine: 'naver' },
  { q: '강아지 카페 서울',                  at: '2026-10-05 22:18', engine: 'naver' },
  { q: 'F1 그랑프리 일정',                  at: '2026-10-04 09:40', engine: 'google' },

  // ── 사귀기 전 ──
  { q: '고백하기 좋은 장소',                at: '2026-09-29 02:03', engine: 'naver' },
  { q: '꽃다발 예약 당일',                  at: '2026-09-30 13:12', engine: 'naver' },
  { q: '서울 전망대 추천',                  at: '2026-09-24 23:41', engine: 'naver' },
  { q: '분위기 좋은 카페',                  at: '2026-09-19 22:05', engine: 'naver' },
  { q: '기타 이펙터 추천',                  at: '2026-09-15 18:30', engine: 'google' },
  { q: '파스타 레시피',                     at: '2026-09-12 19:02', engine: 'naver' },
  { q: '기타 줄 교체 주기',                 at: '2026-08-13 22:44', engine: 'google' },
];
