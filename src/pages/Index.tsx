import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navigation } from '@/components/navigation';
import { MobileHeader } from '@/components/mobile-header';
import { BottomNavigation } from '@/components/bottom-navigation';
import { DiseaseAnalyzer } from '@/components/disease-analyzer';
import { DiseaseLibrary } from '@/components/disease-library';
import heroImage from '@/assets/hero-farm.jpg';

const Index = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'analyzer' | 'library'>('analyzer');

  return (
    <div className="min-h-screen bg-gradient-secondary pb-20 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader />
      </div>

      {/* Hero Section - More compact on mobile */}
      <div className="relative bg-gradient-primary text-primary-foreground">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 py-8 md:py-12 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-4">
            MyFarm
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-4 md:mb-6 opacity-90">
            {t('app.subtitle')}
          </p>
          <p className="text-base md:text-lg opacity-80 max-w-2xl mx-auto hidden sm:block">
            {t('app.description')}
          </p>
        </div>
      </div>

      {/* Main Content - Optimized padding for mobile */}
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mobile-scroll">
          {activeTab === 'analyzer' && <DiseaseAnalyzer />}
          {activeTab === 'library' && <DiseaseLibrary />}
        </div>
      </div>
      
      {/* Footer - Hidden on mobile (bottom nav replaces it) */}
      <footer className="hidden md:block border-t mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>{t('app.footer')}</p>
          <div className="mt-4 flex justify-center gap-4">
            <Link to="/advice" className="text-primary hover:underline touch-manipulation min-h-[44px] inline-flex items-center">
              Farming Advice
            </Link>
            <Link to="/history" className="text-primary hover:underline touch-manipulation min-h-[44px] inline-flex items-center">
              Scan History
            </Link>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </div>
  );
};

export default Index;
