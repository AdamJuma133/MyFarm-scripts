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
    <Card className="mb-4 md:mb-6">
      <div className="p-3 md:p-4">
        {/* Desktop header - hidden on mobile since we have MobileHeader */}
        <div className="hidden md:flex items-center justify-between gap-4 mb-4">
          <button 
            className="flex items-center gap-2 touch-manipulation"
            onClick={() => navigate('/')}
          >
            <Sprout className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {t('app.title')}
            </h1>
          </button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
              className={`h-11 w-11 ${isActive('/settings') ? 'bg-primary/10' : ''}`}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <LanguageSelector />
          </div>
        </div>
        
        {/* Tab switcher for analyzer/library - optimized for touch */}
        {activeTab !== undefined && onTabChange && (
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'analyzer' ? 'default' : 'outline'}
              onClick={() => onTabChange('analyzer')}
              className="flex-1 h-12 md:h-10 md:flex-none touch-manipulation"
            >
              <Scan className="h-5 w-5 md:h-4 md:w-4 mr-2" />
              <span className="text-sm md:text-base">{t('navigation.diseaseAnalyzer')}</span>
            </Button>
            <Button
              variant={activeTab === 'library' ? 'default' : 'outline'}
              onClick={() => onTabChange('library')}
              className="flex-1 h-12 md:h-10 md:flex-none touch-manipulation"
            >
              <Book className="h-5 w-5 md:h-4 md:w-4 mr-2" />
              <span className="text-sm md:text-base">{t('navigation.diseaseLibrary')}</span>
            </Button>
          </div>
        )}
        
        {/* Desktop-only navigation buttons */}
        <div className="hidden md:flex flex-wrap gap-2 mt-4">
          <Button
            variant={isActive('/') ? 'default' : 'outline'}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 h-11 touch-manipulation"
          >
            <Scan className="h-4 w-4" />
            {t('navigation.diseaseAnalyzer')}
          </Button>
          <Button
            variant={isActive('/advice') ? 'default' : 'outline'}
            onClick={() => navigate('/advice')}
            className="flex items-center gap-2 h-11 touch-manipulation"
          >
            <Lightbulb className="h-4 w-4" />
            {t('navigation.advice', 'Advice')}
          </Button>
          <Button
            variant={isActive('/outbreaks') ? 'default' : 'outline'}
            onClick={() => navigate('/outbreaks')}
            className="flex items-center gap-2 h-11 touch-manipulation"
          >
            <MapPin className="h-4 w-4" />
            {t('navigation.outbreaks', 'Outbreaks')}
          </Button>
          <Button
            variant={isActive('/workshops') ? 'default' : 'outline'}
            onClick={() => navigate('/workshops')}
            className="flex items-center gap-2 h-11 touch-manipulation"
          >
            <Video className="h-4 w-4" />
            {t('navigation.workshops', 'Learn')}
          </Button>
          <Button
            variant={isActive('/history') ? 'default' : 'outline'}
            onClick={() => navigate('/history')}
            className="flex items-center gap-2 h-11 touch-manipulation"
          >
            <History className="h-4 w-4" />
            {t('navigation.history')}
          </Button>
        </div>
      </div>
    </Card>
  );
}