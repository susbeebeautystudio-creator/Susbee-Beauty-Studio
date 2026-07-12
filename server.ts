import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Set up JSON body parser
app.use(express.json());

// Setup storage
const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

interface Booking {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  source: "Website" | "WhatsApp";
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
}

// Ensure DB directory and file exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify({
      bookings: [
        {
          id: "SB-8402",
          name: "Sita Thapa",
          phone: "9856102345",
          service: "Bridal Makeup",
          date: "2026-07-15",
          source: "Website",
          status: "Confirmed",
          createdAt: new Date().toISOString(),
        },
        {
          id: "SB-1923",
          name: "Gita Gurung",
          phone: "9856109876",
          service: "Facial Treatment",
          date: "2026-07-20",
          source: "WhatsApp",
          status: "Pending",
          createdAt: new Date().toISOString(),
        }
      ]
    }, null, 2)
  );
}

const getDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return { bookings: [] };
  }
};

const saveDB = (data: any) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
};

// --- API Endpoints ---

// Get all bookings (Admin only)
app.get("/api/bookings", (req, res) => {
  // Simple token-based check for safety
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== "Bearer susbee-admin-token") {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const db = getDB();
  res.json({ bookings: db.bookings });
});

// Create a new booking (Guest)
app.post("/api/bookings", (req, res) => {
  const { name, phone, service, date, source } = req.body;

  if (!name || !phone || !service || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (phone.length !== 10 || !/^\d+$/.test(phone)) {
    return res.status(400).json({ error: "Phone number must be exactly 10 digits" });
  }

  const db = getDB();
  const randomId = Math.floor(1000 + Math.random() * 9000);
  const newBooking: Booking = {
    id: `SB-${randomId}`,
    name,
    phone,
    service,
    date,
    source: source === "WhatsApp" ? "WhatsApp" : "Website",
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  db.bookings.unshift(newBooking); // Put newest on top
  saveDB(db);

  res.status(201).json({ success: true, booking: newBooking });
});

// Get bookings for a customer (using phone number)
app.get("/api/bookings/customer/:phone", (req, res) => {
  const { phone } = req.params;

  if (!phone || phone.length !== 10 || !/^\d+$/.test(phone)) {
    return res.status(400).json({ error: "Invalid 10-digit phone number" });
  }

  const db = getDB();
  const customerBookings = db.bookings.filter((b: Booking) => b.phone === phone);

  res.json({ bookings: customerBookings });
});

// Admin Login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  // Let's set credentials as requested by user
  if (username === "admin" && password === "susbee@2026") {
    return res.json({ success: true, token: "susbee-admin-token" });
  }

  res.status(401).json({ error: "Invalid username or password" });
});

// Update booking status (Admin only)
app.put("/api/bookings/:id/status", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== "Bearer susbee-admin-token") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status state" });
  }

  const db = getDB();
  const index = db.bookings.findIndex((b: Booking) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }

  db.bookings[index].status = status;
  saveDB(db);

  res.json({ success: true, booking: db.bookings[index] });
});

// Delete a booking (Admin only)
app.delete("/api/bookings/:id", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== "Bearer susbee-admin-token") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.params;
  const db = getDB();
  const initialLength = db.bookings.length;
  db.bookings = db.bookings.filter((b: Booking) => b.id !== id);

  if (db.bookings.length === initialLength) {
    return res.status(404).json({ error: "Booking not found" });
  }

  saveDB(db);
  res.json({ success: true });
});

// --- Server Startup & Vite Integration ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
