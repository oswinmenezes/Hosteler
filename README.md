# Hostel Management System (Supabase + React + Vite)

This repository contains a **multi‑module hostel management system**, where each feature is built as its own Vite project but all connect to the **same Supabase backend**.

You can run and develop every part independently.

---

## 🚀 Modules inside this repository

| Folder            | Description                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| **Hostel_Admin**  | Admin / Warden dashboard — manages mess, gym, complaints, and attendance |
| **Student_Panel** | Student portal — complaints, mess opt‑out, gym, attendance & profile     |
| **Laundry**       | Laundry service management (separate flow)                               |

Each has its **own README** explaining exact commands and `.env` setup. This document explains everything at a higher level.

---

## 🏗️ Tech Stack

* React (Vite)
* Supabase (Auth + DB + Realtime)
* JavaScript (ES Modules)

> All projects share the **same Supabase project**.

---

## 🔐 Supabase Credentials (used in ALL apps)

From Supabase → **Project Settings → API**

You will need:

```
Project URL
anon (publishable) API key
```

> ⚠️ Never use the `service_role` key on the frontend or commit it to GitHub.

All apps read credentials via environment variables.

---

## ⚙️ Environment Variables (Common Format)

Every project uses the exact same variables:

```
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_KEY=YOUR_SUPABASE_ANON_KEY
```

Create them inside each project (not in root) — example:

```
Hostel_Admin/.env
Student_Panel/.env
Laundry/.env
```

> Each project’s own README already lists its exact steps.

---

## ▶️ Running the projects

### 1️⃣ Admin Panel

```
cd Hostel_Admin
npm install
npm run dev
```

### 2️⃣ Student Panel

```
cd Student_Panel
npm install
npm run dev
```

### 3️⃣ Laundry Panel

```
cd Laundry
npm install
npm run dev
```

Run them independently — they will all talk to the same Supabase backend.

---

## 🗄️ Main Database Overview

The following tables power the system:

* **Complaints** — student complaints + admin response
* **Mess_Attendance** — meal opt‑out
* **Gym** — gym joining/cancel
* **Attendance_Sessions** — creates QR sessions for attendance
* **Attendance** — records attendance per student

> Row‑Level Security (RLS) is enabled and policies are added so students can only access their own records.

---

## 🎯 Goals of the System

✔ Centralized hostel management
✔ Separate dashboards for admin and students
✔ Shared database
✔ Extensible features (QR attendance, notifications, history)

---

## 📌 Notes

* Keep `.env` files local — do not push keys to GitHub
* Each project can be deployed separately if needed
* More detailed usage and screenshots are inside each module README

---

## 📝 License

Academic / educational use.

---

If something is unclear — check module READMEs or ask the maintainers.
