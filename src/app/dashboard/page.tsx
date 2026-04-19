import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { AnalysisCard } from "@/components/dashboard/AnalysisCard";
import { MOCK_DASHBOARD_ANALYSES } from "@/lib/mock/dashboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Header />
      <main className="flex-1 container-lg page-px py-8">
        <PageHeader
          title="Meine Analysen"
          subtitle={`${MOCK_DASHBOARD_ANALYSES.length} gespeicherte Analysen`}
          actions={
            <Link href="/ergebnis">
              <Button variant="primary" size="md">
                Neue Analyse
              </Button>
            </Link>
          }
        />

        <div className="mt-6 flex flex-col gap-4">
          {MOCK_DASHBOARD_ANALYSES.map((analysis) => (
            <AnalysisCard key={analysis.id} analysis={analysis} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
