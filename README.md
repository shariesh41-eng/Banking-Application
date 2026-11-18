# NOVABANK Digital Banking Platform Foundation

> Enterprise-grade digital banking web application foundation built with **React.js**, **Vite**, **JavaScript ES Modules**, **Tailwind CSS**, and **React Context API**.

---

## 🏛️ Executive Architecture Overview

NOVABANK is a multi-persona digital banking and institutional treasury interface designed according to senior fintech architectural principles. The system implements a role-based operational framework serving three distinct banking environments:

1. **Authentication & Onboarding Gateway (`AuthLayout`)**: Complete 9-screen authentication lifecycle including welcome gateway, feature walkthrough, customer registration with live password strength analysis, login with 1-click role switcher, forgot/reset password flows, 6-digit OTP verification demonstration, profile personalization, and graceful logout confirmation.
2. **Private Client Banking (`CustomerLayout`)**: High-net-worth portfolio overview, multi-account ledger, instant ACH & Fedwire transfers, 3D corporate card controls with live freeze/unfreeze, and searchable transaction analytics.
3. **Super Admin Platform Operations (`AdminLayout`)**: System health telemetry, API SLA uptime diagnostics, real-time WAF threat metrics, directory user impersonation, and SOC 2 immutable cryptographic audit trails.
4. **Credit & Relationship Management (`EmployeeLayout`)**: Commercial credit queue, SME facility underwriting workbench with instant approval/rejection actions, and client KYC document clearance.

---

## 🔐 Complete Authentication Module (9 Screens)

| Screen | Route | Description |
| :--- | :--- | :--- |
| **1. Welcome Gateway** | `/auth/welcome` | Hero introduction with 3 action cards and 1-click demo access banner |
| **2. Platform Tour** | `/auth/onboarding` | Interactive 3-step feature journey (Treasury, Clearing, Zero-Trust) |
| **3. Customer Registration** | `/auth/register` | Facility picker, name, email & phone validation, live password meter |
| **4. Login Portal** | `/auth/login` | Multi-role login, remember terminal, forgot password, demo banner |
| **5. Forgot Password** | `/auth/forgot-password`| Delivery method toggle (Email vs SMS), validation, code dispatch |
| **6. Reset Password** | `/auth/reset-password` | New passkey input with live criteria analysis and success state |
| **7. OTP Verification** | `/auth/otp` | 6-digit auto-advancing boxes, paste support, 60s timer, master code `123456` |
| **8. Profile Setup** | `/auth/profile-setup` | Avatar selection, 4-digit wire PIN creation, notification preferences |
| **9. Logout Confirmation**| `/auth/logout` | Session teardown screen + global `LogoutConfirmModal` dialog |

---

## 🔑 Clearly Documented Demo Credentials

> ⚠️ **Important Security Notice**: This is frontend demo authentication only for interface evaluation and design testing. Do not store real passwords or imply that client-side authentication is production-secure. Production authentication must always be handled by an isolated, audited backend API gateway.

| Role | Name | Email | Password | Assigned Dashboard |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | Alexandra Morgan | `customer@novabank.com` | `Customer@123` | `/customer/dashboard` |
| **Bank Employee** | David Chen | `employee@novabank.com` | `Employee@123` | `/employee/dashboard` |
| **Admin** | Elena Rostova | `admin@novabank.com` | `Admin@123` | `/admin/dashboard` |

*Demo OTP master test code: `123456` (or click "Auto-fill" on the OTP screen).*

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | **React.js 18** | Functional components, custom hooks, and Context API |
| **Build Tool** | **Vite 5** | Lightning-fast HMR and optimized ES module bundling |
| **Styling** | **Tailwind CSS 3** | Custom fintech palette (Navy, Royal Blue, Teal, Slate) |
| **Routing** | **React Router DOM 6** | Role-guarded nested layout routes and navigation |
| **Icons** | **Lucide React** | Consistent, lightweight fintech SVG iconography |
| **Analytics** | **Recharts 2** | Responsive cash flow velocity area and donut charts |
| **Notifications**| **React Hot Toast** | Centralized notification queue with fintech theme |

---

## 🚀 Installation & Execution

### Navigate to Project Directory
```powershell
cd "C:\Users\Administrator\Downloads\Banking Aplication\Front End"
```

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Launches on `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied).

### 3. Production Build
```bash
npm run build
```
Creates an optimized static bundle in `dist/`.

---

## 🛡️ License & Compliance Notice

This foundation is crafted as an institutional reference architecture. All mock entities and simulated accounts reflect standard FDIC, Equal Housing Lender, and SOC 2 Type II compliance interfaces.
