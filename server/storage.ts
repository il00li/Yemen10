import { 
  products, 
  deliveryAreas, 
  settings, 
  categories,
  type Product, 
  type InsertProduct,
  type DeliveryArea,
  type InsertDeliveryArea,
  type Setting,
  type InsertSetting,
  type Category,
  type InsertCategory
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  }

  // Delivery Areas
  async getDeliveryAreas(): Promise<DeliveryArea[]> {
    return await db.select().from(deliveryAreas);
  }

  async getDeliveryArea(id: number): Promise<DeliveryArea | undefined> {
    const [area] = await db.select().from(deliveryAreas).where(eq(deliveryAreas.id, id));
    return area || undefined;
  }

  async createDeliveryArea(area: InsertDeliveryArea): Promise<DeliveryArea> {
    const [newArea] = await db.insert(deliveryAreas).values(area).returning();
    return newArea;
  }

  async updateDeliveryArea(id: number, area: Partial<InsertDeliveryArea>): Promise<DeliveryArea | undefined> {
    const [updatedArea] = await db
      .update(deliveryAreas)
      .set(area)
      .where(eq(deliveryAreas.id, id))
      .returning();
    return updatedArea || undefined;
  }

  async deleteDeliveryArea(id: number): Promise<boolean> {
    const result = await db.delete(deliveryAreas).where(eq(deliveryAreas.id, id));
    return result.rowCount > 0;
  }

  // Settings
  async getSettings(): Promise<Setting[]> {
    return await db.select().from(settings);
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting || undefined;
  }

  async setSetting(setting: InsertSetting): Promise<Setting> {
    const existing = await this.getSetting(setting.key);
    if (existing) {
      const [updated] = await db
        .update(settings)
        .set({ value: setting.value })
        .where(eq(settings.key, setting.key))
        .returning();
      return updated;
    } else {
      const [newSetting] = await db.insert(settings).values(setting).returning();
      return newSetting;
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();