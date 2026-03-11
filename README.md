# E-Commerce Full Stack Application

โปรเจค E-Commerce ที่พัฒนาด้วย Angular (Frontend) และ Node.js + Express + Prisma (Backend)

## 🚀 เริ่มต้น

### วิธีที่ 1: ใช้ Docker (แนะนำ)
```bash
# รันทั้งระบบด้วย Docker Compose
docker-compose up -d

# หยุดระบบ
docker-compose down
```

### วิธีที่ 2: รันแบบ Manual

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # และแก้ไขค่า config
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
ng serve
```

## 📁 โครงสร้างโปรเจค

```
├── backend/                 # Node.js + Express + Prisma API
│   ├── prisma/             # Database schema และ migrations
│   ├── server/             # Express server code
│   └── package.json
├── frontend/               # Angular Application
│   ├── src/               # Source code
│   └── package.json
├── docker-compose.yaml    # Docker configuration
└── .gitignore            # Git ignore rules
```

## 🌐 พอร์ตที่ใช้

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:9999
- **Database**: localhost:5432
- **Prisma Studio**: http://localhost:5555

## 🛠️ Tech Stack

### Frontend
- Angular 20.3.0
- TypeScript
- Angular CLI

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcryptjs

### DevOps
- Docker & Docker Compose
- Git

## 📦 Dependencies

### Backend
- `@prisma/client` - Database ORM
- `express` - Web framework
- `jsonwebtoken` - Authentication
- `bcryptjs` - Password hashing
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables

### Frontend
- `@angular/core` - Angular framework
- `@angular/router` - Routing
- `@angular/forms` - Forms handling

## 🔧 Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์ `backend/`:

```env
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
```

## 📝 Database Schema

ใช้ Prisma ในการจัดการ database schema ที่ `backend/prisma/schema.prisma`

## 🚀 Deployment

1. อัปเดต environment variables ใน production
2. รัน `docker-compose up -d` บน server
3. ตั้งค่า reverse proxy (nginx/apache) ถ้าต้องการ

## 🤝 การมีส่วนร่วม

1. Fork โปรเจค
2. สร้าง feature branch
3. Commit การเปลี่ยนแปลง
4. Push และสร้าง Pull Request

## 📄 License

ISC License
