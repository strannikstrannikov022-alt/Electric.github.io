/* ===== TANKIST — app.js ===== */
/* Чистый JavaScript, без фреймворков */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollReveal();
  initSmoothScroll();
  loadProjects();
});

/* ===== Мобильное меню ===== */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  // Закрыть меню при клике на ссылку
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ===== Плавная прокрутка ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ===== Анимации при скролле ===== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ===== Загрузка проектов из projects.json ===== */
async function loadProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  try {
    const response = await fetch('./projects.json');
    if (!response.ok) throw new Error('Файл не найден');
    const projects = await response.json();

    if (projects.length === 0) {
      container.innerHTML = `
        <div class="projects-empty">
          <div class="empty-icon">📁</div>
          <p>Проекты скоро появятся</p>
        </div>`;
      return;
    }

    container.innerHTML = '';
    projects.forEach(project => {
      container.appendChild(createProjectCard(project));
    });

  } catch (error) {
    console.warn('Не удалось загрузить projects.json:', error);
    container.innerHTML = `
      <div class="projects-empty">
        <div class="empty-icon">⚠️</div>
        <p>Не удалось загрузить проекты</p>
      </div>`;
  }
}

/* ===== Создание карточки проекта ===== */
function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'project-card reveal';
  card.style.opacity = '1';
  card.style.transform = 'none';

  const hasPhotos = project.photos && project.photos.length > 0;
  const thumbHTML = hasPhotos
    ? `<img src="${project.photos[0]}" alt="${project.title}" loading="lazy">
       <div class="project-photo-count">📷 ${project.photos.length} фото</div>`
    : `<div class="project-thumb-placeholder">🏗️</div>`;

  const videoBtn = project.video
    ? `<a href="${project.video}" target="_blank" rel="noopener" class="btn btn-sm btn-outline">▶ Видео</a>`
    : '';

  card.innerHTML = `
    <div class="project-thumb">${thumbHTML}</div>
    <div class="project-info">
      <div class="project-meta">
        <span class="project-type">${project.type}</span>
        <span class="project-status">${project.status}</span>
      </div>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="project-actions">
        ${hasPhotos ? `<button class="btn btn-sm btn-primary" onclick="openGallery(${project.id})">🖼 Галерея</button>` : ''}
        ${videoBtn}
      </div>
    </div>`;

  // Клик по карточке открывает галерею
  if (hasPhotos) {
    card.querySelector('.project-thumb').addEventListener('click', () => {
      openGallery(project.id);
    });
  }

  // Сохраняем данные для галереи
  card.dataset.projectId = project.id;
  if (!window.__projects) window.__projects = {};
  window.__projects[project.id] = project;

  return card;
}

/* ===== Галерея / Lightbox ===== */
let currentGallery = [];
let currentIndex = 0;

function openGallery(projectId) {
  const project = window.__projects[projectId];
  if (!project || !project.photos || project.photos.length === 0) return;

  currentGallery = project.photos;
  currentIndex = 0;

  // Создаём lightbox, если его нет
  let lightbox = document.getElementById('lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    document.body.appendChild(lightbox);
  }

  renderLightbox(project.title);
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderLightbox(title) {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const thumbsHTML = currentGallery.map((photo, i) => `
    <div class="lightbox-thumb ${i === currentIndex ? 'active' : ''}" onclick="goToSlide(${i})">
      <img src="${photo}" alt="Фото ${i + 1}" loading="lazy">
    </div>
  `).join('');

  lightbox.innerHTML = `
    <div class="lightbox-header">
      <span class="lightbox-title">${title || 'Галерея'}</span>
      <span class="lightbox-counter">${currentIndex + 1} / ${currentGallery.length}</span>
      <button class="lightbox-close" onclick="closeLightbox()">✕</button>
    </div>
    <div class="lightbox-body">
      ${currentGallery.length > 1 ? `<button class="lightbox-prev" onclick="prevSlide()">‹</button>` : ''}
      <img src="${currentGallery[currentIndex]}" alt="Фото проекта">
      ${currentGallery.length > 1 ? `<button class="lightbox-next" onclick="nextSlide()">›</button>` : ''}
    </div>
    <div class="lightbox-thumbs">${thumbsHTML}</div>`;

  // Свайпы на мобильных
  const body = lightbox.querySelector('.lightbox-body');
  let touchStartX = 0;
  let touchEndX = 0;

  body.ontouchstart = (e) => { touchStartX = e.changedTouches[0].screenX; };
  body.ontouchend = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % currentGallery.length;
  renderLightbox(document.querySelector('.lightbox-title')?.textContent);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  renderLightbox(document.querySelector('.lightbox-title')?.textContent);
}

function goToSlide(index) {
  currentIndex = index;
  renderLightbox(document.querySelector('.lightbox-title')?.textContent);
}

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});
