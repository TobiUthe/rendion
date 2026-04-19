import { PublicLayout } from "@/components/layout/PublicLayout";
import { MockAuthForm } from "@/components/auth/MockAuthForm";

export default function SignupPage() {
  return (
    <PublicLayout width="full">
      <div className="container-lg page-px py-16">
        <MockAuthForm
          mode="signup"
          title="Konto erstellen"
          submitLabel="Kostenlos registrieren"
        />
      </div>
    </PublicLayout>
  );
}
