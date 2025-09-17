export interface Disease {
  id: string;
  name: string;
  type: 'bacterial' | 'viral' | 'fungal' | 'nutritional';
  crops: string[];
  symptoms: string[];
  causes: string[];
  treatment: string[];
  prevention: string[];
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export const diseases: Disease[] = [
  {
    id: 'tomato-late-blight',
    name: 'Late Blight',
    type: 'fungal',
    crops: ['tomato', 'potato'],
    symptoms: [
      'Dark brown to black lesions on leaves',
      'White fuzzy growth on leaf undersides',
      'Brown spots on fruit',
      'Rapid plant death in humid conditions'
    ],
    causes: [
      'Phytophthora infestans fungus',
      'High humidity (>90%)',
      'Cool temperatures (60-70°F)',
      'Poor air circulation'
    ],
    treatment: [
      'Apply copper-based fungicides immediately',
      'Remove and destroy infected plants',
      'Improve air circulation',
      'Apply preventive fungicide sprays'
    ],
    prevention: [
      'Plant disease-resistant varieties',
      'Ensure proper spacing for air circulation',
      'Avoid overhead watering',
      'Apply preventive fungicide in high-risk periods'
    ],
    severity: 'high',
    description: 'A devastating fungal disease that can destroy entire tomato and potato crops within days under favorable conditions.'
  },
  {
    id: 'corn-northern-leaf-blight',
    name: 'Northern Corn Leaf Blight',
    type: 'fungal',
    crops: ['corn', 'maize'],
    symptoms: [
      'Cigar-shaped grayish-green lesions',
      'Lesions develop dark borders',
      'Leaves turn yellow and die',
      'Reduced grain fill and yield'
    ],
    causes: [
      'Exserohilum turcicum fungus',
      'High humidity and moisture',
      'Moderate temperatures (64-81°F)',
      'Infected crop residue'
    ],
    treatment: [
      'Apply foliar fungicides (azoles or strobilurins)',
      'Remove infected plant debris',
      'Improve field drainage',
      'Consider early harvest if severe'
    ],
    prevention: [
      'Plant resistant corn hybrids',
      'Rotate crops (avoid corn-on-corn)',
      'Till under crop residue',
      'Monitor weather conditions for disease outbreaks'
    ],
    severity: 'medium',
    description: 'A common fungal disease of corn that can significantly reduce yields if not managed properly.'
  },
  {
    id: 'bacterial-wilt',
    name: 'Bacterial Wilt',
    type: 'bacterial',
    crops: ['cucumber', 'melon', 'squash', 'pumpkin'],
    symptoms: [
      'Sudden wilting of individual vines',
      'Yellow streaking in stems',
      'Sticky bacterial ooze from cut stems',
      'Plant death within days'
    ],
    causes: [
      'Erwinia tracheiphila bacteria',
      'Cucumber beetles as vectors',
      'Contaminated tools',
      'Infected plant material'
    ],
    treatment: [
      'Remove infected plants immediately',
      'Control cucumber beetles',
      'Disinfect tools between plants',
      'No effective chemical treatment available'
    ],
    prevention: [
      'Use row covers during early growth',
      'Control cucumber beetle populations',
      'Plant trap crops (radishes, nasturtiums)',
      'Choose resistant varieties when available'
    ],
    severity: 'high',
    description: 'A bacterial disease spread by cucumber beetles that can quickly kill cucurbit plants.'
  },
  {
    id: 'mosaic-virus',
    name: 'Mosaic Virus',
    type: 'viral',
    crops: ['tomato', 'pepper', 'cucumber', 'tobacco'],
    symptoms: [
      'Mottled yellow and green leaf patterns',
      'Stunted plant growth',
      'Distorted leaves and fruit',
      'Reduced fruit quality and yield'
    ],
    causes: [
      'Various viruses (TMV, CMV, PVY)',
      'Aphid transmission',
      'Contaminated tools and hands',
      'Infected transplants'
    ],
    treatment: [
      'Remove infected plants immediately',
      'Control aphid populations',
      'Disinfect tools with 10% bleach solution',
      'No chemical cure available'
    ],
    prevention: [
      'Use certified virus-free seeds and transplants',
      'Control aphids with reflective mulches',
      'Wash hands before handling plants',
      'Plant resistant varieties'
    ],
    severity: 'medium',
    description: 'A group of viral diseases causing distinctive mosaic patterns on leaves and reducing plant productivity.'
  },
  {
    id: 'nitrogen-deficiency',
    name: 'Nitrogen Deficiency',
    type: 'nutritional',
    crops: ['corn', 'wheat', 'rice', 'vegetables'],
    symptoms: [
      'Yellowing of older leaves first',
      'Stunted plant growth',
      'Pale green to yellow plant color',
      'Reduced leaf size and number'
    ],
    causes: [
      'Insufficient nitrogen in soil',
      'Excessive rainfall leaching nitrogen',
      'Poor soil organic matter',
      'Competition from weeds'
    ],
    treatment: [
      'Apply nitrogen fertilizer immediately',
      'Use foliar nitrogen spray for quick response',
      'Add organic matter (compost, manure)',
      'Consider side-dressing with nitrogen'
    ],
    prevention: [
      'Regular soil testing',
      'Proper fertilization program',
      'Use cover crops to add nitrogen',
      'Maintain soil organic matter'
    ],
    severity: 'medium',
    description: 'A nutritional disorder caused by insufficient nitrogen, essential for plant growth and chlorophyll production.'
  },
  {
    id: 'powdery-mildew',
    name: 'Powdery Mildew',
    type: 'fungal',
    crops: ['grape', 'cucumber', 'squash', 'rose'],
    symptoms: [
      'White powdery coating on leaves',
      'Leaves become distorted and yellowed',
      'Premature leaf drop',
      'Reduced fruit quality'
    ],
    causes: [
      'Various fungal species',
      'High humidity with dry conditions',
      'Poor air circulation',
      'Overcrowded planting'
    ],
    treatment: [
      'Apply sulfur-based fungicides',
      'Use bicarbonate sprays',
      'Improve air circulation',
      'Remove infected plant parts'
    ],
    prevention: [
      'Plant in sunny, well-ventilated areas',
      'Avoid overhead watering',
      'Space plants properly',
      'Choose resistant varieties'
    ],
    severity: 'low',
    description: 'A common fungal disease that creates a distinctive white powdery coating on plant surfaces.'
  }
];

export function getDiseasesByType(type: Disease['type']): Disease[] {
  return diseases.filter(disease => disease.type === type);
}

export function getDiseasesByCrop(crop: string): Disease[] {
  return diseases.filter(disease => 
    disease.crops.some(c => c.toLowerCase().includes(crop.toLowerCase()))
  );
}

export function getDiseaseById(id: string): Disease | undefined {
  return diseases.find(disease => disease.id === id);
}