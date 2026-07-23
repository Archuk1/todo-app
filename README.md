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
cp .env.example .env      
npx prisma migrate dev --name init  
npm run dev                # http://localhost:5000
```

## Запуск фронтенду

```bash
cd client
npm install
cp .env.local.example .env.local  
npm run dev               
```
