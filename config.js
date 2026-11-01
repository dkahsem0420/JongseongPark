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

  // 프로필 사진 (사진 파일을 올리고 이름을 적으면 카톡·전화·문자에 적용)
  // 예: gf: 'gf.jpg', '박성훈': 'seonghoon.jpg', '심재윤': 'jaeyoon.jpg', mom: 'mom.jpg'
  // 인스타 프사와 같은 파일을 써서, 한 번 올리면 카톡·전화·문자에도 같이 적용돼요
  avatars: {
    gf: 'pf-gf.jpg',
    '박성훈': 'pf-seonghoon.jpg',
    '심재윤': 'pf-jaeyoon.jpg',
  },

  // 잠긴 메모 「아이디 & 비밀번호」 — 어떤 비밀번호를 넣어도 절대 열리지 않음.
  // 메모 내용 자체를 코드에 넣지 않으므로, 소스를 들여다봐도 볼 수 있는 게 없습니다.
  notes: {
    lockedNeverOpens: true,
  },

  // 잠금화면 알림
  lockNotification: {
    icon: 'kakao',
    title: 'gf', // 'gf' = 종성이 폰에 저장된 이름 그대로 ({name} ♡)
    body: '선배 뭐해요?',
    time: '1시간 전', // 여주가 종성 폰을 갖게 되기 전에 보낸 메시지
    target: '#/app/kakao/chat/gf', // 알림을 누르면 열릴 화면 (여자친구 채팅방)
  },

  // 둘러보는 도중 위에서 내려오는 카톡 알림 (잠금 해제 후 after 초 뒤, 방문마다 한 번)
  //  chat : data-kakao.js 의 채팅방 id / from : 보낸 사람 / text : 내용
  //  메시지는 실제 채팅방에도 추가되고, 누르면 그 채팅방으로 이동
  //  title : 알림 제목을 따로 정할 때 (없으면 보낸 사람 이름)
  notifications: [
    { after: 150, chat: 'self', from: 'me', title: '나와의 채팅', text: '{name아/야}... 혹시 내 폰 너한테 있어?', ending: true },
  ],

  // 둘러보는 도중 걸려오는 전화 (방문마다 한 번)
  //  응답하면 lines 가 at(초) 마다 자막으로 나오고 hangupAt 초에 끊김
  //  거절하거나 ringFor 초 동안 안 받으면 declined.chat 카톡방으로 texts 가 옴
  incomingCall: {
    after: 50,
    from: '심재윤',
    label: '휴대전화',
    ringFor: 20,
    lines: [
      { at: 1,    text: '여보세요?' },
      { at: 3,    text: '박종성 어디야?' },
      { at: 6.5,  text: '...?' },
      { at: 8.5,  text: '뭐야 잘못 연결됐나' },
      { at: 11,   text: '야 박종성' },
    ],
    hangupAt: 13.5,
    declined: { chat: 'jaeyoon', texts: ['야 박종성 어디야', '전화는 왜 끊냐'] },
    // 그 뒤 종성이 PC 카톡으로 재윤에게 보내고, 재윤이 답함
    //  (엔딩 '혹시 내 폰 너한테 있어?'가 이미 왔으면 생략)
    followUp: {
      chat: 'jaeyoon',
      delay: 8, // 통화가 끝나거나 재윤 카톡이 온 뒤 몇 초 후
      me: '나 폰 잃어버림',
      ifAnswered: ['??', '전화는 어케 받았는데'],
      ifDeclined: ['엥?', '어디서 잃어버려'],
    },
  },

  // 엔딩 뒤 종성이 재윤 폰을 빌려서 자기 폰으로 거는 전화 (방문마다 한 번)
  //  엔딩에 답하고 afterAnswer 초 뒤 / 엔딩 질문에 답이 없으면 ifNoAnswer 초 뒤
  //  이 전화가 먼저 오면 위의 재윤 전화(incomingCall)는 생략
  jongseongCall: {
    from: '심재윤',
    label: '휴대전화',
    afterAnswer: 40,
    ifNoAnswer: 75,
    minGapAfterJaeyoon: 120, // 재윤 전화가 끝나고 최소 몇 초 뒤에 (둘이 만나는 시간)
    ringFor: 25,
    lines: [
      { at: 1,    text: '여보세요?' },
      { at: 3,    text: '...{name아/야}?' },
      { at: 5.5,  text: '나야 종성이' },
      { at: 7.5,  text: '재윤이 폰 빌렸어' },
      { at: 10,   text: '부끄러워서 대답 안 하는 거야? ㅋㅋㅋ' },
      { at: 13,   text: '많이 봤어?' },
      { at: 15.5, text: '...아냐 대답하지 마 ㅋㅋ' },
      { at: 18,   text: '지금 가고 있으니까 거기 있어' },
      { at: 20.5, text: '이따 봐' },
    ],
    hangupAt: 22.5,
    declined: { chat: 'self', from: 'me', title: '나와의 채팅', texts: ['왜 안 받아ㅋㅋㅋ', '방금 그거 나야', '심재윤 폰 잠깐 빌렸어'] },
  },

  // 독자가 종성 폰으로 카톡을 처음 보냈을 때 (방문마다 한 번)
  //  보낸 메시지는 상대가 읽지 않아 '1'이 그대로 남고,
  //  잠시 뒤 종성이 PC 카톡에서 눈치채고 '나와의 채팅'으로 보냄
  firstSendNotice: {
    after: 4, // 초
    chat: 'self', from: 'me', title: '나와의 채팅',
    texts: ['...?', '방금 내 카톡으로 뭐가 보내졌는데'],
    endingAfter: 40, // 이 반응 뒤 몇 초 만에 엔딩('혹시 내 폰 너한테 있어?')을 앞당길지
  },

  // 홈화면 디데이 위젯
  ddayWidget: {
    title: '{name이랑/랑}',
    image: '', // 예: 'dday.jpg' (비워두면 흰 배경)
    opens: 'calendar', // 위젯을 누르면 열릴 앱
  },

  batteryPercent: 78,
};
