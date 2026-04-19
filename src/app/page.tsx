import { PublicLayout } from "@/components/layout/PublicLayout";
import { HeroWithCalculator } from "@/components/landing/HeroWithCalculator";
import { TrustBadges } from "@/components/landing/TrustBadges";
import { FeatureBentoGrid } from "@/components/landing/FeatureBentoGrid";
import { CTABanner } from "@/components/landing/CTABanner";

export default function Home() {
  return (
    <PublicLayout width="full">
      <div className="container-xl page-px">
        <HeroWithCalculator />
      </div>
      <TrustBadges />
      <FeatureBentoGrid />
      <CTABanner />
    </PublicLayout>
  );
}
