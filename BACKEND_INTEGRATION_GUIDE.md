# Backend Integration Guide: Firebase & Google Maps

This guide will walk you step-by-step through integrating Firebase (Firestore, Auth) and Google Maps into your HarvestGo project. Follow each step in order—even if you're a complete beginner, you'll be able to connect your app to a real backend and map provider!

---

## 1. Set Up Your Google Cloud & Firebase Project

### 1.1. Create a Google Account (if you don't have one)
- Go to [accounts.google.com](https://accounts.google.com/) and sign up.

### 1.2. Create a Firebase Project
- Visit [Firebase Console](https://console.firebase.google.com/)
- Click **Add project** and follow the prompts (give it a name, accept terms, etc.)
- Once created, you'll be taken to your project dashboard.

### 1.3. Register Your App in Firebase
- In the Firebase Console, click the **Web** icon (`</>`) to add a web app.
- Give it a nickname (e.g., "HarvestGo Web") and register.
- You'll get a Firebase config object—**copy this, you'll need it soon!**

---

## 2. Install Required Packages in Your Project

Open your terminal in your project directory and run:

```sh
npm install firebase @react-google-maps/api
```
- `firebase`: For Firestore, Auth, and other backend services
- `@react-google-maps/api`: For Google Maps integration in React

---

## 3. Add Environment Variables

Create a `.env` file in your project root (if it doesn't exist) and add:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```
- Replace each value with the corresponding value from your Firebase config and Google Cloud Console (for Maps API key).

**Never commit your .env file to public repositories!**

---

## 4. Initialize Firebase in Your Project

Create a new file: `src/lib/firebase.ts`

```ts
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

---

## 5. Connect Firestore (Database)

### 5.1. Add Data to Firestore
- In the Firebase Console, go to **Firestore Database** > **Create database** (choose test mode for now).
- Create collections like `users`, `vendors`, `crops`, `orders`, `drivers`.

### 5.2. Fetch Data from Firestore
Example: Fetch all vendors in a React component

```ts
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function fetchVendors() {
  const querySnapshot = await getDocs(collection(db, 'vendors'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

### 5.3. Add Data to Firestore
```ts
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

async function addVendor(vendor) {
  await addDoc(collection(db, 'vendors'), vendor);
}
```

---

## 6. Set Up Authentication

### 6.1. Enable Auth Providers
- In Firebase Console > **Authentication** > **Get started**
- Enable Email/Password, Google, and/or Phone providers as needed

### 6.2. Use Auth in Your App
Example: Sign up a user
```ts
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

async function signUp(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}
```

---

## 7. Integrate Google Maps

### 7.1. Add Google Maps to a Component
```tsx
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '400px' };
const center = { lat: -6.7924, lng: 39.2083 }; // Example: Dar es Salaam

function MyMapComponent() {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {/* Example marker */}
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}
```
- Replace the mock `Map.tsx` with a real map using this approach.
- Use Firestore data to place vendor/driver markers dynamically.

---

## 8. Store and Retrieve Data in Real Time

- Use Firestore's `onSnapshot` for real-time updates (e.g., order status, driver location):

```ts
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

function listenToOrders(callback) {
  return onSnapshot(collection(db, 'orders'), (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(orders);
  });
}
```

---

## 9. Best Practices & Next Steps

- **Never commit your .env file to version control.**
- **Secure your Firestore rules before going live!**
- Use Firestore for all app data (users, vendors, orders, etc.)
- Use Google Maps for all map features (location, routes, markers)
- Test each integration step before moving to the next
- Document every new feature or integration in your main documentation

---

You now have a step-by-step guide to connect your app to Firebase and Google Maps. For more advanced features (payments, notifications, etc.), see the main `PROJECT_DOCUMENTATION.md`. 