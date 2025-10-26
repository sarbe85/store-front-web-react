# DIY Components - React E-commerce Application

Modern React e-commerce application for electronic components, migrated from Nuxt.js 2 to React + TypeScript.

## 🚀 Features

### ✅ Implemented

- **Authentication System**
  - Login & Registration with validation
  - Email verification flow
  - Protected routes
  - JWT token management

- **Product Management**
  - Product listing with pagination
  - Product detail pages
  - Category browsing
  - Search functionality
  - Product filtering

- **Shopping Cart**
  - Add/remove items
  - Update quantities
  - Cart persistence (authenticated users)
  - Real-time cart count

- **UI/UX**
  - Responsive design (mobile, tablet, desktop)
  - Modern component library (shadcn/ui)
  - Loading states and skeletons
  - Toast notifications
  - Beautiful gradient design system

## 📦 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Zod** - Schema validation
- **React Hook Form** - Form management
- **Decimal.js** - Precise currency calculations

## 🔧 Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api.diycomponents.in

# Optional: If using encrypted API communication
# VITE_ENCRYPTION_SECRET=your-encryption-secret
# VITE_SIGNING_SECRET=your-signing-secret
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### 4. Build for Production

```bash
npm run build
```

## 🌐 API Integration

The application connects to your existing backend at `https://api.diycomponents.in`

### API Endpoints Used

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile

#### Products
- `GET /product` - List all products
- `GET /product/:sku` - Get single product
- `GET /product/search?q=query` - Search products
- `GET /product/category/:category` - Get products by category

#### Categories
- `GET /product/categories` - Get all categories
- `GET /product/categories/filtered` - Get filtered categories

#### Cart
- `GET /cart` - Get cart items
- `POST /cart` - Add item to cart
- `PUT /cart/:sku` - Update cart item quantity
- `DELETE /cart/:sku` - Remove item from cart

### Authentication Flow

1. User logs in with email and password
2. Backend returns JWT token and user data
3. Token is stored in localStorage
4. Token is sent with every API request via Authorization header
5. If token expires (401 response), user is redirected to login

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/           # Layout components (Header, Footer)
│   └── ui/              # shadcn UI components
├── contexts/            # React contexts (Auth, Cart)
├── pages/               # Page components
│   ├── auth/           # Authentication pages
│   ├── Home.tsx        # Homepage
│   ├── Products.tsx    # Product listing
│   ├── ProductDetail.tsx
│   ├── Categories.tsx
│   ├── Cart.tsx
│   └── ...
├── lib/
│   ├── api.ts          # Axios instance & API functions
│   └── utils/          # Utility functions
├── types/              # TypeScript type definitions
├── App.tsx             # Main app component with routes
└── main.tsx            # App entry point
```

## 🎨 Design System

### Colors

```css
Primary (Orange): hsl(20 100% 45%)
Secondary (Deep Blue): hsl(200 100% 14.5%)
Accent (Orange): hsl(32 100% 50%)
```

### Theme Tokens

All colors are defined as HSL tokens in `src/index.css`:
- `--primary` - Main brand color (orange)
- `--secondary` - Deep blue
- `--accent` - Accent orange
- `--success`, `--warning`, `--destructive` - Status colors
- Custom gradients and shadows

## 🔐 Security Features

1. **Input Validation**
   - Zod schemas for all forms
   - Client-side validation before API calls
   - Proper error messages

2. **Authentication**
   - JWT token management
   - Automatic token refresh
   - Secure token storage
   - Protected routes

3. **API Security**
   - CORS handling
   - Error handling with interceptors
   - No sensitive data in console logs (production)

## 🚧 Pending Features

The following features from the original Nuxt app need to be implemented:

- [ ] Checkout flow
- [ ] Order management
- [ ] User dashboard (profile, orders, addresses)
- [ ] Payment integration (Razorpay)
- [ ] Wishlist functionality
- [ ] Product reviews & ratings
- [ ] Order tracking
- [ ] Help pages (FAQ, shipping, returns, etc.)
- [ ] Admin panel (if applicable)

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔄 State Management

- **Auth State**: React Context + localStorage
- **Cart State**: React Context + API sync
- **Server State**: TanStack Query (if needed for caching)
- **Form State**: React Hook Form

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 📝 Development Notes

### Currency Calculations

Use `CurrencyUtils` from `src/lib/utils/currency.ts` for all currency operations to avoid floating-point errors:

```typescript
import { CurrencyUtils } from '@/lib/utils/currency';

const total = CurrencyUtils.add(price1, price2);
const discounted = CurrencyUtils.applyDiscount(price, 10); // 10% off
```

### API Error Handling

All API errors are handled by axios interceptors and display toast notifications automatically.

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Wrap with `<Layout>` if needed

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow the design system (no hardcoded colors)
4. Add proper error handling
5. Test on mobile devices

## 📄 License

[Your License Here]

## 🔗 Related Links

- [Nuxt Source Code](./user-uploads/nuxt-web.txt)
- [Backend API Docs](https://api.diycomponents.in/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
