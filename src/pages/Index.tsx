import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navigation } from '@/components/navigation';
import { DiseaseAnalyzer } from '@/components/disease-analyzer';
import { DiseaseLibrary } from '@/components/disease-library';
import heroImage from '@/assets/hero-farm.jpg';

const Index = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'analyzer' | 'library'>('analyzer');

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Hero Section */}
      <div className="relative bg-gradient-primary text-primary-foreground">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t('app.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-6 opacity-90">
            {t('app.subtitle')}
          </p>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            {t('app.description')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'analyzer' && <DiseaseAnalyzer />}
        {activeTab === 'library' && <DiseaseLibrary />}
      </div>
      
      {/* Footer */}
      <footer className="border-t mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>{t('app.footer')}</p>
          <div className="mt-4 flex justify-center gap-4">
            <Link to="/advice" className="text-primary hover:underline">Farming Advice</Link>
            <Link to="/history" className="text-primary hover:underline">Scan History</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
