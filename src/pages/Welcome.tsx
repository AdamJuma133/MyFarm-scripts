import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Scan, 
  BookOpen, 
  MapPin, 
  Video, 
  ChevronRight, 
  ChevronLeft,
  Sprout,
  Shield,
  Users
} from 'lucide-react';

const features = [
  {
    icon: Scan,
    titleKey: 'welcome.features.detection.title',
    descKey: 'welcome.features.detection.desc',
    color: 'text-emerald-500'
  },
  {
    icon: BookOpen,
    titleKey: 'welcome.features.library.title',
    descKey: 'welcome.features.library.desc',
    color: 'text-blue-500'
  },
  {
    icon: MapPin,
    titleKey: 'welcome.features.map.title',
    descKey: 'welcome.features.map.desc',
    color: 'text-orange-500'
  },
  {
    icon: Video,
    titleKey: 'welcome.features.workshops.title',
    descKey: 'welcome.features.workshops.desc',
    color: 'text-purple-500'
  }
];

export default function Welcome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleGetStarted = () => {
    localStorage.setItem('myfarm-onboarded', 'true');
    navigate('/');
  };

  const nextStep = () => {
    if (currentStep < features.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {currentStep === 0 ? (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
                <Sprout className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground">
                {t('welcome.title', 'Welcome to MyFarm')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('welcome.subtitle', 'Your AI-powered companion for healthier crops and better harvests')}
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 py-6">
              <div className="text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t('welcome.badge.protect', 'Protect Crops')}</p>
              </div>
              <div className="text-center">
                <Scan className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t('welcome.badge.detect', 'Detect Disease')}</p>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t('welcome.badge.community', 'Join Community')}</p>
              </div>
            </div>

            <Button 
              onClick={nextStep} 
              size="lg" 
              className="w-full text-lg py-6"
            >
              {t('welcome.explore', 'Explore Features')}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>

            <Button 
              variant="ghost" 
              onClick={handleGetStarted}
              className="w-full"
            >
              {t('welcome.skip', 'Skip Introduction')}
            </Button>
          </div>
        ) : currentStep <= features.length ? (
          <Card className="border-0 shadow-2xl animate-fade-in">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  {features.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`h-2 w-8 rounded-full transition-colors ${
                        idx < currentStep ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {currentStep}/{features.length}
                </span>
              </div>

              {currentStep <= features.length && (
                <div className="text-center space-y-6">
                  {(() => {
                    const feature = features[currentStep - 1];
                    const Icon = feature.icon;
                    return (
                      <>
                        <div className={`h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mx-auto ${feature.color}`}>
                          <Icon className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-bold">
                          {t(feature.titleKey, feature.titleKey.split('.').pop())}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                          {t(feature.descKey, feature.descKey.split('.').pop())}
                        </p>
                      </>
                    );
                  })()}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  className="flex-1"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {t('welcome.back', 'Back')}
                </Button>
                {currentStep < features.length ? (
                  <Button onClick={nextStep} className="flex-1">
                    {t('welcome.next', 'Next')}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleGetStarted} className="flex-1">
                    {t('welcome.getStarted', 'Get Started')}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
