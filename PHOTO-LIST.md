# 올릴 사진·영상 파일 목록

파일을 **다른 파일들과 같은 곳**(저장소 맨 위)에 아래 **이름 그대로** 올리면 자동으로 들어가요.
없는 파일은 설명이 적힌 회색 칸으로 보이니, 준비된 것부터 하나씩 올려도 괜찮아요.

- 확장자까지 정확히 같아야 해요 (`.jpg`). `.png`, `.jpeg` 라면 해당 데이터 파일에서 이름만 바꿔 주세요.
- 아이폰 기본 사진 형식인 `.heic` 는 브라우저에서 안 보여요 → jpg 로 변환해서 올리기
- 영상은 `.mp4` (파일 하나 25MB 이하, 5~10초 추천). 데이터 파일에서 이름을 `.mp4` 로 적으면 영상으로 재생돼요.
- 사이트가 공개라서, 직접 찍은 사진이나 무료 사진(Pexels·Unsplash 등)을 추천해요.
- 여자친구(독자) 얼굴이 나오는 사진은 넣지 않아요.

## 배경화면 · 위젯 (config.js)

| 파일 이름 | 설명 |
|---|---|
| `lock.jpg` | 잠금화면 배경 (세로 사진, 약 1170×2532) |
| `home.jpg` | 홈화면 배경 (없으면 잠금화면 배경을 같이 씀) |
| `dday.jpg` | 디데이 위젯 배경 (선택 — 쓰려면 config.js 의 ddayWidget.image 에 이름 적기) |

## 인스타 프로필 사진 (data-instagram.js) — 여주·성훈·재윤 프사는 카톡·전화·문자에도 같이 쓰여요

| 파일 이름 | 설명 |
|---|---|
| `pf-jay.jpg` | 박종성 |
| `pf-gf.jpg` | 여자친구 (얼굴 말고 꽃·풍경 등 추천) |
| `pf-jaeyoon.jpg` | 심재윤 |
| `pf-seonghoon.jpg` | 박성훈 |
| `pf-seoa.jpg` | 윤서아 |
| `pf-dog.jpg` | 오늘의 댕댕 |
| `pf-food.jpg` | 서울 맛집 기록 |
| `pf-watch.jpg` | 타임피스랩 |

## 인스타 게시물 (data-instagram.js) — 세로 4:5 추천

| 파일 이름 | 설명 |
|---|---|
| `ig-jay-guitar.jpg` | 기타 사진 |
| `ig-jay-child.jpg` | 종성 어린 시절 사진 |
| `ig-jay-f1.jpg` | F1 보러 간 종성 (뒷모습) |
| `ig-gf-flowers.jpg` | 종성에게 받은 꽃다발 |
| `ig-gf-bf.jpg` | 여자친구가 찍은 종성 사진 (남친짤) |
| `ig-gf-date.jpg` | 데이트 사진 |
| `ig-jaeyoon-1.jpg` | 심재윤 본인 사진 (탈색) |
| `ig-seonghoon-milano.jpg` | 박성훈 밀라노 여행 사진 |

## 인스타 스토리 (data-instagram.js) — 세로 9:16 추천

| 파일 이름 | 설명 |
|---|---|
| `story-jay-1.jpg` | 종성 스토리 |
| `story-gf-1.jpg` | 여자친구 스토리 |
| `story-gf-2.jpg` | 여자친구 스토리 2 |
| `story-jaeyoon-1.jpg` | 심재윤 스토리 |
| `story-seonghoon-gym.jpg` | 박성훈 헬스장 사진 |

## 인스타 DM 속 릴스·게시물 (data-instagram.js)

| 파일 이름 | 설명 |
|---|---|
| `dm-reel-dog.mp4` | 강아지 릴스 |
| `dm-post-food.jpg` | 맛집 소개 게시물 |

## 사진 앱 (data-photos.js)

| 파일 이름 | 설명 |
|---|---|
| `photo-guitar-1.jpg` | 기타 사진 |
| `photo-guitar-2.jpg` | 합주실에서 기타 |
| `photo-friends-1.jpg` | 친구들과 일상 |
| `photo-cook-1.jpg` | 직접 만든 요리 |
| `photo-jay-1.jpg` | 종성 본인 사진 |
| `photo-us-1.jpg` | 전망대에서 본 야경 |
| `photo-us-2.jpg` | 꽃다발 |
| `photo-f1-1.jpg` | F1 경기장 |
| `photo-f1-2.jpg` | F1 보러 간 종성 뒷모습 |
| `photo-f1-3.jpg` | F1 굿즈 |
| `photo-cook-2.jpg` | 파스타 연습 |
| `photo-us-3.jpg` | 여자친구가 찍어준 종성 사진 |
| `photo-us-4.jpg` | 데이트 카페 |
| `photo-us-5.jpg` | 데이트 장소 풍경 |
| `photo-friends-2.jpg` | 친구들과 피시방 |
| `photo-guitar-3.jpg` | 새 기타 언박싱 |
| `photo-cook-3.jpg` | 오늘 저녁 |

## 선택 사항

| 위치 | 방법 |
|---|---|
| 음악 앨범 커버 | data-music.js 의 `cover` 에 파일 이름 (공식 앨범 커버는 저작권이 있어요) |
| 카톡 엄마·아빠 프사 | config.js 의 `avatars` 에 `mom: 'pf-mom.jpg'` 처럼 추가 |
| 카톡 채팅 속 사진 | data-kakao.js 메시지에 `image: '파일.jpg'` |
