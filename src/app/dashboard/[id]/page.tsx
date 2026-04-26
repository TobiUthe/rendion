import { notFound, redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db/client';
import { DashboardAnalysisView } from '@/components/dashboard/DashboardAnalysisView';
import { quickCalcKapitalanlage } from '@/lib/calculator/quick-calc';
import { mapResultToView } from '@/lib/calculator/mapResultToView';
import { requireUser } from '@/lib/auth/requireUser';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardDetailPage({ params }: PageProps) {
  const { id } = await params;

  const userId = await requireUser();
  if (!userId) redirect('/anmelden?next=/dashboard/' + id);

  const [row] = await db
    .select()
    .from(schema.analyses)
    .where(and(eq(schema.analyses.id, id), eq(schema.analyses.userId, userId)))
    .limit(1);

  if (!row) notFound();

  const result = quickCalcKapitalanlage(row.input);
  if (!result) notFound();
  const initialView = mapResultToView(row.input, result);

  return (
    <DashboardAnalysisView
      id={row.id}
      title={row.title}
      address={row.address}
      initialInput={row.input}
      initialView={initialView}
    />
  );
}
