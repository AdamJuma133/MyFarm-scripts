import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Book, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { diseases, Disease, getDiseasesByType } from '@/data/diseases';

export function DiseaseLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);

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
      className="cursor-pointer hover:shadow-medium transition-all duration-200 hover:scale-[1.02]"
      onClick={() => setSelectedDisease(disease)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold">{disease.name}</h3>
            <Badge 
              variant={getSeverityColor(disease.severity)}
              className="flex items-center gap-1"
            >
              {getSeverityIcon(disease.severity)}
              {disease.severity}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={getTypeColor(disease.type)}>
              {disease.type}
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
                +{disease.crops.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (selectedDisease) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedDisease(null)}
          >
            ← Back to Library
          </Button>
          <h2 className="text-2xl font-bold">{selectedDisease.name}</h2>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Badge 
                variant={getSeverityColor(selectedDisease.severity)}
                className="flex items-center gap-1"
              >
                {getSeverityIcon(selectedDisease.severity)}
                {selectedDisease.severity} severity
              </Badge>
              <Badge variant={getTypeColor(selectedDisease.type)}>
                {selectedDisease.type} disease
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Book className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Disease Library</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search diseases, crops, or types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="fungal">Fungal</TabsTrigger>
          <TabsTrigger value="bacterial">Bacterial</TabsTrigger>
          <TabsTrigger value="viral">Viral</TabsTrigger>
          <TabsTrigger value="nutritional">Nutritional</TabsTrigger>
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
            <p className="text-muted-foreground">No diseases found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}