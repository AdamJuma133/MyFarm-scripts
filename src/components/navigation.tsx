import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Scan, Book, Sprout, History, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LanguageSelector } from './language-selector';

interface NavigationProps {
  activeTab: 'analyzer' | 'library';
  onTabChange: (tab: 'analyzer' | 'library') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <Card className="mb-6">
      <div className="p-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sprout className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {t('app.title')}
              </h1>
            </div>
            <div className="hidden md:block text-sm text-muted-foreground">
              {t('app.subtitle')}
            </div>
          </div>
          <LanguageSelector />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === 'analyzer' ? 'default' : 'outline'}
            onClick={() => onTabChange('analyzer')}
            className="flex items-center gap-2"
          >
            <Scan className="h-4 w-4" />
            {t('navigation.diseaseAnalyzer')}
          </Button>
          <Button
            variant={activeTab === 'library' ? 'default' : 'outline'}
            onClick={() => onTabChange('library')}
            className="flex items-center gap-2"
          >
            <Book className="h-4 w-4" />
            {t('navigation.diseaseLibrary')}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/advice')}
            className="flex items-center gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            Advice
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/history')}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            {t('navigation.history')}
          </Button>
        </div>
      </div>
    </Card>
  );
}