<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=600&size=28&duration=3000&pause=1000&color=61DAFB&center=true&vCenter=true&width=800&lines=React+%2B+TypeScript+%2B+Vite;Lightning+Fast+Development+Stack;Modern+Frontend+Boilerplate;Production+Ready+Setup" />
</p>

---

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-NextGen-FE7A16?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/ESLint-TypeSafe-4B32C3?style=for-the-badge&logo=eslint" />
</p>

---

# ⚡ React + TypeScript + Vite Boilerplate

A minimal yet powerful setup to build modern React applications with blazing fast development experience and production-grade configuration.

Designed for scalability. Optimized for performance. Ready for real-world projects.

---

## 🚀 Why This Setup?

✨ Instant dev server start  
🔥 Lightning-fast HMR  
🧠 Full TypeScript support  
🧹 Type-aware ESLint rules  
📦 Optimized production build  
⚙️ Flexible plugin system  

---

## 🧩 Official React Plugins

Currently supports both official Vite React plugins:

### 🔹 @vitejs/plugin-react
- Uses Babel (or OXC with Rolldown)
- Stable Fast Refresh
- Flexible ecosystem compatibility

### 🔹 @vitejs/plugin-react-swc
- Uses SWC compiler
- Faster build & refresh performance
- Lightweight & efficient

Switch depending on your performance preference.

---

## 🧠 React Compiler

React Compiler is intentionally disabled in this template to avoid performance impact on development and build.

To enable it manually, follow:
👉 https://react.dev/learn/react-compiler/installation

---

## 🧹 Production-Ready ESLint Setup

For serious production applications, enable type-aware linting:

Replace:

tseslint.configs.recommended


With:

tseslint.configs.recommendedTypeChecked


Or for stricter enforcement:

tseslint.configs.strictTypeChecked


Optional stylistic rules:

tseslint.configs.stylisticTypeChecked


---

### 🔥 React-Specific Linting (Optional but Recommended)

Install:

- eslint-plugin-react-x
- eslint-plugin-react-dom

Enable configs:

reactX.configs['recommended-typescript']
reactDom.configs.recommended


This ensures:
- Strict React patterns
- DOM best practices
- Cleaner scalable architecture

---

## 📁 Project Structure

src/
├── assets/
├── components/
├── hooks/
├── App.tsx
└── main.tsx

eslint.config.js
tsconfig.app.json
tsconfig.node.json
vite.config.ts


---

## ⚙️ Getting Started

### 1️⃣ Install dependencies

```bash
npm install
2️⃣ Start development server
npm run dev
3️⃣ Build for production
npm run build
4️⃣ Preview production build
npm run preview
📊 Performance Highlights
⚡ Ultra-fast HMR

📦 Optimized production bundle

🧠 Strict type safety

🔍 Advanced linting

🛠 Modern dev tooling

💎 Perfect For
SaaS dashboards

Portfolio projects

Scalable web apps

Production-ready frontend systems

Startup MVPs

<p align="center"> Built with ❤️ using React + TypeScript + Vite </p> ```
