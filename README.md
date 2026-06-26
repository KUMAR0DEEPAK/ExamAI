# ExamAI 🚀

🔗 **Live Link:** [https://examai-g2el.onrender.com](https://examai-g2el.onrender.com)

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

### 🤖 AI-Powered Notes Engine (Google Gemini AI)
- **Tailored Note Customization:** Users can enter a specific **Topic Name**, **Class / Study Level** (e.g., *Class 10*), and **Exam Target** (e.g., *CBSE*, *JEE*, *NEET*) to receive highly targeted, exam-ready revision notes.
- **Smart Content Processing:** The system generates structured, syllabus-oriented explanations corresponding to the user's specific exam board and level.
- **Credit Cost Mechanism:** Each AI generation consumes **10 credits** from the user's balance.

### 📊 Interactive Visualizations & Charts
- **AI-Generated Concept Maps (Mermaid.js):** Generates interactive flowcharts and concept diagrams on-the-fly to visualize complex workflows, loops, cycle routes, or hierarchies.
- **Data-driven Charts (Recharts):** Automatically parses tabular and numerical data from the topic to render beautiful, responsive graphs (bar charts, line charts, etc.) inside the application for better analytical understanding.

### 📝 Exam Study Aids & Practice
- **Starred Priority Subtopics:** Automatically structures key syllabus concepts into importance levels (e.g., High, Medium, Low priority) to help students organize study order.
- **Interactive FAQ / Q&A Accordion:**
  - Generates short-answer, long-answer, and diagram-based questions.
  - Interactive **"Show/Hide Answer"** accordion UI allowing students to test themselves without seeing the answer upfront.
- **Exam Quick Revision Mode:** Offers a toggle-able "Quick Revision" tab containing short, high-yield bulleted key points specifically selected for last-minute cramming.

### 📂 Export & Offline Study
- **Dynamic PDF Generation (PDFKit):** Users can export the fully generated markdown notes, priority subtopics, revision points, and questions (including answers) into a clean, print-friendly PDF file locally using a single click.

### 📚 History & Sidebar Navigation
- **Persistent Sidebar:** Displays an outline of the generated document segments (Subtopics, Notes, Diagrams, Charts, and Questions) for quick page scrolling.
- **Past Notes Archive (History page):** 
  - Keeps a history of all user-generated notes in a remote MongoDB database.
  - Responsive mobile-friendly hamburger menu sidebar loaded with historical study notes.
  - Quick-switch buttons to reload previous results without spending new credits.

### 💳 User Management & Payment Integrations (Razorpay)
- **Secure Session Authentication:** JSON Web Token (JWT) combined with Secure Cookies (`cookie-parser`) and Firebase integrations to register, login, and verify users securely.
- **Razorpay Payment Integration:** Includes a checkout package allowing students to select from 3 packages to replenish credits:
  - **Starter Plan:** ₹99 for 150 credits
  - **Popular Plan:** ₹200 for 450 credits
  - **Pro Learner Plan:** ₹500 for 1500 credits
- **Payment Verification Flow:** Employs SHA-256 HMAC digital signature verification (`razorpay_signature`) in the backend to securely credit the user's balance upon successful payment.

### ✨ Modern Premium UI/UX Design
- **Adaptive Dark Mode & Theme Toggle:** Seamlessly switch between light and dark themes.
- **Framer Motion Animations:** Smooth page loaders, spring-based sliding sidebars, 3D card tilt gestures on hover, and smooth layout changes.

