# SkipaMan Store - React E-Commerce Platform

A modern, feature-rich e-commerce platform built with React, TypeScript, and Tailwind CSS. The project follows best practices with a clean, maintainable architecture and is prepared for Strapi CMS integration.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Full cart functionality with persistent storage
- **User Authentication**: Secure authentication and authorization
- **Order Management**: Track orders and view order history
- **Custom Design Requests**: Submit custom design requests
- **Wishlist**: Save favorite products
- **Admin Dashboard**: Comprehensive admin panel
- **Payment Integration**: Support for multiple payment gateways
- **Responsive Design**: Mobile-first approach

## 📁 Project Structure

```
src/
├── components/
│   ├── features/          # Feature-based components (business logic)
│   │   └── header/        # Header feature (refactored, < 250 lines each)
│   │       ├── Header.tsx              # Main component (< 130 lines)
│   │       ├── HeaderLogo.tsx          # Logo component
│   │       ├── HeaderNavigation.tsx    # Desktop navigation
│   │       ├── HeaderSearch.tsx        # Search functionality
│   │       ├── HeaderActions.tsx       # Cart, wishlist, user actions
│   │       ├── HeaderUserMenu.tsx      # User dropdown menu
│   │       ├── HeaderMobileMenu.tsx    # Mobile navigation
│   │       └── hooks/
│   │           ├── useHeaderScroll.ts  # Scroll behavior
│   │           ├── useHeaderStyles.ts  # Styling logic
│   │           ├── useHeaderSearch.ts  # Search state
│   │           └── useSearchUI.ts      # Search UI state
│   ├── ui/               # Reusable UI components (no business logic)
│   │   ├── Button.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ...
│   ├── layout/           # Layout components
│   │   ├── Layout.tsx
│   │   └── Footer.tsx
│   ├── common/           # Shared components
│   ├── home/             # Home page components
│   ├── product/          # Product-related components
│   ├── auth/             # Authentication components
│   ├── admin/            # Admin components
│   └── ...
├── pages/                # Page components (thin wrappers, < 100 lines)
│   ├── HomePage.tsx
│   ├── ShopPage.tsx
│   ├── ProductPage.tsx
│   └── ...
├── context/              # React Context providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── ...
├── hooks/                # Custom React hooks
│   ├── useAuth.ts
│   └── ...
├── services/             # API services
│   ├── api.ts
│   ├── strapi.ts         # Strapi integration (prepared)
│   └── ...
├── types/                # TypeScript types
│   └── index.ts
├── utils/                # Utility functions
│   ├── constants.ts
│   └── validation.ts
└── data/                 # Static data (temporary, will use Strapi)
    ├── products.ts
    └── testimonials.ts
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Framer Motion** - Animations
- **Vite** - Build tool
- **Firebase** - Authentication & Database (optional)
- **Strapi** - CMS (prepared for integration)

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Architecture Guidelines

### File Size Limits
- **Page Components**: < 100 lines
- **Feature Components**: < 200 lines
- **UI Components**: < 150 lines
- **Hooks**: < 100 lines
- **Services**: < 200 lines
- **Utils**: < 150 lines

### Component Organization
- **Feature-based**: Group related components by feature
- **Reusability**: Extract common logic to hooks
- **Composition**: Compose small components into larger ones
- **Single Responsibility**: Each component should do one thing well

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Consistent naming conventions
- Clear component structure
- Proper error handling

## 📝 Key Features

### Header Component
The header has been refactored into smaller, maintainable components:
- `HeaderLogo` - Brand logo
- `HeaderNavigation` - Desktop navigation
- `HeaderSearch` - Search functionality
- `HeaderActions` - Cart, wishlist, user actions
- `HeaderUserMenu` - User dropdown menu
- `HeaderMobileMenu` - Mobile navigation

### Pages
- **Home**: Landing page with hero section
- **Shop**: Product browsing with filters
- **Product**: Product detail page
- **Custom Design**: Custom design request form
- **Checkout**: Payment and order completion
- **Profile**: User profile management
- **Orders**: Order history and tracking
- **Admin**: Admin dashboard

## 🔌 Strapi Integration (Prepared)

The project structure is prepared for Strapi CMS integration:
- Service layer ready for API calls
- Type definitions for Strapi content types
- Hooks for data fetching
- Component structure supports CMS content

### 🔐 Strapi Authentication

The project supports **both custom backend authentication and Strapi authentication**. You can easily switch between them using an environment variable.

#### Setting Up Strapi Authentication

1. **Enable Strapi Auth in your `.env` file**:
```env
REACT_APP_USE_STRAPI_AUTH=true
REACT_APP_STRAPI_URL=http://localhost:1337
REACT_APP_STRAPI_TOKEN=your-api-token  # Optional, for admin operations
```

2. **Strapi Configuration**:
   - Ensure your Strapi instance is running
   - Configure user registration settings in Strapi admin panel
   - Set up roles and permissions (Authenticated, Admin, etc.)

3. **User Registration in Strapi**:
   - By default, Strapi requires `username`, `email`, and `password`
   - The service automatically uses `email` as `username` if not provided
   - Additional fields like `firstName` and `lastName` can be added to Strapi User content type

#### Strapi Auth Features

✅ **Login**: Email/password authentication via Strapi  
✅ **Registration**: User registration with automatic role assignment  
✅ **Get Current User**: Retrieve authenticated user information  
✅ **Update Profile**: Update user profile information  
✅ **Password Reset**: Forgot password and reset password functionality  
✅ **JWT Token Management**: Automatic token handling and storage  
✅ **Role Mapping**: Maps Strapi roles to application roles (buyer/admin)  

#### Strapi Auth Service

The `strapiAuth` service (`src/services/strapiAuth.ts`) handles all Strapi authentication operations:

```typescript
import strapiAuth from '../services/strapiAuth';

