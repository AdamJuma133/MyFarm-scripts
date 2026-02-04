import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash2, Loader2, Share2 } from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { useNavigate } from 'react-router-dom';
import { LanguageSelector } from '@/components/language-selector';
import { MobileHeader } from '@/components/mobile-header';
import { BottomNavigation } from '@/components/bottom-navigation';
import { ShareScanDialog } from '@/components/share-scan-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ScanHistory {
  id: string;
  created_at: string;
  image_name: string | null;
  image_url: string | null;
  disease_name: string;
  disease_name_scientific: string | null;
  scan_type: string | null;
  confidence: number | null;
  crop_type: string | null;
  treatment_recommendations: string[] | null;
}

const History = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('scan_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching scan history:', error);
      toast.error(t('history.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase
        .from('scan_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(history.filter(item => item.id !== id));
      toast.success(t('history.deleted'));
    } catch (error) {
      console.error('Error deleting scan:', error);
      toast.error(t('history.errorDeleting'));
    } finally {
      setDeleting(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm(t('history.confirmClear'))) return;

    try {
      const { error } = await supabase
        .from('scan_history')
        .delete()
        .eq('user_id', user?.id);

      if (error) throw error;

      setHistory([]);
      toast.success(t('history.cleared'));
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error(t('history.errorClearing'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-secondary flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <BackButton />
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
            <div className="flex items-center gap-2">
              <BackButton />
              <h1 className="text-2xl font-bold">{t('history.title')}</h1>
            </div>
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
                {item.image_url && (
                  <div className="aspect-video relative">
                    <img
                      src={item.image_url}
                      alt={item.image_name || 'Scan image'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-2 pt-3">
                  <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                    {item.crop_type && <Badge variant="outline" className="text-xs">🌾 {item.crop_type}</Badge>}
                    <span className="truncate">{item.disease_name}</span>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3" />
                    {new Date(item.created_at).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={
                      item.scan_type === 'bacterial' ? 'default' :
                      item.scan_type === 'viral' ? 'secondary' :
                      item.scan_type === 'fungal' ? 'destructive' :
                      item.scan_type === 'healthy' ? 'outline' :
                      'outline'
                    }>
                      {item.scan_type || 'unknown'}
                    </Badge>
                    {item.confidence && (
                      <span className="text-sm text-muted-foreground">
                        {Math.round(item.confidence)}%
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <ShareScanDialog scan={item}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-10 touch-manipulation"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        {t('share.share', 'Share')}
                      </Button>
                    </ShareScanDialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-10 touch-manipulation text-destructive hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                    >
                      {deleting === item.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      {t('history.delete')}
                    </Button>
                  </div>
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
