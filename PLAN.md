# 종성선배 iPhone — 전체 개발 계획

## 기술 선택: 빌드 없는 정적 사이트 (HTML + CSS + JavaScript 모듈)

React·Vite 대신 **빌드 과정이 없는 순수 웹 코드**로 만들었습니다.

- GitHub 웹사이트에서 파일을 **끌어다 놓기만 하면** 바로 배포됩니다 (터미널, Node.js 설치, GitHub Actions 설정 불필요).
- 대화·메모·통화 기록은 `data/` 폴더의 파일만 고치면 됩니다. 저장하면 끝이고 다시 빌드할 필요가 없습니다.
- 주소는 `#/app/kakao` 같은 **해시 방식**이라, GitHub Pages에서 어느 화면에서 새로고침해도 404가 나지 않습니다.

## 폴더 구조

```
index.html               ← 진입점
.nojekyll                ← GitHub Pages가 파일을 건드리지 않게 하는 빈 파일
css/
  base.css               ← 폰 프레임, 상태 표시줄, 홈 인디케이터
  screens.css            ← 이름 입력, 잠금화면, 홈화면, 위젯
  apps.css               ← 앱 공통 틀(내비게이션 바, 화면 전환), 설정 앱
data/                    ← ★ 콘텐츠는 전부 여기서 수정
  config.js              ← 날짜·시간, 폰 주인, 배경화면, 잠금 알림, 위젯
  apps.js                ← 홈화면 앱 목록·배치·배지
  (2단계~) kakao.js, messages.js, calls.js, notes.js, instagram.js,
           photos.js, calendar.js, safari.js, music.js
js/
  main.js                ← 화면 흐름과 주소(라우터), 앱 열기/닫기
  store.js               ← 방문자 이름·아이디 저장 (브라우저에만)
  text.js                ← {name아/야} 같은 자리표시자 처리
  clock.js               ← 이야기 속 시간(2026.11.01 21:41), 디데이 계산
  icons.js               ← 앱 아이콘 SVG
  dom.js                 ← 작은 도우미 함수
  utils/josa.js          ← 조사 자동 처리
  utils/romanize.js      ← 한글 이름 → 영문 아이디 추천
  ui/statusbar.js, ui/nav.js
  screens/setup.js, lock.js, home.js
  apps/index.js          ← 앱 id ↔ 앱 코드 연결
  apps/settings.js       ← 설정 앱
  apps/placeholder.js    ← 아직 안 만든 앱의 임시 화면
  (2단계~) apps/phone.js, kakao.js, messages.js, notes.js, instagram.js …
assets/
  wallpapers/            ← lock.jpg, home.jpg
  photos/                ← 사진 앱·인스타·카톡에 쓸 사진
  icons/                 ← 직접 만든 앱 아이콘을 쓸 경우
  widget/                ← 디데이 위젯 배경 사진 (선택)
```

## 단계별 계획

| 단계 | 내용 | 상태 |
|---|---|---|
| 1 | 프로젝트 구조, 이름·아이디 입력, 잠금화면, 홈화면, 디데이 위젯, 앱 열기/뒤로/홈, 설정 앱(이름 변경) | ✅ 완료 |
| 2 | 전화(최근 통화), 카카오톡(목록·대화방·날짜 구분선·읽음 표시), 메시지(SMS), 메모(목록·상세·잠긴 메모) + 데이터 파일 형식 | 다음 |
| 3 | Instagram: 피드, 프로필, 좋아요, 댓글, 스토리 뷰어, DM, 다른 사람 프로필 이동 | |
| 4 | 사진(앨범·격자·전체화면), 캘린더(11월·일정 상세), Safari(검색 기록·네이버/구글 이동), 음악(라이브러리·재생 화면), 시계 | |
| 5 | 실제 대화 내용·사진 넣기 | |
| 6 | 모바일 최적화, 오류 수정, GitHub Pages 배포 확인 | |

### 2단계 데이터 형식 미리보기 (카카오톡 예시)

```js
// data/kakao.js
export const KAKAO_CHATS = [
  {
    id: 'gf',
    title: '{name}',
    messages: [
      { date: '2026-11-01' },                       // 날짜 구분선
      { from: 'gf', time: '13:02', text: '선배 어디예요?' },
      { from: 'me', time: '13:03', text: '나 강의실. 니 자리에 노트북 올려놨어' },
    ],
  },
];
```

대화는 이런 형식으로 받으면 그대로 넣을 수 있습니다. 메모장에 `이름: 내용` 형식으로 보내 주셔도 제가 변환해 드립니다.

## 정해 두면 좋은 것 (2단계 전에)

- 잠긴 메모 「아이디 & 비밀번호」를 여는 가상 비밀번호
- 카톡 채팅방 목록에서 여자친구 이름 옆 이모지 여부 (예: `{name} 🐶`)
- 종성이 휴대폰 속 가족 저장명 (예: `엄마`, `아빠` / `어머니`)
