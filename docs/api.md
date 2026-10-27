# HotelPro REST API Specification

This document details the REST API endpoints implemented in the HotelPro MERN stack backend.

**Base URL**: `http://localhost:5000/api`  
**Authentication**: Bearer JWT token in `Authorization` header (`Bearer <token>`)

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
Register a new guest account.
- **Request Body**:
  ```json
  {
    "name": "Aarav Sharma",
    "email": "guest@hotelpro.in",
    "password": "Password123!",
    "phone": "+91 98201 12345"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": { "id": "...", "name": "Aarav Sharma", "role": "guest" }
  }
  ```

### `POST /api/auth/login`
Authenticate existing user (Guest, Staff, Manager, Admin).
- **Request Body**:
  ```json
  {
    "email": "manager@hotelpro.in",
    "password": "Password123!"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": { "id": "...", "role": "manager", "hotelId": "..." }
  }
  ```

---

## 2. Hotels (`/api/hotels`)

### `GET /api/hotels`
List all hotel properties with optional search and city filters.
- **Query Params**: `city=Udaipur`, `minPrice=5000`, `maxPrice=25000`
- **Response `200 OK`**:
  ```json
  [
    {
      "id": "htl_udaipur_01",
      "name": "The Grand Mewar Palace & Spa",
      "city": "Udaipur",
      "state": "Rajasthan",
      "gstin": "08AABCT4821L1Z8",
      "startingPrice": 14500,
      "rating": 4.9
    }
  ]
  ```

### `POST /api/hotels` (Super Admin Only)
List a new hotel property.
- **Headers**: `Authorization: Bearer <admin-token>`
- **Response `201 Created`**

---

## 3. Bookings (`/api/bookings`)

### `POST /api/bookings`
Create a new room reservation with server-side Indian GST (SAC 9963) price calculation.
- **Request Body**:
  ```json
  {
    "hotelId": "htl_udaipur_01",
    "categoryId": "cat_ud_01",
    "checkIn": "2026-11-10",
    "checkOut": "2026-11-13",
    "guestsCount": 2,
    "roomsCount": 1,
    "couponCode": "NAMASTE10",
    "guestGstin": "27AABCM7731M1ZF"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "bookingReference": "HP-IND-2026-UD1014",
    "priceBreakdown": {
      "nights": 3,
      "grossRoomTariff": 43500,
      "discountAmount": 2175,
      "netTaxableAmount": 41325,
      "gstRate": 0.18,
      "cgstAmount": 3719,
      "sgstAmount": 3720,
      "totalGst": 7439,
      "grandTotal": 48764
    }
  }
  ```

### `POST /api/bookings/:id/cancel`
Cancel booking and trigger Razorpay refund workflow.
- **Response `200 OK`**: `{ "status": "Cancelled", "refundStatus": "Requested" }`

---

## 4. Front Desk Operations (`/api/check-in` & `/api/check-out`)

### `POST /api/check-in` (Staff/Manager Only)
Complete Indian Govt ID verification (Aadhaar/Passport) and issue keycard.
- **Request Body**:
  ```json
  {
    "bookingId": "bkg_001",
    "idProofType": "Aadhaar Card",
    "idProofNumber": "XXXX-XXXX-4819",
    "keyCardAssigned": "KC-104"
  }
  ```

### `POST /api/check-out` (Staff/Manager Only)
Complete departure and automatically spawn a Housekeeping cleaning task.
- **Request Body**:
  ```json
  {
    "bookingId": "bkg_001",
    "feedbackRating": 5,
    "additionalChargesInr": 0
  }
  ```

---

## 5. Housekeeping (`/api/housekeeping`)

### `GET /api/housekeeping`
Get tasks for hotel.
- **Status transitions**: `Pending` -> `In Progress` -> `Completed`
- When marked `Completed`, room operational status is automatically reset to `Available`.

---

## 6. Reports & Analytics (`/api/reports`)

### `GET /api/reports/occupancy` (Manager/Admin Only)
Calculates current room occupancy percentage and ADR (Average Daily Rate).

### `GET /api/reports/revenue` (Manager/Admin Only)
Returns monthly and category revenue figures formatted in Indian Rupees.
