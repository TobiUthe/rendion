import { PageHeader } from "@/components/layout/PageHeader";
import { AnalysesList } from "@/components/dashboard/home/AnalysesList";
import { MOCK_DASHBOARD_ANALYSES } from "@/lib/mock/dashboard";

export default function AnalysenPage() {
  const analyses = MOCK_DASHBOARD_ANALYSES;

  return (
    <div className="container-lg page-px py-8 sm:py-10">
      <PageHeader
        title="Meine Analysen"
        subtitle="Alle gespeicherten Objektanalysen"
        backLink={{ href: "/dashboard", label: "Zurück zur Übersicht" }}
      />
      <div className="mt-8">
        <AnalysesList analyses={analyses} />
      </div>
    </div>
  );
}
