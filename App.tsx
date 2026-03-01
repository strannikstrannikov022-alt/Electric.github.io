import { useState, useEffect, useRef } from 'react';

// Types
interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  images: string[];
  date: string;
}

const categoryLabels: Record<string, string> = {
  apartment: '🏢 Квартира',
  house: '🏠 Частный дом',
  office: '🏬 Офис / Коммерция',
  other: '🔧 Другое',
};

const categoryColors: Record<string, string> = {
  apartment: 'bg-blue-500/10 text-blue-400',
  house: 'bg-green-500/10 text-green-400',
  office: 'bg-purple-500/10 text-purple-400',
  other: 'bg-gray-500/10 text-gray-400',
};

const STORAGE_KEY = 'tankist_projects';

function loadProjects(): Project[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return [
    { id: 1, title: 'Квартира в Грозный-Сити', description: 'Полная разводка электрики в 3-комнатной квартире. 42 точки, щит на 36 модулей.', category: 'apartment', status: 'done', images: [], date: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 2, title: 'Частный дом 180 м²', description: 'Электроснабжение двухэтажного дома: ввод 15кВт, трёхфазный щит, 86 точек.', category: 'house', status: 'done', images: [], date: new Date(Date.now() - 86400000 * 12).toISOString() },
    { id: 3, title: 'Ресторан на пр. Путина', description: 'Коммерческая электрика: силовые линии для кухни, декоративное освещение зала.', category: 'office', status: 'progress', images: [], date: new Date(Date.now() - 86400000 * 2).toISOString() },
  ];
}

function saveProjects(projects: Project[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); } catch {}
}

