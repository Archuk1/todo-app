# TODO App

Простий застосунок для керування завданнями з JWT-аутентифікацією.

- **Бекенд**: Express.js + Prisma (SQLite)
- **Фронтенд**: Next.js (App Router) + React Query + Tailwind CSS
- **Аутентифікація**: JWT (реєстрація / вхід), пароль хешується через bcrypt

## Структура

```
server/   Express API (auth + tasks CRUD)
client/   Next.js frontend
```

## Запуск бекенду

```bash
cd server
npm install
cp .env.example .env      # за потреби зміни JWT_SECRET
npx prisma migrate dev --name init   # створює SQLite базу і таблиці
npm run dev                # http://localhost:5000
```

## Запуск фронтенду

```bash
cd client
npm install
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev                # http://localhost:3000
```

Відкрий http://localhost:3000 — застосунок перенаправить на `/login`.

## API

Базовий шлях: `/api`

| Метод | Шлях             | Опис                              | Авторизація |
|-------|------------------|------------------------------------|-------------|
| POST  | /auth/register   | Реєстрація (email, password)      | -           |
| POST  | /auth/login      | Вхід (email, password)            | -           |
| GET   | /auth/me         | Дані поточного користувача        | Bearer JWT  |
| GET   | /tasks           | Список завдань (?status=todo\|in progress\|done) | Bearer JWT |
| GET   | /tasks/:id       | Одне завдання                     | Bearer JWT  |
| POST  | /tasks           | Створити завдання                 | Bearer JWT  |
| PUT   | /tasks/:id       | Оновити завдання                  | Bearer JWT  |
| DELETE| /tasks/:id       | Видалити завдання                 | Bearer JWT  |

Токен передається в заголовку: `Authorization: Bearer <token>`.

## Що перевірено

- `npx tsc --noEmit` у client — без помилок типів
- `npx eslint .` у client — без помилок
- `npx next build` — успішна production-збірка (усі 5 маршрутів)
- `node --check` для всіх серверних файлів — без синтаксичних помилок

Примітка: `prisma migrate dev` потребує завантаження бінарного Prisma engine з
`binaries.prisma.sh` — переконайся, що в твоєму середовищі є доступ до цього
хоста (в звичайному оточенні розробки це працює без проблем).
