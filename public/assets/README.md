# ⚡ TANKIST — Электрик по Грозному

Профессиональные электромонтажные работы под ключ.

## 📁 Структура файлов

```
/index.html          ← Главная страница
/assets/style.css    ← Стили
/assets/app.js       ← JavaScript
/projects.json       ← Данные проектов (редактируй этот файл!)
/projects/           ← Папка для фото проектов
/README.md           ← Этот файл
```

## 🚀 Как загрузить на GitHub Pages

### Вариант 1: Через браузер
1. Зайди на [github.com](https://github.com) → **New repository**
2. Назови репозиторий, например: `tankist`
3. Нажми **"uploading an existing file"**
4. Перетащи ВСЕ файлы (index.html, assets/, projects.json)
5. Нажми **Commit changes**
6. Перейди в **Settings → Pages**
7. Source: **Deploy from a branch**
8. Branch: **main**, папка: **/ (root)**
9. Нажми **Save**
10. Через 1-2 минуты сайт будет доступен по адресу:
    `https://ТВОЙ_ЛОГИН.github.io/tankist/`

### Вариант 2: Через Git (если установлен)
```bash
git init
git add .
git commit -m "TANKIST - электрик по Грозному"
git branch -M main
git remote add origin https://github.com/ТВОЙ_ЛОГИН/tankist.git
git push -u origin main
```
Затем включи GitHub Pages в настройках репозитория.

## 📷 Как добавить свои проекты

### 1. Загрузи фото
Положи фото в папку `projects/`. Например:
```
projects/kvartira1.jpg
projects/kvartira2.jpg
projects/dom1.jpg
```

### 2. Отредактируй projects.json
Открой файл `projects.json` и добавь новый проект:

```json
{
  "id": 4,
  "title": "Название проекта",
  "type": "Квартира",
  "status": "Завершён",
  "description": "Описание выполненных работ",
  "photos": [
    "projects/kvartira1.jpg",
    "projects/kvartira2.jpg"
  ],
  "video": ""
}
```

### Поля:
| Поле          | Описание                                      |
|---------------|-----------------------------------------------|
| `id`          | Уникальный номер (1, 2, 3...)                 |
| `title`       | Название проекта                              |
| `type`        | Тип: Квартира / Частный дом / Коммерция       |
| `status`      | Статус: Завершён / В работе                   |
| `description` | Краткое описание работ                        |
| `photos`      | Массив путей к фото                           |
| `video`       | Ссылка на видео (YouTube и т.д.) или пусто "" |

### 3. Закоммить изменения
Загрузи обновлённые файлы на GitHub — сайт обновится автоматически.

## 📞 Контакты
- Телефон: +7 929 887-12-37
- WhatsApp: [Написать](https://wa.me/79298871237)
