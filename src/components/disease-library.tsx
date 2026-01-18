import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Book, AlertTriangle, CheckCircle, XCircle, Download, WifiOff, Loader2 } from 'lucide-react';
import { Disease, getDiseasesByType } from '@/data/diseases';
import { useOfflineDiseases } from '@/hooks/use-offline-diseases';
import { useOffline } from '@/hooks/use-offline';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function DiseaseLibrary() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const { diseases, isLoading, isCached, cacheDiseasesNow } = useOfflineDiseases();
  const { isOnline } = useOffline();
  const [caching, setCaching] = useState(false);

  const handleCacheForOffline = async () => {
    setCaching(true);
    await cacheDiseasesNow();
    setCaching(false);
  };

  const filteredDiseases = diseases.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.crops.some(crop => crop.toLowerCase().includes(searchTerm.toLowerCase())) ||
    disease.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity: Disease['severity']) => {
    switch (severity) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: Disease['severity']) => {
    switch (severity) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getTypeColor = (type: Disease['type']) => {
    switch (type) {
      case 'bacterial': return 'destructive';
      case 'viral': return 'warning';
      case 'fungal': return 'secondary';
      case 'nutritional': return 'success';
      default: return 'outline';
    }
  };

  const DiseaseCard = ({ disease }: { disease: Disease }) => (
    <Card 
      className="cursor-pointer hover:shadow-medium transition-all duration-200 active:scale-[0.98] touch-manipulation"
      onClick={() => setSelectedDisease(disease)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base leading-tight">{disease.name}</h3>
            <Badge 
              variant={getSeverityColor(disease.severity)}
              className="flex items-center gap-1 shrink-0"
            >
              {getSeverityIcon(disease.severity)}
              <span className="hidden sm:inline">{t(`severity.${disease.severity}`)}</span>
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={getTypeColor(disease.type)}>
              {t(`library.${disease.type}`)}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {disease.description}
          </p>
          
          <div className="flex flex-wrap gap-1">
            {disease.crops.slice(0, 3).map((crop) => (
              <Badge key={crop} variant="outline" className="text-xs">
                {crop}
              </Badge>
            ))}
            {disease.crops.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{disease.crops.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (selectedDisease) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setSelectedDisease(null)}
            className="h-11 touch-manipulation"
          >
            {t('library.backToLibrary')}
          </Button>
          <h2 className="text-xl md:text-2xl font-bold truncate">{selectedDisease.name}</h2>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Badge 
                variant={getSeverityColor(selectedDisease.severity)}
                className="flex items-center gap-1"
              >
                {getSeverityIcon(selectedDisease.severity)}
                {t(`severity.${selectedDisease.severity}`)} {t('analyzer.severity')}
              </Badge>
              <Badge variant={getTypeColor(selectedDisease.type)}>
                {t(`library.${selectedDisease.type}`)} {t('library.disease')}
              </Badge>
            </div>

            <p className="text-lg">{selectedDisease.description}</p>

            <div>
              <h4 className="font-semibold mb-2">Affected Crops</h4>
              <div className="flex flex-wrap gap-2">
                {selectedDisease.crops.map((crop) => (
                  <Badge key={crop} variant="outline">
                    {crop}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Symptoms
                </h4>
                <ul className="space-y-2">
                  {selectedDisease.symptoms.map((symptom, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-muted-foreground mt-1">•</span>
                      <span className="text-sm">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Causes</h4>
                <ul className="space-y-2">
                  {selectedDisease.causes.map((cause, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-muted-foreground mt-1">•</span>
                      <span className="text-sm">{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Treatment
                </h4>
                <ul className="space-y-2">
                  {selectedDisease.treatment.map((treatment, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-success mt-1">✓</span>
                      <span className="text-sm">{treatment}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Prevention</h4>
                <ul className="space-y-2">
                  {selectedDisease.prevention.map((prevention, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">→</span>
                      <span className="text-sm">{prevention}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Book className="h-6 w-6" />
          <h2 className="text-xl md:text-2xl font-bold">{t('library.title')}</h2>
          {isCached && (
            <Badge variant="outline" className="hidden sm:flex">
              <WifiOff className="h-3 w-3 mr-1" />
              {t('offline.cached', 'Cached')}
            </Badge>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleCacheForOffline}
          disabled={caching || isCached}
          className="h-10 touch-manipulation"
        >
          {caching ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('offline.caching', 'Caching...')}
            </>
          ) : isCached ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              {t('offline.cached', 'Cached')}
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              {t('offline.saveOffline', 'Save Offline')}
            </>
          )}
        </Button>
      </div>

      {!isOnline && !isCached && (
        <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
          <WifiOff className="h-5 w-5 text-amber-600" />
          <AlertDescription className="ml-2 text-amber-700 dark:text-amber-300">
            {t('offline.libraryNotCached', 'Disease library not cached. Connect to internet to view all diseases.')}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t('library.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 md:h-10 text-base"
            />
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 h-auto gap-1 p-1">
          <TabsTrigger value="all" className="h-10 touch-manipulation text-sm">{t('library.all')}</TabsTrigger>
          <TabsTrigger value="fungal" className="h-10 touch-manipulation text-sm">{t('library.fungal')}</TabsTrigger>
          <TabsTrigger value="bacterial" className="h-10 touch-manipulation text-sm">{t('library.bacterial')}</TabsTrigger>
          <TabsTrigger value="viral" className="h-10 touch-manipulation text-sm hidden md:flex">{t('library.viral')}</TabsTrigger>
          <TabsTrigger value="nutritional" className="h-10 touch-manipulation text-sm hidden md:flex">{t('library.nutritional')}</TabsTrigger>
        </TabsList>
        
        {/* Mobile-only second row of tabs */}
        <TabsList className="grid w-full grid-cols-2 md:hidden h-auto gap-1 p-1">
          <TabsTrigger value="viral" className="h-10 touch-manipulation text-sm">{t('library.viral')}</TabsTrigger>
          <TabsTrigger value="nutritional" className="h-10 touch-manipulation text-sm">{t('library.nutritional')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDiseases.map((disease) => (
              <DiseaseCard key={disease.id} disease={disease} />
            ))}
          </div>
        </TabsContent>

        {(['fungal', 'bacterial', 'viral', 'nutritional'] as const).map((type) => (
          <TabsContent key={type} value={type}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getDiseasesByType(type)
                .filter(disease =>
                  disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  disease.crops.some(crop => crop.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map((disease) => (
                  <DiseaseCard key={disease.id} disease={disease} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {filteredDiseases.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t('library.noResults')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}