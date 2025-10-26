# DIY Components - React E-commerce Application

> Modern React e-commerce platform for electronic components, migrated from Nuxt.js 2

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run development server
npm run dev
```

Visit: `http://localhost:8080`

## 📋 Project Overview

This is a complete React rewrite of the DIY Components e-commerce platform, originally built with Nuxt.js 2. It connects to the existing backend API at `api.diycomponents.in`.

**Key Features:**
- 🔐 Full authentication (login/register)
- 🛍️ Product catalog with search & filtering
- 📦 Category browsing
- 🛒 Shopping cart management
- 💳 Checkout flow (coming soon)
- 📱 Fully responsive design

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Routing:** React Router v6
- **State:** React Context API
- **Forms:** React Hook Form + Zod
- **HTTP:** Axios
- **Backend:** Existing Node.js API

## 📖 Documentation

See [REACT_APP_GUIDE.md](./REACT_APP_GUIDE.md) for:
- Detailed setup instructions
- API documentation
- Project structure
- Development guidelines
- Feature roadmap

## 🌐 Live URLs

- **Production:** Coming soon
- **Backend API:** https://api.diycomponents.in

## 📁 Key Directories

```
src/
├── pages/         # Page components (Home, Products, Cart, etc.)
├── components/    # Reusable components (Header, Footer, UI)
├── contexts/      # React contexts (Auth, Cart)
├── lib/          # Utilities (API client, helpers)
└── types/        # TypeScript type definitions
```

## 🔧 Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production  
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

## 🎨 Design System

The app uses a custom design system based on:
- **Primary:** Orange (#E65100) - Electronics theme
- **Secondary:** Deep Blue (#002D4A)
- **Components:** shadcn/ui with custom styling
- **Responsive:** Mobile-first approach

## ✅ Migration Status

### Completed
- ✅ Project setup & build configuration
- ✅ Design system & theming
- ✅ Authentication (login/register/verify)
- ✅ Home page with hero & featured products
- ✅ Product listing & search
- ✅ Product detail pages
- ✅ Category browsing
- ✅ Shopping cart
- ✅ Responsive navigation
- ✅ API integration

### In Progress
- 🚧 Checkout flow
- 🚧 User dashboard (orders, profile, addresses)
- 🚧 Payment integration (Razorpay)
- 🚧 Order tracking

## 🤝 Contributing

This project follows the existing codebase patterns:
1. TypeScript for type safety
2. Component-based architecture
3. Semantic design tokens (no hardcoded colors)
4. Proper error handling
5. Responsive design

## 📄 License

See LICENSE file for details.

---

**Original Nuxt.js 2 project:** Archived in `user-uploads://nuxt-web.txt`
