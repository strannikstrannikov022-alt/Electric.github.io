import { useEffect, useState } from 'react';

/* ===== Данные проектов (встроены, как в projects.json) ===== */
const projectsData = [
  {
    id: 1,
    title: 'Квартира в ЖК «Грозный-Сити»',
    type: 'Квартира',
    status: 'Завершён',
    description: 'Полная разводка электрики в трёхкомнатной квартире 120 м². Установка щита на 36 модулей, LED-освещение, тёплый пол.',
    photos: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=600&fit=crop',
    ],
    video: '',
  },
  {
    id: 2,
    title: 'Частный дом в пос. Гикало',
    type: 'Частный дом',
    status: 'Завершён',
    description: 'Электроснабжение двухэтажного дома 280 м². Трёхфазный ввод, стабилизатор, система «умный дом», наружное освещение участка.',
    photos: [
      'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop',
    ],
    video: 'https://www.youtube.com/watch?v=example',
  },
  {
    id: 3,
    title: 'Офис компании на пр. Путина',
    type: 'Коммерческий объект',
    status: 'Завершён',
    description: 'Электромонтаж офиса 200 м². Серверная комната, структурированная кабельная система, аварийное освещение, панели LED.',
    photos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    ],
    video: '',
  },
];

/* ===== Lightbox Component ===== */
function Lightbox({ photos, title, onClose }: { photos: string[]; title: string; onClose: () => void }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [photos.length, onClose]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column',
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', borderBottom: '1px solid #262626',
      }}>
        <span style={{ fontWeight: 600 }}>{title}</span>
        <span style={{ color: '#a3a3a3', fontSize: 14 }}>{idx + 1} / {photos.length}</span>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer',
        }}>✕</button>
      </div>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', padding: 20,
      }}>
        {photos.length > 1 && (
          <button onClick={() => setIdx((i) => (i - 1 + photos.length) % photos.length)} style={{
            position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
            fontSize: 24, width: 50, height: 50, borderRadius: '50%', cursor: 'pointer',
          }}>‹</button>
        )}
        <img src={photos[idx]} alt="" style={{
          maxWidth: '90%', maxHeight: '75vh', objectFit: 'contain', borderRadius: 8,
        }} />
        {photos.length > 1 && (
          <button onClick={() => setIdx((i) => (i + 1) % photos.length)} style={{
            position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
            fontSize: 24, width: 50, height: 50, borderRadius: '50%', cursor: 'pointer',
          }}>›</button>
        )}
      </div>
      <div style={{
        display: 'flex', gap: 8, padding: '16px 24px', justifyContent: 'center',
        borderTop: '1px solid #262626', overflowX: 'auto',
      }}>
        {photos.map((p, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{
            width: 64, height: 64, borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
            border: i === idx ? '2px solid #facc15' : '2px solid transparent',
            opacity: i === idx ? 1 : 0.5, flexShrink: 0,
            transition: '0.3s',
          }}>
            <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Main App ===== */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [gallery, setGallery] = useState<{ photos: string[]; title: string } | null>(null);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Inject Google Fonts
  useEffect(() => {
    if (!document.querySelector('link[href*="Inter"]')) {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  const css = `
    :root {
      --bg-dark: #0a0a0a;
      --bg-card: #141414;
      --yellow: #facc15;
      --yellow-dark: #eab308;
      --yellow-glow: rgba(250,204,21,0.15);
      --text: #f5f5f5;
      --text-muted: #a3a3a3;
      --text-dim: #737373;
      --border: #262626;
      --radius: 16px;
    }
    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', sans-serif; background: var(--bg-dark); color: var(--text); line-height:1.6; overflow-x:hidden; }
    a { text-decoration:none; color:inherit; }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulseGlow { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
    @keyframes bounceIn { 0%{opacity:0;transform:scale(.3)} 50%{transform:scale(1.05)} 100%{opacity:1;transform:scale(1)} }
    .container { max-width:1200px; margin:0 auto; padding:0 20px; }
  `;

  return (
    <>
      <style>{css}</style>

      {gallery && <Lightbox photos={gallery.photos} title={gallery.title} onClose={() => setGallery(null)} />}

      {/* HEADER */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #262626',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
          <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, background: '#facc15', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚡</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2 }}>TANK<span style={{ color: '#facc15' }}>IST</span></div>
          </a>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
            {['services', 'why', 'projects', 'contacts'].map((s) => (
              <a key={s} href={`#${s}`} onClick={(e) => { e.preventDefault(); scrollTo(s); }}
                style={{ fontSize: 14, fontWeight: 500, color: '#a3a3a3', cursor: 'pointer', transition: '0.3s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#facc15')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#a3a3a3')}>
                {s === 'services' ? 'Услуги' : s === 'why' ? 'Почему мы' : s === 'projects' ? 'Проекты' : 'Контакты'}
              </a>
            ))}
            <a href="tel:+79298871237" style={{ fontWeight: 600, fontSize: 15, color: '#facc15' }}>📞 +7 929 887-12-37</a>
          </nav>
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
            className="mobile-toggle">
            <span style={{ display: 'block', width: 24, height: 2, background: '#fff', margin: '6px 0', borderRadius: 2 }} />
            <span style={{ display: 'block', width: 24, height: 2, background: '#fff', margin: '6px 0', borderRadius: 2 }} />
            <span style={{ display: 'block', width: 24, height: 2, background: '#fff', margin: '6px 0', borderRadius: 2 }} />
          </button>
        </div>
      </header>

      <style>{`
        @media(max-width:768px) {
          .desktop-nav { display:none !important; }
          .mobile-toggle { display:block !important; }
        }
      `}</style>

      {menuOpen && (
        <nav style={{
          position: 'fixed', top: 73, left: 0, right: 0, bottom: 0,
          background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(20px)', zIndex: 999,
          padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: 24,
        }}>
          {[['services', '⚡ Услуги'], ['why', '💪 Почему мы'], ['projects', '📁 Проекты'], ['contacts', '📞 Контакты']].map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}
              style={{ fontSize: 20, fontWeight: 500, color: '#a3a3a3', padding: '12px 0', borderBottom: '1px solid #262626' }}>
              {label}
            </a>
          ))}
          <a href="tel:+79298871237" style={{ fontSize: 20, fontWeight: 600, color: '#facc15', padding: '12px 0' }}>📱 +7 929 887-12-37</a>
          <a href="https://wa.me/79298871237" style={{ fontSize: 20, fontWeight: 500, color: '#25d366', padding: '12px 0' }}>💬 WhatsApp</a>
        </nav>
      )}

      {/* HERO */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '120px 0 80px' }}>
        <div style={{
          position: 'absolute', top: '-50%', right: '-30%', width: 800, height: 800,
          background: 'radial-gradient(circle, rgba(250,204,21,0.15) 0%, transparent 70%)',
          animation: 'pulseGlow 4s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 800 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(250,204,21,0.15)', border: '1px solid rgba(250,204,21,0.3)',
              borderRadius: 100, padding: '8px 20px', fontSize: 14, fontWeight: 600, color: '#facc15',
              marginBottom: 32, animation: 'fadeInUp 0.6s ease',
            }}>⚡ Электрик по Грозному</div>
            <h1 style={{ fontSize: 'clamp(36px,7vw,72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 8, animation: 'fadeInUp 0.6s ease 0.1s both' }}>
              TANK<span style={{ color: '#facc15' }}>IST</span>
            </h1>
            <div style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 600, color: '#a3a3a3', marginBottom: 24, animation: 'fadeInUp 0.6s ease 0.2s both' }}>
              Профессиональная электрика под ключ
            </div>
            <p style={{ fontSize: 17, color: '#a3a3a3', maxWidth: 600, lineHeight: 1.7, marginBottom: 40, animation: 'fadeInUp 0.6s ease 0.3s both' }}>
              Электрика — это основа безопасности и комфорта. Мы выполняем профессиональный монтаж электросетей под ключ: от ввода питания до финальной установки розеток и освещения.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', animation: 'fadeInUp 0.6s ease 0.4s both' }}>
              <a href="tel:+79298871237" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 32px', borderRadius: 12,
                fontSize: 16, fontWeight: 600, background: '#facc15', color: '#000', transition: '0.3s',
              }}>📞 Позвонить</a>
              <a href="https://wa.me/79298871237" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 32px', borderRadius: 12,
                fontSize: 16, fontWeight: 600, background: '#25d366', color: '#fff', transition: '0.3s',
              }}>💬 WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: '100px 0', background: '#141414', borderTop: '1px solid #262626', borderBottom: '1px solid #262626' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#facc15', marginBottom: 16 }}>⚡ Услуги</div>
            <h2 style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>С кем мы работаем</h2>
            <p style={{ fontSize: 17, color: '#a3a3a3', maxWidth: 600, margin: '0 auto' }}>Каждый проект рассчитывается индивидуально с учётом нагрузки, современных стандартов и будущих потребностей клиента.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { icon: '🏗️', title: 'Новостройки', desc: 'Полная электрика с нуля: проект, разводка, щит, розетки, освещение. Всё по нормам ПУЭ.' },
              { icon: '🏠', title: 'Частные дома', desc: 'Электроснабжение коттеджей и домов: трёхфазный ввод, стабилизация, наружное освещение.' },
              { icon: '🏢', title: 'Офисы и коммерция', desc: 'Электромонтаж офисов, магазинов, ресторанов. Серверные, аварийное освещение, СКС.' },
              { icon: '🔧', title: 'Реконструкция', desc: 'Замена старой проводки, модернизация щитов, перенос точек. Аккуратно и без пыли.' },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#0a0a0a', border: '1px solid #262626', borderRadius: 16, padding: 32, textAlign: 'center', transition: '0.3s',
              }}>
                <span style={{ fontSize: 40, marginBottom: 20, display: 'block' }}>{item.icon}</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#a3a3a3', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why" style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#facc15', marginBottom: 16 }}>💪 Преимущества</div>
            <h2 style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>Почему выбирают нас</h2>
            <p style={{ fontSize: 17, color: '#a3a3a3', maxWidth: 600, margin: '0 auto' }}>Наша задача — чтобы электрика работала стабильно десятилетиями.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { icon: '📐', title: 'Индивидуальный расчёт', desc: 'Рассчитываем нагрузку под ваш объект: количество потребителей, сечение кабеля, номиналы автоматов.' },
              { icon: '📋', title: 'По стандартам', desc: 'Работаем строго по ПУЭ и современным нормативам. Проходим любую проверку.' },
              { icon: '🛡️', title: 'Гарантия качества', desc: 'Даём гарантию на все виды работ. Используем только сертифицированные материалы.' },
              { icon: '⏳', title: 'Надёжность на десятилетия', desc: 'Монтируем так, чтобы вы забыли о проблемах с электрикой на долгие годы.' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#141414', border: '1px solid #262626', borderRadius: 16, padding: 36, transition: '0.3s' }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: '#facc15', lineHeight: 1, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#a3a3a3', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding: '100px 0', background: '#141414', borderTop: '1px solid #262626', borderBottom: '1px solid #262626' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#facc15', marginBottom: 16 }}>📁 Портфолио</div>
            <h2 style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>Наши проекты</h2>
            <p style={{ fontSize: 17, color: '#a3a3a3', maxWidth: 600, margin: '0 auto' }}>Реальные объекты, которые мы сделали. Нажмите на проект, чтобы посмотреть фото.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28 }}>
            {projectsData.map((project) => (
              <div key={project.id} style={{ background: '#0a0a0a', border: '1px solid #262626', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: '0.3s' }}
                onClick={() => project.photos.length > 0 && setGallery({ photos: project.photos, title: project.title })}>
                <div style={{ width: '100%', height: 240, overflow: 'hidden', position: 'relative', background: '#0a0a0a' }}>
                  {project.photos.length > 0 ? (
                    <>
                      <img src={project.photos[0]} alt={project.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                      <div style={{
                        position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                        color: '#fff', fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 100,
                      }}>📷 {project.photos.length} фото</div>
                    </>
                  ) : (
                    <div style={{ fontSize: 64, opacity: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>🏗️</div>
                  )}
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1,
                      color: '#facc15', background: 'rgba(250,204,21,0.15)', padding: '4px 12px', borderRadius: 100,
                    }}>{project.type}</span>
                    <span style={{ fontSize: 12, color: '#737373' }}>{project.status}</span>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{project.title}</h3>
                  <p style={{ fontSize: 14, color: '#a3a3a3', lineHeight: 1.6, marginBottom: 16 }}>{project.description}</p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {project.photos.length > 0 && (
                      <button onClick={(e) => { e.stopPropagation(); setGallery({ photos: project.photos, title: project.title }); }} style={{
                        padding: '10px 20px', fontSize: 13, borderRadius: 10, background: '#facc15', color: '#000',
                        border: 'none', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                      }}>🖼 Галерея</button>
                    )}
                    {project.video && (
                      <a href={project.video} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{
                        padding: '10px 20px', fontSize: 13, borderRadius: 10, background: 'transparent', color: '#facc15',
                        border: '1px solid rgba(250,204,21,0.3)', fontWeight: 600, display: 'inline-flex', alignItems: 'center',
                      }}>▶ Видео</a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" style={{ padding: '100px 0', background: '#141414', borderTop: '1px solid #262626' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#facc15', marginBottom: 16 }}>📞 Связь</div>
            <h2 style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>Свяжитесь с нами</h2>
            <p style={{ fontSize: 17, color: '#a3a3a3', maxWidth: 600, margin: '0 auto' }}>Позвоните или напишите — обсудим ваш проект и рассчитаем стоимость.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 48, alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>Контактная информация</h3>
              {[
                { icon: '📞', label: 'Телефон', value: '+7 929 887-12-37', href: 'tel:+79298871237' },
                { icon: '💬', label: 'WhatsApp', value: 'Написать в WhatsApp', href: 'https://wa.me/79298871237' },
                { icon: '📍', label: 'Город', value: 'Грозный, Чеченская Республика' },
                { icon: '🕐', label: 'Режим работы', value: 'Пн–Сб: 08:00 — 20:00' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <div style={{
                    width: 52, height: 52, background: 'rgba(250,204,21,0.15)', border: '1px solid rgba(250,204,21,0.2)',
                    borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
                  }}>{item.icon}</div>
                  <div>
                    <strong style={{ display: 'block', fontSize: 14, color: '#a3a3a3', fontWeight: 500, marginBottom: 2 }}>{item.label}</strong>
                    {item.href ? (
                      <a href={item.href} style={{ color: '#facc15', fontSize: 18, fontWeight: 700 }}>{item.value}</a>
                    ) : (
                      <span style={{ fontSize: 18, fontWeight: 700 }}>{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#0a0a0a', border: '1px solid #262626', borderRadius: 16, padding: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Нужен электрик?</h3>
              <p style={{ color: '#a3a3a3', fontSize: 15, marginBottom: 16 }}>Оставьте заявку — перезвоним в течение 15 минут и обсудим ваш проект.</p>
              <a href="tel:+79298871237" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px 32px', borderRadius: 12,
                fontSize: 16, fontWeight: 600, background: '#facc15', color: '#000', width: '100%',
              }}>📞 Позвонить сейчас</a>
              <a href="https://wa.me/79298871237?text=Здравствуйте! Интересуют услуги электрика" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '16px 32px', borderRadius: 12,
                fontSize: 16, fontWeight: 600, background: '#25d366', color: '#fff', width: '100%',
              }}>💬 Написать в WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #262626', padding: '40px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontSize: 14, color: '#737373' }}>© 2025 <span style={{ color: '#facc15', fontWeight: 600 }}>TANKIST</span> — Электрик по Грозному</div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[['services', 'Услуги'], ['projects', 'Проекты'], ['contacts', 'Контакты']].map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}
                style={{ fontSize: 14, color: '#737373', transition: '0.3s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#facc15')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#737373')}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a href="https://wa.me/79298871237" target="_blank" rel="noopener noreferrer" style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 900, width: 60, height: 60,
        background: '#25d366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, color: '#fff', boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
        animation: 'bounceIn 0.6s ease 1s both',
      }}>💬</a>
    </>
  );
}
