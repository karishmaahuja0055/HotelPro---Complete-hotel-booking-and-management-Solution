# HotelPro — Complete Indian Hotel Booking & Hospitality Management System

![HotelPro Architecture](https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80)

**HotelPro** is an enterprise-grade, academic portfolio-standard Hotel Management & Reservation System built from scratch on the **MERN** stack (MongoDB, Express.js, React, Node.js) specifically optimized for the **Indian Hospitality Region**.

It features dynamic room reservation workflows, certified **Indian GST Tax Invoicing (SAC 9963)** with CGST & SGST breakdowns, **Razorpay** payment gateway integration (with instant UPI / NetBanking / Cards / Pay at Check-in simulation), and **four distinct authenticated roles** (Guest, Staff, Manager, Super Admin) with operational check-in, checkout, and housekeeping automation.

---

## 🌟 Key Highlights & Regional Indian Optimizations

1. **Indian Regional Customization**:
   - **Destinations**: Handcrafted luxury palace and resort destinations across India:
     - Udaipur (The Grand Mewar Palace & Spa)
     - Goa (Goa Palms & Azure Beach Resort)
     - Jaipur (Royal Amber Haveli & Heritage Retreat)
     - Mumbai (The Bayview Marine Grand Hotel)
     - Munnar (Misty Hills Tea Estate & Retreat)
     - Bengaluru (The Silicon Valley Grand Suites)
     - Varanasi & Manali chalets
   - **Currency**: All tariffs, invoices, reports, and payments in Indian Rupees (**₹ INR**) with authentic Indian number grouping (`₹1,25,000`).
   - **Indian Phone Validation**: Strict `+91` country code handling and 10-digit authentic Indian mobile formatting (e.g., `+91 98201 12345`).
   - **GST Compliance (SAC 9963)**: Automatic tax calculation as per Section 31 of the CGST Act 2017:
     - Room tariff $\le$ ₹7,500/night: **12% GST** (6% CGST + 6% SGST)
     - Room tariff $>$ ₹7,500/night: **18% GST** (9% CGST + 9% SGST)
     - B2B Input Tax Credit with optional 15-character corporate GSTIN input
     - Printable tax invoice with amount in Indian words (e.g. *Rupees Forty-Eight Thousand Seven Hundred Sixty-Four Only*).
   - **Payment Gateway**: Authentic **Razorpay** modal supporting UPI (Google Pay, PhonePe, Paytm, BHIM), NetBanking (SBI, HDFC, ICICI, Axis), Credit/Debit Cards (RuPay, Visa, Mastercard), and Guaranteed Pay-at-Hotel.

2. **Four Authenticated User Roles**:
   - **Guest**: Browse hotels, select room categories, apply festive coupon `NAMASTE10`, checkout with Razorpay, view/print GST invoices, request in-room dining, cancel stays with instant refund.
   - **Hotel Staff**: Front Desk arrival queue, Indian Govt ID verification (Aadhaar / Passport), keycard issuance, departure checkout processing, automatic housekeeping task creation, room cleaning completion.
   - **Hotel Manager**: Occupancy rate percentage, gross revenue analytics with Recharts, room status inventory grid, real-time dynamic room tariff adjuster.
   - **Super Admin**: Platform-wide metrics, multi-property oversight across Indian states, new hotel listing creator, user directory, and immutable security audit logs.

---

## 👥 Demo Accounts (1-Click Switcher Available in UI)

| Role | Name | Email | Phone | Password |
|---|---|---|---|---|
| **Guest** | Aarav Sharma | `guest@hotelpro.in` | `+91 98201 12345` | `Password123!` |
| **Front Desk Staff** | Priya Verma | `staff@hotelpro.in` | `+91 98112 23456` | `Password123!` |
| **Hotel Manager** | Vikramaditya Singh | `manager@hotelpro.in` | `+91 94140 34567` | `Password123!` |
| **Super Admin** | Rajeshwari Devi | `admin@hotelpro.in` | `+91 98450 45678` | `Password123!` |

> **Portfolio Demo Tip**: Use the **"Role: [Role Name] ▼"** dropdown in the top navigation bar to instantaneously switch roles without typing credentials!

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts, Canvas-Confetti
- **Backend**: Node.js, Express.js, Mongoose, JWT Authentication, bcryptjs, Helmet, CORS
- **Database**: MongoDB (Atlas or Local)
- **Testing**: Node.js built-in test runner (`node:test`, `node:assert/strict`) via `tsx`
- **Payments**: Razorpay API (with test sandbox and client-side simulation)

---

## 💻 Local Development Setup (Windows / macOS / Linux)

### Prerequisites
- Node.js (version 18+ or 20+ LTS recommended)
- npm or bun
- MongoDB (Local instance or free MongoDB Atlas cluster URI)

### Quick Start (Full App)

```bash
# 1. Clone repository
git clone https://github.com/your-username/hotelpro.git
cd hotelpro

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Run automated unit tests
npm test # or npx tsx --test src/utils/pricing.test.ts

# 5. Start dev server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🧪 Automated Testing

Pure calculation and regional logic is tested using Node's test runner:

```bash
npx --yes tsx --test src/utils/pricing.test.ts
```

Tests cover:
- Multi-night calculation
- 12% GST calculation for room rates $\le$ ₹7,500
- 18% GST calculation for room rates $>$ ₹7,500
- Indian Rupee comma formatting (`formatINR`)
- 10-digit Indian mobile validation with `+91`
- 15-character Indian GSTIN verification

---

## 📜 GST Tax Invoice Sample (SAC 9963)
Every completed stay automatically generates an Indian Tax Invoice compliant with Section 31 of the CGST Act, including:
- Hotel Name, Address, and GSTIN
- SAC Code: 9963
- Guest Name, +91 Phone, Address, and optional B2B GSTIN
- Itemized nightly room charge, promo discount, net taxable value
- Split 50-50 CGST and SGST
- Amount in Words with Indian Rupee syntax
- Print-optimized CSS stylesheet (`@media print`)

---

## 📄 License
This project is licensed under the Apache-2.0 License. Built for academic and professional engineering evaluation.