// Login
const result = await strapiAuth.login({ email, password });
// Returns: { user: User, token: string }

// Register
const result = await strapiAuth.register({ email, password, firstName, lastName });
// Returns: { user: User, token: string }

// Get current user
const user = await strapiAuth.getCurrentUser();

// Update profile
const updatedUser = await strapiAuth.updateProfile(userId, { firstName, lastName });

// Change password
await strapiAuth.changePassword(currentPassword, newPassword);

// Forgot password
await strapiAuth.forgotPassword(email);

// Reset password
await strapiAuth.resetPassword(code, password, passwordConfirmation);
```

#### Switching Between Auth Systems

The `AuthContext` automatically uses the correct authentication system based on the `REACT_APP_USE_STRAPI_AUTH` environment variable:

- **`false` or unset**: Uses custom backend (`src/services/api.ts`)
- **`true`**: Uses Strapi authentication (`src/services/strapiAuth.ts`)

Both systems provide the same interface, so no component changes are needed when switching.

#### Strapi User Content Type Setup

To use Strapi authentication with firstName and lastName:

1. In Strapi admin panel, go to **Content-Type Builder**
2. Edit the **User** content type (under **User** plugin)
3. Add fields:
   - `firstName` (Text)
   - `lastName` (Text)
4. Save and restart Strapi

#### Role Mapping

The service maps Strapi roles to your application roles:
- `Authenticated` → `buyer`
- `Public` → `buyer`
- `Admin` → `admin`
- `Editor` → `admin`

You can customize this mapping in `src/services/strapiAuth.ts` → `mapStrapiRole()` method.

### 📦 Strapi Orders

Orders are now synced to Strapi whenever a customer initiates payment.

#### Order Content Type Setup

Create a **Collection Type** named `Order` in Strapi with the following structure:

- **orderNumber**: Text (unique order reference)
- **status**: Enumeration  
  Values: `pending`, `awaiting_payment`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`, `returned`, `refunded`
- **paymentStatus**: Enumeration  
  Values: `pending`, `paid`, `failed`, `refunded`, `partially_refunded`
- **subtotal**: Decimal / float
- **shippingTotal**: Decimal / float
- **total**: Decimal / float
- **currency**: Text (default: `ZAR`)
- **notes**: Rich text (optional)
- **metadata**: JSON (optional)

Create the following **components** and attach them to the Order type:

- `order.customer` (Component, single, required)  
  - `firstName` (Text)  
  - `lastName` (Text)  
  - `email` (Email)  
  - `phone` (Text, optional)  
  - `userId` (Text, optional) – stores the authenticated user ID when available
- `order.address` (Component, single, required)  
  - `line1` (Text)  
  - `line2` (Text, optional)  
  - `city` (Text)  
  - `postalCode` (Text)  
  - `country` (Text)
- `order.order-item` (Component, repeatable, required)  
  - `name` (Text)  
  - `description` (Text, optional)  
  - `quantity` (Integer)  
  - `unitPrice` (Decimal / float)  
  - `lineTotal` (Decimal / float)  
  - `productId` (Text, optional)  
  - `sku` (Text, optional)  
  - `size` (Text, optional)  
  - `color` (Text, optional)

#### Permissions

1. Go to **Settings → Users & Permissions Plugin → Roles → Authenticated**.
2. Under **Order**, enable **create** (and read/update if desired) so logged-in users can create orders.
3. If you want guest checkout, create an API Token (Settings → API Tokens) with access to create Orders and set `VITE_STRAPI_TOKEN` in the React app.

