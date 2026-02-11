# HRMS Lite

A lightweight Human Resource Management System built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Live Demo

- **Frontend**: _[Live URL](https://ethara-ai-drab.vercel.app/)_
- **Backend API**: _[API Base URL](https://etharaai-rfwg.onrender.com)_

## Features

### Core Features

- **Employee Management** – Add, view, search, and delete employees
- **Attendance Management** – Mark daily attendance (Present / Absent) for employees
- **RESTful API** – Clean, well-structured backend API with proper validations and error handling

### Bonus Features

- **Dashboard** – Summary cards showing total employees and today's attendance stats
- **Department Distribution** – Visual department-wise employee breakdown
- **Date Filter** – Filter attendance records by specific date
- **Attendance Summary** – Total present / absent days displayed per employee
- **Search** – Client-side search for employees by name, ID, email, or department

## Tech Stack

| Layer | Technology |
| ---------- | --------------------------------- |
| Frontend | React 18 (Vite), Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Icons | Lucide React |
| Toasts | React Hot Toast |
| Deployment | Vercel (Frontend), Render (Backend) |

## Project Structure

    hrms-lite/
    ├── client/                  # React frontend (Vite)
    │   ├── src/
    │   │   ├── api/             # Axios API service layer
    │   │   ├── components/
    │   │   │   ├── layout/      # Sidebar, Navbar, Layout
    │   │   │   ├── ui/          # LoadingSpinner, EmptyState, ErrorAlert, etc.
    │   │   │   ├── employees/   # EmployeeTable, EmployeeForm
    │   │   │   ├── attendance/  # AttendanceTable, AttendanceForm
    │   │   │   └── dashboard/   # StatCard
    │   │   └── pages/           # Dashboard, Employees, EmployeeAttendance
    │   └── ...
    ├── server/                  # Express backend
    │   ├── config/              # Database connection
    │   ├── controllers/         # Route handlers
    │   ├── middleware/           # Error handler
    │   ├── models/              # Mongoose schemas
    │   ├── routes/              # API route definitions
    │   └── utils/               # Helper utilities
    └── README.md

## Running Locally

### Prerequisites

- Node.js >= 18
- MongoDB (local instance or Atlas cluster)
- npm

### 1. Clone the repository

    git clone https://github.com/YOUR_USERNAME/hrms-lite.git
    cd hrms-lite

### 2. Setup Backend

    cd server
    npm install

    # Create .env from example
    cp .env.example .env
    # Edit .env and add your MONGO_URI

    npm run dev

### 3. Setup Frontend

    cd client
    npm install
    npm run dev

The frontend runs on **http://localhost:3000** and proxies API requests to **http://localhost:5000** during development.

## API Endpoints

### Employees

| Method | Endpoint | Description |
| ------ | ------------------- | ------------------- |
| GET | /api/employees | List all employees |
| GET | /api/employees/:id | Get single employee |
| POST | /api/employees | Create employee |
| DELETE | /api/employees/:id | Delete employee |

### Attendance

| Method | Endpoint | Description |
| ------ | ----------------------------------- | --------------------------------- |
| POST | /api/attendance | Mark attendance |
| GET | /api/attendance/:employeeId | Get attendance records |
| GET | /api/attendance/:employeeId?date=X | Filter attendance by date (bonus) |

### Dashboard

| Method | Endpoint | Description |
| ------ | -------------- | ---------------------------------- |
| GET | /api/dashboard | Dashboard summary (counts & stats) |

## Environment Variables

### Backend (`server/.env`)

    PORT=5000
    MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms-lite

### Frontend (`client/.env`)

    VITE_API_URL=http://localhost:5000/api

> In local development the Vite proxy handles forwarding, so the frontend `.env` is only needed for production builds pointing at the live backend.

## Assumptions & Limitations

- Single admin user — no authentication or authorization is implemented
- Employee ID is auto-generated in the format `EMP-0001`, `EMP-0002`, etc.
- Leave management, payroll, and advanced HR features are out of scope
- Attendance can be updated (overwritten) if marked again for the same employee + date
- All attendance dates are normalized to UTC midnight to avoid timezone issues
