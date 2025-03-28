import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email"),
  age: integer("age"),
  gender: text("gender"),
  healthProfile: json("health_profile").$type<HealthProfile>(),
});

// Health condition tracking
export const healthConditions = pgTable("health_conditions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  organId: text("organ_id").notNull(),
  conditionId: text("condition_id").notNull(),
  severity: integer("severity").notNull(), // 1-10 scale
  detectedAt: text("detected_at").notNull(),
  notes: text("notes"),
  treatmentPlan: json("treatment_plan").$type<TreatmentPlan>(),
});

// Chat messages
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isFromAI: boolean("is_from_ai").notNull(),
  timestamp: text("timestamp").notNull(),
});

// Types
export type HealthProfile = {
  height?: number;
  weight?: number;
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
  medications?: string[];
  familyHistory?: string[];
  lifestyleFactors?: {
    smoking?: boolean;
    alcohol?: boolean;
    exercise?: string;
    diet?: string;
  };
};

export type TreatmentPlan = {
  recommendations: string[];
  medications?: string[];
  lifestyle?: string[];
  followUp?: string;
  expectedImprovement?: string;
  preventiveMeasures?: string[];
};

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  age: true,
  gender: true,
  healthProfile: true,
});

export const insertHealthConditionSchema = createInsertSchema(healthConditions).pick({
  userId: true,
  organId: true,
  conditionId: true,
  severity: true,
  detectedAt: true,
  notes: true,
  treatmentPlan: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  content: true,
  isFromAI: true,
  timestamp: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertHealthCondition = z.infer<typeof insertHealthConditionSchema>;
export type HealthCondition = typeof healthConditions.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
