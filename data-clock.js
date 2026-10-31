// ─────────────────────────────────────────────
//  시계 앱
// ─────────────────────────────────────────────
//  알람   : time '07:30', label, days(반복 요일 문구), on(켜짐 여부)
//  세계 시계 : offset = 서울과의 시차(시간). 11월 기준 (유럽은 서머타임 끝난 뒤)

export const ALARMS = [
  { time: '07:30', label: '1교시', days: '월 수 금', on: true },
  { time: '08:20', label: '알람', days: '화 목', on: true },
  { time: '07:50', label: '다시 알람', days: '평일', on: true },
  { time: '10:00', label: '주말', days: '토 일', on: false },
  { time: '05:50', label: 'F1 결승', days: '', on: false },
];

export const WORLD_CLOCKS = [
  { city: '서울',     offset: 0 },
  { city: '암스테르담', offset: -8 },
  { city: '런던',     offset: -9 },
  { city: '밀라노',   offset: -8 },
];
