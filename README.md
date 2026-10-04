# Tic-Tac-Toe

เกม Tic-Tac-Toe ที่พัฒนาด้วย Next.js โดยผู้เล่นสามารถเล่นกับ Bot และมีระบบคะแนน รวมถึงบันทึกประวัติการเล่นลง Database

## ฟีเจอร์

* สมัครสมาชิกด้วย Email และ Password
* Login ด้วย Google
* Login ด้วย LINE
* เล่น Tic-Tac-Toe กับ Bot
* ระบบคะแนน
* ระบบ Winning Streak
* บันทึกประวัติการเล่น
* Bot มีความยากตาม Score ของผู้เล่น
* แสดง Score และ Streak ของผู้เล่น

## เทคโนโลยีที่ใช้

* Next.js
* React
* TypeScript
* Tailwind CSS
* NextAuth.js
* PostgreSQL

## ระบบ Bot

Bot จะเล่นเป็นฝั่ง `O` และผู้เล่นจะเล่นเป็นฝั่ง `X`

ระดับความยากของ Bot จะเปลี่ยนตาม Score ของผู้เล่น

|      Score | ระดับ      | รูปแบบการเล่น                         |
| ---------: | ---------- | ------------------------------------- |
|     `< 20` | Easy       | สุ่มช่องในการเล่น                     |
|  `20 - 69` | Normal     | พยายามชนะและป้องกันการแพ้             |
| `70 - 100` | Hard       | ใช้ Minimax และมีการสุ่มบางครั้ง      |
|    `> 100` | Impossible | ใช้ Minimax ในการเลือกช่องที่ดีที่สุด |

## ระบบคะแนน

เมื่อจบเกม ระบบจะคำนวณคะแนนตามผลการแข่งขัน

| ผลการแข่งขัน |          คะแนน |
| ------------ | -------------: |
| ชนะ          |             +1 |
| แพ้          |             -1 |
| เสมอ         | ไม่เปลี่ยนแปลง |

หากผู้เล่นชนะติดต่อกัน จะมีระบบ `Winning Streak` และได้รับคะแนนพิเศษตามเงื่อนไขที่กำหนดไว้ในระบบ

## การติดตั้ง

### 1. Clone Project

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. ติดตั้ง Dependencies

```bash
pnpm install
```

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env`

```env
DATABASE_URL=your_database_url

NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

LINE_CLIENT_ID=your_line_client_id
LINE_CLIENT_SECRET=your_line_client_secret

NODE_ENV=development
```

> อย่านำค่า Secret หรือข้อมูลที่เป็นความลับขึ้น GitHub

### 4. ตั้งค่า Database

สร้าง Database PostgreSQL และสร้าง Table ที่จำเป็นสำหรับระบบ เช่น

* `players`
* `accounts`
* `gamelogs`

## การ Run Project

รัน Development Server

```bash
docker-compose up -d
```

เพือ run docker สำหรับ database ไว้ก่อน

```bash
pnpm dev
```

จากนั้นเปิด

```text
http://localhost:3000
```

## คำสั่งที่ใช้บ่อย

| Command      | รายละเอียด             |
| ------------ | ---------------------- |
| `pnpm dev`   | Run Development Server |
| `pnpm build` | Build Project          |
| `pnpm start` | Run Production Server  |
| `pnpm lint`  | ตรวจสอบโค้ดด้วย ESLint |

## โครงสร้าง Project

```text
app/
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts
│   ├── players/
│   │   └── score/
│   │       └── route.ts
│   └── gamelog/
│       └── route.ts
│
├── matchroom/
├── playground/
├── signup/
│
components/
│   └── Button.tsx
│
config/
└── database.ts
```

## กติกาการเล่น

1. ผู้เล่นจะเล่นเป็น `X`
2. Bot จะเล่นเป็น `O`
3. ผู้เล่น X เป็นฝ่ายเริ่มก่อน
4. ผู้เล่นที่เรียงสัญลักษณ์ได้ 3 ช่องติดกันในแนวนอน แนวตั้ง หรือแนวทแยง จะเป็นผู้ชนะ
5. หากช่องทั้ง 9 ช่องถูกใช้หมดโดยไม่มีผู้ชนะ จะถือว่าเสมอ

## การบันทึก Game Log

เมื่อจบเกม ระบบจะบันทึกข้อมูลลง `gamelogs` เช่น

* ผู้เล่น
* ผู้ชนะ
* ลำดับการเล่น
* วันที่และเวลาที่เล่น

ตัวอย่าง `game_log`

```text
[0, 4, 1, 3, 8, 2, 6]
```

โดยแต่ละตัวเลขหมายถึงตำแหน่งช่องที่ผู้เล่นเลือก

## จุดประสงค์ของ Project

โปรเจกต์นี้สร้างขึ้นเพื่อฝึกการพัฒนา Web Application ด้วย Next.js รวมถึงการทำ Authentication, API Route, Database และการสร้าง Bot สำหรับเกม Tic-Tac-Toe
