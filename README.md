# Царство трафика — сайт Марины Поповой

Живой адрес: https://tsarstvo-trafika.ru

Одностраничник услуг (Яндекс Директ, Telegram, VK, Авито) + политика `/privacy/` + выдача гайда после заявки.

## Если папка на компьютере пропала

Код лежит в двух местах. Тяни любой, оба должны совпадать.

1. Публичный репозиторий (отсюда деплоится сайт):  
   https://github.com/Povic1705/tsarstvo-trafika
2. Приватная копия в Cursor:  
   `https://origin.cursor.com/mikle-povolocky/site-osipova.git`

```bash
git clone https://github.com/Povic1705/tsarstvo-trafika.git site_osipova
cd site_osipova
git remote add origin https://origin.cursor.com/mikle-povolocky/site-osipova.git
```

`origin` — это Cursor, его **не переименовывать и не подменять** на GitHub. GitHub здесь remote с именем `github`.

Пушить всегда в оба:

```bash
git push origin main
git push github main
```

Хостинг — **GitHub Pages**, не VPS и не «Домен плюс» на Reg.ru.

## Что менять, чтобы включить сайт

Всё управление в одном файле: `config.js`.

```js
siteOn: true,                    // false = заглушка без формы и Метрики
guideUrl: "https://....pdf",     // ссылка на гайд; можно оставить ""
```

Потом закоммитить и запушить в `main`. Actions сам выложит сайт.

- `siteOn: false` — на домене только «сайт временно недоступен». Лендинг, форма и `/thanks/` на сервер не попадают.
- `siteOn: true` — снова лендинг. Заявка уходит на почту, затем страница «спасибо».
- Если `guideUrl` пустой, после заявки будет текст «файл ещё оформляется».
- Если вписать ссылку (PDF на сайте, Яндекс.Диск и т.п.) — появится кнопка «Скачать гайд».

Контакты, почта формы и ID Метрики тоже в `config.js`.

## Как устроены файлы

| Файл | Зачем |
|---|---|
| `config.js` | Вкл/выкл сайта, ссылка на гайд, контакты |
| `index.html` | Заглушка, пока `siteOn: false` |
| `home.html` | Полный лендинг |
| `thanks/index.html` | Страница после заявки, скачивание гайда |
| `privacy/index.html` | Политика конфиденциальности |
| `script.js` | Форма (Formsubmit) и выдача гайда |
| `styles.css` | Стили |
| `CNAME` | Домен `tsarstvo-trafika.ru` |
| `.github/workflows/pages.yml` | Деплой на GitHub Pages |

После правок CSS/JS поднимай версию в ссылках (`styles.css?v=16`, `script.js?v=11`), иначе браузер может показать старый файл.

## Локальный просмотр

Из папки проекта:

```bash
python3 -m http.server 8766
```

- Заглушка: http://127.0.0.1:8766/
- Лендинг (даже если сайт выключен): http://127.0.0.1:8766/home.html
- Спасибо / гайд: http://127.0.0.1:8766/thanks/
- Политика: http://127.0.0.1:8766/privacy/

Форма на локалке шлёт письма так же, как на проде — тестовые заявки лучше не жать без нужды.

## Как уезжает на прод

Пуш в `main` → workflow **Deploy site** → GitHub Pages.

Проверка деплоя: https://github.com/Povic1705/tsarstvo-trafika/actions

Домен на Reg.ru, NS `ns1.reg.ru` / `ns2.reg.ru`.

- `A` для `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `CNAME` для `www`: `Povic1705.github.io`

В репозитории GitHub: Settings → Pages → Source = GitHub Actions, кастомный домен `tsarstvo-trafika.ru`, HTTPS Enforce включён.

## Форма и счётчики

- Заявки: Formsubmit → `osipovamp@yandex.ru`
- Метрика: `112124750`, цель `lead` после успешной отправки
- Телефон: `+7 950 805 2835`
- Telegram заявок: `@tsar_devitsa`
- Канал: `t.me/tsarstvo_trafika`

Первый раз Formsubmit просит подтвердить ящик письмом (смотреть спам).

## Реквизиты

ИП Попова Марина Петровна  
ИНН `482413963270`  
ОГРНИП `324480000028451`
