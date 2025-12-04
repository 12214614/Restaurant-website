# Quick Start Guide - PowerShell Commands

## 🚀 Run the Project

### 1. Navigate to project folder
```powershell
cd project
```

### 2. Install dependencies (first time only)
```powershell
npm install
```

### 3. Create `.env` file
Create a file named `.env` in the `project` folder with:
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_key_here
```

### 4. Start development server
```powershell
npm run dev
```

Open browser at: `http://localhost:5173`

---

## 📦 Build Commands

### Build for production
```powershell
npm run build
```

### Preview production build
```powershell
npm run preview
```

### Check for errors
```powershell
npm run lint
```

---

## ✅ Build Status

**Current Status:** ✅ Build successful!

The project builds without errors. All components are working correctly.

---

## 🐛 If Build Fails

1. Clear cache and reinstall:
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

2. Clear Vite cache:
```powershell
Remove-Item -Recurse -Force node_modules\.vite
```

---

## 📝 Notes

- Make sure Node.js (v18+) is installed
- The `.env` file is required for Supabase connection
- Development server runs on port 5173 by default


