import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LanguageSelector } from '@/components/language-selector';
import { MobileHeader } from '@/components/mobile-header';
import { BottomNavigation } from '@/components/bottom-navigation';

interface ScanHistory {
  id: string;
  timestamp: number;
  imageName: string;
  imageUrl: string;
  disease: string;
  type: string;
  confidence: string;
  crop?: string;
}

const History = () => {
  const { t } = useTranslation();
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('myfarm-scan-history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to parse scan history:', error);
      localStorage.removeItem('myfarm-scan-history');
    }
  }, []);

  const handleDelete = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('myfarm-scan-history', JSON.stringify(updatedHistory));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all scan history?')) {
      setHistory([]);
      localStorage.removeItem('myfarm-scan-history');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary pb-20 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader />
      </div>
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Desktop header with back button */}
        <div className="hidden md:flex mb-6 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="h-11 touch-manipulation">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">{t('history.title')}</h1>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <Button variant="destructive" onClick={handleClearAll} className="h-11 touch-manipulation">
                <Trash2 className="h-4 w-4 mr-2" />
                {t('history.clear')}
              </Button>
            )}
            <LanguageSelector />
          </div>
        </div>

        {/* Mobile header */}
        <div className="md:hidden mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{t('history.title')}</h1>
            {history.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleClearAll}
                className="h-10 touch-manipulation"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {history.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">{t('history.noHistory')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('history.startAnalyzing')}
              </p>
              <Button onClick={() => navigate('/')} className="h-12 touch-manipulation">
                {t('navigation.diseaseAnalyzer')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={item.imageUrl}
                    alt={item.imageName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2 pt-3">
                  <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                    {item.crop && <Badge variant="outline" className="text-xs">🌾 {item.crop}</Badge>}
                    <span className="truncate">{item.disease}</span>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3" />
                    {new Date(item.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={
                      item.type === 'bacterial' ? 'default' :
                      item.type === 'viral' ? 'secondary' :
                      item.type === 'fungal' ? 'destructive' :
                      'outline'
                    }>
                      {item.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {item.confidence}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 h-10 touch-manipulation"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('history.delete')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </div>
  );
};

export default History;
