import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/navigation';
import { BottomNavigation } from '@/components/bottom-navigation';
import { MobileHeader } from '@/components/mobile-header';
import { ModerationLogViewer } from '@/components/moderation-log-viewer';
import { ReportsQueue } from '@/components/reports-queue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Flag, 
  History, 
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function Moderation() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [canModerate, setCanModerate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingReports, setPendingReports] = useState(0);

  useEffect(() => {
    checkModeratorAccess();
    fetchPendingReportsCount();
  }, [user]);

  const checkModeratorAccess = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Check if user has moderator/admin role or reputation >= 100
      const [{ data: roleData }, { data: profileData }] = await Promise.all([
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .in('role', ['moderator', 'admin']),
        supabase
          .from('profiles')
          .select('reputation_score')
          .eq('user_id', user.id)
          .single()
      ]);

      const hasRole = roleData && roleData.length > 0;
      const hasReputation = profileData && profileData.reputation_score >= 100;
      
      setCanModerate(hasRole || hasReputation);
    } catch (error) {
      console.error('Error checking moderator access:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingReportsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (!error && count !== null) {
        setPendingReports(count);
      }
    } catch (error) {
      console.error('Error fetching pending reports count:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <MobileHeader />
        <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (!canModerate) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <MobileHeader />
        <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                {t('moderation.accessDenied', 'Access Denied')}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t('moderation.accessDeniedMessage', 'You need moderator privileges or 100+ reputation to access this page.')}
              </p>
              <Button onClick={() => navigate('/forum')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('moderation.backToForum', 'Back to Forum')}
              </Button>
            </CardContent>
          </Card>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <MobileHeader />
      
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">
                  {t('moderation.dashboard', 'Moderation Dashboard')}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {t('moderation.dashboardDescription', 'Manage reports and view moderation activity')}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/forum')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('moderation.backToForum', 'Back to Forum')}
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flag className="h-5 w-5 text-amber-500" />
                    <span className="font-medium">{t('moderation.pendingReports', 'Pending Reports')}</span>
                  </div>
                  <Badge variant={pendingReports > 0 ? 'destructive' : 'secondary'}>
                    {pendingReports}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">{t('moderation.activityLog', 'Activity Log')}</span>
                  </div>
                  <Badge variant="outline">
                    {t('moderation.recent', 'Recent')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Reports and Logs */}
          <Tabs defaultValue="reports" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <Flag className="h-4 w-4" />
                {t('moderation.reports', 'Reports')}
                {pendingReports > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {pendingReports}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                {t('moderation.logs', 'Activity Log')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reports">
              <ReportsQueue />
            </TabsContent>

            <TabsContent value="logs">
              <ModerationLogViewer />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
