import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.VERCEL ? "/tmp/target_fashion.db" : "target_fashion.db";
const db = new Database(dbPath);

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    sale_price REAL,
    description TEXT,
    fabric_info TEXT,
    stock_count INTEGER DEFAULT 0,
    images TEXT, -- JSON array
    colors TEXT, -- JSON array
    sizes TEXT, -- JSON array
    tags TEXT, -- JSON array
    status TEXT DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    division TEXT NOT NULL,
    district TEXT NOT NULL,
    address TEXT NOT NULL,
    note TEXT,
    items TEXT NOT NULL, -- JSON array
    subtotal REAL NOT NULL,
    delivery_charge REAL NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed some initial data if empty
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get().count;
if (productCount === 0) {
  const seedProducts = [
    {
      name: "Classic Black Drop Shoulder",
      slug: "classic-black-drop-shoulder",
      sku: "TF-DS-001",
      category: "Solid Drop Shoulder",
      price: 550,
      sale_price: 499,
      description: "Premium quality solid drop shoulder t-shirt.",
      fabric_info: "100% Cotton, 180 GSM",
      stock_count: 50,
      images: JSON.stringify(["https://picsum.photos/seed/tshirt1/800/1000", "https://picsum.photos/seed/tshirt1back/800/1000"]),
      colors: JSON.stringify(["Black", "White"]),
      sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
      tags: JSON.stringify(["new-arrival", "best-seller"]),
    },
    {
      name: "Cyberpunk Graphic Tee",
      slug: "cyberpunk-graphic-tee",
      sku: "TF-OG-001",
      category: "Oversized Graphic Tee",
      price: 750,
      sale_price: null,
      description: "Streetwear oversized graphic t-shirt with cyberpunk print.",
      fabric_info: "100% Cotton, 220 GSM",
      stock_count: 30,
      images: JSON.stringify(["https://picsum.photos/seed/tshirt2/800/1000", "https://picsum.photos/seed/tshirt2back/800/1000"]),
      colors: JSON.stringify(["Charcoal", "Navy"]),
      sizes: JSON.stringify(["M", "L", "XL"]),
      tags: JSON.stringify(["new-arrival"]),
    }
  ];

  const insert = db.prepare(`
    INSERT INTO products (name, slug, sku, category, price, sale_price, description, fabric_info, stock_count, images, colors, sizes, tags)
    VALUES (@name, @slug, @sku, @category, @price, @sale_price, @description, @fabric_info, @stock_count, @images, @colors, @sizes, @tags)
  `);

  for (const p of seedProducts) {
    insert.run(p);
  }
}

const defaultSettings = [
  { key: 'announcement_text', value: '🚚 সারা বাংলাদেশে ডেলিভারি | ৳500+ অর্ডারে ফ্রি ডেলিভারি | Cash on Delivery Available' },
  { key: 'announcement_enabled', value: 'true' },
  { key: 'feature1_enabled', value: 'true' },
  { key: 'feature1_title', value: 'Free Delivery' },
  { key: 'feature1_desc', value: 'On orders ৳500+' },
  { key: 'feature2_enabled', value: 'true' },
  { key: 'feature2_title', value: 'Cash on Delivery' },
  { key: 'feature2_desc', value: 'Pay when you receive' },
  { key: 'feature3_enabled', value: 'true' },
  { key: 'feature3_title', value: 'Easy Exchange' },
  { key: 'feature3_desc', value: '3-4 day exchange policy' },
  { key: 'feature4_enabled', value: 'true' },
  { key: 'feature4_title', value: 'Premium Quality' },
  { key: 'feature4_desc', value: '100% cotton fabric' },
  { key: 'whatsapp_number', value: '8801856078978' }
];
const insertSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
for (const s of defaultSettings) {
  insertSetting.run(s.key, s.value);
}

export const app = express();
const PORT = 3000;

async function startServer() {
  app.use(express.json());

  // API Routes
  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const settingsObj = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  });

  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products WHERE status = 'Active'").all();
    res.json(products.map(p => ({
      ...p,
      images: JSON.parse(p.images),
      colors: JSON.parse(p.colors),
      sizes: JSON.parse(p.sizes),
      tags: JSON.parse(p.tags)
    })));
  });

  app.get("/api/products/:slug", (req, res) => {
    const product = db.prepare("SELECT * FROM products WHERE slug = ?").get(req.params.slug);
    if (product) {
      res.json({
        ...product,
        images: JSON.parse(product.images),
        colors: JSON.parse(product.colors),
        sizes: JSON.parse(product.sizes),
        tags: JSON.parse(product.tags)
      });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  app.post("/api/orders", (req, res) => {
    const { customer_name, phone, division, district, address, note, items, subtotal, delivery_charge, total } = req.body;
    const order_id = "TF-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    try {
      const insert = db.prepare(`
        INSERT INTO orders (order_id, customer_name, phone, division, district, address, note, items, subtotal, delivery_charge, total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insert.run(order_id, customer_name, phone, division, district, address, note, JSON.stringify(items), subtotal, delivery_charge, total);
      res.json({ success: true, order_id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to place order" });
    }
  });

  // Admin Routes
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === "target123") { // Simple hardcoded password for now
      res.json({ success: true, token: "admin-token-123" });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  app.get("/api/admin/orders", (req, res) => {
    const orders = db.prepare("SELECT * FROM orders ORDER BY id DESC").all();
    res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items) })));
  });

  app.get("/api/admin/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products ORDER BY id DESC").all();
    res.json(products.map(p => ({
      ...p,
      images: JSON.parse(p.images),
      colors: JSON.parse(p.colors),
      sizes: JSON.parse(p.sizes),
      tags: JSON.parse(p.tags)
    })));
  });

  app.post("/api/admin/products", (req, res) => {
    const p = req.body;
    try {
      const insert = db.prepare(`
        INSERT INTO products (name, slug, sku, category, price, sale_price, description, fabric_info, stock_count, images, colors, sizes, tags, status)
        VALUES (@name, @slug, @sku, @category, @price, @sale_price, @description, @fabric_info, @stock_count, @images, @colors, @sizes, @tags, @status)
      `);
      insert.run({
        ...p,
        images: JSON.stringify(p.images),
        colors: JSON.stringify(p.colors),
        sizes: JSON.stringify(p.sizes),
        tags: JSON.stringify(p.tags)
      });
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add product" });
    }
  });

  app.put("/api/admin/products/:id", (req, res) => {
    const p = req.body;
    const { id } = req.params;
    try {
      const update = db.prepare(`
        UPDATE products SET 
          name = @name, slug = @slug, sku = @sku, category = @category, 
          price = @price, sale_price = @sale_price, description = @description, 
          fabric_info = @fabric_info, stock_count = @stock_count, 
          images = @images, colors = @colors, sizes = @sizes, 
          tags = @tags, status = @status
        WHERE id = ?
      `);
      update.run({
        ...p,
        images: JSON.stringify(p.images),
        colors: JSON.stringify(p.colors),
        sizes: JSON.stringify(p.sizes),
        tags: JSON.stringify(p.tags)
      }, id);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.put("/api/admin/settings", (req, res) => {
    const settings = req.body; // Expecting { key: value, ... }
    try {
      const update = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
      for (const [key, value] of Object.entries(settings)) {
        update.run(key, String(value));
      }
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  app.use(express.static(path.join(__dirname, "public")));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();
