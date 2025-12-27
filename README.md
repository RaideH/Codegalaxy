# CodeGalaxy

Overview
--------
CodeGalaxy is a small educational website for learning HTML, CSS and JavaScript. It provides tutorial pages, demo effects, and an interactive code editor for live testing in the browser.

Key Features
------------
- Tutorial pages with examples for HTML/CSS/JS
- Interactive code editor for instant experimentation
- Demo effects and styles (animations, starfield, etc.)

Project Structure
-----------------
- `index.html` — Main landing page
- `codegalaxypagetwo.html` — Additional project page
- `learnhtml.html` — HTML tutorial page
- `Interactive Code Editor.html` — In-browser code editor
- `404.html` — Custom 404 page
- CSS files: `codegalaxy.css`, `codegalaxypagetwo.css`, `learnhtml.css`, `header.css`, `stars.css`
- JS files: `codegalaxy.js`, `codegalaxypagetwo.js`, `learnhtml.js`, `Interactive Code Editor.js`, `404.js`, `stars.js`
- `vercel.json` — Vercel deployment configuration

Running Locally
---------------
The easiest way is to open `index.html` directly in your browser.

For features that require an HTTP server (fetch requests, module imports), start a simple local server:

```bash
# Python 3
python -m http.server 8000

# or, if you have the serve package installed
serve . -l 5000
```

Then open:

```
http://localhost:8000
# or
http://localhost:5000
```

Deployment
----------
This project can be deployed to Vercel (see `vercel.json`). Typical workflow:

1. Initialize a git repository and push to GitHub.
2. Connect the repository to Vercel and deploy.

Contributing
------------
Fork or clone the repo, create a feature branch, make changes, and open a pull request.

License
-------
Add a `LICENSE` file if you want to specify licensing (for example, MIT).

Author
------
Henri

If you'd like, I can also translate this README back to Russian, add a `LICENSE`, or expand developer instructions.

Русский
-------
Ниже приведена русская версия README с тем же содержанием.

Обзор
--------
CodeGalaxy — небольшой образовательный веб-сайт для изучения HTML, CSS и JavaScript. Проект содержит учебные страницы, демонстрационные эффекты и интерактивный редактор для живого тестирования в браузере.

Ключевые возможности
------------
- Учебные страницы с примерами для HTML/CSS/JS
- Интерактивный редактор кода для моментального экспериментирования
- Демонстрационные эффекты и стили (анимации, звёздное небо и т.п.)

Структура проекта
-----------------
- `index.html` — главная страница
- `codegalaxypagetwo.html` — дополнительная страница проекта
- `learnhtml.html` — учебная страница по HTML
- `Interactive Code Editor.html` — редактор кода в браузере
- `404.html` — кастомная страница 404
- CSS файлы: `codegalaxy.css`, `codegalaxypagetwo.css`, `learnhtml.css`, `header.css`, `stars.css`
- JS файлы: `codegalaxy.js`, `codegalaxypagetwo.js`, `learnhtml.js`, `Interactive Code Editor.js`, `404.js`, `stars.js`
- `vercel.json` — конфигурация для деплоя на Vercel

Локальный запуск
---------------
Проще всего открыть `index.html` напрямую в браузере.

Если нужны возможности, зависящие от HTTP-сервера (fetch-запросы, импорты модулей), запустите простой локальный сервер:

```bash
# Python 3
python -m http.server 8000

# или, если установлен пакет serve
serve . -l 5000
```

Откройте в браузере:

```
http://localhost:8000
# или
http://localhost:5000
```

Деплой
----------
Проект можно задеплоить на Vercel (см. `vercel.json`). Типичный рабочий процесс:

1. Инициализируйте git-репозиторий и запушьте код в GitHub.
2. Подключите репозиторий к Vercel и выполните деплой.

Контрибьюция
------------
Форкните или клонируйте репозиторий, создайте ветку для фичи, внесите изменения и откройте pull request.


