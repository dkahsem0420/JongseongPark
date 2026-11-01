// ─────────────────────────────────────────────
//  캘린더 앱
// ─────────────────────────────────────────────
//  date  : '2026-11-07'
//  time  : '18:30' (없으면 하루 종일)   end : 끝나는 시간 (선택)
//  cal   : 아래 CALENDARS 중 하나 (점 색깔)
//  place : 장소 (선택)   note : 메모 (선택)
//  다른 앱과 날짜를 맞춰 두었어요: 치과(문자), 레스토랑(카톡), 본가(엄마 문자), 팀플(단톡)

export const CALENDARS = {
  us:     { name: '우리', color: '#FF2D55' },
  school: { name: '학교', color: '#007AFF' },
  me:     { name: '개인', color: '#FF9500' },
};

export const EVENTS = [
  { date: '2026-10-02', title: '{name이랑/랑} 사귄 날', cal: 'us' },
  { date: '2026-10-02', time: '16:00', title: '꽃 픽업', cal: 'us', note: '차에 두기' },
  { date: '2026-10-02', time: '18:00', end: '19:30', title: '오스테리아 루체', cal: 'us', place: '오스테리아 루체', note: '창가 자리 → 셰프님 사정으로 취소됨ㅠ' },
  { date: '2026-10-02', time: '20:00', title: '케이블카 → 전망대', cal: 'us', note: '야경 보고 말하기' },
  { date: '2026-10-30', time: '16:00', end: '17:00', title: '조직행동론 팀플 회의', cal: 'school', place: '경영관 스터디룸 3' },
  { date: '2026-11-02', title: '{name이랑/랑} 한 달 🎉', cal: 'us' },
  { date: '2026-11-03', time: '10:30', end: '11:00', title: '재무관리 퀴즈', cal: 'school' },
  { date: '2026-11-05', time: '14:00', end: '15:00', title: '바른숲치과 스케일링', cal: 'me', note: '10분 전 도착' },
  { date: '2026-11-06', time: '15:00', end: '16:30', title: '조직행동론 팀플 회의', cal: 'school', place: '경영관 스터디룸 3', note: '발표 리허설' },
  { date: '2026-11-07', time: '18:30', end: '20:30', title: '라 메종 블랑', cal: 'us', place: '라 메종 블랑', note: '2명 · 창가 테이블\n10/2 다시 하기. 이번엔 완벽하게' },
  { date: '2026-11-08', title: '본가', cal: 'me', note: '엄마 허리 / 아빠랑 골프' },
  { date: '2026-11-09', time: '23:59', title: '마케팅원론 레포트 마감', cal: 'school' },
  { date: '2026-11-12', time: '10:30', end: '12:00', title: '조직행동론 발표', cal: 'school', note: '발표 담당: 나' },
];
