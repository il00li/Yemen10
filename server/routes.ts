import express, { type Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertProductSchema, insertDeliveryAreaSchema, insertSettingSchema, insertCategorySchema } from "@shared/schema";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage_multer,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadsDir));
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // File upload endpoint
  app.post("/api/upload", upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "لا توجد صورة مرفوعة" });
      }
      
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      res.status(500).json({ error: "فشل في رفع الصورة" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, productData);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Delivery areas routes
  app.get("/api/delivery-areas", async (req, res) => {
    try {
      const areas = await storage.getDeliveryAreas();
      res.json(areas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch delivery areas" });
    }
  });

  app.post("/api/delivery-areas", async (req, res) => {
    try {
      const areaData = insertDeliveryAreaSchema.parse(req.body);
      const area = await storage.createDeliveryArea(areaData);
      res.status(201).json(area);
    } catch (error) {
      res.status(400).json({ error: "Invalid delivery area data" });
    }
  });

  app.patch("/api/delivery-areas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const areaData = insertDeliveryAreaSchema.partial().parse(req.body);
      const area = await storage.updateDeliveryArea(id, areaData);
      if (!area) {
        return res.status(404).json({ error: "Delivery area not found" });
      }
      res.json(area);
    } catch (error) {
      res.status(400).json({ error: "Invalid delivery area data" });
    }
  });

  app.delete("/api/delivery-areas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDeliveryArea(id);
      if (!success) {
        return res.status(404).json({ error: "Delivery area not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete delivery area" });
    }
  });

  // Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.get("/api/settings/:key", async (req, res) => {
    try {
      const key = req.params.key;
      const setting = await storage.getSetting(key);
      if (!setting) {
        return res.status(404).json({ error: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch setting" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const settingData = insertSettingSchema.parse(req.body);
      const setting = await storage.setSetting(settingData);
      res.json(setting);
    } catch (error) {
      res.status(400).json({ error: "Invalid setting data" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: "Invalid category data" });
    }
  });

  app.patch("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, categoryData);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: "Invalid category data" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Authentication route for admin
  app.post("/api/auth/admin", async (req, res) => {
    try {
      const { password } = req.body;
      const adminPasswordSetting = await storage.getSetting("admin_password");
      
      if (!adminPasswordSetting || adminPasswordSetting.value !== password) {
        return res.status(401).json({ error: "كلمة المرور غير صحيحة" });
      }
      
      res.json({ success: true, message: "تم تسجيل الدخول بنجاح" });
    } catch (error) {
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
