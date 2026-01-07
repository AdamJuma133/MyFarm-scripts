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
  // TOMATO DISEASES
  {
    id: 'tomato-late-blight',
    name: 'Late Blight',
    type: 'fungal',
    crops: ['tomato', 'potato', 'cherry tomato', 'roma tomato'],
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
    id: 'tomato-early-blight',
    name: 'Early Blight',
    type: 'fungal',
    crops: ['tomato', 'potato', 'eggplant', 'pepper'],
    symptoms: [
      'Dark brown spots with concentric rings (target pattern)',
      'Lower leaves affected first',
      'Yellowing around lesions',
      'Premature leaf drop'
    ],
    causes: [
      'Alternaria solani fungus',
      'Warm humid weather',
      'Splashing water spreading spores',
      'Infected plant debris'
    ],
    treatment: [
      'Apply chlorothalonil or copper fungicides',
      'Remove infected lower leaves',
      'Mulch around plants',
      'Improve air circulation'
    ],
    prevention: [
      'Rotate crops 2-3 years',
      'Use disease-free seeds',
      'Stake plants for better airflow',
      'Apply preventive fungicides'
    ],
    severity: 'medium',
    description: 'A common fungal disease showing distinctive target-like spots on leaves, starting from the bottom of the plant.'
  },
  {
    id: 'tomato-septoria-leaf-spot',
    name: 'Septoria Leaf Spot',
    type: 'fungal',
    crops: ['tomato', 'cherry tomato', 'roma tomato'],
    symptoms: [
      'Small circular spots with dark borders',
      'Gray centers with tiny black dots',
      'Lower leaves yellow and drop',
      'Rapid defoliation in wet weather'
    ],
    causes: [
      'Septoria lycopersici fungus',
      'Warm wet conditions',
      'Splashing rain or irrigation',
      'Infected crop residue'
    ],
    treatment: [
      'Apply fungicides containing chlorothalonil',
      'Remove infected leaves immediately',
      'Improve drainage and air circulation',
      'Avoid working with wet plants'
    ],
    prevention: [
      'Use certified disease-free seed',
      'Rotate crops for 2-3 years',
      'Mulch to prevent splash',
      'Stake or cage plants'
    ],
    severity: 'medium',
    description: 'A fungal disease causing numerous small spots that can lead to severe defoliation.'
  },
  {
    id: 'tomato-bacterial-spot',
    name: 'Bacterial Spot',
    type: 'bacterial',
    crops: ['tomato', 'pepper', 'bell pepper', 'chili pepper'],
    symptoms: [
      'Small dark raised spots on leaves',
      'Spots may have yellow halos',
      'Raised scabby spots on fruit',
      'Leaf distortion and drop'
    ],
    causes: [
      'Xanthomonas bacteria',
      'Warm humid weather',
      'Rain splash and overhead irrigation',
      'Infected seeds or transplants'
    ],
    treatment: [
      'Apply copper-based bactericides',
      'Remove severely infected plants',
      'Avoid overhead watering',
      'Disinfect tools regularly'
    ],
    prevention: [
      'Use disease-free certified seeds',
      'Hot water seed treatment',
      'Avoid working with wet plants',
      'Practice crop rotation'
    ],
    severity: 'medium',
    description: 'A bacterial disease causing spots on both leaves and fruit, reducing marketability.'
  },
  // CORN/MAIZE DISEASES
  {
    id: 'corn-northern-leaf-blight',
    name: 'Northern Corn Leaf Blight',
    type: 'fungal',
    crops: ['corn', 'maize', 'sweet corn'],
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
    id: 'corn-gray-leaf-spot',
    name: 'Gray Leaf Spot',
    type: 'fungal',
    crops: ['corn', 'maize', 'sweet corn'],
    symptoms: [
      'Rectangular gray to tan lesions',
      'Lesions run parallel to leaf veins',
      'Lower leaves affected first',
      'Premature death of leaves'
    ],
    causes: [
      'Cercospora zeae-maydis fungus',
      'Prolonged high humidity',
      'Warm temperatures',
      'Continuous corn cultivation'
    ],
    treatment: [
      'Apply strobilurin fungicides at tasseling',
      'Rotate away from corn for 1-2 years',
      'Remove crop debris after harvest',
      'Improve field drainage'
    ],
    prevention: [
      'Select resistant hybrids',
      'Practice crop rotation',
      'Tillage to bury infected residue',
      'Scout fields regularly'
    ],
    severity: 'high',
    description: 'A serious fungal disease that can cause significant yield loss in humid conditions.'
  },
  {
    id: 'corn-rust',
    name: 'Common Rust',
    type: 'fungal',
    crops: ['corn', 'maize', 'sweet corn'],
    symptoms: [
      'Cinnamon-brown pustules on leaves',
      'Pustules on both leaf surfaces',
      'Yellow halos around pustules',
      'Heavy infection causes leaf death'
    ],
    causes: [
      'Puccinia sorghi fungus',
      'Cool humid conditions',
      'Wind-blown spores',
      'Moderate temperatures (60-77°F)'
    ],
    treatment: [
      'Apply fungicides if infection is early and severe',
      'Most damage occurs before tasseling',
      'Usually no treatment needed for late infections',
      'Remove heavily infected plants'
    ],
    prevention: [
      'Plant rust-resistant hybrids',
      'Early planting to avoid peak infection',
      'Monitor weather conditions',
      'Scout fields regularly'
    ],
    severity: 'low',
    description: 'A fungal disease causing rust-colored pustules, usually not severe in field corn.'
  },
  // RICE DISEASES
  {
    id: 'rice-blast',
    name: 'Rice Blast',
    type: 'fungal',
    crops: ['rice', 'paddy rice'],
    symptoms: [
      'Diamond-shaped lesions with gray centers',
      'Brown borders on lesions',
      'Lesions on leaves, stems, and panicles',
      'Neck rot causing empty grains'
    ],
    causes: [
      'Magnaporthe oryzae fungus',
      'High nitrogen fertilization',
      'Humid conditions with dew',
      'Cool nights and warm days'
    ],
    treatment: [
      'Apply tricyclazole or azoxystrobin fungicides',
      'Drain and dry fields when possible',
      'Reduce nitrogen application',
      'Remove infected plant debris'
    ],
    prevention: [
      'Use resistant varieties',
      'Balanced fertilization',
      'Avoid excessive nitrogen',
      'Proper water management'
    ],
    severity: 'high',
    description: 'The most destructive rice disease worldwide, capable of destroying entire crops.'
  },
  {
    id: 'rice-brown-spot',
    name: 'Brown Spot',
    type: 'fungal',
    crops: ['rice', 'paddy rice'],
    symptoms: [
      'Oval brown spots on leaves',
      'Spots have yellow halos',
      'Grain discoloration',
      'Seedling blight'
    ],
    causes: [
      'Bipolaris oryzae fungus',
      'Nutrient-deficient soils',
      'Drought stress',
      'Poor soil conditions'
    ],
    treatment: [
      'Apply mancozeb or carbendazim fungicides',
      'Improve soil fertility',
      'Ensure adequate potassium',
      'Proper water management'
    ],
    prevention: [
      'Use healthy certified seed',
      'Balanced fertilization with potassium',
      'Avoid water stress',
      'Seed treatment before planting'
    ],
    severity: 'medium',
    description: 'A fungal disease associated with poor soil nutrition and stress conditions.'
  },
  {
    id: 'rice-bacterial-leaf-blight',
    name: 'Bacterial Leaf Blight',
    type: 'bacterial',
    crops: ['rice', 'paddy rice'],
    symptoms: [
      'Yellow to white lesions on leaf tips',
      'Lesions extend along leaf margins',
      'Leaves become grayish and die',
      'Wilting of seedlings (kresek)'
    ],
    causes: [
      'Xanthomonas oryzae bacteria',
      'Wounds from wind or insects',
      'Contaminated irrigation water',
      'Infected seeds'
    ],
    treatment: [
      'No effective chemical treatment',
      'Drain fields and allow to dry',
      'Reduce nitrogen fertilization',
      'Remove infected plants'
    ],
    prevention: [
      'Plant resistant varieties',
      'Use certified disease-free seed',
      'Balanced fertilization',
      'Avoid field flooding during storms'
    ],
    severity: 'high',
    description: 'A devastating bacterial disease that can cause severe yield losses in rice.'
  },
  // WHEAT DISEASES
  {
    id: 'wheat-rust',
    name: 'Wheat Rust',
    type: 'fungal',
    crops: ['wheat', 'bread wheat', 'durum wheat'],
    symptoms: [
      'Orange to brown pustules on leaves',
      'Pustules release rusty spores',
      'Severe infection causes leaf death',
      'Shriveled grains'
    ],
    causes: [
      'Puccinia species fungi',
      'Humid conditions',
      'Moderate temperatures',
      'Wind-dispersed spores'
    ],
    treatment: [
      'Apply triazole fungicides promptly',
      'Scout fields regularly for early detection',
      'Time applications before heading',
      'Remove alternate hosts nearby'
    ],
    prevention: [
      'Plant resistant varieties',
      'Early sowing dates',
      'Avoid dense planting',
      'Destroy volunteer wheat'
    ],
    severity: 'high',
    description: 'A group of fungal diseases causing rusty pustules that can devastate wheat crops.'
  },
  {
    id: 'wheat-powdery-mildew',
    name: 'Powdery Mildew',
    type: 'fungal',
    crops: ['wheat', 'barley', 'oat'],
    symptoms: [
      'White powdery patches on leaves',
      'Patches turn gray-brown with age',
      'Reduced photosynthesis',
      'Stunted growth'
    ],
    causes: [
      'Blumeria graminis fungus',
      'Cool humid conditions',
      'Dense canopy',
      'High nitrogen fertilization'
    ],
    treatment: [
      'Apply triazole or strobilurin fungicides',
      'Reduce nitrogen applications',
      'Improve air circulation',
      'Remove infected debris'
    ],
    prevention: [
      'Use resistant varieties',
      'Balanced fertilization',
      'Proper plant spacing',
      'Avoid excessive nitrogen'
    ],
    severity: 'medium',
    description: 'A common fungal disease creating white powdery coating on wheat leaves.'
  },
  // CUCUMBER AND CUCURBIT DISEASES
  {
    id: 'bacterial-wilt',
    name: 'Bacterial Wilt',
    type: 'bacterial',
    crops: ['cucumber', 'melon', 'squash', 'pumpkin', 'zucchini', 'watermelon'],
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
    id: 'cucumber-downy-mildew',
    name: 'Downy Mildew',
    type: 'fungal',
    crops: ['cucumber', 'melon', 'squash', 'pumpkin', 'watermelon'],
    symptoms: [
      'Angular yellow spots on upper leaves',
      'Purple-gray fuzzy growth underneath',
      'Rapid leaf browning and death',
      'Reduced fruit production'
    ],
    causes: [
      'Pseudoperonospora cubensis',
      'Cool wet weather',
      'High humidity',
      'Wind-blown spores'
    ],
    treatment: [
      'Apply preventive fungicides weekly',
      'Use systemic fungicides for active infection',
      'Improve air circulation',
      'Remove infected leaves'
    ],
    prevention: [
      'Plant resistant varieties',
      'Avoid overhead irrigation',
      'Scout for early symptoms',
      'Start preventive sprays early'
    ],
    severity: 'high',
    description: 'A destructive disease that can rapidly kill cucumber foliage.'
  },
  // PEPPER DISEASES
  {
    id: 'pepper-anthracnose',
    name: 'Anthracnose',
    type: 'fungal',
    crops: ['pepper', 'bell pepper', 'chili pepper', 'hot pepper'],
    symptoms: [
      'Sunken circular lesions on fruit',
      'Lesions turn tan then black',
      'Salmon-colored spore masses',
      'Fruit rot and drop'
    ],
    causes: [
      'Colletotrichum species fungi',
      'Warm humid weather',
      'Rain splash spreading spores',
      'Infected seeds or transplants'
    ],
    treatment: [
      'Apply copper or mancozeb fungicides',
      'Remove infected fruit immediately',
      'Avoid overhead irrigation',
      'Harvest fruit before full maturity'
    ],
    prevention: [
      'Use disease-free certified seed',
      'Hot water seed treatment',
      'Rotate crops 2-3 years',
      'Avoid working with wet plants'
    ],
    severity: 'high',
    description: 'A serious fungal disease causing fruit rot in peppers.'
  },
  {
    id: 'pepper-phytophthora-blight',
    name: 'Phytophthora Blight',
    type: 'fungal',
    crops: ['pepper', 'bell pepper', 'eggplant', 'tomato'],
    symptoms: [
      'Dark water-soaked lesions on stems',
      'Sudden plant wilting',
      'Fruit rot from calyx end',
      'Root and crown rot'
    ],
    causes: [
      'Phytophthora capsici',
      'Poorly drained soils',
      'Excessive irrigation',
      'Warm wet conditions'
    ],
    treatment: [
      'Apply mefenoxam or phosphonate fungicides',
      'Improve field drainage',
      'Remove infected plants',
      'Avoid overhead irrigation'
    ],
    prevention: [
      'Plant in well-drained soils',
      'Use raised beds',
      'Avoid overwatering',
      'Rotate with non-host crops 3+ years'
    ],
    severity: 'high',
    description: 'A devastating water mold disease that can destroy entire pepper fields.'
  },
  // VIRAL DISEASES
  {
    id: 'mosaic-virus',
    name: 'Mosaic Virus',
    type: 'viral',
    crops: ['tomato', 'pepper', 'cucumber', 'tobacco', 'bean', 'squash'],
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
    id: 'tomato-yellow-leaf-curl',
    name: 'Tomato Yellow Leaf Curl Virus',
    type: 'viral',
    crops: ['tomato', 'pepper', 'bean'],
    symptoms: [
      'Upward curling of leaf margins',
      'Yellow leaf edges',
      'Stunted bushy growth',
      'Flower drop and no fruit set'
    ],
    causes: [
      'Begomovirus transmitted by whiteflies',
      'Whitefly populations',
      'Infected transplants',
      'Warm dry conditions favor vector'
    ],
    treatment: [
      'Remove infected plants immediately',
      'Control whitefly with insecticides',
      'Use yellow sticky traps',
      'No cure once infected'
    ],
    prevention: [
      'Use resistant varieties',
      'Use reflective mulches',
      'Install fine mesh screens',
      'Control weeds that harbor virus'
    ],
    severity: 'high',
    description: 'A devastating viral disease transmitted by whiteflies causing severe yield loss.'
  },
  // NUTRITIONAL DEFICIENCIES
  {
    id: 'nitrogen-deficiency',
    name: 'Nitrogen Deficiency',
    type: 'nutritional',
    crops: ['corn', 'wheat', 'rice', 'vegetables', 'tomato', 'lettuce', 'cabbage'],
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
    id: 'potassium-deficiency',
    name: 'Potassium Deficiency',
    type: 'nutritional',
    crops: ['potato', 'tomato', 'banana', 'corn', 'soybean'],
    symptoms: [
      'Brown scorching on leaf edges',
      'Older leaves affected first',
      'Weak stems and lodging',
      'Poor fruit quality'
    ],
    causes: [
      'Low potassium in soil',
      'Sandy or leached soils',
      'High crop removal',
      'Excessive nitrogen or calcium'
    ],
    treatment: [
      'Apply potassium fertilizer (potash)',
      'Use potassium sulfate for quick uptake',
      'Add wood ash or compost',
      'Foliar potassium spray'
    ],
    prevention: [
      'Regular soil testing',
      'Balanced fertilization',
      'Add organic matter',
      'Avoid over-liming'
    ],
    severity: 'medium',
    description: 'A deficiency causing leaf edge burning and weak plants.'
  },
  {
    id: 'iron-chlorosis',
    name: 'Iron Chlorosis',
    type: 'nutritional',
    crops: ['soybean', 'sorghum', 'fruit trees', 'grape', 'citrus'],
    symptoms: [
      'Interveinal yellowing on young leaves',
      'Veins remain green',
      'Severe cases show white leaves',
      'Stunted growth'
    ],
    causes: [
      'High soil pH limiting iron availability',
      'Waterlogged soils',
      'High bicarbonate levels',
      'Calcareous soils'
    ],
    treatment: [
      'Apply chelated iron (Fe-EDDHA)',
      'Foliar iron sprays',
      'Acidify soil with sulfur',
      'Improve drainage'
    ],
    prevention: [
      'Select tolerant varieties',
      'Avoid over-liming',
      'Improve soil drainage',
      'Add organic matter'
    ],
    severity: 'medium',
    description: 'A condition where iron is unavailable to plants despite being present in soil.'
  },
  // POWDERY MILDEW (General)
  {
    id: 'powdery-mildew',
    name: 'Powdery Mildew',
    type: 'fungal',
    crops: ['grape', 'cucumber', 'squash', 'rose', 'apple', 'pea', 'melon'],
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
  },
  // CASSAVA DISEASES
  {
    id: 'cassava-mosaic',
    name: 'Cassava Mosaic Disease',
    type: 'viral',
    crops: ['cassava', 'manioc', 'tapioca'],
    symptoms: [
      'Yellow and green mosaic patterns',
      'Leaf distortion and curling',
      'Stunted plant growth',
      'Reduced root yield'
    ],
    causes: [
      'Cassava mosaic geminiviruses',
      'Whitefly transmission',
      'Infected cuttings',
      'Wild host plants'
    ],
    treatment: [
      'Remove infected plants',
      'Control whitefly populations',
      'Use virus-free planting material',
      'No chemical cure available'
    ],
    prevention: [
      'Use virus-free cuttings',
      'Plant resistant varieties',
      'Control whiteflies',
      'Remove infected plants promptly'
    ],
    severity: 'high',
    description: 'The most important disease of cassava in Africa, causing severe yield losses.'
  },
  // BANANA DISEASES
  {
    id: 'banana-black-sigatoka',
    name: 'Black Sigatoka',
    type: 'fungal',
    crops: ['banana', 'plantain'],
    symptoms: [
      'Dark streaks on leaves',
      'Streaks expand to black spots',
      'Leaf death from tip',
      'Premature fruit ripening'
    ],
    causes: [
      'Mycosphaerella fijiensis fungus',
      'High humidity and rainfall',
      'Warm temperatures',
      'Poor air circulation'
    ],
    treatment: [
      'Apply systemic fungicides',
      'Remove infected leaves',
      'Improve drainage and spacing',
      'Deleafing to reduce inoculum'
    ],
    prevention: [
      'Use resistant varieties',
      'Proper plant spacing',
      'Regular fungicide program',
      'Remove dead leaves'
    ],
    severity: 'high',
    description: 'A devastating leaf disease that can reduce banana yields by 50% or more.'
  },
  // COFFEE DISEASES
  {
    id: 'coffee-leaf-rust',
    name: 'Coffee Leaf Rust',
    type: 'fungal',
    crops: ['coffee', 'arabica coffee', 'robusta coffee'],
    symptoms: [
      'Yellow-orange powdery spots on leaf undersides',
      'Corresponding yellow spots on upper surface',
      'Premature leaf drop',
      'Reduced berry production'
    ],
    causes: [
      'Hemileia vastatrix fungus',
      'Warm humid conditions',
      'Rain splash spreading spores',
      'Shade-grown conditions'
    ],
    treatment: [
      'Apply copper or triazole fungicides',
      'Remove infected leaves',
      'Improve air circulation',
      'Reduce shade if excessive'
    ],
    prevention: [
      'Plant resistant varieties',
      'Proper plant spacing',
      'Regular preventive sprays',
      'Balanced fertilization'
    ],
    severity: 'high',
    description: 'A major threat to coffee production worldwide, causing devastating epidemics.'
  },
  // APPLE DISEASES
  {
    id: 'apple-scab',
    name: 'Apple Scab',
    type: 'fungal',
    crops: ['apple', 'crabapple', 'pear'],
    symptoms: [
      'Olive-green to brown spots on leaves',
      'Velvety texture on spots',
      'Scabby lesions on fruit',
      'Premature leaf and fruit drop'
    ],
    causes: [
      'Venturia inaequalis fungus',
      'Cool wet spring weather',
      'Infected fallen leaves',
      'Overhead irrigation'
    ],
    treatment: [
      'Apply fungicides during infection periods',
      'Remove fallen leaves',
      'Prune for better air circulation',
      'Multiple sprays during wet periods'
    ],
    prevention: [
      'Plant scab-resistant varieties',
      'Remove fallen leaves in autumn',
      'Proper pruning',
      'Avoid overhead irrigation'
    ],
    severity: 'medium',
    description: 'The most common and serious apple disease, causing spotted and deformed fruit.'
  },
  // CITRUS DISEASES
  {
    id: 'citrus-canker',
    name: 'Citrus Canker',
    type: 'bacterial',
    crops: ['orange', 'lemon', 'lime', 'grapefruit', 'citrus'],
    symptoms: [
      'Raised corky lesions on leaves',
      'Lesions have yellow halos',
      'Similar lesions on fruit',
      'Premature fruit and leaf drop'
    ],
    causes: [
      'Xanthomonas citri bacteria',
      'Wind-driven rain',
      'Contaminated equipment',
      'Infected nursery stock'
    ],
    treatment: [
      'Apply copper bactericides',
      'Remove infected branches',
      'Windbreaks to reduce spread',
      'Quarantine infected trees'
    ],
    prevention: [
      'Use certified disease-free plants',
      'Disinfect pruning tools',
      'Windbreaks around orchards',
      'Avoid working with wet trees'
    ],
    severity: 'high',
    description: 'A serious bacterial disease causing unsightly fruit and quarantine issues.'
  },
  // POTATO DISEASES
  {
    id: 'potato-blackleg',
    name: 'Blackleg',
    type: 'bacterial',
    crops: ['potato'],
    symptoms: [
      'Black rotting of stem base',
      'Yellow and wilting foliage',
      'Slimy stem rot',
      'Tuber soft rot'
    ],
    causes: [
      'Pectobacterium species bacteria',
      'Infected seed tubers',
      'Wet soil conditions',
      'Poor drainage'
    ],
    treatment: [
      'Remove infected plants',
      'Improve field drainage',
      'Allow tubers to suberize before storage',
      'No effective chemical treatment'
    ],
    prevention: [
      'Use certified disease-free seed',
      'Plant in well-drained soil',
      'Avoid overwatering',
      'Harvest in dry conditions'
    ],
    severity: 'high',
    description: 'A bacterial disease causing plant death and tuber rot in storage.'
  },
  // BEAN DISEASES
  {
    id: 'bean-rust',
    name: 'Bean Rust',
    type: 'fungal',
    crops: ['bean', 'green bean', 'dry bean', 'kidney bean'],
    symptoms: [
      'Rusty brown pustules on leaves',
      'Pustules mostly on undersides',
      'Yellow halos around pustules',
      'Severe defoliation'
    ],
    causes: [
      'Uromyces appendiculatus fungus',
      'Warm humid conditions',
      'Wind-spread spores',
      'Infected crop debris'
    ],
    treatment: [
      'Apply sulfur or triazole fungicides',
      'Remove infected leaves',
      'Improve air circulation',
      'Avoid overhead irrigation'
    ],
    prevention: [
      'Plant resistant varieties',
      'Rotate crops 2-3 years',
      'Destroy crop residue',
      'Avoid dense planting'
    ],
    severity: 'medium',
    description: 'A common fungal disease causing rusty pustules on bean leaves.'
  },
  // GRAPE DISEASES
  {
    id: 'grape-downy-mildew',
    name: 'Downy Mildew',
    type: 'fungal',
    crops: ['grape', 'grapevine'],
    symptoms: [
      'Yellow oily spots on upper leaf surface',
      'White downy growth underneath',
      'Infected berries shrivel (gray rot)',
      'Shoot tip dieback'
    ],
    causes: [
      'Plasmopara viticola',
      'Cool wet spring weather',
      'High humidity',
      'Infected leaf debris'
    ],
    treatment: [
      'Apply copper or mancozeb fungicides',
      'Remove infected leaves',
      'Improve air circulation',
      'Multiple sprays during wet periods'
    ],
    prevention: [
      'Plant resistant varieties',
      'Open canopy management',
      'Proper vine spacing',
      'Avoid overhead irrigation'
    ],
    severity: 'high',
    description: 'A major disease of grapes that can destroy the entire crop in wet years.'
  },
  // MANGO DISEASES
  {
    id: 'mango-anthracnose',
    name: 'Mango Anthracnose',
    type: 'fungal',
    crops: ['mango'],
    symptoms: [
      'Black spots on flowers and young fruit',
      'Sunken black lesions on mature fruit',
      'Blossom blight',
      'Leaf spots and tip dieback'
    ],
    causes: [
      'Colletotrichum gloeosporioides',
      'Wet humid conditions during flowering',
      'Rain splash spreading spores',
      'Infected dead twigs'
    ],
    treatment: [
      'Apply copper or mancozeb fungicides',
      'Hot water treatment of harvested fruit',
      'Prune infected branches',
      'Remove mummified fruit'
    ],
    prevention: [
      'Avoid overhead irrigation during flowering',
      'Proper pruning for air circulation',
      'Preventive fungicide sprays',
      'Post-harvest treatments'
    ],
    severity: 'high',
    description: 'The most important disease of mango, causing major losses in humid regions.'
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