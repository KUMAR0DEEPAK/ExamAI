# ExamAI 🚀

ExamAI is a modern, AI-powered exam and study assistant. It helps students generate comprehensive study notes, view interactive concept maps using Mermaid.js diagrams, visualize performance data, export study materials to PDF format, and purchase study credits or subscriptions.

---

## 🛠️ Tech Stack

### Client (Frontend)
- **Framework:** React 19 (Vite)
- **Routing:** React Router v7
- **State Management:** Redux Toolkit
- **Styling:** TailwindCSS v4 & React Icons
- **Animations:** Motion (Framer Motion)
- **Data Visualizations:** Recharts (performance/credit tracking) & Mermaid (concept maps / flowcharts)
- **Text Rendering:** React Markdown

### Server (Backend)
- **Runtime Environment:** Node.js (Express.js)
- **Database:** MongoDB (via Mongoose)
- **PDF Generation:** PDFKit
- **Payment Gateway:** Razorpay
- **AI Integration:** Google Gemini API
- **Auth & Session Management:** JSON Web Token (JWT) & Cookies

---

## 📂 Project Structure

```text
ExamAI/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── assets/         # Images & static assets
│   │   ├── component/      # Reusable UI components (Sidebar, Navbar, ThemeToggle, etc.)
│   │   ├── pages/          # Main views (Home, Auth, Notes, History, Pricing)
│   │   ├── redux/          # Redux Toolkit state slice (user store)
│   │   └── services/       # API call configurations
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend Node.js Express API
│   ├── controllers/        # Business logic for auth, notes generation, payments, and PDF creation
│   ├── middleware/         # Custom authentication guards
│   ├── models/             # Mongoose schemas (User, Notes, Subscriber)
│   ├── routes/             # Express route routing configurations
│   ├── utils/              # Database connection, prompt builders, JWT token generators
│   └── index.js            # Server entry point
│
└── README.md               # Project documentation (this file)
```

---

## ⚙️ Setup & Configuration

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+ recommended) and [MongoDB](https://www.mongodb.com/) installed and running locally.

### 1. Environment Variables Configuration

You need to create a `.env` file in **both** the `client/` and `server/` directories.

#### **Client Configuration (`client/.env`)**
Create `client/.env` and add:
```env
VITE_API_URL=http://localhost:8000/api
```

#### **Server Configuration (`server/.env`)**
Create `server/.env` and add:
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/examai     # Your MongoDB connection string
JWT_SECRET=your_jwt_secret_key                 # Secret key for token signing
GEMINI_API_KEY=your_gemini_api_key             # API Key from Google AI Studio
RAZORPAY_KEY_ID=your_razorpay_key_id           # Razorpay Integration Key
RAZORPAY_KEY_SECRET=your_razorpay_key_secret   # Razorpay Secret Key
CLIENT_URL=http://localhost:5173              # Frontend origin URL
```

---

## 🚀 Installation & Running

Follow these steps to get your local environment running:

### Step 1: Install Dependencies
Run npm install in both the client and server directories:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Step 2: Run Development Servers
Open two terminal windows/tabs:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
*The server will start listening on port `8000`.*

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
*The frontend dev server will launch (usually on `http://localhost:5173`).*

---

## 📄 Key Features
- **AI Notes Generator:** Input a topic or syllabus guidelines, and receive clean markdown notes along with generated diagrams automatically formatted using Mermaid.js.
- **PDF Export:** Download generated study guides and notes immediately as PDF files.
- **Responsive Layout:** Dark/light mode theme toggle, sleek sidebar navigation, and a modern responsive dashboard built with Framer Motion.
- **Billing & Subscriptions:** Purchase credits or switch to a subscription tier seamlessly via Razorpay integration.
