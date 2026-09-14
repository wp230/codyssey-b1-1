# 🚀 권현석(Kwon Hyeon Seok) 반응형 포트폴리오 웹사이트

외부 프레임워크나 라이브러리(React, Vue, jQuery, Bootstrap 등)를 일절 배제하고, **순수 웹 표준 기술(HTML5, CSS3, ES6+ JavaScript)**만으로 밑바닥부터 직접 설계·구현한 반응형 포트폴리오 웹사이트입니다.

- **🌐 배포 URL (GitHub Pages)**: [https://wp230.github.io/codyssey-b1-1/](https://wp230.github.io/codyssey-b1-1/)
- **📂 저장소 URL**: [https://github.com/wp230/codyssey-b1-1](https://github.com/wp230/codyssey-b1-1)
- **👤 제작자**: 권현석 (Kwon Hyeon Seok) / `wp230@syuin.ac.kr`

---

## 📌 목차 (Table of Contents)
1. [기능 구현 및 동작 검증](#1-기능-구현-및-동작-검증)
2. [웹 기초 및 아키텍처 설계 원칙](#2-웹-기초-및-아키텍처-설계-원칙)
3. [핵심 구현 및 코드 흐름 상세](#3-핵심-구현-및-코드-흐름-상세)
4. [심화 설계 질문 및 React 연결 아키텍처](#4-심화-설계-질문-및-react-연결-아키텍처)
5. [주요 설정값 및 브레이크포인트 기준표](#5-주요-설정값-및-브레이크포인트-기준표)
6. [기술 스택 (Tech Stack)](#6-기술-스택-tech-stack)

---

## 1. 기능 구현 및 동작 검증

| 평가 검증 항목 | 구현 및 동작 내용 | 상태 |
| :--- | :--- | :---: |
| **반응형 화면 최적화** | 뷰포트 너비 992px 기준으로 데스크톱(좌측 280px 고정 사이드바)과 모바일(상단 60px 고정 헤더)로 자동 전환되며 모든 디바이스에서 깨짐 없이 최적화됨. | ✅ 완료 |
| **다크/라이트 모드 지속성** | 우측 하단 원형 플로팅 액션 버튼(FAB)을 클릭하여 테마를 전환하며, `localStorage`에 상태가 동기화되어 페이지를 새로고침하거나 브라우저를 닫아도 설정이 유지됨. | ✅ 완료 |
| **인터랙티브 UI 동작** | 모바일 햄버거 토글 메뉴, Intersection Observer 기반 ScrollSpy 및 부드러운 스크롤, 스크롤 300px 이상 시 우측 하단 스크롤 탑(`↑`) 버튼 정상 동작. | ✅ 완료 |
| **GitHub API 4가지 상태** | GitHub REST API(`https://api.github.com/users/wp230/repos`)를 비동기 호출하여 **로딩(스피너) / 성공(카드 렌더링) / 에러(재시도 버튼) / 빈 데이터** 상태를 완벽히 분기 표현. | ✅ 완료 |
| **폼 유효성 검사 즉각 피드백** | 이름/메시지 빈 값 누락 시, 이메일 정규식 형식 오류 시 입력 필드 바로 아래에 빨간색 경고 문구를 즉각 렌더링하고, 전송 성공 시 폼 초기화 및 성공 메시지 출력. | ✅ 완료 |

---

## 2. 웹 기초 및 아키텍처 설계 원칙

### Q1. HTML, CSS, JavaScript를 분리한 이유와 각 파일의 역할은 무엇인가?
- **분리 이유 (관심사의 분리, Separation of Concerns)**:
  - 웹 애플리케이션의 세 가지 축인 **구조(HTML), 표현(CSS), 동작(JS)**을 독립된 레이어로 분리함으로써 코드의 가독성을 높이고, 유지보수 시 스타일 변경이 비즈니스 로직에 영향을 주지 않도록 결합도를 낮췄습니다.
- **각 파일의 역할**:
  - `index.html`: 문서의 의미론적 뼈대(DOM 트리)를 정의하고 시맨틱 태그로 정보의 위계를 구성.
  - `css/style.css`: 레이아웃(Flexbox/Grid), CSS 변수 기반 디자인 시스템, 모바일 퍼스트 반응형 스타일링을 전담.
  - `js/main.js`: 이벤트 리스너 등록, 애플리케이션 상태 관리(State), 비동기 API 통신, 동적 DOM 업데이트를 수행.

### Q2. 시맨틱 태그를 사용한 이유와 선택 기준은 무엇인가?
- **사용 이유**:
  - 단순 `<div>` 대신 시맨틱 태그를 사용하면 **검색엔진 최적화(SEO)** 시 검색 크롤러가 주요 콘텐츠의 위치를 정확히 색인할 수 있으며, **웹 접근성(A11y)** 측면에서 스크린 리더 사용자가 랜드마크 단위로 빠르게 건너뛰며 탐색할 수 있습니다.
- **구조 설계 기준**:
  - `<header>`: 최상단/사이드바 네비게이션과 브랜드 아이덴티티 영역.
  - `<nav>`: 다른 섹션으로 이동하는 앵커 메뉴 목록(`<ul>`, `<li>`, `<a>`).
  - `<main>`: 문서의 핵심 고유 콘텐츠 영역 (Hero ~ Contact).
  - `<section>`: 고유 제목(`<h2>`)을 포함하며 논리적으로 독립된 주제 구역 (Hero, About, Skills, Projects, Contact).
  - `<article>`: 각 기술 스택 카드 및 GitHub 프로젝트 카드처럼 그 자체로 독립적 배포가 가능한 콘텐츠 단위.
  - `<footer>`: 저작권 표시 및 외부 프로필 링크.
  - `<label for="...">` - `<input id="...">`: 1:1 매칭하여 시각장애인 음성 안내 보장 및 라벨 클릭 시 입력창 자동 포커싱 구현.

### Q3. CSS 변수(:root)로 정의한 이유와 이점은 무엇인가?
- **도입 이유**:
  - 색상 코드(`#2563eb`, `#0f172a`), 레이아웃 수치(`280px`, `60px`)를 하드코딩하지 않고 변수화하여 **일관된 디자인 토큰(Design Token)**을 수립.
- **구체적인 이점 (다크모드 제어)**:
  - 일반 CSS는 다크모드 구현 시 수십~수백 개의 선택자에 일일이 다크모드 색상을 재정의해야 합니다.
  - 본 프로젝트는 `:root`에 정의된 CSS 변수값을 `[data-theme="dark"]` 선택자에서 단 몇 줄로 재선언하기만 하면, 자바스크립트가 `<html>` 태그에 `data-theme="dark"` 속성 하나만 주입해도 **$O(1)$의 비용으로 전체 웹사이트 색상이 일괄 전환**됩니다.

### Q4. onclick 인라인 속성 대신 addEventListener를 사용한 이유는 무엇인가?
- **인라인 `onclick`의 한계**:
  - HTML 태그 안에 자바스크립트 코드가 침범하여 구조와 로직이 뒤섞입니다.
  - 하나의 요소에 하나의 이벤트 핸들러만 등록할 수 있어, 새로운 동작을 추가하면 기존 핸들러가 덮어씌워지는 치명적 단점이 있습니다.
- **`addEventListener` 선택 이유**:
  - 자바스크립트 파일에서 이벤트를 일괄 관리하여 HTML을 순수하게 유지합니다.
  - 동일한 요소와 이벤트에 대해 복수의 독립적인 리스너를 안전하게 등록할 수 있습니다.
  - 캡처링/버블링 제어 및 이벤트 위임(Event Delegation), 옵션 객체(`once`, `passive`) 활용이 가능합니다.

---

## 3. 핵심 구현 및 코드 흐름 상세

### 1) "이벤트 → 상태 변경 → 화면 업데이트" 3대 파이프라인
React의 핵심 동작 원리인 **단방향 데이터 흐름(Unidirectional Data Flow)**을 순수 JS로 구현했습니다.

```
[사용자 이벤트 발생]  ──>  [애플리케이션 상태(State) 갱신]  ──>  [DOM 렌더링 함수 호출]
```

1. **다크 모드 흐름**:
   - `Event`: 우측 하단 플로팅 버튼 클릭
   - `State`: `state.theme = (state.theme === 'light' ? 'dark' : 'light')` 갱신 및 `localStorage` 저장
   - `Render`: `document.documentElement.setAttribute('data-theme', state.theme)` 적용 및 버튼 아이콘(`🌙`/`☀️`) 갱신
2. **GitHub API 데이터 흐름**:
   - `Event`: 페이지 DOMContentLoaded 초기 로드 (또는 [다시 시도] 버튼 클릭)
   - `State`: `state.projects.status = 'loading'` ➔ 통신 완료 후 `'success'` 또는 `'error'`
   - `Render`: 상태에 맞춰 스피너 HTML ➔ 카드 그리드 HTML ➔ 에러 메시지+버튼 HTML을 컨테이너에 교체 렌더링
3. **Contact 폼 유효성 흐름**:
   - `Event`: 폼 `submit` 제출 (`event.preventDefault()`로 새로고침 차단)
   - `State`: 이름, 이메일(정규식), 메시지 검증 후 `state.form.isValid` 플래그 계산
   - `Render`: 유효하지 않으면 입력창 하단 에러 문구 렌더링, 유효하면 초록색 전송 완료 메시지 출력 및 `form.reset()`

### 2) async/await와 try/catch 기반의 비동기 분기 처리 흐름
```javascript
const fetchGitHubProjects = async () => {
  // 1. 요청 시작: 상태를 'loading'으로 전이하고 스피너 렌더링
  setProjectState('loading');

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);

    // 2. HTTP 에러 응답 분기 (403 Rate Limit, 404 등)
    if (!response.ok) {
      throw new Error(`GitHub API 통신 오류 (HTTP ${response.status})`);
    }

    const repos = await response.json();

    // 3. 빈 데이터(Empty) 분기
    if (repos.length === 0) {
      setProjectState('empty');
      return;
    }

    // 4. 통신 성공(Success) 분기
    setProjectState('success', repos);

  } catch (error) {
    // 5. 네트워크 단절 또는 예외 발생 시 에러 UI 및 재시도 버튼 렌더링
    console.error('GitHub API Fetch Error:', error);
    setProjectState('error', [], error.message);
  }
};
```

### 3) Array 메서드를 활용한 카드 UI 변환 단계
1. **순회 및 변환 (`map`)**: GitHub API로부터 수신한 레포지토리 객체 배열 `repos`를 순회.
2. **구조분해 할당 (Destructuring)**: `const { name, description, html_url, language, stargazers_count } = repo;` 로 필요한 속성 추출.
3. **HTML 템플릿 리터럴 생성**: 백틱(`` ` ``)을 활용하여 동적 데이터가 바인딩된 `<article class="project__card">` 문자열 생성.
4. **DOM 주입 (`join`)**: 생성된 문자열 배열을 `.join('')`으로 단일 HTML 문자열로 결합한 뒤, `projectsContainer.innerHTML`에 단 한 번만 주입하여 불필요한 브라우저 리플로우(Reflow)를 최소화.

### 4) Flexbox와 CSS Grid 적용 위치 및 선택 이유 비교

| 비교 항목 | Flexbox 적용 위치 | CSS Grid 적용 위치 |
| :--- | :--- | :--- |
| **적용 영역** | 모바일 상단 바, 좌측 사이드바 수직 메뉴, Hero 버튼 그룹 | Projects 카드 목록, Skills 기술 스택 그리드 |
| **차원 구조** | **1차원 레이아웃** (가로축 또는 세로축 단일 방향) | **2차원 레이아웃** (행과 열을 동시에 제어하는 바둑판 격자) |
| **선택 이유** | 로고는 좌측, 햄버거는 우측 끝으로 양 끝 정렬(`justify-content: space-between`)하거나, 사이드바 메뉴를 세로 단일 줄로 균등 정렬하기에 가장 직관적임. | 카드의 너비가 고정되지 않고 화면 크기에 따라 1열~3열로 유연하게 늘어나야 하므로 `repeat(auto-fit, minmax(280px, 1fr))`로 완벽한 자동 반응형 격자를 구성하기 위함. |

---

## 4. 심화 설계 질문 및 React 연결 아키텍처

### Q1. 상태(STATE) 객체를 따로 만들어 관리한 이유는 무엇이며, 그냥 개별 변수로 처리하면 안 되는가?
- **개별 변수(Ad-hoc Variables)의 문제점**:
  - `let theme = 'light'`, `let isLoading = false`, `let repos = []` 처럼 변수를 코드 곳곳에 흩뿌려 두면, 어떤 이벤트가 어떤 변수를 언제 바꿨는지 추적하기가 극도로 어렵습니다.
  - 데이터가 변경되었을 때 화면(DOM)을 함께 갱신해 주는 것을 깜빡하여 **데이터와 화면 간의 불일치 버그**가 필연적으로 발생합니다.
- **중앙 집중식 `state` 객체 도입의 이점**:
  - 애플리케이션의 모든 데이터를 하나의 객체(**Single Source of Truth, 단일 진실의 원천**)로 모아 현재 시스템의 상태를 한눈에 파악할 수 있습니다.
  - **"상태가 바뀌면 렌더링 함수를 실행한다"**는 단일 규칙을 강제함으로써, 버그를 원천 차단합니다.
  - 이 패턴이 바로 React의 핵심인 `useState`, `useReducer`, `Redux`의 근본 원리입니다.

### Q2. 반응형 디자인에서 "모바일 퍼스트(Mobile-First)"로 작성한 이유는 무엇인가?
1. **성능 및 렌더링 최적화**: 모바일 기기는 데스크톱에 비해 CPU 성능과 네트워크 대역폭이 제한적입니다. 기본 CSS 스타일을 가벼운 모바일용으로 먼저 파싱시키고, 고사양 데스크톱 환경에서 `@media (min-width: 992px)` 미디어 쿼리를 추가 적용하는 것이 모바일 사용자 체감 성능(LCP)에 유리합니다.
2. **CSS 오버라이드 복잡도 감소**: 데스크톱의 복잡한 3열 그리드나 고정 사이드바를 먼저 짜두고 모바일에서 해제(reset)하는 것보다, 기본 1열 흐름 레이아웃에서 화면이 커짐에 따라 2열, 3열, 고정 사이드바로 기능을 점진적으로 확장(Progressive Enhancement)해 나가는 것이 CSS 코드가 훨씬 간결해집니다.
3. **점유율 기반 설계**: 현대 웹 트래픽의 60% 이상이 모바일에서 발생하므로 모바일 사용자 경험을 기본 출발점으로 삼는 것이 현대 웹 표준입니다.

---

## 5. 주요 설정값 및 브레이크포인트 기준표

| 설정 항목 | 적용 수치 | 코드 위치 및 설정 근거 |
| :--- | :--- | :--- |
| **스크롤 탑 버튼 표시** | `300px` | `window.scrollY > 300`: 사용자가 한 화면 이상 스크롤했을 때만 플로팅 버튼 출현 |
| **ScrollSpy 감지 영역** | `rootMargin: '-20% 0px -60% 0px'` | 섹션이 화면의 상단 20% ~ 40% 부근에 도달했을 때 사이드바 메뉴 하이라이트 트리거 |
| **반응형 전환 기준점** | `992px` (태블릿 가로 / 데스크톱) | 992px 미만: 상단 60px 헤더 + 햄버거 메뉴<br>992px 이상: 좌측 280px 고정 사이드바 레이아웃 |

---

## 6. 🛠️ 기술 스택 (Tech Stack)

- **Markup & Structure**: HTML5 (Semantic Markup, W3C Standards)
- **Styling & Layout**: CSS3 (Custom Properties, Flexbox, Grid, Mobile-First Media Queries)
- **Programming Logic**: Vanilla JavaScript (ES6+, Async/Await, Intersection Observer, localStorage)
- **Deployment**: GitHub Pages
- **External Dependencies**: 없음 (순수 웹 표준 기술 100%)

---

&copy; 2026 권현석 (Kwon Hyeon Seok). All rights reserved.
