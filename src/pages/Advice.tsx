import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Droplets, 
  Sun, 
  Shield, 
  Leaf, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';

const Advice = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const adviceCategories = [
    {
      icon: Shield,
      title: 'Disease Prevention',
      color: 'text-green-600 dark:text-green-400',
      tips: [
        'Rotate crops annually to prevent soil-borne diseases',
        'Maintain proper plant spacing for air circulation',
        'Remove infected plants immediately to prevent spread',
        'Use disease-resistant crop varieties when available'
      ]
    },
    {
      icon: Droplets,
      title: 'Watering Best Practices',
      color: 'text-blue-600 dark:text-blue-400',
      tips: [
        'Water early in the morning to reduce fungal growth',
        'Avoid overhead watering; use drip irrigation when possible',
        'Ensure proper drainage to prevent root rot',
        'Adjust watering based on weather conditions'
      ]
    },
    {
      icon: Sprout,
      title: 'Soil Health',
      color: 'text-amber-600 dark:text-amber-400',
      tips: [
        'Test soil pH and nutrient levels regularly',
        'Add organic matter to improve soil structure',
        'Practice crop rotation to maintain soil fertility',
        'Use mulch to retain moisture and prevent weeds'
      ]
    },
    {
      icon: Sun,
      title: 'Environmental Management',
      color: 'text-orange-600 dark:text-orange-400',
      tips: [
        'Ensure crops receive adequate sunlight (6-8 hours daily)',
        'Monitor temperature fluctuations that stress plants',
        'Protect crops from extreme weather conditions',
        'Provide shade during heat waves for sensitive crops'
      ]
    },
    {
      icon: Leaf,
      title: 'Nutrient Management',
      color: 'text-emerald-600 dark:text-emerald-400',
      tips: [
        'Apply fertilizers based on soil test results',
        'Use balanced NPK ratios appropriate for each crop',
        'Consider organic alternatives like compost',
        'Avoid over-fertilization which can harm plants'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Early Detection',
      color: 'text-red-600 dark:text-red-400',
      tips: [
        'Inspect plants regularly for disease symptoms',
        'Check undersides of leaves for pests and diseases',
        'Monitor plant growth patterns for abnormalities',
        'Use MyFarm AI analyzer for quick disease identification'
      ]
    }
  ];

  const seasonalTips = [
    {
      season: 'Spring',
      icon: Sprout,
      tips: [
        'Prepare soil beds and test soil quality',
        'Start seedlings indoors for warm-season crops',
        'Apply pre-emergent treatments for weeds',
        'Monitor for early pest activity'
      ]
    },
    {
      season: 'Summer',
      icon: Sun,
      tips: [
        'Increase watering frequency during heat',
        'Monitor for fungal diseases in humid conditions',
        'Harvest crops at peak ripeness',
        'Provide shade for heat-sensitive plants'
      ]
    },
    {
      season: 'Fall',
      icon: Leaf,
      tips: [
        'Plant cool-season crops',
        'Clean up plant debris to prevent disease overwintering',
        'Add compost to soil for next season',
        'Protect crops from early frost'
      ]
    },
    {
      season: 'Winter',
      icon: Clock,
      tips: [
        'Plan crop rotation for next season',
        'Maintain greenhouse conditions for winter crops',
        'Service and clean farming equipment',
        'Study disease patterns from past season'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Farming Advice & Recommendations
          </h1>
          <p className="text-lg opacity-90 max-w-3xl">
            Expert tips and best practices to keep your crops healthy and productive
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* General Best Practices */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adviceCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`h-6 w-6 ${category.color}`} />
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Seasonal Recommendations */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Seasonal Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasonalTips.map((season, index) => {
              const Icon = season.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-6 w-6 text-primary" />
                      <CardTitle className="text-xl">{season.season}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {season.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <span className="text-primary text-xs mt-1">•</span>
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Quick Tips */}
        <section>
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-2xl">Quick Daily Checklist</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Essential tasks for healthy crops
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg mb-3">Morning Tasks</h3>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Inspect plants for new disease symptoms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Check soil moisture levels</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Water if needed (before 10 AM)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Monitor weather forecast</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg mb-3">Evening Tasks</h3>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Remove any dead or diseased plant material</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Check for pest activity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Harvest ripe produce</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Plan next day's tasks</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 MyFarm - Empowering farmers with AI technology</p>
        </div>
      </footer>
    </div>
  );
};

export default Advice;