#### Environment Variables

Add or update the following values in your `.env`:

```env
VITE_STRAPI_URL=http://localhost:1337
VITE_USE_STRAPI_AUTH=true
VITE_STRAPI_TOKEN=your-order-write-token   # optional fallback when user JWT not available
VITE_PAYPAL_PAYMENT_URL=https://www.paypal.com/ncp/payment/64D66FJ3E455E
```

#### How It Works

- Checkout gathers shipping + order details and posts them to Strapi before redirecting to PayPal.
- Orders are created with status `pending` / payment status `pending`.
- The payload includes customer details, totals, items, and shipping address.
- The new service lives in `src/services/strapiOrders.ts`.
- Types for the payload are defined in `src/types/index.ts` (`StrapiOrderCreateInput`, etc.).

> **PayPal currency note:** Hosted PayPal buttons only accept PayPal-supported currencies (USD, EUR, GBP, etc.). If a ZAR amount is passed, PayPal will automatically convert it using your account settings. Configure the hosted button inside PayPal to match your preferred currency/amount rules.

See `STRAPI_TROUBLESHOOTING.md` for diagnosing order sync issues.

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Custom components** for reusable UI elements
- **Responsive design** for all screen sizes
- **Dark mode support** (where applicable)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📚 Documentation

- Component documentation in code comments
- Type definitions for all interfaces in `src/types/`
- API service documentation in `src/services/`
- Hook usage examples in `src/hooks/`

## 🔄 Recent Refactoring

The project has been restructured for better maintainability and Strapi integration:

### Header Component Refactoring ✅
- **Before**: Single file with 1,241 lines
- **After**: Broken into 8 focused components, all < 250 lines
  - Main Header.tsx: **160 lines** ✅
  - HeaderLogo.tsx: 47 lines
  - HeaderNavigation.tsx: 109 lines
  - HeaderSearch.tsx: 220 lines
  - HeaderActions.tsx: 98 lines
  - HeaderUserMenu.tsx: 236 lines
  - HeaderMobileMenu.tsx: 300+ lines (needs further breakdown)
  - 4 custom hooks for shared logic

### File Organization ✅
- Feature-based component structure (`components/features/`)
- Clear separation of concerns
- Reusable hooks and utilities
- Prepared for Strapi CMS integration

### Cleanup Completed ✅
- ✅ Removed duplicate/unused page files (Checkout.tsx, CheckoutPage.tsx, etc.)
- ✅ Removed old component versions (old Header.tsx)
- ✅ Removed old data files (products_old.ts, products_fixed.ts)
- ✅ Removed empty/unused folders (search folder)
- ✅ Consolidated documentation into single README.md
- ✅ Updated all imports to use new structure

### Next Steps
1. **Break down HeaderMobileMenu.tsx** (~364 lines) - Extract sections into smaller components
2. **Refactor EnhancedCustomDesignPage.tsx** (1,184 lines) - Create custom-design feature structure
3. **Refactor ShopPage.tsx** - Extract filters, grid, pagination if needed
4. **Create Strapi Service Layer** - Set up services/strapi/ structure for CMS integration

## 📋 File Organization Rules

1. **Components**: Organized by feature in `components/features/`
2. **Pages**: Thin wrappers in `pages/`, business logic in features
3. **Hooks**: Shared logic extracted to `hooks/` or feature-specific `hooks/` folders
4. **Services**: API calls and data fetching in `services/`
5. **Types**: TypeScript interfaces in `types/`
6. **Utils**: Helper functions in `utils/`

## ✅ Quality Checklist

- [x] Header component refactored (< 250 lines)
- [x] Removed unused/duplicate files
- [x] Updated all imports
- [x] Created comprehensive README
- [ ] All files < 250 lines (in progress)
- [ ] Strapi service layer created (pending)

## 🚀 Deployment

```bash
# Build for production
npm run build

# The dist/ folder contains the production build
```

## 🤝 Contributing

1. Follow the file size guidelines
2. Maintain component organization
3. Write clear, documented code
4. Use TypeScript for type safety
5. Follow existing code patterns

## 📄 License

This project is proprietary software.

## 📖 Additional Documentation

- [Backend Documentation](./backend/README.md) - Backend server documentation
- [Backend Deployment](./backend/DEPLOYMENT.md) - Deployment guide

## 👥 Team

SkipaMan Development Team

---

**Note**: This project is actively maintained and follows modern React best practices. The codebase has been restructured for maintainability with all components following the < 250 lines guideline. For questions or issues, please contact the development team.
#   s k i p a m a n - o n l i n e s t o r e  
 #   s k i p a m a n o n l i n e  
 