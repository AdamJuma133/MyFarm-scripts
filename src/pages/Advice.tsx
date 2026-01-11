import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { MobileHeader } from '@/components/mobile-header';
import { BottomNavigation } from '@/components/bottom-navigation';
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
  Globe,
  Tractor,
  Wheat,
  TreePine,
  Calendar,
  Shovel,
  Zap,
  Heart,
  TrendingUp,
  Target,
  Sparkles,
  Layers,
  HandHeart,
  Scale
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

  const waterManagement = [
    {
      title: 'Irrigation Systems',
      icon: Droplets,
      color: 'text-blue-500',
      recommendations: [
        'Install drip irrigation for 30-50% water savings compared to flood irrigation',
        'Use sprinkler systems for larger field crops with even water distribution',
        'Implement subsurface drip irrigation for high-value crops',
        'Schedule irrigation during early morning or late evening to reduce evaporation',
        'Monitor soil moisture at different depths using sensors'
      ]
    },
    {
      title: 'Water Conservation',
      icon: Recycle,
      color: 'text-green-500',
      recommendations: [
        'Apply organic mulch (straw, wood chips) to reduce water evaporation by 25-50%',
        'Harvest rainwater using collection systems and storage tanks',
        'Use cover crops to improve soil water retention',
        'Implement terracing on sloped land to reduce runoff',
        'Recycle treated wastewater for non-edible crops where regulations permit'
      ]
    },
    {
      title: 'Deficit Irrigation Strategies',
      icon: Target,
      color: 'text-amber-500',
      recommendations: [
        'Apply regulated deficit irrigation during non-critical growth stages',
        'Monitor plant stress indicators (leaf wilting, color changes)',
        'Use partial root-zone drying to improve water use efficiency',
        'Adjust irrigation frequency based on crop growth stage',
        'Combine deficit irrigation with drought-tolerant varieties'
      ]
    }
  ];

  const plantingGuide = {
    preparation: [
      'Test soil for pH, nutrients, and organic matter content before planting',
      'Clear field of weeds, debris, and previous crop residues',
      'Apply base fertilizers based on soil test recommendations',
      'Prepare seedbeds with proper tilth for good seed-soil contact',
      'Plan plant spacing based on variety and growth habits'
    ],
    techniques: [
      'Direct seeding: Best for large seeds (corn, beans, squash)',
      'Transplanting: Ideal for tomatoes, peppers, and brassicas',
      'Raised beds: Improve drainage and soil warming',
      'No-till planting: Preserves soil structure and moisture',
      'Intercropping: Maximize space and reduce pest pressure'
    ],
    timing: [
      'Check last frost date for your region before planting tender crops',
      'Use soil temperature (not air temperature) as planting indicator',
      'Stagger plantings every 2-3 weeks for continuous harvest',
      'Consider photoperiod requirements for flowering crops',
      'Plan succession planting for year-round production'
    ]
  };

  const seasonalTips = {
    spring: {
      title: 'Spring (Planting Season)',
      icon: Sprout,
      color: 'text-green-500',
      tips: [
        'Prepare soil as soon as it can be worked (not too wet)',
        'Start seeds indoors 6-8 weeks before last frost',
        'Apply pre-emergent herbicides before weed seeds germinate',
        'Install irrigation systems before peak water needs',
        'Scout for early-season pests like cutworms and aphids'
      ]
    },
    summer: {
      title: 'Summer (Growing Season)',
      icon: Sun,
      color: 'text-yellow-500',
      tips: [
        'Maintain consistent watering during fruit development',
        'Apply side-dressing of nitrogen for heavy feeders',
        'Monitor for heat stress and provide shade if needed',
        'Scout regularly for pests and diseases (weekly minimum)',
        'Harvest regularly to encourage continued production'
      ]
    },
    fall: {
      title: 'Fall (Harvest Season)',
      icon: Wheat,
      color: 'text-orange-500',
      tips: [
        'Begin harvesting before first frost for tender crops',
        'Plant cover crops immediately after harvest',
        'Prepare storage areas for root crops and winter squash',
        'Collect and save seeds from best-performing plants',
        'Apply fall fertilizers to perennial crops and fruit trees'
      ]
    },
    winter: {
      title: 'Winter (Planning Season)',
      icon: TreePine,
      color: 'text-blue-400',
      tips: [
        'Review crop records and plan next year\'s rotation',
        'Order seeds early for best variety selection',
        'Maintain and repair equipment during downtime',
        'Prune dormant fruit trees and berry bushes',
        'Plan infrastructure improvements (irrigation, fencing)'
      ]
    }
  };

  const organicFarming = [
    {
      title: 'Soil Building',
      icon: Layers,
      recommendations: [
        'Apply compost at 2-4 tons per acre annually',
        'Use green manures (legumes) to fix nitrogen naturally',
        'Practice minimal tillage to preserve soil biology',
        'Encourage earthworm populations through organic matter',
        'Rotate between heavy feeders, light feeders, and soil builders'
      ]
    },
    {
      title: 'Natural Pest Control',
      icon: Bug,
      recommendations: [
        'Encourage beneficial insects with habitat plantings',
        'Use biological controls (Bt, beneficial nematodes)',
        'Apply neem oil, insecticidal soaps for soft-bodied pests',
        'Install physical barriers (row covers, nets)',
        'Practice crop rotation to break pest cycles'
      ]
    },
    {
      title: 'Organic Fertilization',
      icon: HandHeart,
      recommendations: [
        'Use blood meal (12-0-0) for quick nitrogen boost',
        'Apply bone meal (3-15-0) for phosphorus-deficient soils',
        'Use kelp meal for micronutrients and growth hormones',
        'Compost tea as foliar spray for nutrient boost',
        'Fish emulsion for balanced, fast-acting nutrition'
      ]
    }
  ];

  const economicAdvice = [
    {
      title: 'Cost Reduction Strategies',
      icon: Scale,
      recommendations: [
        'Produce your own seedlings to reduce input costs',
        'Implement precision agriculture to optimize input use',
        'Group purchases with neighboring farmers for bulk discounts',
        'Maintain equipment properly to avoid costly repairs',
        'Use renewable energy (solar) for irrigation and processing'
      ]
    },
    {
      title: 'Market Optimization',
      icon: TrendingUp,
      recommendations: [
        'Diversify sales channels (farmers markets, CSA, wholesale)',
        'Grow high-value specialty crops for premium prices',
        'Add value through processing (dried, preserved products)',
        'Build direct consumer relationships for customer loyalty',
        'Time harvests for peak market prices'
      ]
    },
    {
      title: 'Risk Management',
      icon: Shield,
      recommendations: [
        'Diversify crops to spread risk across multiple products',
        'Consider crop insurance for major commodity crops',
        'Maintain emergency reserves (seed, feed, cash)',
        'Contract farming for guaranteed prices on key crops',
        'Keep detailed records for tax and insurance purposes'
      ]
    }
  ];

  const livestockIntegration = [
    {
      title: 'Crop-Livestock Synergies',
      recommendations: [
        'Use livestock manure as organic fertilizer for crops',
        'Graze cover crops to add value and reduce termination costs',
        'Rotate livestock through fields after harvest for gleaning',
        'Produce feed crops (hay, silage, grain) on-farm',
        'Use crop residues as bedding or supplemental feed'
      ]
    },
    {
      title: 'Pasture Management',
      recommendations: [
        'Implement rotational grazing to improve pasture health',
        'Allow adequate rest periods (21-45 days) between grazing',
        'Maintain pasture height (3-6 inches) for optimal regrowth',
        'Overseed thin areas with improved grass varieties',
        'Control weeds through timely mowing and grazing management'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-secondary pb-20 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader />
      </div>

      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-3 md:mb-4 text-primary-foreground hover:bg-primary-foreground/20 h-11 touch-manipulation hidden md:flex"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3">
            AI-Powered Agricultural Advice
          </h1>
          <p className="text-sm md:text-lg opacity-90 max-w-4xl">
            Comprehensive farming guidance for disease detection & crop management
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile-optimized scrollable tabs */}
          <div className="overflow-x-auto -mx-3 px-3 mb-6 md:mb-8">
            <TabsList className="inline-flex w-max md:grid md:w-full md:grid-cols-9 gap-1 p-1 h-auto">
              <TabsTrigger value="overview" className="h-10 px-3 touch-manipulation whitespace-nowrap">Overview</TabsTrigger>
              <TabsTrigger value="diseases" className="h-10 px-3 touch-manipulation whitespace-nowrap">Diseases</TabsTrigger>
              <TabsTrigger value="environment" className="h-10 px-3 touch-manipulation whitespace-nowrap">Environment</TabsTrigger>
              <TabsTrigger value="soil" className="h-10 px-3 touch-manipulation whitespace-nowrap">Soil</TabsTrigger>
              <TabsTrigger value="water" className="h-10 px-3 touch-manipulation whitespace-nowrap">Water</TabsTrigger>
              <TabsTrigger value="planting" className="h-10 px-3 touch-manipulation whitespace-nowrap">Planting</TabsTrigger>
              <TabsTrigger value="seasonal" className="h-10 px-3 touch-manipulation whitespace-nowrap">Seasonal</TabsTrigger>
              <TabsTrigger value="organic" className="h-10 px-3 touch-manipulation whitespace-nowrap">Organic</TabsTrigger>
              <TabsTrigger value="advanced" className="h-10 px-3 touch-manipulation whitespace-nowrap">Advanced</TabsTrigger>
            </TabsList>
          </div>

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

            {/* Economic Advice Section */}
            <div className="mt-8 mb-6">
              <h2 className="text-3xl font-bold mb-2">Economic & Farm Business Advice</h2>
              <p className="text-muted-foreground">
                Strategies for profitable and sustainable farming operations
              </p>
            </div>

            {economicAdvice.map((advice, index) => {
              const Icon = advice.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon className="h-8 w-8 text-primary" />
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

            {/* Livestock Integration */}
            <div className="mt-8 mb-6">
              <h2 className="text-3xl font-bold mb-2">Livestock Integration</h2>
              <p className="text-muted-foreground">
                Integrating livestock for diversified and sustainable farming
              </p>
            </div>

            {livestockIntegration.map((advice, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Tractor className="h-8 w-8 text-amber-600" />
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
            ))}
          </TabsContent>

          {/* Water Management Tab */}
          <TabsContent value="water" className="space-y-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Water Management</h2>
              <p className="text-muted-foreground">
                Efficient irrigation and water conservation strategies
              </p>
            </div>

            {waterManagement.map((advice, index) => {
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

          {/* Planting Guide Tab */}
          <TabsContent value="planting" className="space-y-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Planting Guide</h2>
              <p className="text-muted-foreground">
                Best practices for successful crop establishment
              </p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shovel className="h-8 w-8 text-amber-600" />
                  <CardTitle className="text-2xl">Field Preparation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plantingGuide.preparation.map((rec, recIndex) => (
                    <li key={recIndex} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Sprout className="h-8 w-8 text-green-600" />
                  <CardTitle className="text-2xl">Planting Techniques</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plantingGuide.techniques.map((rec, recIndex) => (
                    <li key={recIndex} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-2xl">Timing & Scheduling</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plantingGuide.timing.map((rec, recIndex) => (
                    <li key={recIndex} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seasonal Tips Tab */}
          <TabsContent value="seasonal" className="space-y-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Seasonal Farming Tips</h2>
              <p className="text-muted-foreground">
                Season-specific guidance for year-round success
              </p>
            </div>

            {Object.values(seasonalTips).map((season, index) => {
              const Icon = season.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon className={`h-8 w-8 ${season.color}`} />
                      <CardTitle className="text-2xl">{season.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {season.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Organic Farming Tab */}
          <TabsContent value="organic" className="space-y-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Organic Farming Practices</h2>
              <p className="text-muted-foreground">
                Natural and sustainable farming methods
              </p>
            </div>

            {organicFarming.map((advice, index) => {
              const Icon = advice.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon className="h-8 w-8 text-green-600" />
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

            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">Organic Certification Tips</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Maintain detailed records of all inputs, practices, and sales for 3+ years</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Establish buffer zones between organic and conventional fields</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Use only approved inputs listed by your certifying agency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Plan for the 3-year transition period before achieving full certification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Connect with local organic farming associations for guidance and support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer - hidden on mobile */}
      <footer className="hidden md:block border-t mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 MyFarm - Empowering farmers with AI technology</p>
        </div>
      </footer>
      
      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </div>
  );
};

export default Advice;