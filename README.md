# 🛒 ShopLine – Full-Stack E-Commerce Platform

A modern, full-stack e-commerce web application built with **React** on the frontend and **Node.js / Express** on the backend, with a **MySQL** database managed through **Prisma ORM**.

> Built for: CS Final Project  
> Design: Clean Light Theme with glassmorphism, smooth animations, and a fully responsive layout.

---

## 📸 Features at a Glance

| Area | Features |
|---|---|
| 🔐 **Auth** | Register, Login, JWT-based sessions, role-based access (Admin / Customer) |
| 🏠 **Home** | Hero image slider with CTA overlay, category filter pills, featured products grid |
| 🛍️ **Products** | Product catalog, category filtering, product detail pages |
| 🛒 **Cart** | Add/remove items, update quantity, order summary with trust badges |
| 📦 **Orders** | Place orders, view order history with color-coded status badges |
| 🏷️ **Brands** | Browse all brands in a premium card grid |
| 🔑 **Admin Panel** | Manage products, categories, and view all orders (Admin only) |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |

---

## 🗂️ Project Structure

```
finalProject-main/
│
├── 📁 src/                        # React Frontend
│   ├── 📁 Components/
│   │   ├── NavBar/                # Top navigation with user profile dropdown
│   │   ├── Home/                  # Home page
│   │   ├── MainSlider/            # Hero image slider
│   │   ├── CategoriesSlider/      # Category filter pills
│   │   ├── FeatureProducts/       # Product grid with filtering
│   │   ├── Products/              # All products page
│   │   ├── Details/               # Single product detail page
│   │   ├── Cart/                  # Shopping cart page
│   │   ├── Checkout/              # Checkout / shipping address form
│   │   ├── Allorders/             # Order history page
│   │   ├── Brands/                # Brands page
│   │   ├── Login/                 # Login form
│   │   ├── Register/              # Registration form
│   │   ├── Admin/                 # Admin panel (products, categories, orders)
│   │   ├── Footer/                # Site footer
│   │   └── NotFound/              # 404 page
│   │
│   ├── 📁 Context/
│   │   ├── Token.jsx              # Manages JWT token state globally
│   │   └── cartContent.jsx        # Manages cart state globally
│   │
│   ├── 📁 ProtectedRoutes/
│   │   ├── ProtectedRoutes.js     # Blocks unauthenticated users
│   │   └── AdminRoute.js          # Blocks non-admin users from admin panel
│   │
│   ├── 📁 api/
│   │   └── api.js                 # Axios instance pointing to the backend
│   │
│   ├── index.css                  # Global design system (colors, fonts, utilities)
│   └── App.jsx                    # App routes
│
└── 📁 backend/                    # Node.js Backend
    ├── 📁 src/
    │   ├── 📁 controllers/        # Business logic for each resource
    │   ├── 📁 routes/             # API route definitions
    │   │   ├── authRoutes.js      # POST /register, POST /login
    │   │   ├── productRoutes.js   # GET /products, GET /products/:id
    │   │   ├── categoryRoutes.js  # GET /categories
    │   │   ├── orderRoutes.js     # POST /orders, GET /orders/my-orders
    │   │   └── adminRoutes.js     # Admin-only CRUD routes
    │   ├── 📁 middlewares/
    │   │   └── authMiddleware.js  # JWT verification & role checking
    │   └── 📁 config/
    │       └── prisma.js          # Prisma client singleton
    │
    ├── 📁 prisma/
    │   └── schema.prisma          # Database models (User, Product, Category, Order)
    │
    ├── server.js                  # Express server entry point
    └── .env                       # Environment variables (you create this)
```

---

## 🗄️ Database Models

| Model | Key Fields |
|---|---|
| **User** | `id`, `name`, `email`, `password` (hashed), `role` (ADMIN / CUSTOMER) |
| **Product** | `id`, `name`, `description`, `price`, `stock`, `categoryId`, `imageUrl` |
| **Category** | `id`, `name`, `slug` |
| **Order** | `id`, `userId`, `totalPrice`, `status` (PENDING / SHIPPED / DELIVERED) |
| **OrderItem** | `id`, `orderId`, `productId`, `quantity`, `priceAtPurchase` |

---

## ✅ Prerequisites – Install These First

Before you start, make sure you have the following installed on your computer:

