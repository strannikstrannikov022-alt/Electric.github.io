/* ===========================
   TANKIST — Электрик по Грозному
   Основной JavaScript
   =========================== */

// ===== Мобильное меню =====
function toggleMenu() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  nav.classList.toggle('active');
  burger.classList.toggle('active');
  document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
}

function closeMenu() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  nav.classList.remove('active');
  burger.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== Скролл шапки =====
window.addEventListener('scroll', function () {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== Анимации при скролле =====
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.service-card, .client-card, .why-card, .process-card, .contact-card, .project-card'
  );

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry, index) {
        if (entry.isIntersecting) {
          // Задержка для каскадного эффекта
          setTimeout(function () {
            entry.target.classList.add('animate');
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// При добавлении класса animate
const style = document.createElement('style');
style.textContent = `
  .service-card.animate, .client-card.animate, .why-card.animate,
  .process-card.animate, .contact-card.animate, .project-card.animate {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

// ===== Загрузка проектов из projects.json =====
let currentProject = null;
let currentSlide = 0;

async function loadProjects() {
  const grid = document.getElementById('projects-grid');

  try {
    const response = await fetch('projects.json');

    if (!response.ok) {
      throw new Error('Файл projects.json не найден');
    }

    const projects = await response.json();

    if (!projects || projects.length === 0) {
      grid.innerHTML = `
        <div class="projects-empty">
          <span>📂</span>
          <p>Проекты скоро появятся</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = '';

    projects.forEach(function (project) {
      const card = createProjectCard(project);
      grid.appendChild(card);
    });

    // Повторно инициализируем анимации для новых карточек
    initScrollAnimations();

  } catch (error) {
    console.warn('Не удалось загрузить проекты:', error.message);
    grid.innerHTML = `
      <div class="projects-empty">
        <span>📂</span>
        <p>Проекты загружаются...</p>
        <p style="font-size: 0.8rem; margin-top: 8px;">Убедитесь, что файл projects.json находится рядом с index.html</p>
      </div>
    `;
  }
}

// ===== Создание карточки проекта =====
function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'project-card';

  // Обложка
  let coverHTML = '';
  if (project.photos && project.photos.length > 0) {
    coverHTML = `
      <div class="project-cover" onclick='openGallery(${JSON.stringify(project.photos).replace(/'/g, "&#39;")}, "${escapeHTML(project.title)}")'>
        <img src="${project.photos[0]}" alt="${escapeHTML(project.title)}" 
             onerror="this.parentElement.innerHTML='<div class=\\'project-cover-placeholder\\'>⚡</div>'">
        <div class="project-photo-count">📷 ${project.photos.length} фото</div>
      </div>
    `;
  } else {
    coverHTML = `
      <div class="project-cover">
        <div class="project-cover-placeholder">⚡</div>
      </div>
    `;
  }

  // Кнопки
  let actionsHTML = '';
  const actions = [];

  if (project.photos && project.photos.length > 0) {
    actions.push(
      `<button class="project-btn photos" onclick='openGallery(${JSON.stringify(project.photos).replace(/'/g, "&#39;")}, "${escapeHTML(project.title)}")'>📷 Фото (${project.photos.length})</button>`
    );
  }

  if (project.video) {
    actions.push(
      `<a href="${project.video}" target="_blank" class="project-btn video">▶ Смотреть видео</a>`
    );
  }

  if (actions.length > 0) {
    actionsHTML = `<div class="project-actions">${actions.join('')}</div>`;
  }

  card.innerHTML = `
    ${coverHTML}
    <div class="project-body">
      <div class="project-meta">
        ${project.type ? `<span class="project-tag type">${escapeHTML(project.type)}</span>` : ''}
        ${project.status ? `<span class="project-tag status">${escapeHTML(project.status)}</span>` : ''}
      </div>
      <h3>${escapeHTML(project.title)}</h3>
      <p>${escapeHTML(project.description)}</p>
      ${actionsHTML}
    </div>
  `;

  return card;
}

// ===== Экранирование HTML =====
function escapeHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== Галерея (Lightbox) =====
function openGallery(photos, title) {
  if (!photos || photos.length === 0) return;

  currentProject = { photos: photos, title: title };
  currentSlide = 0;
  showSlide();

  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  currentProject = null;
}

function showSlide() {
  if (!currentProject) return;

  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const counter = document.getElementById('lightbox-counter');

  img.src = currentProject.photos[currentSlide];
  img.alt = currentProject.title;
  caption.textContent = currentProject.title;
  counter.textContent = (currentSlide + 1) + ' / ' + currentProject.photos.length;
}

function nextSlide() {
  if (!currentProject) return;
  currentSlide = (currentSlide + 1) % currentProject.photos.length;
  showSlide();
}

function prevSlide() {
  if (!currentProject) return;
  currentSlide = (currentSlide - 1 + currentProject.photos.length) % currentProject.photos.length;
  showSlide();
}

// Закрытие по клавишам
document.addEventListener('keydown', function (e) {
  if (!currentProject) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

// Закрытие по клику на фон
document.getElementById('lightbox').addEventListener('click', function (e) {
  if (e.target === this || e.target.classList.contains('lightbox-content')) {
    closeLightbox();
  }
});

// Свайп на мобильном
let touchStartX = 0;
let touchEndX = 0;

document.getElementById('lightbox').addEventListener('touchstart', function (e) {
  touchStartX = e.changedTouches[0].screenX;
}, false);

document.getElementById('lightbox').addEventListener('touchend', function (e) {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextSlide();
    else prevSlide();
  }
}, false);

// ===== Инициализация =====
document.addEventListener('DOMContentLoaded', function () {
  loadProjects();
  initScrollAnimations();
});
