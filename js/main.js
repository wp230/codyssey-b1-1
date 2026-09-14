/* ==========================================
   권현석(Kwon Hyeon Seok) 포트폴리오 메인 스크립트
   - 순수 JavaScript (ES6+) 작성
   - 단일 진실의 원천(State) 기반 상태-렌더링 아키텍처
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM 요소 선택
  const sidebarNav = document.getElementById('sidebar-nav');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const scrollTopBtn = document.getElementById('scroll-top');
  const sidebarLinks = document.querySelectorAll('.sidebar__link');
  const sections = document.querySelectorAll('.section');
  const projectsContainer = document.getElementById('projects-container');
  const contactForm = document.getElementById('contact-form');

  /* ==========================================
     1. 애플리케이션 상태 객체 (State: Single Source of Truth)
     ========================================== */
  const state = {
    theme: localStorage.getItem('theme') || 'light',
    projects: {
      status: 'idle', // 'idle' | 'loading' | 'success' | 'error' | 'empty'
      data: [],
      errorMessage: ''
    }
  };

  /* ==========================================
     2. 테마 상태 관리 및 렌더링
     ========================================== */
  const renderTheme = () => {
    if (state.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggleBtns.forEach((btn) => {
        btn.textContent = '☀️';
        btn.setAttribute('aria-label', '라이트 모드로 전환');
        btn.title = '라이트 모드로 전환';
      });
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggleBtns.forEach((btn) => {
        btn.textContent = '🌙';
        btn.setAttribute('aria-label', '다크 모드로 전환');
        btn.title = '다크 모드로 전환';
      });
    }
  };

  const setTheme = (newTheme) => {
    state.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    renderTheme();
  };

  // 초기 테마 렌더링
  renderTheme();

  // 플로팅 테마 토글 버튼 클릭 이벤트
  themeToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      setTheme(nextTheme);
    });
  });

  /* ==========================================
     3. 햄버거 메뉴 토글 & 모바일 링크 클릭 시 닫기
     ========================================== */
  hamburgerBtn.addEventListener('click', () => {
    sidebarNav.classList.toggle('active');
  });

  sidebarLinks.forEach((link) => {
    link.addEventListener('click', () => {
      sidebarNav.classList.remove('active');
    });
  });

  /* ==========================================
     4. ScrollSpy & 스크롤 탑 버튼
     ========================================== */
  // 스크롤 300px 이상 시 스크롤탑 버튼 출현
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // IntersectionObserver 기반 ScrollSpy
  const spyOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        sidebarLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, spyOptions);

  sections.forEach((section) => spyObserver.observe(section));

  /* ==========================================
     5. 비동기 GitHub API 연동 (상태 기반 4가지 UI 분기)
     ========================================== */
  const GITHUB_USERNAME = 'wp230';

  // 프로젝트 상태 전이 및 렌더링 디스패치 함수
  const setProjectsState = (status, data = [], errorMessage = '') => {
    state.projects.status = status;
    state.projects.data = data;
    state.projects.errorMessage = errorMessage;
    renderProjects();
  };

  const renderProjects = () => {
    const { status, data, errorMessage } = state.projects;

    switch (status) {
      case 'loading':
        projectsContainer.innerHTML = `
          <div class="status-box">
            <div class="spinner"></div>
            <p>GitHub 프로젝트를 불러오는 중입니다...</p>
          </div>
        `;
        break;

      case 'success':
        const cardsHtml = data.map((repo) => {
          const { name, description, html_url, language, stargazers_count } = repo;
          return `
            <article class="project__card">
              <div>
                <h3 class="project__title">
                  <a href="${html_url}" target="_blank" rel="noopener noreferrer">${name}</a>
                </h3>
                <p class="project__desc">${description || '설명이 등록되어 있지 않습니다.'}</p>
              </div>
              <div class="project__meta">
                <span>💻 ${language || '기타'}</span>
                <span>⭐ ${stargazers_count}</span>
              </div>
            </article>
          `;
        }).join('');
        projectsContainer.innerHTML = cardsHtml;
        break;

      case 'error':
        projectsContainer.innerHTML = `
          <div class="status-box">
            <p style="color: #ef4444; margin-bottom: 1rem; font-weight: 600;">
              ⚠️ 프로젝트를 불러올 수 없습니다.<br>(${errorMessage})
            </p>
            <button id="retry-btn" class="btn btn--outline">다시 시도</button>
          </div>
        `;
        document.getElementById('retry-btn')?.addEventListener('click', fetchGitHubProjects);
        break;

      case 'empty':
        projectsContainer.innerHTML = `
          <div class="status-box">
            <p>표시할 공개 프로젝트가 없습니다.</p>
          </div>
        `;
        break;
    }
  };

  const fetchGitHubProjects = async () => {
    setProjectsState('loading');

    try {
      const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);

      if (!response.ok) {
        throw new Error(`API 통신 오류 (HTTP ${response.status})`);
      }

      const repos = await response.json();

      if (repos.length === 0) {
        setProjectsState('empty');
        return;
      }

      setProjectsState('success', repos);

    } catch (error) {
      console.error('GitHub API 연동 실패:', error);
      setProjectsState('error', [], error.message);
    }
  };

  // 초기 API 호출
  fetchGitHubProjects();

  /* ==========================================
     6. Contact 폼 유효성 검사 (Form UX)
     ========================================== */
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const messageInput = document.getElementById('user-message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formStatus = document.getElementById('form-status');

    // 에러 상태 초기화
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';
    formStatus.textContent = '';

    let isValid = true;

    // 이름 필수 검증
    if (!nameInput.value.trim()) {
      nameError.textContent = '이름을 입력해 주세요.';
      isValid = false;
    }

    // 이메일 정규식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      emailError.textContent = '이메일을 입력해 주세요.';
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      emailError.textContent = '올바른 이메일 형식을 입력해 주세요.';
      isValid = false;
    }

    // 메시지 필수 검증
    if (!messageInput.value.trim()) {
      messageError.textContent = '메시지를 입력해 주세요.';
      isValid = false;
    }

    // 모든 검증 통과 시 성공 UI 렌더링
    if (isValid) {
      formStatus.style.color = '#10b981';
      formStatus.textContent = '✅ 성공적으로 메시지가 전송되었습니다!';
      contactForm.reset();
    }
  });
});
