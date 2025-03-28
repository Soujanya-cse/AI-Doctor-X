// Disease and organ data for the application

// Organs data
export const organs = [
  {
    id: 'heart',
    name: 'Heart',
    description: 'The heart is a muscular organ that pumps blood through the blood vessels of the circulatory system.',
    position: { x: 0, y: -0.05, z: 0.1 },
    normalColor: '#cc6666',
    size: 0.08,
  },
  {
    id: 'lungs',
    name: 'Lungs',
    description: 'The lungs are the primary organs of the respiratory system, providing oxygen to the bloodstream.',
    position: { x: 0, y: -0.05, z: 0.05 },
    normalColor: '#aaaaee',
    size: 0.1,
  },
  {
    id: 'liver',
    name: 'Liver',
    description: 'The liver is a vital organ that has a wide range of functions related to metabolism, detoxification, and digestion.',
    position: { x: 0.07, y: -0.15, z: 0.08 },
    normalColor: '#bb6644',
    size: 0.09,
  },
  {
    id: 'stomach',
    name: 'Stomach',
    description: 'The stomach is a muscular organ that digests food and passes it into the small intestine.',
    position: { x: 0, y: -0.2, z: 0.05 },
    normalColor: '#ddaa88',
    size: 0.08,
  },
  {
    id: 'kidneys',
    name: 'Kidneys',
    description: 'The kidneys filter blood, removing waste and excess water to form urine.',
    position: { x: 0.1, y: -0.25, z: 0 },
    normalColor: '#dd6677',
    size: 0.06,
  },
  {
    id: 'brain',
    name: 'Brain',
    description: 'The brain is the center of the nervous system and controls most body functions.',
    position: { x: 0, y: 0.3, z: 0 },
    normalColor: '#eebbcc',
    size: 0.1,
  },
  {
    id: 'leftShoulder',
    name: 'Left Shoulder',
    description: 'The shoulder joint connects the arm to the torso.',
    position: { x: -0.2, y: 0.1, z: 0 },
    normalColor: '#aaaaaa',
    size: 0.06,
  },
  {
    id: 'rightShoulder',
    name: 'Right Shoulder',
    description: 'The shoulder joint connects the arm to the torso.',
    position: { x: 0.2, y: 0.1, z: 0 },
    normalColor: '#aaaaaa',
    size: 0.06,
  },
  {
    id: 'leftKnee',
    name: 'Left Knee',
    description: 'The knee is the joint between the upper and lower leg.',
    position: { x: -0.08, y: -0.7, z: 0.05 },
    normalColor: '#aaaaaa',
    size: 0.06,
  },
  {
    id: 'rightKnee',
    name: 'Right Knee',
    description: 'The knee is the joint between the upper and lower leg.',
    position: { x: 0.08, y: -0.7, z: 0.05 },
    normalColor: '#aaaaaa',
    size: 0.06,
  }
];

// Diseases data
export const diseases = [
  {
    id: 'heartDisease',
    name: 'Heart Disease',
    description: 'Heart disease includes various problems with the heart and blood vessels, including coronary artery disease, arrhythmias, and heart defects.',
    symptoms: [
      'Chest pain or discomfort',
      'Shortness of breath',
      'Pain or numbness in arms or legs',
      'Irregular heartbeat',
      'Fatigue'
    ],
    affectedOrgans: ['heart'],
    initialSeverity: 2,
    progressionRate: 0.7,
    recommendations: [
      'Regular cardiovascular exercise',
      'Heart-healthy diet low in saturated fats',
      'Regular blood pressure monitoring',
      'Medication as prescribed by doctor'
    ]
  },
  {
    id: 'lungInflammation',
    name: 'Lung Inflammation',
    description: 'Lung inflammation can be caused by infection, allergies, or irritants and can affect breathing and oxygen exchange.',
    symptoms: [
      'Shortness of breath',
      'Coughing',
      'Chest discomfort',
      'Wheezing',
      'Fatigue'
    ],
    affectedOrgans: ['lungs'],
    initialSeverity: 3,
    progressionRate: 0.5,
    recommendations: [
      'Avoid irritants like smoke',
      'Use prescribed inhalers or medications',
      'Practice breathing exercises',
      'Stay hydrated'
    ]
  },
  {
    id: 'liverDisease',
    name: 'Liver Disease',
    description: 'Liver disease can be caused by infections, alcohol use, obesity, and other factors affecting liver function.',
    symptoms: [
      'Jaundice (yellowing of skin/eyes)',
      'Abdominal pain',
      'Swelling in abdomen or legs',
      'Fatigue',
      'Nausea'
    ],
    affectedOrgans: ['liver'],
    initialSeverity: 2,
    progressionRate: 0.6,
    recommendations: [
      'Limit alcohol consumption',
      'Maintain healthy weight',
      'Follow a balanced diet',
      'Avoid potentially harmful medications'
    ]
  },
  {
    id: 'kidneyDisease',
    name: 'Kidney Disease',
    description: 'Kidney disease affects kidney function including filtering waste from blood and regulating fluid balance.',
    symptoms: [
      'Changes in urination',
      'Swelling in feet or ankles',
      'Fatigue',
      'Persistent itching',
      'High blood pressure'
    ],
    affectedOrgans: ['kidneys'],
    initialSeverity: 2,
    progressionRate: 0.4,
    recommendations: [
      'Control blood pressure',
      'Manage blood sugar',
      'Low-sodium diet',
      'Regular kidney function tests'
    ]
  },
  {
    id: 'arthritisKnee',
    name: 'Knee Osteoarthritis',
    description: 'Osteoarthritis in the knee involves the breakdown of cartilage in the knee joint, causing pain and stiffness.',
    symptoms: [
      'Joint pain during or after movement',
      'Stiffness, especially in the morning',
      'Swelling around the joint',
      'Decreased range of motion',
      'Grinding sensation during movement'
    ],
    affectedOrgans: ['leftKnee', 'rightKnee'],
    initialSeverity: 3,
    progressionRate: 0.4,
    recommendations: [
      'Low-impact exercise like swimming',
      'Weight management',
      'Physical therapy',
      'Joint-appropriate footwear',
      'Anti-inflammatory medications'
    ]
  },
  {
    id: 'shoulderInflammation',
    name: 'Shoulder Inflammation',
    description: 'Inflammation in the shoulder joint, often caused by tendinitis, bursitis, or injury.',
    symptoms: [
      'Pain during movement',
      'Stiffness',
      'Reduced range of motion',
      'Swelling',
      'Tenderness'
    ],
    affectedOrgans: ['leftShoulder', 'rightShoulder'],
    initialSeverity: 3,
    progressionRate: 0.3,
    recommendations: [
      'Rest affected shoulder',
      'Apply ice for inflammation',
      'Physical therapy exercises',
      'Anti-inflammatory medications',
      'Proper posture'
    ]
  },
  {
    id: 'brainStroke',
    name: 'Stroke Risk',
    description: 'A stroke occurs when blood supply to part of the brain is interrupted or reduced, preventing brain tissue from getting oxygen and nutrients.',
    symptoms: [
      'Numbness or weakness in face/arm/leg',
      'Confusion or trouble speaking',
      'Vision problems',
      'Difficulty walking',
      'Severe headache'
    ],
    affectedOrgans: ['brain'],
    initialSeverity: 1,
    progressionRate: 0.8,
    recommendations: [
      'Control blood pressure',
      'Manage cholesterol levels',
      'Regular exercise',
      'Healthy diet',
      'Limit alcohol consumption',
      'Quit smoking'
    ]
  }
];
