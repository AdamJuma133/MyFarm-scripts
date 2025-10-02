import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUpload } from '@/components/ui/file-upload';
import { Loader2, Scan, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { diseases, Disease } from '@/data/diseases';

interface AnalysisResult {
  disease: Disease;
  confidence: number;
}

export function DiseaseAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simulated AI analysis - In production, this would use a real AI model
  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate disease detection with random selection for demo
      const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
      const confidence = Math.random() * 0.4 + 0.6; // 60-100% confidence
      
      const result = {
        disease: randomDisease,
        confidence
      };
      
      setAnalysisResult(result);
      
      // Save to history
      const reader = new FileReader();
      reader.onload = (e) => {
        const historyItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          imageName: file.name,
          imageUrl: e.target?.result as string,
          disease: randomDisease.name,
          type: randomDisease.type,
          confidence: `${Math.round(confidence * 100)}%`
        };
        
        const existingHistory = localStorage.getItem('myfarm-scan-history');
        const history = existingHistory ? JSON.parse(existingHistory) : [];
        history.unshift(historyItem);
        localStorage.setItem('myfarm-scan-history', JSON.stringify(history));
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
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
                  <h3 className="text-xl font-semibold">{analysisResult.disease.name}</h3>
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
              </div>

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