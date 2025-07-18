import { 
  type Product, 
  type InsertProduct,
  type DeliveryArea,
  type InsertDeliveryArea,
  type Setting,
  type InsertSetting,
  type Category,
  type InsertCategory
} from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Delivery Areas
  getDeliveryAreas(): Promise<DeliveryArea[]>;
  getDeliveryArea(id: number): Promise<DeliveryArea | undefined>;
  createDeliveryArea(area: InsertDeliveryArea): Promise<DeliveryArea>;
  updateDeliveryArea(id: number, area: Partial<InsertDeliveryArea>): Promise<DeliveryArea | undefined>;
  deleteDeliveryArea(id: number): Promise<boolean>;

  // Settings
  getSettings(): Promise<Setting[]>;
  getSetting(key: string): Promise<Setting | undefined>;
  setSetting(setting: InsertSetting): Promise<Setting>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private deliveryAreas: Map<number, DeliveryArea>;
  private settings: Map<string, Setting>;
  private categories: Map<number, Category>;
  private currentProductId: number;
  private currentDeliveryAreaId: number;
  private currentSettingId: number;
  private currentCategoryId: number;

  constructor() {
    this.products = new Map();
    this.deliveryAreas = new Map();
    this.settings = new Map();
    this.categories = new Map();
    this.currentProductId = 1;
    this.currentDeliveryAreaId = 1;
    this.currentSettingId = 1;
    this.currentCategoryId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Default products
    const defaultProducts: InsertProduct[] = [
      {
        name: "تطبيق الهاتف المحمول",
        description: "تطبيق متطور للهواتف الذكية يوفر تجربة مستخدم ممتازة",
        price: 29900, // 299 SAR
        category: "تطبيقات",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "تصميم موقع إلكتروني",
        description: "تصميم موقع إلكتروني احترافي متجاوب مع جميع الأجهزة",
        price: 79900, // 799 SAR
        category: "تصميم",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "خدمة التسويق الرقمي",
        description: "حملة تسويقية شاملة لزيادة المبيعات والوصول للعملاء",
        price: 129900, // 1299 SAR
        category: "تسويق",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "متجر إلكتروني كامل",
        description: "منصة تجارة إلكترونية متكاملة مع نظام إدارة وتحليلات",
        price: 249900, // 2499 SAR
        category: "تطوير",
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "تصميم هوية بصرية",
        description: "تصميم شعار وهوية بصرية كاملة لشركتك أو مشروعك",
        price: 59900, // 599 SAR
        category: "تصميم",
        imageUrl: "https://pixabay.com/get/g99b4bb926200e7eb238931bd0d7dd40740652712058bd7a92067edbaa9ed84ac9db560f1db2561ae9326b395a7aade8bf7ae8e627242d5a27d4e606089c8c386_1280.jpg"
      },
      {
        name: "إدارة مواقع التواصل",
        description: "إدارة احترافية لحساباتك على مواقع التواصل الاجتماعي",
        price: 89900, // 899 SAR
        category: "إدارة",
        imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      }
    ];

    defaultProducts.forEach(product => {
      this.createProduct(product);
    });

    // Default delivery areas
    const defaultAreas: InsertDeliveryArea[] = [
      { name: "الرياض", fee: 2000, deliveryTime: "2-3 أيام" },
      { name: "جدة", fee: 2500, deliveryTime: "3-4 أيام" },
      { name: "الدمام", fee: 3000, deliveryTime: "3-5 أيام" },
      { name: "مكة المكرمة", fee: 2500, deliveryTime: "2-4 أيام" }
    ];

    defaultAreas.forEach(area => {
      this.createDeliveryArea(area);
    });

    // Default settings
    const defaultSettings: InsertSetting[] = [
      { key: "whatsapp_number", value: "+966501234567" },
      { key: "telegram_url", value: "https://t.me/example" },
      { key: "instagram_url", value: "https://instagram.com/example" },
      { key: "facebook_url", value: "https://facebook.com/example" },
      { key: "admin_password", value: "admin123" },
      { key: "site_name", value: "متجر المنتجات الرقمية" }
    ];

    defaultSettings.forEach(setting => {
      this.setSetting(setting);
    });

    // Default categories
    const defaultCategories: InsertCategory[] = [
      { name: "ملابس رجالية" },
      { name: "ملابس نسائية" },
      { name: "ملابس أطفال" },
      { name: "تطبيقات" },
      { name: "تصميم" },
      { name: "تسويق" }
    ];

    defaultCategories.forEach(category => {
      this.createCategory(category);
    });
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id, isActive: true };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updateData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const product = this.products.get(id);
    if (!product) return false;
    
    const updatedProduct = { ...product, isActive: false };
    this.products.set(id, updatedProduct);
    return true;
  }

  // Delivery Areas
  async getDeliveryAreas(): Promise<DeliveryArea[]> {
    return Array.from(this.deliveryAreas.values()).filter(a => a.isActive);
  }

  async getDeliveryArea(id: number): Promise<DeliveryArea | undefined> {
    return this.deliveryAreas.get(id);
  }

  async createDeliveryArea(insertArea: InsertDeliveryArea): Promise<DeliveryArea> {
    const id = this.currentDeliveryAreaId++;
    const area: DeliveryArea = { ...insertArea, id, isActive: true };
    this.deliveryAreas.set(id, area);
    return area;
  }

  async updateDeliveryArea(id: number, updateData: Partial<InsertDeliveryArea>): Promise<DeliveryArea | undefined> {
    const area = this.deliveryAreas.get(id);
    if (!area) return undefined;
    
    const updatedArea = { ...area, ...updateData };
    this.deliveryAreas.set(id, updatedArea);
    return updatedArea;
  }

  async deleteDeliveryArea(id: number): Promise<boolean> {
    const area = this.deliveryAreas.get(id);
    if (!area) return false;
    
    const updatedArea = { ...area, isActive: false };
    this.deliveryAreas.set(id, updatedArea);
    return true;
  }

  // Settings
  async getSettings(): Promise<Setting[]> {
    return Array.from(this.settings.values());
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    return this.settings.get(key);
  }

  async setSetting(insertSetting: InsertSetting): Promise<Setting> {
    const existing = this.settings.get(insertSetting.key);
    if (existing) {
      const updated = { ...existing, value: insertSetting.value };
      this.settings.set(insertSetting.key, updated);
      return updated;
    } else {
      const id = this.currentSettingId++;
      const setting: Setting = { ...insertSetting, id };
      this.settings.set(insertSetting.key, setting);
      return setting;
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(c => c.isActive);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id, isActive: true };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...updateData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const category = this.categories.get(id);
    if (!category) return false;
    
    const updatedCategory = { ...category, isActive: false };
    this.categories.set(id, updatedCategory);
    return true;
  }
}

export const storage = new MemStorage();
