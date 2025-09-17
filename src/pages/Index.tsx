import React, { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { DiseaseAnalyzer } from '@/components/disease-analyzer';
import { DiseaseLibrary } from '@/components/disease-library';
import heroImage from '@/assets/hero-farm.jpg';

const Index = () => {
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
            MyFarm
          </h1>
          <p className="text-xl md:text-2xl mb-6 opacity-90">
            AI-Powered Crop Disease Identifier
          </p>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Protect your crops with advanced AI technology. Upload images of your plants 
            to instantly identify diseases and get expert treatment recommendations.
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
          <p>© 2024 MyFarm - Empowering farmers with AI technology</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
