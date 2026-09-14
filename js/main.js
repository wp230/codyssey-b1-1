/* ==========================================
   권현석 포트폴리오 메인 자바스크립트
   - 순수 JavaScript (ES6+) 작성
   - 좌측 사이드바 반응형 네비게이션 & ScrollSpy 적용
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
     1. 다크 모드 관리 (상태 관리 & localStorage)
     ========================================== */
  let currentTheme = localStorage.getItem('theme') || 'light';

  const renderTheme = (theme) => {
    if (theme === 'dark') {
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

  // 초기 테마 렌더링
  renderTheme(currentTheme);

  // 다크모드 버튼 클릭 이벤트 연결 (모바일/데스크톱 모두 작동)
  themeToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', currentTheme);
      renderTheme(currentTheme);
    });
  });

  /* ==========================================
     2. 햄버거 메뉴 토글 & 모바일 링크 클릭 시 닫기
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
     3. ScrollSpy & 스크롤 탑 버튼
     ========================================== */
  // 스크롤 탑 버튼 노출 제어 (기준값: 300px)
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

  // IntersectionObserver 기반 ScrollSpy (현재 보고 있는 섹션 하이라이트)
  const spyOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // 뷰포트 중간 영역에 진입할 때 트리거
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
     4. 비동기 GitHub API 연동 (4가지 UI 상태 처리)
     ========================================== */
  const GITHUB_USERNAME = 'wp230';

  const fetchGitHubProjects = async () => {
    // 1) 로딩 상태
    renderLoadingState();

    try {
      const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);

      if (!response.ok) {
        throw new Error(`GitHub API 오류 (응답 코드: ${response.status})`);
      }

      const repos = await response.json();

      // 2) 빈 데이터 상태
      if (repos.length === 0) {
        renderEmptyState();
        return;
      }

      // 3) 성공 상태
      renderSuccessState(repos);

    } catch (error) {
      // 4) 에러 상태
      console.error('GitHub API 연동 실패:', error);
      renderErrorState(error.message);
    }
  };

  function renderLoadingState() {
    projectsContainer.innerHTML = `
      <div class="status-box">
        <div class="spinner"></div>
        <p>GitHub 프로젝트를 불러오는 중입니다...</p>
      </div>
    `;
  }

  function renderSuccessState(repos) {
    const cardsHtml = repos.map((repo) => {
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
  }

  function renderErrorState(message) {
    projectsContainer.innerHTML = `
      <div class="status-box">
        <p style="color: #ef4444; margin-bottom: 1rem; font-weight: 600;">⚠️ 프로젝트를 불러올 수 없습니다.<br>(${message})</p>
        <button id="retry-btn" class="btn btn--outline">다시 시도</button>
      </div>
    `;

    document.getElementById('retry-btn')?.addEventListener('click', fetchGitHubProjects);
  }

  function renderEmptyState() {
    projectsContainer.innerHTML = `
      <div class="status-box">
        <p>표시할 공개 프로젝트가 없습니다.</p>
      </div>
    `;
  }

  // API 호출 실행
  fetchGitHubProjects();

  /* ==========================================
     5. Contact 폼 유효성 검사 (Form UX)
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

    // 이름 검증
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

    // 메시지 검증
    if (!messageInput.value.trim()) {
      messageError.textContent = '메시지를 입력해 주세요.';
      isValid = false;
    }

    // 통과 시 성공 UI 렌더링
    if (isValid) {
      formStatus.style.color = '#10b981';
      formStatus.textContent = '✅ 성공적으로 메시지가 전송되었습니다!';
      contactForm.reset();
    }
  });
});
