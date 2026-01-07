import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Scan, Book, Sprout, History, Lightbulb, MapPin, Video, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LanguageSelector } from './language-selector';

interface NavigationProps {
  activeTab?: 'analyzer' | 'library';
  onTabChange?: (tab: 'analyzer' | 'library') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;
  
  return (
    <Card className="mb-6 mx-4 mt-4 md:mx-auto md:max-w-6xl">
      <div className="p-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Sprout className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {t('app.title')}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
              className={isActive('/settings') ? 'bg-primary/10' : ''}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <LanguageSelector />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {activeTab !== undefined && onTabChange ? (
            <>
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
            </>
          ) : (
            <>
              <Button
                variant={isActive('/') ? 'default' : 'outline'}
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Scan className="h-4 w-4" />
                {t('navigation.diseaseAnalyzer')}
              </Button>
            </>
          )}
          <Button
            variant={isActive('/advice') ? 'default' : 'outline'}
            onClick={() => navigate('/advice')}
            className="flex items-center gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            {t('navigation.advice', 'Advice')}
          </Button>
          <Button
            variant={isActive('/outbreaks') ? 'default' : 'outline'}
            onClick={() => navigate('/outbreaks')}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            {t('navigation.outbreaks', 'Outbreaks')}
          </Button>
          <Button
            variant={isActive('/workshops') ? 'default' : 'outline'}
            onClick={() => navigate('/workshops')}
            className="flex items-center gap-2"
          >
            <Video className="h-4 w-4" />
            {t('navigation.workshops', 'Learn')}
          </Button>
          <Button
            variant={isActive('/history') ? 'default' : 'outline'}
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