| Tool | Why You Need It | Download |
|---|---|---|
| **Node.js v18+** | Runs both the frontend and backend | [nodejs.org](https://nodejs.org) |
| **npm** | Package manager (comes with Node.js automatically) | Included with Node.js |
| **MySQL 8+** | The database | [mysql.com](https://dev.mysql.com/downloads/mysql/) |
| **Git** | To clone the project | [git-scm.com](https://git-scm.com) |

> 💡 **Tip:** After installing Node.js, open a terminal and run `node -v` and `npm -v` to confirm they work.

---

## 🚀 How to Run Locally (Step by Step)

### Step 1 – Clone the Repository

```bash
git clone https://github.com/ahmedaborayya/AlaaFinalProject-
cd finalProject-main
```

---

### Step 2 – Set Up the Database

1. Open **MySQL Workbench** (or any MySQL client) and log in.
2. Create a new database:

```sql
CREATE DATABASE ecommerce_db;
```

3. Keep note of your MySQL **username** (usually `root`) and **password**.

---

### Step 3 – Configure the Backend Environment

Navigate into the `backend` folder and create a `.env` file:

```bash
cd backend
```

Create a new file called `.env` and paste this inside it — replacing the values with your own:

```env
# Database connection (replace with your MySQL credentials)
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/ecommerce_db"

# Secret key used to sign JWT tokens (can be any random long string)
JWT_SECRET="your_super_secret_key_here"

# Port the backend server will run on
PORT=5000
```

> ⚠️ **Important:** Never share your `.env` file. It contains sensitive credentials.

---

### Step 4 – Install Backend Dependencies & Set Up the Database

Make sure you are inside the `backend` folder, then run:

```bash
# Install all backend packages
npm install

# Push the database schema to MySQL (creates all the tables automatically)
npx prisma db push

# (Optional) Open the visual database browser
npx prisma studio
```

---

### Step 5 – Start the Backend Server

```bash
# Development mode (auto-restarts when you change files)
npm run dev

# OR production mode
npm start
```

✅ The backend API will now be running at: **`http://localhost:5000`**

---

### Step 6 – Install Frontend Dependencies

Open a **new terminal window**, go back to the root of the project:

```bash
cd ..          # go back to finalProject-main (if you were inside /backend)
npm install
```

---

### Step 7 – Start the Frontend

```bash
npm start
```

✅ The app will automatically open in your browser at: **`http://localhost:3000`**

---

### Step 8 – Create an Admin Account (Optional)

Register a normal account through the app, then use Prisma Studio or a MySQL client to change that user's role to `ADMIN`:

```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'your@email.com';
```

Or using Prisma Studio (runs in your browser at `http://localhost:5555`):

```bash
cd backend
npx prisma studio
```

Find your user, change `role` from `CUSTOMER` to `ADMIN`, and save.

---

## 🌐 API Endpoints Summary

All API endpoints are prefixed with `/api`.

### Auth
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create a new account | ❌ |
| `POST` | `/api/auth/login` | Log in, returns a JWT token | ❌ |

### Products
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/products` | Get all products | ✅ |
| `GET` | `/api/products/:id` | Get a single product | ✅ |

### Categories
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/categories` | Get all categories | ✅ |

### Orders
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/orders` | Place a new order | ✅ |
| `GET` | `/api/orders/my-orders` | Get your own orders | ✅ |

### Admin (ADMIN role required)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/orders` | View all orders |
| `PUT` | `/api/admin/orders/:id` | Update order status |
| `POST` | `/api/admin/products` | Create a product |
| `PUT` | `/api/admin/products/:id` | Update a product |
| `DELETE` | `/api/admin/products/:id` | Delete a product |
| `POST` | `/api/admin/categories` | Create a category |

---

## 📦 Full Dependency List

### Frontend (`src/`)

| Package | Purpose |
|---|---|
| `react` & `react-dom` | Core UI library |
| `react-router-dom` | Page navigation / routing |
| `axios` | HTTP requests to the backend API |
| `@tanstack/react-query` | Server state management & caching |
| `formik` + `yup` | Form handling & validation |
| `react-hot-toast` | Toast notification messages |
| `react-slick` + `slick-carousel` | Image slider / carousel |
| `react-loader-spinner` + `react-spinners` | Loading animations |
| `react-helmet` | Dynamic page `<title>` tags |
| `bootstrap` | Grid system & base utilities |
| `@fortawesome/fontawesome-free` | Icon library |

### Backend (`backend/`)

| Package | Purpose |
|---|---|
| `express` | Web server framework |
| `@prisma/client` | Type-safe database client |
| `prisma` (dev) | CLI tool for schema migrations |
| `mysql2` | MySQL database driver |
| `jsonwebtoken` | Create and verify JWT tokens |
| `bcrypt` | Hash and compare passwords securely |
| `dotenv` | Load `.env` environment variables |
| `cors` | Allow the frontend to talk to the backend |
| `morgan` | HTTP request logging in the terminal |
| `nodemon` (dev) | Auto-restart server on file changes |

---

## 🔧 Common Troubleshooting

| Problem | Solution |
|---|---|
| `Cannot connect to database` | Make sure MySQL is running. Check your `DATABASE_URL` in `.env` |
| `Port 5000 is already in use` | Change `PORT=5001` in `.env` and update `src/api/api.js` |
| `npm install` fails | Make sure you're using Node.js v18 or higher (`node -v`) |
| Frontend shows blank page | Make sure the backend is running first, then start the frontend |
| `Invalid token` error | Log out and log back in to get a fresh JWT token |

---

## 🛠️ Tech Stack Summary

```
Frontend:   React 18  ·  React Router v7  ·  TanStack Query  ·  CSS Modules
Backend:    Node.js  ·  Express.js  ·  Prisma ORM
Database:   MySQL 8
Auth:       JSON Web Tokens (JWT)  ·  bcrypt password hashing
```

---

## 📄 License

This project was built as a university final project. Feel free to use it as a learning reference.
