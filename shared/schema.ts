import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in smallest currency unit (halalas)
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const deliveryAreas = pgTable("delivery_areas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  fee: integer("fee").notNull(), // Fee in smallest currency unit
  deliveryTime: text("delivery_time").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  isActive: true,
});

export const insertDeliveryAreaSchema = createInsertSchema(deliveryAreas).omit({
  id: true,
  isActive: true,
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type DeliveryArea = typeof deliveryAreas.$inferSelect;
export type InsertDeliveryArea = z.infer<typeof insertDeliveryAreaSchema>;
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
