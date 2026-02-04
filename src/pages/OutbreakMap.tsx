import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BackButton } from '@/components/back-button';
import { MobileHeader } from '@/components/mobile-header';
import { BottomNavigation } from '@/components/bottom-navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  AlertTriangle, 
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Shield,
  Leaf
} from 'lucide-react';

interface OutbreakReport {
  id: string;
  disease: string;
  crop: string;
  location: string;
  region: string;
  severity: 'low' | 'medium' | 'high';
  reportedDate: string;
  affectedArea: string;
  status: 'active' | 'contained' | 'resolved';
}

// Demo outbreak data
const demoOutbreaks: OutbreakReport[] = [
  {
    id: '1',
    disease: 'Late Blight',
    crop: 'Tomato',
    location: 'Central Kenya',
    region: 'East Africa',
    severity: 'high',
    reportedDate: '2025-01-05',
    affectedArea: '150 hectares',
    status: 'active'
  },
  {
    id: '2',
    disease: 'Cassava Mosaic Disease',
    crop: 'Cassava',
    location: 'Western Nigeria',
    region: 'West Africa',
    severity: 'high',
    reportedDate: '2025-01-03',
    affectedArea: '500 hectares',
    status: 'active'
  },
  {
    id: '3',
    disease: 'Coffee Leaf Rust',
    crop: 'Coffee',
    location: 'Antioquia, Colombia',
    region: 'South America',
    severity: 'medium',
    reportedDate: '2025-01-02',
    affectedArea: '200 hectares',
    status: 'contained'
  },
  {
    id: '4',
    disease: 'Rice Blast',
    crop: 'Rice',
    location: 'Punjab, India',
    region: 'South Asia',
    severity: 'high',
    reportedDate: '2025-01-01',
    affectedArea: '1000 hectares',
    status: 'active'
  },
  {
    id: '5',
    disease: 'Banana Black Sigatoka',
    crop: 'Banana',
    location: 'Costa Rica',
    region: 'Central America',
    severity: 'medium',
    reportedDate: '2024-12-28',
    affectedArea: '300 hectares',
    status: 'contained'
  },
  {
    id: '6',
    disease: 'Wheat Rust',
    crop: 'Wheat',
    location: 'Eastern Ethiopia',
    region: 'East Africa',
    severity: 'high',
    reportedDate: '2024-12-25',
    affectedArea: '800 hectares',
    status: 'active'
  },
  {
    id: '7',
    disease: 'Powdery Mildew',
    crop: 'Grape',
    location: 'Napa Valley, USA',
    region: 'North America',
    severity: 'low',
    reportedDate: '2024-12-20',
    affectedArea: '50 hectares',
    status: 'resolved'
  },
  {
    id: '8',
    disease: 'Corn Gray Leaf Spot',
    crop: 'Corn',
    location: 'Zambia',
    region: 'Southern Africa',
    severity: 'medium',
    reportedDate: '2024-12-18',
    affectedArea: '400 hectares',
    status: 'contained'
  }
];

const regions = ['All Regions', 'East Africa', 'West Africa', 'South Asia', 'South America', 'Central America', 'North America', 'Southern Africa'];

export default function OutbreakMap() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const filteredOutbreaks = demoOutbreaks.filter(outbreak => {
    const matchesSearch = 
      outbreak.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outbreak.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outbreak.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = selectedRegion === 'All Regions' || outbreak.region === selectedRegion;
    const matchesSeverity = selectedSeverity === 'all' || outbreak.severity === selectedSeverity;
    
    return matchesSearch && matchesRegion && matchesSeverity;
  });

  const activeCount = demoOutbreaks.filter(o => o.status === 'active').length;
  const highSeverityCount = demoOutbreaks.filter(o => o.severity === 'high').length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'destructive';
      case 'contained': return 'warning';
      case 'resolved': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader />
      </div>
      
      <main className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BackButton />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2 md:gap-3">
              <MapPin className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              {t('outbreakMap.title', 'Disease Outbreak Tracker')}
            </h1>
          </div>
          <p className="text-muted-foreground mt-2 ml-10 text-sm md:text-base">
            {t('outbreakMap.subtitle', 'Real-time monitoring of crop disease outbreaks worldwide')}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{activeCount}</p>
                <p className="text-sm text-muted-foreground">{t('outbreakMap.activeOutbreaks', 'Active Outbreaks')}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-warning/10 border-warning/20">
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{highSeverityCount}</p>
                <p className="text-sm text-muted-foreground">{t('outbreakMap.highSeverity', 'High Severity')}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Leaf className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{new Set(demoOutbreaks.map(o => o.crop)).size}</p>
                <p className="text-sm text-muted-foreground">{t('outbreakMap.cropsAffected', 'Crops Affected')}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-success/10 border-success/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Shield className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{demoOutbreaks.filter(o => o.status === 'resolved').length}</p>
                <p className="text-sm text-muted-foreground">{t('outbreakMap.resolved', 'Resolved')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Notice */}
        <Alert className="mb-6 border-primary/50 bg-primary/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t('outbreakMap.demoNotice', 'This is demo data for demonstration purposes. In production, this would show real-time community-reported outbreaks.')}
          </AlertDescription>
        </Alert>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('outbreakMap.searchPlaceholder', 'Search by disease, crop, or location...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3 py-2 rounded-md border bg-background text-sm"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                
                <Tabs value={selectedSeverity} onValueChange={setSelectedSeverity} className="w-auto">
                  <TabsList className="h-10">
                    <TabsTrigger value="all" className="px-3">{t('outbreakMap.all', 'All')}</TabsTrigger>
                    <TabsTrigger value="high" className="px-3 text-destructive">{t('outbreakMap.high', 'High')}</TabsTrigger>
                    <TabsTrigger value="medium" className="px-3 text-warning">{t('outbreakMap.medium', 'Medium')}</TabsTrigger>
                    <TabsTrigger value="low" className="px-3 text-success">{t('outbreakMap.low', 'Low')}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outbreak List */}
        <div className="space-y-4">
          {filteredOutbreaks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t('outbreakMap.noResults', 'No outbreaks match your filters')}</p>
              </CardContent>
            </Card>
          ) : (
            filteredOutbreaks.map((outbreak) => (
              <Card key={outbreak.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{outbreak.disease}</h3>
                        <Badge variant={getSeverityColor(outbreak.severity)}>
                          {outbreak.severity.toUpperCase()}
                        </Badge>
                        <Badge variant={getStatusColor(outbreak.status)}>
                          {outbreak.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Leaf className="h-4 w-4" />
                          {outbreak.crop}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {outbreak.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {outbreak.reportedDate}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{t('outbreakMap.affectedArea', 'Affected Area')}</p>
                      <p className="font-semibold">{outbreak.affectedArea}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
      
      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </div>
  );
}
