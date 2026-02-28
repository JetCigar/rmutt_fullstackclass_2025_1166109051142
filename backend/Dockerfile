FROM node:20

WORKDIR /app

COPY package*.json ./

# ลง dependencies พร้อมตั้งค่า retry กันเน็ตหลุด
RUN npm install

# คัดลอกโฟลเดอร์ prisma มาก่อน (เพื่อให้ npx prisma generate ทำงานได้)
COPY prisma ./prisma/

# คัดลอกไฟล์ที่เหลือทั้งหมด
COPY . .

# สร้าง Prisma Client ให้พร้อมใช้งาน
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]