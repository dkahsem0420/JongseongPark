// ─────────────────────────────────────────────
//  사이트 전체 설정 — 날짜, 폰 주인, 배경화면 등
//  여기 값만 바꾸면 사이트 전체에 반영됩니다.
// ─────────────────────────────────────────────
//
//  [문장 속 이름 자리표시자]
//   {name}            → 방문자 이름            (예: 여주 / 지원)
//   {name이/가}       → 여주가 / 지원이
//   {name은/는}       → 여주는 / 지원은
//   {name을/를}       → 여주를 / 지원을
//   {name아/야}       → 여주야 / 지원아
//   {name이랑/랑}     → 여주랑 / 지원이랑
//   {name이/}         → 여주 / 지원이   (부를 때 붙는 '이')
//   {name으로/로}     → 여주로 / 지원으로
//   {id}              → 방문자 인스타 아이디
//   {owner} {ownerFirst} {ownerNick} {ownerId}
//                     → 박종성 / 종성 / 종성선배 / jayPark02

export const CONFIG = {
  // 이야기 속 고정 날짜·시간 (접속 날짜와 상관없이 항상 이 시점)
  story: {
    date: '2026-11-01',
    time: '21:41',
    // true면 21:41에서 시작해 머무는 동안 실제처럼 1분씩 흘러갑니다 (23:59에서 멈춤)
    clockRuns: true,
  },

  couple: {
    startDate: '2026-10-02', // 사귄 날 (이 날을 1일로 셈 → 11/1 = +31일)
  },

  owner: {
    name: '박종성',
    firstName: '종성',
    nickname: '종성선배',
    instagram: 'jayPark02',
  },

  // 이름 입력 화면의 예시 문구
  visitorPlaceholder: '여주',

  // 배경화면: 파일을 이 경로에 넣으면 자동으로 적용됩니다.
  // 파일이 없으면 기본 어두운 그라데이션이 보입니다.
  wallpapers: {
    lock: 'lock.jpg',
    home: 'home.jpg', // 없으면 잠금화면 배경을 같이 씀
  },

  // 잠금화면 암호 (비워 두면 '' 암호 없이 열림)
  lock: {
    passcode: '0420',
    hint: '',      // 예: '우리가 처음 만난 날' — 비워 두면 힌트 없음
    hintAfter: 3,  // 몇 번 틀리면 힌트를 보여줄지
  },

  // 종성이 폰에 저장된 이름
  contacts: {
    gf: '{name} ♡',
    mom: '엄마',
    dad: '아빠',
  },

  // 잠긴 메모 「아이디 & 비밀번호」 — 어떤 비밀번호를 넣어도 절대 열리지 않음.
  // 메모 내용 자체를 코드에 넣지 않으므로, 소스를 들여다봐도 볼 수 있는 게 없습니다.
  notes: {
    lockedNeverOpens: true,
  },

  // 잠금화면 알림
  lockNotification: {
    icon: 'kakao',
    title: '{name}',
    body: '선배 어디예요?',
    time: '지금',
    target: '#/app/kakao', // 알림을 누르면 열릴 화면
  },

  // 홈화면 디데이 위젯
  ddayWidget: {
    title: '{name이랑/랑}',
    image: '', // 예: 'dday.jpg' (비워두면 흰 배경)
    opens: 'calendar', // 위젯을 누르면 열릴 앱
  },

  batteryPercent: 78,
};
