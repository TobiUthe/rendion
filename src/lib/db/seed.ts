/**
 * One-shot seed: inserts the demo analyses used by the dashboard.
 * Run: `npx tsx src/lib/db/seed.ts` (after `npm run db:migrate`).
 */
import { config } from 'dotenv';
import { DEMO_INPUT } from '@/lib/calculator/defaults';
import { MOCK_DASHBOARD_ANALYSES } from '@/lib/mock/dashboard';

config({ path: '.env.local' });

async function run() {
  const { db, schema } = await import('./client');

  const rows = MOCK_DASHBOARD_ANALYSES.map((a) => ({
    id: a.id,
    userId: 'mock-user',
    title: a.title,
    address: a.address,
    input: {
      ...DEMO_INPUT,
      kaufpreis: a.kaufpreis,
      kaltmiete: a.kaltmiete,
      eigenkapital: a.eigenkapital,
    },
  }));

  await db.insert(schema.analyses).values(rows).onConflictDoNothing();
  console.log(`Seeded ${rows.length} analyses.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
