# User Management Platform

A fully functional web application for user management with a role-based access control system.

## Features

- Root Admin
  - Can create new users
  - Can view and edit all users in the system
- Admin
  - Can view and edit only the users they have created
- User
  - No access to the user table
- Email Notifications
  - Automatic email sent to a user upon creation

## Tech Stack

Frontend: React, Next.js, TypeScript, Ant Desight\
Backend: NestJS, TypeScript, TypeORM(PostgreSQL), JWT, bcrypt\
Other: Nodemailer, Pug, Axios, Zod, ESLint, Prettier

## Installation

1. **Clone repository**
   `git clone https://github.com/NekoKrator/mithril-root-admin-task`

2. **Setup project:**

### Client Setup

```console
cd .\server
npm install
npm run dev
```

### Backend Setup

```console
 cd .\server
 npm install
 npm run typeorm:run-migrations
 npm run start:dev
```

## Environment Variables

### .env.example

```env
# Server

PORT # port

# Database

POSTGRES_HOST
POSTGRES_PORT
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DATABASE
POSTGRES_SSL

# JWT

JWT_SECRET

# Root Admin

ROOT_EMAIL
ROOT_PASSWORD

# Email (SMTP)

SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
```

## API Documentation

Once the server is running, Swagger will be avaliable at:

```console
localhost:3000/api
```