export default function App() {
  const [tab, setTab] = useState<'projects' | 'services' | 'contact'>('projects');
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [showAdd, setShowAdd] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  // Form state
  const [form, setForm] = useState({ title: '', description: '', category: 'apartment', status: 'done' });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { saveProjects(projects); }, [projects]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.slice(0, 6 - uploadedImages.length).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > 800) { h = h * 800 / w; w = 800; }
          if (h > 800) { w = w * 800 / h; h = 800; }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
          setUploadedImages(prev => [...prev, canvas.toDataURL('image/jpeg', 0.7)]);
        };
        img.src = ev.target!.result as string;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const addProject = () => {
    if (!form.title.trim()) return;
    const p: Project = { id: Date.now(), ...form, images: uploadedImages, date: new Date().toISOString() };
    setProjects([p, ...projects]);
    setShowAdd(false);
    setForm({ title: '', description: '', category: 'apartment', status: 'done' });
    setUploadedImages([]);
  };

  const updateProject = () => {
    if (editIdx === null) return;
    const updated = [...projects];
    updated[editIdx] = { ...updated[editIdx], ...form };
    setProjects(updated);
    setEditIdx(null);
  };

  const deleteProject = (idx: number) => {
    setProjects(projects.filter((_, i) => i !== idx));
    setEditIdx(null);
  };

  const openEdit = (idx: number) => {
    const p = projects[idx];
    setForm({ title: p.title, description: p.description, category: p.category, status: p.status });
    setEditIdx(idx);
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-[#252530]">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center"><span className="text-[#0a0a0f] font-bold text-sm">⚡</span></div>
            <span className="font-bold text-lg">TANKIST</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="tel:+79298871237" className="w-9 h-9 bg-[#1a1a25] rounded-full flex items-center justify-center text-yellow-400 text-sm">📞</a>
            <a href="https://wa.me/79298871237" target="_blank" className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">💬</a>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto pt-16 pb-20 px-4">
        {/* Profile */}
        <section className="py-6 border-b border-[#1a1a25]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl">⚡</div>
            <div>
              <h1 className="text-xl font-bold">TANKIST</h1>
              <p className="text-sm text-gray-400">Электромонтажные работы • Грозный</p>
              <p className="text-yellow-400 text-xs mt-1">★★★★★ 5.0</p>
            </div>
          </div>
          <p className="text-sm text-gray-300 mt-4 leading-relaxed">Профессиональный монтаж электросетей под ключ: от ввода питания до финальной установки розеток и освещения.</p>
        </section>

        {/* Stats */}
        <section className="py-4 border-b border-[#1a1a25]">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-[#12121a] rounded-xl py-3"><div className="text-yellow-400 font-bold text-lg">{projects.length}</div><div className="text-[10px] text-gray-500">Проектов</div></div>
            <div className="bg-[#12121a] rounded-xl py-3"><div className="text-yellow-400 font-bold text-lg">10+</div><div className="text-[10px] text-gray-500">Лет опыта</div></div>
            <div className="bg-[#12121a] rounded-xl py-3"><div className="text-yellow-400 font-bold text-lg">300+</div><div className="text-[10px] text-gray-500">Объектов</div></div>
            <div className="bg-[#12121a] rounded-xl py-3"><div className="text-yellow-400 font-bold text-lg">100%</div><div className="text-[10px] text-gray-500">По нормам</div></div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-2 pt-4 pb-2 sticky top-[57px] bg-[#0a0a0f] z-40">
          {(['projects', 'services', 'contact'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'bg-yellow-400 text-[#0a0a0f]' : 'bg-[#1a1a25] text-gray-400'}`}>
              {t === 'projects' ? '📷 Проекты' : t === 'services' ? '🔧 Услуги' : '📞 Контакты'}
            </button>
          ))}
        </div>

        {/* Projects Tab */}
        {tab === 'projects' && (
          <section className="py-4">
            <button onClick={() => { setForm({ title: '', description: '', category: 'apartment', status: 'done' }); setUploadedImages([]); setShowAdd(true); }} className="w-full py-3 border-2 border-dashed border-[#252530] rounded-2xl text-gray-400 hover:border-yellow-400 hover:text-yellow-400 transition-all mb-4 text-sm font-medium">
              ➕ Добавить проект
            </button>
            {projects.length === 0 ? (
              <div className="text-center py-16"><div className="text-5xl mb-4">📷</div><h3 className="text-lg font-semibold text-gray-400 mb-2">Пока нет проектов</h3><p className="text-sm text-gray-600">Добавьте свой первый проект</p></div>
            ) : (
              <div className="space-y-4">
                {projects.map((p, i) => (
                  <div key={p.id} className="bg-[#12121a] border border-[#252530] rounded-2xl overflow-hidden">
                    {p.images.length > 0 && (
                      <div className={`grid gap-0.5 ${p.images.length === 1 ? '' : 'grid-cols-2'}`}>
                        {p.images.slice(0, 4).map((img, idx) => (
                          <img key={idx} src={img} alt="" className="w-full h-40 object-cover cursor-pointer" onClick={() => setLightbox({ images: p.images, index: idx })} />
                        ))}
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-sm">{p.title}</h3>
                        <button onClick={() => openEdit(i)} className="w-7 h-7 bg-[#1a1a25] rounded-full flex items-center justify-center text-gray-500 hover:text-yellow-400 ml-2 text-xs">✏️</button>
                      </div>
                      {p.description && <p className="text-xs text-gray-400 mb-3">{p.description}</p>}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1.5 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${categoryColors[p.category]}`}>{categoryLabels[p.category]}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${p.status === 'done' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                            {p.status === 'done' ? '✅ Завершён' : '🔨 В работе'}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-600">{fmtDate(p.date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Services Tab */}
        {tab === 'services' && (
          <section className="py-4 space-y-3">
            {[
              ['⚡', 'Полная разводка электрики', 'Проектирование и монтаж электропроводки с нуля'],
              ['💡', 'Монтаж освещения', 'Люстры, точечные светильники, LED-подсветка'],
              ['🔌', 'Розетки и выключатели', 'Установка, перенос, USB-розетки, диммеры'],
              ['🖥️', 'Сборка электрощитов', 'Щиты с автоматами, УЗО, реле напряжения'],
              ['🏢', 'Коммерческие объекты', 'Офисы, магазины, рестораны'],
              ['🏠', 'Умный дом', 'Автоматизация света, штор, климата'],
              ['🔍', 'Диагностика и ремонт', 'Поиск неисправностей, замена проводки'],
            ].map(([icon, title, desc], i) => (
              <div key={i} className="bg-[#12121a] border border-[#252530] rounded-2xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">{icon}</div>
                <div><h3 className="font-semibold text-sm">{title}</h3><p className="text-xs text-gray-400 mt-1">{desc}</p></div>
              </div>
            ))}
          </section>
        )}

        {/* Contact Tab */}
        {tab === 'contact' && (
          <section className="py-4 space-y-3">
            <a href="tel:+79298871237" className="block bg-[#12121a] border border-[#252530] rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center text-lg">📞</div>
                <div><p className="text-xs text-gray-400">Позвонить</p><p className="font-bold text-lg">+7 929 887-12-37</p></div>
              </div>
            </a>
            <a href="https://wa.me/79298871237" target="_blank" className="block bg-[#12121a] border border-[#252530] rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-lg">💬</div>
                <div><p className="text-xs text-gray-400">WhatsApp</p><p className="font-semibold">Быстрый ответ</p></div>
              </div>
            </a>
            <a href="https://t.me/+79298871237" target="_blank" className="block bg-[#12121a] border border-[#252530] rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-lg">✈️</div>
                <div><p className="text-xs text-gray-400">Telegram</p><p className="font-semibold">Написать</p></div>
              </div>
            </a>
            <div className="bg-[#12121a] border border-[#252530] rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-lg">📍</div>
                <div><p className="text-xs text-gray-400">Расположение</p><p className="font-semibold">г. Грозный</p><p className="text-xs text-gray-500">Выезд по всей ЧР</p></div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-[#12121a] border border-[#252530] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-[#252530] flex justify-between items-center">
              <h2 className="font-bold text-lg">Новый проект</h2>
              <button onClick={() => setShowAdd(false)} className="w-8 h-8 bg-[#1a1a25] rounded-full flex items-center justify-center text-gray-400">✕</button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Фотографии</label>
                <button onClick={() => fileRef.current?.click()} className="w-full h-32 border-2 border-dashed border-[#252530] rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-yellow-400 transition-all">
                  📷<span className="text-xs mt-1">Нажмите для загрузки</span>
                </button>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {uploadedImages.map((img, i) => (
                      <div key={i} className="relative h-20 rounded-lg overflow-hidden">
                        <img src={img} className="w-full h-full object-cover" />
                        <button onClick={() => setUploadedImages(uploadedImages.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Название проекта" className="w-full bg-[#1a1a25] border border-[#252530] rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400" />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Описание работ" rows={3} className="w-full bg-[#1a1a25] border border-[#252530] rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400 resize-none" />
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-[#1a1a25] border border-[#252530] rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400">
                <option value="apartment">🏢 Квартира</option>
                <option value="house">🏠 Частный дом</option>
                <option value="office">🏬 Офис / Коммерция</option>
                <option value="other">🔧 Другое</option>
              </select>
              <div className="flex gap-2">
                {['done', 'progress'].map(s => (
                  <label key={s} className="flex-1 cursor-pointer">
                    <input type="radio" name="status" value={s} checked={form.status === s} onChange={() => setForm({ ...form, status: s })} className="hidden peer" />
                    <div className={`peer-checked:ring-2 ring-yellow-400 rounded-xl py-2.5 text-center text-sm transition-all ${form.status === s ? 'bg-yellow-400/20 text-yellow-400' : 'bg-[#1a1a25] text-gray-400'}`}>
                      {s === 'done' ? '✅ Завершён' : '🔨 В работе'}
                    </div>
                  </label>
                ))}
              </div>
              <button onClick={addProject} className="w-full bg-yellow-400 text-[#0a0a0f] font-bold py-3 rounded-xl text-sm">✅ Сохранить проект</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editIdx !== null && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditIdx(null)}>
          <div className="bg-[#12121a] border border-[#252530] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-[#252530] flex justify-between items-center">
              <h2 className="font-bold text-lg">Редактировать</h2>
              <button onClick={() => setEditIdx(null)} className="w-8 h-8 bg-[#1a1a25] rounded-full flex items-center justify-center text-gray-400">✕</button>
            </div>
            <div className="p-4 space-y-4">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-[#1a1a25] border border-[#252530] rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400" />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-[#1a1a25] border border-[#252530] rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400 resize-none" />
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-[#1a1a25] border border-[#252530] rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400">
                <option value="apartment">🏢 Квартира</option>
                <option value="house">🏠 Частный дом</option>
                <option value="office">🏬 Офис / Коммерция</option>
                <option value="other">🔧 Другое</option>
              </select>
              <div className="flex gap-2">
                {['done', 'progress'].map(s => (
                  <label key={s} className="flex-1 cursor-pointer">
                    <input type="radio" name="editStatus" value={s} checked={form.status === s} onChange={() => setForm({ ...form, status: s })} className="hidden peer" />
                    <div className={`peer-checked:ring-2 ring-yellow-400 rounded-xl py-2.5 text-center text-sm transition-all ${form.status === s ? 'bg-yellow-400/20 text-yellow-400' : 'bg-[#1a1a25] text-gray-400'}`}>
                      {s === 'done' ? '✅ Завершён' : '🔨 В работе'}
                    </div>
                  </label>
                ))}
              </div>
              <button onClick={updateProject} className="w-full bg-yellow-400 text-[#0a0a0f] font-bold py-3 rounded-xl text-sm">💾 Сохранить</button>
              <button onClick={() => deleteProject(editIdx)} className="w-full bg-red-500/10 text-red-400 border border-red-500/20 py-2.5 rounded-xl text-sm font-semibold">🗑️ Удалить проект</button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 bg-[#12121a]/80 rounded-full text-white z-10">✕</button>
          {lightbox.images.length > 1 && (
            <>
              <button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#12121a]/80 rounded-full text-white z-10" onClick={e => { e.stopPropagation(); setLightbox({ ...lightbox, index: (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length }); }}>◀</button>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#12121a]/80 rounded-full text-white z-10" onClick={e => { e.stopPropagation(); setLightbox({ ...lightbox, index: (lightbox.index + 1) % lightbox.images.length }); }}>▶</button>
            </>
          )}
          <img src={lightbox.images[lightbox.index]} className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
          <div className="absolute bottom-4 bg-[#12121a]/80 px-3 py-1 rounded-full text-xs text-gray-300">{lightbox.index + 1} / {lightbox.images.length}</div>
        </div>
      )}
    </div>
  );
}
