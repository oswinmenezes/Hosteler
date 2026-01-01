# 🌟 Project README

## 📌 Overview

This project runs using Node.js and npm. Follow the steps below to set it up and start the development server.

---

## ✅ Prerequisites

Make sure you have the following installed:

* Node.js (LTS recommended)
* npm (comes with Node.js)

Check versions:

```bash
node -v
npm -v
```

---

## 🔐 Environment Variables

Create a `.env` (or `.env.local`) file in the project root and add:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_superbase_key
```

> Restart the dev server after changing environment variables.

---

## 🚀 Getting Started

### 🔹 Step 1: Install dependencies

Run this inside the project folder:

```bash
npm install
```

### 🔹 Step 2: Start the development server

```bash
npm run dev
```

The app should now be running, usually at:

```
http://localhost:5173
```

---


## ⚙️ NPM Scripts

| Command       | Description                       |
| ------------- | --------------------------------- |
| `npm install` | Installs all project dependencies |
| `npm run dev` | Runs the development server       |

---

## 🛠 Troubleshooting

If things don’t work:

1. Delete `node_modules` and reinstall:

   ```bash
   rm -rf node_modules
   npm install
   ```
2. Make sure Node.js version is compatible.
3. Check the terminal for detailed error messages.

---

## 📄 License

This project is for learning/demo purposes unless otherwise noted.
