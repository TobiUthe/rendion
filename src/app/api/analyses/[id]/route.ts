import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/lib/db/client';
import { quickCalcInputSchema } from '@/lib/schemas/calculator';
import { requireUser } from '@/lib/auth/requireUser';

const patchBodySchema = z.object({
  input: quickCalcInputSchema,
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { id } = await ctx.params;
  const [row] = await db
    .select()
    .from(schema.analyses)
    .where(and(eq(schema.analyses.id, id), eq(schema.analyses.userId, userId)))
    .limit(1);

  if (!row) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  return NextResponse.json({
    id: row.id,
    title: row.title,
    address: row.address,
    input: row.input,
    updatedAt: row.updatedAt,
  });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = patchBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body', issues: parsed.error.issues }, { status: 400 });
  }

  const [row] = await db
    .update(schema.analyses)
    .set({ input: parsed.data.input, updatedAt: new Date() })
    .where(and(eq(schema.analyses.id, id), eq(schema.analyses.userId, userId)))
    .returning();

  if (!row) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  return NextResponse.json({
    id: row.id,
    title: row.title,
    address: row.address,
    input: row.input,
    updatedAt: row.updatedAt,
  });
}
