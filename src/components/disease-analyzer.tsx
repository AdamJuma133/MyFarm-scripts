import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUpload } from '@/components/ui/file-upload';
import { Loader2, Scan, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { diseases, Disease } from '@/data/diseases';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalysisResult {
  disease: Disease | null;
  confidence: number;
  detectedCrop: string;
  aiConfidence: number;
  isHealthy: boolean;
  diseaseName?: string;
}

export function DiseaseAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // AI-powered image analysis using Lovable AI
  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      const imageData = await base64Promise;
      
      // Call edge function to analyze crop with AI
      const { data: aiResult, error: aiError } = await supabase.functions.invoke('analyze-crop', {
        body: { imageData }
      });

      if (aiError) {
        throw new Error(aiError.message || 'Failed to analyze image');
      }

      if (!aiResult) {
        throw new Error('No result from AI analysis');
      }

      const detectedCrop = aiResult.cropType;
      const isHealthy = aiResult.isHealthy;
      
      let selectedDisease: Disease | null = null;
      let matchConfidence = aiResult.confidence;
      
      // Only search for disease if crop is not healthy
      if (!isHealthy) {
        const detectedDiseaseType = aiResult.diseaseType || 'fungal';
        const diseaseName = aiResult.diseaseName;
        
        // Try to find matching disease in our database
        if (diseaseName) {
          // First try exact match by name
          const exactMatch = diseases.find(d => 
            d.name.toLowerCase().includes(diseaseName.toLowerCase()) ||
            diseaseName.toLowerCase().includes(d.name.toLowerCase())
          );
          
          if (exactMatch) {
            selectedDisease = exactMatch;
          }
        }
        
        // If no exact match, try by crop and type
        if (!selectedDisease) {
          const matchingDiseases = diseases.filter(d => 
            d.crops.some(crop => crop.toLowerCase().includes(detectedCrop.toLowerCase())) &&
            d.type === detectedDiseaseType
          );
          
          if (matchingDiseases.length > 0) {
            selectedDisease = matchingDiseases[0];
          } else {
            // Fallback to any disease for this crop
            const cropDiseases = diseases.filter(d => 
              d.crops.some(crop => crop.toLowerCase().includes(detectedCrop.toLowerCase()))
            );
            selectedDisease = cropDiseases.length > 0 ? cropDiseases[0] : null;
          }
        }
      }
      
      const result: AnalysisResult = {
        disease: selectedDisease,
        confidence: matchConfidence,
        detectedCrop: detectedCrop,
        aiConfidence: aiResult.confidence,
        isHealthy: isHealthy,
        diseaseName: aiResult.diseaseName
      };
      
      setAnalysisResult(result);
      
      // Save to history with detected crop
      const historyReader = new FileReader();
      historyReader.onload = (e) => {
        const historyItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          imageName: file.name,
          imageUrl: e.target?.result as string,
          disease: isHealthy ? 'Healthy' : (selectedDisease?.name || aiResult.diseaseName || 'Unknown Disease'),
          type: isHealthy ? 'healthy' : (selectedDisease?.type || aiResult.diseaseType || 'unknown'),
          confidence: `${Math.round(result.confidence * 100)}%`,
          crop: detectedCrop
        };
        
        const existingHistory = localStorage.getItem('myfarm-scan-history');
        const history = existingHistory ? JSON.parse(existingHistory) : [];
        history.unshift(historyItem);
        localStorage.setItem('myfarm-scan-history', JSON.stringify(history));
      };
      historyReader.readAsDataURL(file);
      
      if (isHealthy) {
        toast.success(`${detectedCrop} appears healthy!`);
      } else {
        toast.success(`${detectedCrop} analyzed - disease detected`);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAnalysisResult(null);
    setError(null);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setError(null);
  };

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            AI Crop Disease Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            selectedFile={selectedFile}
          />
          
          {selectedFile && !isAnalyzing && !analysisResult && (
            <Button 
              onClick={() => analyzeImage(selectedFile)}
              className="w-full"
            >
              <Scan className="h-4 w-4 mr-2" />
              Analyze Crop Image
            </Button>
          )}

          {isAnalyzing && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Analyzing your crop image with AI technology...
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Analysis Results
              <Badge variant="outline">
                {Math.round(analysisResult.confidence * 100)}% Confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-base px-3 py-1">
                    🌾 {analysisResult.detectedCrop}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                {analysisResult.isHealthy ? (
                  <div className="text-center py-6">
                    <div className="inline-flex items-center gap-2 mb-4">
                      <CheckCircle className="h-12 w-12 text-success" />
                    </div>
                    <h3 className="text-2xl font-bold text-success mb-2">Crop is Healthy!</h3>
                    <p className="text-muted-foreground">
                      No disease symptoms detected in your {analysisResult.detectedCrop}. Keep up the good practices!
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="h-6 w-6 text-destructive" />
                        <h3 className="text-xl font-semibold text-destructive">
                          Infected with {analysisResult.diseaseName || analysisResult.disease?.name || 'Disease'}
                        </h3>
                      </div>
                      {analysisResult.disease && (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant={getSeverityColor(analysisResult.disease.severity)}
                              className="flex items-center gap-1"
                            >
                              {getSeverityIcon(analysisResult.disease.severity)}
                              {analysisResult.disease.severity} severity
                            </Badge>
                            <Badge variant="secondary">
                              {analysisResult.disease.type}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{analysisResult.disease.description}</p>
                        </>
                      )}
                    </div>

                    {analysisResult.disease && (
                      <>
                        <div>
                          <h4 className="font-semibold mb-2">Affected Crops</h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.disease.crops.map((crop) => (
                              <Badge key={crop} variant="outline">
                                {crop}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Symptoms</h4>
                          <ul className="space-y-1">
                            {analysisResult.disease.symptoms.map((symptom, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-muted-foreground">•</span>
                                <span className="text-sm">{symptom}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Treatment Recommendations</h4>
                          <ul className="space-y-1">
                            {analysisResult.disease.treatment.map((treatment, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-success">✓</span>
                                <span className="text-sm">{treatment}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Prevention Measures</h4>
                          <ul className="space-y-1">
                            {analysisResult.disease.prevention.map((prevention, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-primary">→</span>
                                <span className="text-sm">{prevention}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedFile(null);
                setAnalysisResult(null);
                setError(null);
              }}
              className="w-full"
            >
              Analyze Another Image
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}