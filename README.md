#  TravelMS — Frontend

A full-featured Travel Management System built with **React + Vite**, integrated with a Node.js/Express backend and Razorpay payment gateway.

---

##  Tech Stack

| Tech | Usage |
|------|-------|
| React 18 | UI Framework |
| React Router v6 | Client-side routing |
| Axios | API calls |
| React Toastify | Toast notifications |
| Razorpay JS SDK | Payment gateway |
| Vite | Build tool |

---

##  Project Structure

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── api.js               # Axios instance with base URL + auth token
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── Loader.jsx
│   ├── context/
│   │   └── AuthContext.jsx      # Global auth state (user, token)
│   ├── lib/
│   │   └── helpers.js           # formatPrice, formatDate, renderStars, calcTotalPrice
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── PackagesPage.jsx
│   │   ├── PackageDetailPage.jsx
│   │   ├── BookingPage.jsx      # Book package + Razorpay payment
│   │   ├── MyBookings.jsx       # View, cancel, pay bookings
│   │   ├── MyReviews.jsx        # View, add, delete reviews
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── Dashboard.jsx
│   ├── App.jsx
│   └── main.jsx
├── .env
├── index.html
└── package.json
```

---

##  Setup & Installation

### 1. Clone & Install

```bash
git clone https://github.com/Srinivasan-0731/Tourist_Mnagemant_System_Forntend
cd travelms/frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `frontend/` root:

```env
VITE_API_URL=http://localhost:3000/api
```

>  All env variables must start with `VITE_` to be accessible in React/Vite.

### 3. Run Development Server

```bash
npm run dev
```

App runs at **http://localhost:5173** by default.

### 4. Build for Production

```bash
npm run build
```

---

##  Key Pages & Features

###  BookingPage (`/book/:packageId`)
- Select travel date, return date
- Guest counter (Adults / Children / Infants)
- Special request tags + textarea
- **Razorpay online payment** (test mode limit: ₹5,00,000)
- **Pay Later (Cash)** option — always available
- Amount warning shown if total exceeds ₹5L

###  MyBookings (`/my-bookings`)
- View all active bookings (cancelled tickets hidden)
- Status filter: All / Pending / Confirmed / Completed
- **Cancel** button for Pending + Confirmed bookings
- **Pay Now** button for unpaid Pending bookings
- Booking ticket modal with full details + Print option

###  MyReviews (`/my-reviews`)
- View all submitted reviews
- **Add Review** modal — select destination, star rating, title, comment
- Delete review with confirmation modal

---

##  Razorpay Integration

### Frontend Flow
1. User clicks **Book Now & Pay**
2. `POST /api/bookings` — creates booking in DB
3. `POST /api/payments/create-order` — creates Razorpay order
4. Razorpay popup opens
5. On success → `POST /api/payments/verify` → booking confirmed
6. On dismiss/fail → `POST /api/payments/failed` → booking stays pending

### Test Credentials (Razorpay Test Mode)
```
Card Number : 4111 1111 1111 1111
Expiry      : Any future date
CVV         : Any 3 digits
OTP         : 1234 (test)
```

>  Test mode max limit: **₹5,00,000 per transaction**

---

##  Auth Flow

- JWT token stored in `localStorage` as `token`
- Axios interceptor attaches token to every request header:
```js
Authorization: Bearer <token>
```
- On 401 response → redirect to `/login`

---

##  API Base URL

Configured in `src/api/api.js`:

```js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
```

---

##  Helper Functions (`src/lib/helpers.js`)

| Function | Usage |
|----------|-------|
| `formatPrice(amount)` | ₹1,20,000 format |
| `formatDate(date)` | 12 Jan 2025 format |
| `renderStars(rating)` | ⭐⭐⭐⭐⭐ |
| `calcTotalPrice(price, discount, adults, children)` | Total booking price |

---

##  Routes

| Path | Page | Auth Required |
|------|------|---------------|
| `/` | HomePage | No |
| `/packages` | PackagesPage | No |
| `/packages/:id` | PackageDetailPage | No |
| `/book/:packageId` | BookingPage |  Yes |
| `/my-bookings` | MyBookings |  Yes |
| `/my-reviews` | MyReviews |  Yes |
| `/dashboard` | Dashboard |  Yes |
| `/login` | LoginPage | No |
| `/register` | RegisterPage | No |

---

## Common Issues

| Issue | Fix |
|-------|-----|
| API calls fail | Check `VITE_API_URL` in `.env` |
| Razorpay popup not opening | Add Razorpay script in `index.html` |
| Amount exceeds limit error | Reduce guests or use Pay Later |
| Token expired error | Re-login to get fresh token |

### Razorpay Script in `index.html`
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

---

##  Support

- Email: support@travelms.com
- Phone: +91 98765 43210

---

*Built with using MERN Stack*