import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { AnalysesList } from "@/components/dashboard/home/AnalysesList";
import { MOCK_DASHBOARD_ANALYSES } from "@/lib/mock/dashboard";

export default function DashboardPage() {
  const analyses = MOCK_DASHBOARD_ANALYSES;
  const count = analyses.length;

  return (
    <div className="container-lg page-px py-8 sm:py-10">
      <PageHeader
        title="Übersicht"
        subtitle={
          count === 1 ? "1 gespeicherte Analyse" : `${count} gespeicherte Analysen`
        }
        actions={
          <Button href="/" variant="primary" size="md">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Neue Analyse
          </Button>
        }
      />

      <div className="mt-8">
        <AnalysesList analyses={analyses} />
      </div>
    </div>
  );
}
