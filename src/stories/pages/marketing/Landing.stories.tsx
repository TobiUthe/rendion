import type { Meta } from '@storybook/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { CalculatorTeaser } from '@/components/landing/CalculatorTeaser';
import { TrustBadges } from '@/components/landing/TrustBadges';
import { FeatureBentoGrid } from '@/components/landing/FeatureBentoGrid';
import { CTABanner } from '@/components/landing/CTABanner';

const meta = {
  title: 'Pages/Marketing/Landing',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

const LandingPageComposition = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">
      <div className="container-xl page-px">
        <HeroSection />
        <div id="rechner" className="py-8">
          <CalculatorTeaser />
        </div>
      </div>
      <TrustBadges />
      <FeatureBentoGrid />
      <div className="container-xl page-px">
        <CTABanner />
      </div>
    </main>
    <Footer />
  </div>
);

export const Default = {
  render: LandingPageComposition,
};
