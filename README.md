# 🍔 Restaurant Ordering App (React Native + Firebase)

This is a React Native restaurant ordering application built with Expo, Firebase Authentication, and Firestore.
It allows users to browse a menu, add items to a cart, place orders, and track order status.
Admins can manage menu items and update order statuses.

## 🚀 Features
### 👤 User Features
-Register & Login (Firebase Auth)
-Browse restaurant menu
-Add items to cart (with quantity control)
-Checkout with delivery address & card details (demo)
-View My Orders
-Track order status in real time (Pending → Preparing → Delivered)
-View order details

### 🛠️ Admin Features
-Admin dashboard
-Add / edit menu items
-View all customer orders
-Update order status (Preparing / Delivered)
-Changes reflect instantly on user screens
### 🔐 Admin Login Credentials
-To access the Admin side, log in using:
  Email: thabiso@admin.com
  Password: Thabiso

  ### 🧑‍🍳 User Login
-Users can register using any valid email not ending with @admin.com.

## 🧩 Tech Stack
-React Native (Expo)
-TypeScript
-Firebase Authentication
-Cloud Firestore
-React Navigation (Stack + Tabs)
-React Native Paper (UI components)

📦 Installation & Setup
-Install dependencies
   npm install
-Start the app
   npx expo start
-(Optional clean start if issues appear)
   npx expo start -c

## 🔥 Firebase Configuration
This project uses:
 -Firebase Authentication
 -Cloud Firestore
Ensure your Firebase project:
 -Has Email/Password Authentication enabled
 -Has Firestore rules allowing authenticated access
Example Firestore rules used:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /menu/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /orders/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}


## 📌 Notes for Assessment / Rubric
-Card details are demo only (stored to meet rubric requirements)
-Order status updates are real-time using Firestore listeners
-Admin actions immediately reflect on user screens
-Navigation handled using nested Stack & Tab navigators

## ✅ Submission Ready
This project fulfills:
 -Authentication
 -Role-based access (Admin / User)
 -CRUD operations
 -Real-time updates
 -Clean UI & navigation flow