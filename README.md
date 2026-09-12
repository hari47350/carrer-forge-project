
---

```powershell
# Go to project root
cd C:\Users\admin\Downloads\career-forge-fresh

# ============ 1. README.md ============
@'
# ⚒️ CareerForge

> **Forge Your Career Path** — An AI-powered career platform that scores your resume, matches you with jobs, and guides your career growth.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.0-green)
![React](https://img.shields.io/badge/React-18-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 📖 Overview

CareerForge is a full-stack AI-powered platform that helps job seekers:
- 📊 **Analyze resumes** with real AI feedback (ATS score, strengths, weaknesses, tips)
- 💼 **Match jobs** based on skills, location, and experience (real-time via JSearch API)
- 📝 **Generate cover letters** tailored to specific jobs
- 🎤 **Prepare for interviews** with AI-generated questions
- 📋 **Track applications** with a Kanban-style dashboard
- 🔐 **Authenticate** securely using JWT

## 🚀 Tech Stack

### Backend
- Java 17
- Spring Boot 3.4
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL (Neon)
- Google Gemini API (AI analysis)
- JSearch (RapidAPI) for real-time jobs
- Apache Tika (resume parsing)
- Lombok

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React

## 📁 Project Structure

```
careerforge/
├── backend/                          # Spring Boot backend
│   ├── src/main/java/com/careerforge/
│   │   ├── config/                   # Security, CORS, WebClient
│   │   ├── controller/               # REST endpoints
│   │   ├── service/                  # Business logic
│   │   ├── repository/               # JPA repositories
│   │   ├── model/                    # Entities & DTOs
│   │   ├── security/                 # JWT filter
│   │   └── exception/                # Global handler
│   ├── src/main/resources/
│   │   └── application.yml.example
│   └── pom.xml
├── src/                              # React frontend
│   ├── pages/
│   ├── services/
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── README.md
```

## ⚙️ Setup Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.9+
- Accounts: Neon, Google AI Studio, RapidAPI

### 1️⃣ Clone
```bash
git clone https://github.com/hari47350/carrer-forge-project.git
cd carrer-forge-project
```

### 2️⃣ Backend Setup

Create `backend/.env`:
```env
DB_URL=jdbc:postgresql://YOUR_NEON_HOST/neondb?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=YOUR_NEON_PASSWORD
JWT_SECRET=YOUR_JWT_SECRET
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
RAPIDAPI_KEY=YOUR_RAPIDAPI_KEY
FRONTEND_URL=http://localhost:5173
```

Run:
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```
Backend: **http://localhost:8080**

### 3️⃣ Frontend Setup
```bash
cd ..
npm install
npm run dev
```
Frontend: **http://localhost:5173**

## 🌐 API Endpoints

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Resume
- `POST /api/v1/resume/analyze`

### Jobs
- `GET /api/v1/jobs`
- `POST /api/v1/jobs/match`
- `POST /api/v1/jobs/seed`

### Saved Jobs
- `GET /api/v1/saved-jobs`
- `POST /api/v1/saved-jobs`
- `DELETE /api/v1/saved-jobs/{jobId}`

### Health
- `GET /api/v1/health`
- `GET /api/v1/health/gemini-test`

## 🎯 Features

- [x] JWT-based authentication
- [x] AI Resume Analyzer (Gemini + Tika)
- [x] Real-time Job Matcher (JSearch API)
- [x] Saved Jobs
- [x] Application Tracker
- [x] Cover Letter Generator
- [x] Interview Prep
- [x] Dark mode UI

## 🚀 Deployment

- **Backend** → Render
- **Frontend** → Netlify
- **Database** → Neon PostgreSQL

## 📄 License

MIT License

## 👨‍💻 Author

**Hari Krishna Reddy**
- GitHub: [@hari47350](https://github.com/hari47350)

---

⭐ If you find this helpful, give it a star!
'@ | Out-File -FilePath README.md -Encoding UTF8

# ============ 2. LICENSE ============
@'
MIT License

Copyright (c) 2026 Hari Krishna Reddy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
'@ | Out-File -FilePath LICENSE -Encoding UTF8

# ============ 3. application.yml.example ============
@'
spring:
  application:
    name: CareerForge

  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    show-sql: true

  flyway:
    enabled: false

  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000

gemini:
  api:
    key: ${GEMINI_API_KEY}
    url: https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent

cors:
  allowed-origins: ${FRONTEND_URL:http://localhost:5173}

server:
  port: 8080

logging:
  level:
    com.careerforge: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE

rapidapi:
  key: ${RAPIDAPI_KEY}
'@ | Out-File -FilePath backend\src\main\resources\application.yml.example -Encoding UTF8

# ============ 4. Confirm ============
Write-Host ""
Write-Host "✅ All files created:" -ForegroundColor Green
Write-Host "   - README.md"
Write-Host "   - LICENSE"
Write-Host "   - backend/src/main/resources/application.yml.example"
Write-Host ""
Write-Host "Now run these commands to push:" -ForegroundColor Yellow
Write-Host "   git add ."
Write-Host "   git commit -m 'Add README, LICENSE, and config example'"
Write-Host "   git push"
```

---

## 🚀 After Running the Script

Push it:

```powershell
git add .
git commit -m "Add README, LICENSE, and config example"
git push
```

---

## 📌 What This Creates

| File | Purpose |
|------|---------|
| `README.md` | Professional project documentation |
| `LICENSE` | MIT License (open source) |
| `backend/src/main/resources/application.yml.example` | Config template with placeholders |

---
