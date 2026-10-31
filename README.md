# 종성선배의 iPhone

> 이 버전은 **폴더 없이** 모든 파일을 저장소 맨 위에 그대로 올리는 방식입니다. 사진도 같은 곳에 올리면 됩니다.

방문자가 종성선배의 휴대폰을 몰래 구경하는 인터랙티브 웹사이트입니다.
빌드 과정이 없는 정적 사이트라서 GitHub Pages에 파일만 올리면 바로 작동합니다.

전체 계획과 폴더 구조는 [`PLAN.md`](PLAN.md)를 보세요.

---

## GitHub Pages에 올리는 법 (웹사이트에서만)

1. github.com에 로그인 → 오른쪽 위 **+** → **New repository**
2. 저장소 이름 입력 (예: `jongseong`) → **Public** 선택 → **Create repository**
3. 생성된 화면에서 **uploading an existing file** 클릭
4. 압축을 푼 폴더 **안의 파일 전부**(Ctrl+A)를 끌어다 놓기
   - 같은 이름의 파일은 새 파일로 덮어써집니다.
   - `.nojekyll`은 숨김 파일이라 안 보일 수 있습니다. 없어도 작동은 합니다.
5. 아래 **Commit changes** 클릭
6. 저장소의 **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main**, 폴더 **/(root)** → **Save**
7. 1~2분 뒤 `https://내아이디.github.io/저장소이름/` 으로 접속

파일을 고친 뒤에는 같은 방법으로 다시 올리면(덮어쓰기) 1~2분 안에 반영됩니다.

## 내 컴퓨터에서 미리 보기

`index.html`을 더블클릭하면 **작동하지 않습니다** (브라우저 보안 정책 때문). 폴더에서 아래 명령을 실행한 뒤 `http://localhost:8000` 으로 접속하세요.

```
python3 -m http.server 8000
```

또는 VS Code의 *Live Server* 확장을 써도 됩니다. 그냥 GitHub에 올려서 확인해도 됩니다.

---

## 자주 고칠 곳

| 하고 싶은 것 | 고칠 파일 |
|---|---|
| 잠금화면 배경 | `lock.jpg` 파일을 다른 파일들과 같은 곳에 올리기 |
| 홈화면 배경 (따로 쓰고 싶을 때) | `home.jpg` 파일을 같은 곳에 올리기 |
| 날짜·시간·사귄 날 | `config.js` → `story`, `couple` |
| 잠금화면 알림 문구 | `config.js` → `lockNotification` |
| 디데이 위젯 제목·배경 사진 | `config.js` → `ddayWidget` |
| 앱 배치, 빨간 배지 숫자 | `apps.js` |
| 카카오톡 채팅방·대화 | `data-kakao.js` |
| 문자 대화 | `data-messages.js` |
| 최근 통화 기록 | `data-calls.js` |
| 메모 | `data-notes.js` |
| 인스타그램 계정·게시물·댓글·스토리·DM | `data-instagram.js` |
| 사진 앱 사진·앨범 | `data-photos.js` |
| 캘린더 일정 | `data-calendar.js` |
| Safari 검색 기록·즐겨찾기 | `data-safari.js` |
| 음악 목록 | `data-music.js` |
| 알람·세계 시계 | `data-clock.js` |
| **올릴 사진 전체 목록** | `PHOTO-LIST.md` |
| 저장명(♡, 엄마/아빠), 프로필 사진 | `config.js` → `contacts`, `avatars` |
| 앱 아이콘을 이미지로 바꾸기 | 이미지를 올리고 `apps.js`에서 `image: '파일명.png'` |

배경 사진은 세로 사진(약 1170×2532)이 가장 잘 맞습니다. 파일 이름과 확장자(`.jpg`)가 정확히 같아야 합니다.

## 문장 속 이름 넣기

대화·메모 데이터 파일의 모든 문장에서 아래처럼 쓰면 방문자 이름으로 바뀝니다. 받침에 맞게 조사가 자동으로 붙어요.

| 쓰는 법 | 여주 | 지원 |
|---|---|---|
| `{name}` | 여주 | 지원 |
| `{name아/야}` | 여주야 | 지원아 |
| `{name이/}` | 여주 | 지원이 |
| `{name이랑/랑}` | 여주랑 | 지원이랑 |
| `{name이/가}` | 여주가 | 지원이 |
| `{name은/는}` | 여주는 | 지원은 |
| `{name을/를}` | 여주를 | 지원을 |
| `{name으로/로}` | 여주로 | 지원으로 |
| `{id}` | 방문자 인스타 아이디 | |
| `{owner}` `{ownerFirst}` `{ownerNick}` `{ownerId}` | 박종성 · 종성 · 종성선배 · jayPark02 | |

## 동작 방식 메모

- 이야기 속 시간은 항상 **2026년 11월 1일 일요일 21:41**에서 시작하고, 머무는 동안 1분씩 흐릅니다 (`config.js`의 `clockRuns: false`로 고정 가능).
- 방문자 이름·아이디는 그 사람의 브라우저(localStorage)에만 저장됩니다. 서버로 전송되지 않습니다.
- 탭을 닫았다가 다시 들어오면 잠금화면부터 시작합니다.
- PC에서는 폰 모양 프레임 안에 보이고, 휴대폰에서는 화면 전체를 씁니다.
- PC에서 앱을 닫으려면 하단 막대(홈 인디케이터)를 클릭하거나 `Esc`를 누르세요.
- 앱 아이콘은 iOS 느낌으로 새로 그린 것이며 실제 회사 로고 파일이 아닙니다.
