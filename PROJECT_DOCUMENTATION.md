# HarvestGo Tanzania Connect Documentation

## Project Overview
HarvestGo is a platform that connects buyers, local vendors, and delivery drivers to facilitate the purchase and delivery of fresh farm produce. The application streamlines the process of browsing crops, selecting vendors, and arranging doorstep delivery, with dedicated flows for buyers, vendors, and drivers.

## Tech Stack
- **Vite**: Fast build tool and development server
- **TypeScript**: Type-safe JavaScript
- **React**: UI library for building interactive interfaces
- **shadcn-ui**: Component library for modern UI elements
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **TanStack React Query**: Data fetching and caching

## Directory Structure
```
harvestgo-tanzania-connect/
├── public/                # Static assets
├── src/                   # Main source code
│   ├── components/        # Reusable UI, shared, and layout components
│   │   ├── layout/        # Layout components (Header, Footer, Layout)
│   │   ├── shared/        # Shared components (e.g., Map)
│   │   └── ui/            # UI components (buttons, forms, sidebar, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries (e.g., utils.ts)
│   ├── pages/             # Application pages, grouped by user type
│   │   ├── auth/          # Authentication pages (Login, Register)
│   │   ├── buyer/         # Buyer-specific pages (Map, Order Tracking, etc.)
│   │   ├── driver/        # Driver dashboard
│   │   └── vendor/        # Vendor dashboard and inventory
│   ├── App.tsx            # Main app component and routing
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── package.json           # Project dependencies and scripts
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
├── tsconfig*.json         # TypeScript configuration
└── README.md              # Basic project info
```

---

## Routing & Main Flows

The application uses React Router for client-side navigation. The main routes and their purposes are:

- `/` — **Landing Page**: Introduction to the platform, how it works, and entry points for buyers, vendors, and drivers.
- `/login` — **Login Page**: User authentication for all roles.
- `/register` — **Register Page**: User registration for buyers, vendors, and drivers.

### Buyer Flows
- `/buyer/map` — **Buyer Map**: Main interface for buyers to browse vendors and crops on a map.
- `/buyer/order-confirmation` — **Order Confirmation**: Confirms a buyer's order details before finalizing.
- `/buyer/tracking` — **Order Tracking**: Allows buyers to track their order delivery status in real time.

### Vendor Flows
- `/vendor/dashboard` — **Vendor Dashboard**: Vendor's main interface for managing orders and profile.
- `/vendor/inventory` — **Vendor Inventory**: Manage and update available crops/products.

### Driver Flows
- `/driver/dashboard` — **Driver Dashboard**: Interface for drivers to view and manage delivery assignments.

### Error Handling
- `*` — **NotFound**: Catch-all route for undefined paths, displaying a 404 or not found page.

All routes are defined in `src/App.tsx` and leverage code-splitting for performance. Each user type (buyer, vendor, driver) has a dedicated set of pages and flows.

---

## Key Components

The `src/components/` directory is organized into three main groups:

### Layout Components (`components/layout/`)
- **Layout.tsx**: Wraps pages with consistent structure and styling.
- **Header.tsx**: Top navigation bar, may include branding, navigation links, and user actions.
- **Footer.tsx**: Bottom section with additional links or information.

### Shared Components (`components/shared/`)
- **Map.tsx**: Shared map component, likely used for displaying locations for buyers, vendors, or drivers.

### UI Components (`components/ui/`)
Reusable, atomic UI elements and advanced widgets, including:
- **Buttons, Inputs, Forms**: Standard form and action controls.
- **Sidebar, NavigationMenu, Menubar**: Navigation elements for dashboards and main flows.
- **Table, Card, Badge, Alert, Dialog, Drawer, Popover, Tooltip, Toast, Toaster**: Rich UI elements for displaying data, notifications, and modals.
- **Carousel, Chart, Calendar, Pagination**: Advanced widgets for data display and interaction.
- **Custom Components**: E.g., `sidebar.tsx` (large, likely dashboard navigation), `chart.tsx` (data visualization), `form.tsx` (form handling), and more.

All UI components are styled with Tailwind CSS and many are built on top of shadcn-ui primitives, ensuring a modern and consistent look.

---

## Custom Hooks & Utilities

### Custom Hooks (`src/hooks/`)
- **use-mobile.tsx**: Detects if the user is on a mobile device, enabling responsive or mobile-specific UI logic.
- **use-toast.ts**: Provides a custom hook for managing toast notifications, likely used throughout the app for user feedback.

### Utilities (`src/lib/`)
- **utils.ts**: Contains general-purpose utility functions used across the codebase.

