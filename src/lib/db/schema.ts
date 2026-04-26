import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import type { QuickCalcInput } from '@/lib/schemas/calculator';

export const analyses = pgTable('analyses', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  address: text('address').notNull(),
  input: jsonb('input').$type<QuickCalcInput>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type AnalysisRow = typeof analyses.$inferSelect;
export type NewAnalysisRow = typeof analyses.$inferInsert;
