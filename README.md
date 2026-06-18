# IT Helpdesk Ticket Management System - Full-Stack Project

This project is organized as a professional full-stack application, separated into frontend and backend components.

---

## 📁 Project Structure

*   **`frontend/`**: Contains the React + Vite frontend application.
*   **`backend/`**: Contains the Node.js + Express API server and MongoDB database models/controllers.

---

## 🚀 How to Run the App

### 1. Start the Backend Server (API)
Open a terminal, navigate to the `backend` directory, and start the server:
```bash
cd backend
npm install   # (Only needed the first time)
npm start
```
*The server will run on port `5000` and automatically connect to MongoDB Atlas.*

### 2. Start the Frontend App (Vite Dev Server)
Open a second terminal, navigate to the `frontend` directory, and start the development server:
```bash
cd frontend
npm install   # (Only needed the first time)
npm run dev -- --host
```
*The website will open on port `3000`.*

---

## 🔗 Important Links

*   **Your Local Access (Only on your laptop):**
    👉 [http://localhost:3000/](http://localhost:3000/)

*   **Local Wi-Fi Network Access (For friends on your same Wi-Fi):**
    👉 [http://<your-ip-address>:3000/](http://<your-ip-address>:3000/) *(Check the IP printed by the frontend terminal when you start the server)*

*   **Free Netlify Drop Deployment (To get a permanent public link to share with anyone):**
    1. Open: [https://app.netlify.com/drop](https://app.netlify.com/drop)
    2. Drag and drop the **`dist`** folder (located inside `frontend/dist` after running `npm run build` in the frontend directory) into the browser window.
    3. Copy the public URL it generates for you.

---

## 🔑 Test Credentials (Username / Password)

You can type these in manually or use the Quick Presets at the bottom of the login page:

| Role | Username | Password | Name |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `password` | Eleanor Vance |
| **IT Support Staff (L1)** | `support_alice` | `password` | Alice Cooper |
| **IT Support Staff (L2)** | `support_bob` | `password` | Bob Dylan |
| **Employee (Preset 1)** | `employee_john` | `password` | John Smith |
| **Employee (Preset 2)** | `employee_jane` | `password` | Jane Doe |

*Note: You can also register new employee accounts using the "Register Here" button on the screen.*