These hooks and utilities help keep the codebase modular, maintainable, and DRY (Don't Repeat Yourself).

---

## Minor Features

- **Toasts & Notifications**: The app uses custom toasts (`toast.tsx`, `toaster.tsx`, `sonner.tsx`) and the `use-toast` hook to provide user feedback for actions like form submissions, errors, and status updates.
- **Tooltips**: Tooltips are provided via `tooltip.tsx` and `TooltipProvider`, enhancing usability by giving users contextual hints.
- **Dialogs, Drawers, Popovers**: Used for modals, side panels, and overlays to display additional information or actions without navigating away from the current page.
- **Responsive Design**: The `use-mobile` hook and Tailwind CSS ensure the app works well on both desktop and mobile devices.
- **Data Visualization**: Components like `chart.tsx` and `calendar.tsx` provide visual representations of data for dashboards and analytics.
- **Advanced Navigation**: Components like `sidebar.tsx`, `navigation-menu.tsx`, and `menubar.tsx` offer rich navigation experiences for different user roles.

These features contribute to a modern, user-friendly, and interactive application experience.

---

## How to Run, Develop, and Build

### Prerequisites
- Node.js and npm installed (recommended: use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Setup & Development
1. **Clone the repository:**
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm run dev
   ```
   This will launch the app with hot reloading at `http://localhost:5173` (default Vite port).

### Build for Production
```sh
npm run build
```
The output will be in the `dist/` directory, ready for deployment.

### Deployment
- You can deploy using the Lovable platform or any static hosting provider.
- For custom domains, follow the Lovable documentation or your host's instructions.

---

Next sections will cover Key Components, Custom Hooks, and more. 

# Migration & Integration Checklist

This section provides a step-by-step guide for migrating from mock/demo data to a full production-ready app using Google Cloud (Firestore, Auth, Maps, etc.), and for integrating all required features.  
**Check off each [ ] as you complete it!**

---

## 1. Map Integration (Google Maps)

**Current State:**  
- The app uses a mock `Map.tsx` component (`src/components/shared/Map.tsx`) that draws a grid and places SVG markers for vendors, drivers, and the user.
- No real roads, shops, or live driver movement.

**To Do:**  
- [ ] Replace mock Map with Google Maps React SDK  
- [ ] Add Google Maps API key to environment variables  
- [ ] Update `BuyerMap.tsx` to use real map, markers, and routes  
- [ ] Implement real-time vendor/driver locations using Firestore or Realtime Database  
- [ ] Remove all mock data for vendors, drivers, and routes  
- [ ] Add custom map markers for vendors, drivers, and buyers  
- [ ] Implement route calculation using Google Directions API  
- [ ] Add map controls (zoom, recenter, etc.)

**How To:**  
1. Install Google Maps React library:  
   ```sh
   npm install @react-google-maps/api
   ```
2. Get a Google Maps API key: [Google Cloud Console](https://console.cloud.google.com/)
3. Add your API key to `.env`:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_key_here
   ```
4. Replace the `Map.tsx` implementation with the Google Maps component.  
   - See [@react-google-maps/api docs](https://react-google-maps-api-docs.netlify.app/)
5. In `BuyerMap.tsx`, update all map logic to use Google Maps, and fetch vendor/driver locations from Firestore.
6. Remove all hardcoded/mock vendor and driver data.

---

## 2. Authentication (Google Auth)

**Current State:**  
- Auth pages exist (`src/pages/auth/Login.tsx`, `Register.tsx`), but may use mock logic or local state.

**To Do:**  
- [ ] Integrate Firebase Auth (Google, Email/Password, Phone/OTP)  
- [ ] Add language switcher (English/Kiswahili)  
- [ ] Remove any mock user data or local-only auth logic  
- [ ] Store user roles (buyer, vendor, driver) in Firestore

**How To:**  
1. Set up Firebase project: [Firebase Console](https://console.firebase.google.com/)
2. Install Firebase SDK:
   ```sh
   npm install firebase
   ```
3. Initialize Firebase in `src/lib/firebase.ts` (create this file).
4. Update Login/Register pages to use Firebase Auth methods.
5. Store user profile and role in Firestore after registration.
6. Add language switcher UI and logic.

---

## 3. Database (Firestore)

**Current State:**  
- All data (vendors, crops, orders, drivers) is likely mock/sample data in code.

**To Do:**  
- [ ] Set up Firestore database  
- [ ] Create collections: `users`, `vendors`, `crops`, `orders`, `drivers`, `payments`  
- [ ] Remove all sample/mock data from components and pages  
- [ ] Update all data fetching to use Firestore queries  
- [ ] Add real-time listeners for order status, driver location, etc.

**How To:**  
1. In Firebase Console, create the required collections.
2. In your code, replace all mock data arrays/objects with Firestore queries.
3. Use Firestore's `onSnapshot` for real-time updates (e.g., order status, driver location).
4. Remove all hardcoded data from `BuyerMap.tsx`, `VendorDashboard.tsx`, etc.

---

## 4. Payments (M-Pesa, Airtel Money, Card)

**Current State:**  
- Payment logic is not implemented or is mocked.

**To Do:**  
- [ ] Integrate payment providers (M-Pesa, Airtel Money, VISA/MasterCard)  
- [ ] Add payment UI to order confirmation and vendor payout screens  
- [ ] Implement payment splitting (vendor/driver commission)  
- [ ] Store payment records in Firestore

**How To:**  
1. Choose a payment gateway (e.g., [Flutterwave](https://www.flutterwave.com/), [Paystack](https://paystack.com/), or direct integration).
2. Follow the provider's docs to set up payment flows.
3. Add payment logic to order confirmation in `BuyerMap.tsx` and vendor payout in `VendorDashboard.tsx`.
4. Store payment results in Firestore.

---

## 5. Notifications (Push, SMS, In-App)

**Current State:**  
- Only in-app toasts/alerts are implemented.

**To Do:**  
- [ ] Integrate Firebase Cloud Messaging for push notifications  
- [ ] Add SMS notifications (e.g., via Twilio)  
- [ ] Add in-app notification center  
- [ ] Remove any mock notification logic

**How To:**  
1. Set up Firebase Cloud Messaging in Firebase Console.
2. Install FCM SDK and configure in your app.
3. Add notification logic to order status changes, new orders, etc.
4. For SMS, set up Twilio or similar and trigger from backend functions.

---

## 6. Real-Time Order & Driver Tracking

**Current State:**  
- Order and driver tracking is simulated with mock data.

**To Do:**  
- [ ] Use Firestore or Realtime Database for live order and driver updates  
- [ ] Update map and order tracking UI to reflect real-time changes  
- [ ] Remove all mock tracking logic

**How To:**  
1. On order creation, write order and driver info to Firestore.
2. Use Firestore listeners to update UI as driver/vendor/order status changes.
3. Animate driver marker on map as location updates.

---

## 7. Admin Panel

**Current State:**  
- No admin panel or only mock logic.

**To Do:**  
- [ ] Build admin dashboard for user/vendor/driver management  
- [ ] Add analytics, order management, support tools  
- [ ] Restrict access to admin users only

**How To:**  
1. Create new pages/components for admin features.
2. Use Firestore for all admin data.
3. Add role-based access control.

---

## 8. Removing Dummy Data

**To Do:**  
- [ ] Identify all files/components using mock/sample data  
- [ ] Replace with Firestore queries or real API calls  
- [ ] Remove all hardcoded arrays/objects

**How To:**  
- Search for arrays/objects like `const vendors = [...]` or `const mockOrders = [...]` in the codebase.
- Replace with Firestore fetches.
- Test all flows to ensure no mock data remains.

---

## 9. Extending & Adding Features

**How To:**  
- To add a new feature (e.g., referral program, promo codes, chat), create a new component/page in `src/pages/` or `src/components/`.
- Use Firestore for all data storage.
- Follow the same integration steps as above for any new third-party service.

---

# Codebase Walkthrough

- **src/components/**: All reusable UI, layout, and shared components.
- **src/pages/**: Main app pages, grouped by user type (auth, buyer, vendor, driver).
- **src/hooks/**: Custom React hooks for state and logic.
- **src/lib/**: Utility functions and (eventually) Firebase/Google integration code.
- **src/App.tsx**: Main app component and route definitions.
- **src/index.css**: Global styles (Tailwind CSS).
- **public/**: Static assets.

---

# How to Add or Change Features

1. **To add a new page:**  
   - Create a new file in `src/pages/` and add a route in `src/App.tsx`.
2. **To add a new component:**  
   - Add to `src/components/ui/` or `src/components/shared/`.
3. **To fetch/store data:**  
   - Use Firestore queries in your component or a custom hook.
4. **To add authentication:**  
   - Use Firebase Auth methods in your auth pages.
5. **To add notifications:**  
   - Use Firebase Cloud Messaging or Twilio for push/SMS.

---

# General Best Practices

- Always remove mock/sample data before going live.
- Store all user, order, and payment data in Firestore.
- Use environment variables for API keys and secrets.
- Test all flows with real data before launch.
- Document every new feature or integration in this file.

--- 