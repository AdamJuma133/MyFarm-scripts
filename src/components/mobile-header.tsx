import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Sprout, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from './language-selector';

export function MobileHeader() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        <button 
          className="flex items-center gap-2 touch-manipulation min-h-[44px]"
          onClick={() => navigate('/')}
        >
          <Sprout className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {t('app.title')}
          </h1>
        </button>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
            className="h-11 w-11 touch-manipulation"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
