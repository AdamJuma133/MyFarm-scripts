import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  Clock, 
  Leaf, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader2,
  Calendar
} from 'lucide-react';
import { MobileHeader } from '@/components/mobile-header';
import { BottomNavigation } from '@/components/bottom-navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ScanStats {
  totalScans: number;
  healthyScans: number;
  diseasedScans: number;
  avgConfidence: number;
  diseaseTypes: Record<string, number>;
  scansThisWeek: number;
  scansLastWeek: number;
  recentScans: Array<{
    id: string;
    disease_name: string;
    crop_type: string | null;
    confidence: number | null;
    created_at: string;
    scan_type: string | null;
  }>;
  weeklyData: Array<{ day: string; scans: number }>;
}

const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<ScanStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const { data: scans, error } = await supabase
        .from('scan_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const healthyScans = scans?.filter(s => s.scan_type === 'healthy' || s.disease_name === 'Healthy') || [];
      const diseasedScans = scans?.filter(s => s.scan_type !== 'healthy' && s.disease_name !== 'Healthy') || [];
      
      const scansThisWeek = scans?.filter(s => new Date(s.created_at) >= weekAgo) || [];
      const scansLastWeek = scans?.filter(s => {
        const date = new Date(s.created_at);
        return date >= twoWeeksAgo && date < weekAgo;
      }) || [];

      // Count disease types
      const diseaseTypes: Record<string, number> = {};
      diseasedScans.forEach(scan => {
        const type = scan.scan_type || 'unknown';
        diseaseTypes[type] = (diseaseTypes[type] || 0) + 1;
      });

      // Calculate weekly data
      const weeklyData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayName = date.toLocaleDateString('en', { weekday: 'short' });
        const dayScans = scans?.filter(s => {
          const scanDate = new Date(s.created_at);
          return scanDate.toDateString() === date.toDateString();
        }) || [];
        weeklyData.push({ day: dayName, scans: dayScans.length });
      }

      const avgConfidence = scans?.length 
        ? scans.reduce((sum, s) => sum + (s.confidence || 0), 0) / scans.length 
        : 0;

      setStats({
        totalScans: scans?.length || 0,
        healthyScans: healthyScans.length,
        diseasedScans: diseasedScans.length,
        avgConfidence: Math.round(avgConfidence),
        diseaseTypes,
        scansThisWeek: scansThisWeek.length,
        scansLastWeek: scansLastWeek.length,
        recentScans: (scans || []).slice(0, 5),
        weeklyData,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthScore = () => {
    if (!stats || stats.totalScans === 0) return 100;
    return Math.round((stats.healthyScans / stats.totalScans) * 100);
  };

  const getTrendPercentage = () => {
    if (!stats || stats.scansLastWeek === 0) return stats?.scansThisWeek || 0;
    return Math.round(((stats.scansThisWeek - stats.scansLastWeek) / stats.scansLastWeek) * 100);
  };

  const pieChartData = stats ? [
    { name: 'Healthy', value: stats.healthyScans, fill: 'hsl(var(--success))' },
    { name: 'Diseased', value: stats.diseasedScans, fill: 'hsl(var(--destructive))' },
  ].filter(d => d.value > 0) : [];

  const chartConfig = {
    scans: {
      label: "Scans",
      color: "hsl(var(--primary))",
    },
    healthy: {
      label: "Healthy",
      color: "hsl(var(--success))",
    },
    diseased: {
      label: "Diseased",
      color: "hsl(var(--destructive))",
    },
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
      <div className="md:hidden">
        <MobileHeader />
      </div>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Header */}
        <div className="hidden md:flex mb-6 items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="h-11 touch-manipulation">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <h1 className="text-3xl font-bold">{t('dashboard.title', 'Dashboard')}</h1>
        </div>

        <div className="md:hidden mb-4">
          <h1 className="text-2xl font-bold">{t('dashboard.title', 'Dashboard')}</h1>
          <p className="text-muted-foreground">{t('dashboard.subtitle', 'Your farm health overview')}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">{t('dashboard.totalScans', 'Total Scans')}</span>
              </div>
              <p className="text-2xl font-bold">{stats?.totalScans || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm text-muted-foreground">{t('dashboard.healthy', 'Healthy')}</span>
              </div>
              <p className="text-2xl font-bold text-success">{stats?.healthyScans || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="text-sm text-muted-foreground">{t('dashboard.diseased', 'Diseased')}</span>
              </div>
              <p className="text-2xl font-bold text-destructive">{stats?.diseasedScans || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">{t('dashboard.thisWeek', 'This Week')}</span>
              </div>
              <p className="text-2xl font-bold">{stats?.scansThisWeek || 0}</p>
              {getTrendPercentage() !== 0 && (
                <span className={`text-xs ${getTrendPercentage() > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                  {getTrendPercentage() > 0 ? '+' : ''}{getTrendPercentage()}% vs last week
                </span>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Farm Health Score */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              {t('dashboard.farmHealth', 'Farm Health Score')}
            </CardTitle>
            <CardDescription>{t('dashboard.farmHealthDesc', 'Based on your scan results')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={getHealthScore()} className="h-4" />
              </div>
              <span className={`text-2xl font-bold ${getHealthScore() >= 70 ? 'text-success' : getHealthScore() >= 40 ? 'text-warning' : 'text-destructive'}`}>
                {getHealthScore()}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {getHealthScore() >= 70 
                ? t('dashboard.healthGood', 'Your crops are in good health!')
                : getHealthScore() >= 40
                ? t('dashboard.healthFair', 'Some crops need attention')
                : t('dashboard.healthPoor', 'Multiple disease issues detected')}
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Weekly Activity Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5" />
                {t('dashboard.weeklyActivity', 'Weekly Activity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats && stats.weeklyData.some(d => d.scans > 0) ? (
                <ChartContainer config={chartConfig} className="h-48">
                  <BarChart data={stats.weeklyData}>
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="scans" fill="var(--color-scans)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  {t('dashboard.noData', 'No scan data yet')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Leaf className="h-5 w-5" />
                {t('dashboard.healthDistribution', 'Health Distribution')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieChartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-48">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  {t('dashboard.noData', 'No scan data yet')}
                </div>
              )}
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-sm">{t('dashboard.healthy', 'Healthy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm">{t('dashboard.diseased', 'Diseased')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t('dashboard.recentActivity', 'Recent Activity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats && stats.recentScans.length > 0 ? (
              <div className="space-y-3">
                {stats.recentScans.map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {scan.scan_type === 'healthy' || scan.disease_name === 'Healthy' ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{scan.disease_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {scan.crop_type && `${scan.crop_type} • `}
                          {new Date(scan.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {scan.confidence && (
                      <Badge variant="outline">{Math.round(scan.confidence)}%</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('dashboard.noRecentActivity', 'No recent activity')}</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
                  {t('dashboard.startScanning', 'Start Scanning')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;