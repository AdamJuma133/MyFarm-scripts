import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ArrowLeft,
  Bug,
  Thermometer,
  CloudRain,
  FlaskConical,
  Recycle,
  Package,
  Globe
} from 'lucide-react';

const Advice = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const diseaseManagement = {
    fungal: {
      title: 'Fungal Diseases',
      icon: Leaf,
      color: 'text-emerald-600 dark:text-emerald-400',
      recommendations: [
        {
          category: 'Fungicide Application',
          points: [
            'Apply appropriate fungicides for detected diseases (e.g., powdery mildew, late blight, fusarium wilt)',
            'Follow recommended dosages and application frequencies',
            'Rotate fungicide classes to prevent resistance development'
          ]
        },
        {
          category: 'Water Management',
          points: [
            'Reduce leaf wetness through proper irrigation scheduling',
            'Ensure good drainage in the field to prevent standing water',
            'Water early in the morning to allow foliage to dry during the day'
          ]
        },
        {
          category: 'Crop Rotation',
          points: [
            'Rotate with non-host crops to break the disease cycle',
            'Plan minimum 2-3 year rotation periods',
            'Keep detailed records of crop placement'
          ]
        }
      ]
    },
    bacterial: {
      title: 'Bacterial Diseases',
      icon: AlertTriangle,
      color: 'text-orange-600 dark:text-orange-400',
      recommendations: [
        {
          category: 'Antibiotic Treatments',
          points: [
            'Apply specific bactericides for bacterial wilt or blight',
            'Use copper-based compounds where appropriate',
            'Follow resistance management protocols'
          ]
        },
        {
          category: 'Pruning and Removal',
          points: [
            'Prune infected plant parts immediately (e.g., citrus canker)',
            'Properly dispose of infected material - burn or bury',
            'Disinfect pruning tools between plants'
          ]
        },
        {
          category: 'Field Sanitation',
          points: [
            'Clean farm tools after touching infected plants',
            'Avoid overhead irrigation to prevent bacterial spread',
            'Implement strict sanitation protocols during wet conditions'
          ]
        }
      ]
    },
    viral: {
      title: 'Viral Diseases',
      icon: Bug,
      color: 'text-red-600 dark:text-red-400',
      recommendations: [
        {
          category: 'Vector Control',
          points: [
            'Control insect vectors like aphids and whiteflies',
            'Use yellow sticky traps for monitoring and control',
            'Apply appropriate insecticides when vector populations are high'
          ]
        },
        {
          category: 'Resistant Varieties',
          points: [
            'Plant genetically resistant crop varieties',
            'Choose virus-resistant tomatoes, peppers, or cucumbers',
            'Source certified disease-free seeds and transplants'
          ]
        },
        {
          category: 'Infected Plant Management',
          points: [
            'Remove and destroy infected plants immediately',
            'Create buffer zones around infected areas',
            'Monitor neighboring plants closely for symptoms'
          ]
        }
      ]
    },
    nematode: {
      title: 'Nematode Diseases',
      icon: FlaskConical,
      color: 'text-purple-600 dark:text-purple-400',
      recommendations: [
        {
          category: 'Soil Treatment',
          points: [
            'Apply soil fumigation with nematicides for severe infestations',
            'Consider organic alternatives like nematode-resistant crops',
            'Use bio-fumigation with plants like marigold or mustard'
          ]
        },
        {
          category: 'Crop Rotation',
          points: [
            'Rotate with crops not susceptible to nematodes',
            'Plant cereals instead of root vegetables',
            'Allow sufficient fallow periods between susceptible crops'
          ]
        },
        {
          category: 'Organic Soil Amendments',
          points: [
            'Add compost to improve soil health',
            'Incorporate green manures to suppress nematode populations',
            'Maintain high organic matter content'
          ]
        }
      ]
    }
  };

  const environmentalAdvice = [
    {
      title: 'Temperature and Humidity',
      icon: Thermometer,
      color: 'text-red-500',
      recommendations: [
        'Control humidity with dehumidifiers or adjust irrigation to prevent fungal/bacterial outbreaks',
        'Use shading or fans in greenhouses when temperatures exceed optimal growing conditions',
        'Protect crops from frost using row covers or heaters during cold spells',
        'Monitor temperature fluctuations that can stress plants'
      ]
    },
    {
      title: 'Soil Moisture',
      icon: Droplets,
      color: 'text-blue-500',
      recommendations: [
        'Use drip irrigation or sprinkler systems to maintain optimal moisture levels',
        'Apply mulching to reduce water loss and increase soil moisture retention',
        'Install soil moisture sensors for precise irrigation management',
        'Adjust watering frequency based on weather conditions and plant needs'
      ]
    },
    {
      title: 'Rain and Wind Protection',
      icon: CloudRain,
      color: 'text-slate-500',
      recommendations: [
        'Apply fungicides before heavy rain to prevent waterborne diseases',
        'Harvest vulnerable crops early when storms are forecasted',
        'Install windbreaks (trees, nets) to prevent crop damage',
        'Ensure proper drainage systems are in place before rainy seasons'
      ]
    }
  ];

  const soilHealthAdvice = [
    {
      title: 'Nutrient Deficiencies',
      recommendations: [
        'Apply specific fertilizers based on soil test results',
        'Use foliar feeding for quick nutrient uptake when soil absorption is slow',
        'Follow recommended application rates and timing',
        'Monitor plant response and adjust fertilization accordingly'
      ]
    },
    {
      title: 'Soil pH Management',
      recommendations: [
        'Apply lime to raise pH in acidic soils',
        'Use sulfur to lower pH in alkaline soils',
        'Target optimal pH range for specific crops (usually 6.0-7.0)',
        'Test soil pH regularly (at least annually)'
      ]
    },
    {
      title: 'Compaction and Aeration',
      recommendations: [
        'Use tillers or soil penetrators to improve soil aeration',
        'Implement deep plowing or subsoiling for compacted soils',
        'Avoid working soil when too wet to prevent compaction',
        'Add organic matter to improve soil structure'
      ]
    }
  ];

  const quickChecklist = {
    morning: [
      'Inspect plants for new disease symptoms',
      'Check soil moisture levels',
      'Water if needed (before 10 AM)',
      'Monitor weather forecast',
      'Check for pest activity'
    ],
    evening: [
      'Remove any dead or diseased plant material',
      'Check for pest activity',
      'Harvest ripe produce',
      'Plan next day\'s tasks',
      'Record observations in farm journal'
    ]
  };

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
            AI-Powered Agricultural Advice & Recommendations
          </h1>
          <p className="text-lg opacity-90 max-w-4xl">
            Comprehensive farming guidance tailored to disease detection, environmental conditions, and crop management practices
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="diseases">Disease Management</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
            <TabsTrigger value="soil">Soil Health</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">About This System</CardTitle>
                <CardDescription>
                  How AI-powered crop disease identification helps farmers
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <p>
                  This AI-powered crop disease identifier provides farmers with personalized farming advice and recommendations. 
                  These recommendations are tailored to the specific disease detected, environmental conditions, and crop type.
                </p>
                <p>
                  By integrating real-time monitoring, personalized recommendations, and cutting-edge technologies, this system 
                  plays a pivotal role in helping farmers manage their crops more effectively while combating diseases in a timely manner.
                </p>
              </CardContent>
            </Card>

            {/* Quick Daily Checklist */}
            <Card className="bg-gradient-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-2xl">Quick Daily Checklist</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Essential tasks for healthy crops
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Sun className="h-5 w-5" />
                      Morning Tasks
                    </h3>
                    {quickChecklist.morning.map((task, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Evening Tasks
                    </h3>
                    {quickChecklist.evening.map((task, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disease Management Tab */}
          <TabsContent value="diseases" className="space-y-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Disease-Specific Management</h2>
              <p className="text-muted-foreground">
                Tailored advice for different types of crop diseases
              </p>
            </div>

            {Object.values(diseaseManagement).map((disease, index) => {
              const Icon = disease.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon className={`h-8 w-8 ${disease.color}`} />
                      <CardTitle className="text-2xl">{disease.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {disease.recommendations.map((rec, recIndex) => (
                        <div key={recIndex}>
                          <h4 className="font-semibold text-lg mb-3 text-primary">
                            {rec.category}
                          </h4>
                          <ul className="space-y-2">
                            {rec.points.map((point, pointIndex) => (
                              <li key={pointIndex} className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* IPM Section */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Bug className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">Integrated Pest Management (IPM)</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-primary">Biological Control</h4>
                    <p>Introduce natural predators like ladybugs for aphid control, parasitic wasps for caterpillars, and nematodes for soil pests.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-primary">Mechanical Control</h4>
                    <p>Use physical barriers, nets, traps, and manual removal. Install insect screens in greenhouses and use row covers for protection.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-primary">Chemical Control</h4>
                    <p>Apply eco-friendly pesticides with correct application rates and schedules. Rotate pesticide classes to prevent resistance.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Environment Tab */}
          <TabsContent value="environment" className="space-y-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Environmental & Weather-Based Advice</h2>
              <p className="text-muted-foreground">
                Optimize growing conditions based on environmental factors
              </p>
            </div>

            {environmentalAdvice.map((advice, index) => {
              const Icon = advice.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon className={`h-8 w-8 ${advice.color}`} />
                      <CardTitle className="text-2xl">{advice.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {advice.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Soil Health Tab */}
          <TabsContent value="soil" className="space-y-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Soil Health & Fertility</h2>
              <p className="text-muted-foreground">
                Maintain optimal soil conditions for healthy crop growth
              </p>
            </div>

            {soilHealthAdvice.map((advice, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-2xl">{advice.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {advice.recommendations.map((rec, recIndex) => (
                      <li key={recIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Advanced Practices</h2>
              <p className="text-muted-foreground">
                Long-term strategies for sustainable farming
              </p>
            </div>

            {/* Crop Variety Selection */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Recycle className="h-8 w-8 text-green-600" />
                  <CardTitle className="text-2xl">Crop Variety Selection & Rotation</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-primary">Disease-Resistant Varieties</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Plant disease-resistant crop varieties (e.g., resistant tomatoes for bacterial wilt)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Choose varieties suited to your local climate and soil conditions</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-primary">Crop Rotation Strategies</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Rotate tomatoes with cereals (wheat or corn) to avoid soil-borne diseases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Plan 3-4 year rotation cycles for optimal disease management</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-primary">Polyculture & Agroforestry</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Grow multiple crops together to reduce pest and disease risks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Incorporate trees and shrubs to improve soil health and biodiversity</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Post-Harvest Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-amber-600" />
                  <CardTitle className="text-2xl">Post-Harvest Management & Storage</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-primary">Disease Prevention in Storage</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Maintain low humidity and good ventilation in storage areas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Treat crops with appropriate fungicides before storing (e.g., potato blight)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Regularly inspect stored crops for early disease signs</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-primary">Processing & Packaging</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Wash and disinfect equipment and packaging materials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Use cold storage for perishable crops to prevent post-harvest rot</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Climate Change Adaptation */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Globe className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-2xl">Climate Change Adaptation & Resilience</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Implement climate-smart agriculture practices including efficient water management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Diversify crops to spread risk across different weather patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Use heat-tolerant and drought-resistant crop varieties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Adopt conservation agriculture techniques to improve soil resilience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Monitor and adapt to changing growing seasons and weather patterns</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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