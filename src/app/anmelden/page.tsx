import { PublicLayout } from "@/components/layout/PublicLayout";
import { MockAuthForm } from "@/components/auth/MockAuthForm";

export default function LoginPage() {
  return (
    <PublicLayout width="full">
      <div className="container-lg page-px py-16">
        <MockAuthForm
          mode="signin"
          title="Willkommen zurück"
          submitLabel="Anmelden"
        />
      </div>
    </PublicLayout>
  );
}
