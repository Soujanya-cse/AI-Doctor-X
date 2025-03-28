import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PROGRESSION_MONTHS } from '@/lib/constants';
import { apiRequest } from '@/lib/queryClient';

interface Organ {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number; z: number };
  normalColor: string;
  size: number;
}

interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  affectedOrgans: string[];
  initialSeverity: number;
  progressionRate: number;
  recommendations: string[];
}

interface Progression {
  diseaseId: string;
  diseaseName: string;
  initialSeverity: number;
  currentSeverity: number;
  months: number;
  affectedOrgans: {
    organId: string;
    organName: string;
    severity: number;
  }[];
  recommendations: string[];
}

interface ModelContextType {
  organs: Organ[];
  diseases: Disease[];
  selectedOrgan: string | null;
  selectedDisease: string | null;
  currentMonth: number;
  progression: Progression | null;
  isARMode: boolean;
  loading: boolean;
  setSelectedOrgan: (id: string | null) => void;
  setSelectedDisease: (id: string | null) => void;
  setCurrentMonth: (month: number) => void;
  setIsARMode: (isAR: boolean) => void;
  getOrganSeverity: (organId: string) => number;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

// Mock data for development
import type { Organ as OrganType } from '../lib/3d/human-model';

// Define the Disease type since it's not exported from human-model.ts
interface DiseaseType {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  affectedOrgans: string[];
  initialSeverity: number;
  progressionRate: number;
  recommendations: string[];
}

// Sample data
const organs: OrganType[] = [
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

const diseases: DiseaseType[] = [
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
    id: 'liverDisease',
    name: 'Liver Disease',
    description: 'Liver disease can be caused by infections, genetic conditions, or lifestyle choices that damage the liver. It can lead to scarring (cirrhosis) and eventual liver failure if untreated.',
    symptoms: [
      'Jaundice (yellowing of skin/eyes)',
      'Abdominal pain and swelling',
      'Swelling in legs and ankles',
      'Itchy skin',
      'Dark urine color',
      'Chronic fatigue'
    ],
    affectedOrgans: ['liver'],
    initialSeverity: 2,
    progressionRate: 0.9,
    recommendations: [
      'Avoid alcohol consumption',
      'Maintain healthy weight',
      'Regular liver function tests',
      'Vaccination for hepatitis',
      'Medication as prescribed by doctor'
    ]
  },
  {
    id: 'brainTumor',
    name: 'Brain Tumor',
    description: 'A brain tumor is a mass or growth of abnormal cells in the brain. Some brain tumors are noncancerous (benign), and some are cancerous (malignant).',
    symptoms: [
      'Headaches that worsen over time',
      'Unexplained nausea or vomiting',
      'Vision problems',
      'Seizures',
      'Difficulty with balance or speech',
      'Confusion in everyday matters'
    ],
    affectedOrgans: ['brain'],
    initialSeverity: 4,
    progressionRate: 0.8,
    recommendations: [
      'Regular MRI monitoring',
      'Surgical evaluation',
      'Radiation therapy assessment',
      'Management of neurological symptoms',
      'Consultation with neuro-oncologist'
    ]
  },
  {
    id: 'lungDisease',
    name: 'Pulmonary Disease',
    description: 'Chronic pulmonary disease affects the lungs and respiratory system, limiting airflow and causing breathing problems. It includes conditions like COPD, emphysema, and chronic bronchitis.',
    symptoms: [
      'Shortness of breath',
      'Chronic cough',
      'Wheezing',
      'Chest tightness',
      'Frequent respiratory infections',
      'Fatigue'
    ],
    affectedOrgans: ['lungs'],
    initialSeverity: 3,
    progressionRate: 0.6,
    recommendations: [
      'Smoking cessation',
      'Pulmonary rehabilitation',
      'Regular use of prescribed inhalers',
      'Vaccination against pneumonia and flu',
      'Oxygen therapy if needed'
    ]
  }
];

// Mock progression data generator
const generateMockProgression = (diseaseId: string | null, month: number): Progression | null => {
  if (!diseaseId) return null;
  
  const disease = diseases.find((d: DiseaseType) => d.id === diseaseId);
  if (!disease) return null;
  
  // Calculate current severity based on initial severity and progression rate
  const currentSeverity = Math.min(10, disease.initialSeverity + (disease.progressionRate * month));
  
  // Generate affected organs data
  const affectedOrgans = disease.affectedOrgans.map((organId: string) => {
    const organ = organs.find((o: OrganType) => o.id === organId);
    const baseSeverity = disease.initialSeverity;
    // Different progression rates for different organs
    const organProgressionFactor = 0.8 + Math.random() * 0.4; 
    const severity = Math.min(10, baseSeverity + (disease.progressionRate * month * organProgressionFactor));
    
    return {
      organId,
      organName: organ?.name || 'Unknown',
      severity: Number(severity.toFixed(1))
    };
  });
  
  return {
    diseaseId,
    diseaseName: disease.name,
    initialSeverity: disease.initialSeverity,
    currentSeverity: Number(currentSeverity.toFixed(1)),
    months: month,
    affectedOrgans,
    recommendations: disease.recommendations
  };
};

export function ModelProvider({ children }: { children: ReactNode }) {
  console.log('ModelProvider initialized');
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<string | null>('arthritisKnee');
  const [currentMonth, setCurrentMonth] = useState<number>(0);
  const [isARMode, setIsARMode] = useState<boolean>(false);

  // Fetch organs and diseases data
  // Simulate fetching data with loading state for demo
  const { data: organsData, isLoading: organsLoading } = useQuery({
    queryKey: ['/api/organs'],
    staleTime: Infinity,
    queryFn: async () => {
      // For development, use the imported organs data
      return { organs };
    }
  });
  
  const { data: diseasesData, isLoading: diseasesLoading } = useQuery({
    queryKey: ['/api/diseases'],
    staleTime: Infinity,
    queryFn: async () => {
      // For development, use the imported diseases data
      return { diseases };
    }
  });

  // Fetch disease progression based on selected disease and month
  const { data: progressionData, isLoading: progressionLoading } = useQuery({
    queryKey: [
      `/api/disease-progression/${selectedDisease}/${currentMonth}`, 
      selectedDisease, 
      currentMonth
    ],
    enabled: !!selectedDisease,
    staleTime: 0, // Always refetch when dependencies change
    queryFn: async () => {
      // Generate mock progression data for development
      const progression = generateMockProgression(selectedDisease, currentMonth);
      return { progression };
    }
  });

  // Get severity for a specific organ
  const getOrganSeverity = (organId: string): number => {
    if (!progressionData?.progression) return 0;
    
    const affectedOrgan = progressionData.progression.affectedOrgans.find(
      organ => organ.organId === organId
    );
    
    return affectedOrgan ? affectedOrgan.severity : 0;
  };

  // When user selects an organ, try to find a disease that affects it
  useEffect(() => {
    if (selectedOrgan && diseasesData?.diseases) {
      const disease = diseasesData.diseases.find((d: DiseaseType) => 
        d.affectedOrgans.includes(selectedOrgan)
      );
      
      if (disease) {
        setSelectedDisease(disease.id);
      }
    }
  }, [selectedOrgan, diseasesData?.diseases]);

  // Provide context value
  const contextValue: ModelContextType = {
    organs: organsData?.organs || [],
    diseases: diseasesData?.diseases || [],
    selectedOrgan,
    selectedDisease,
    currentMonth,
    progression: progressionData?.progression || null,
    isARMode,
    loading: organsLoading || diseasesLoading || progressionLoading,
    setSelectedOrgan,
    setSelectedDisease,
    setCurrentMonth,
    setIsARMode,
    getOrganSeverity
  };

  return (
    <ModelContext.Provider value={contextValue}>
      {children}
    </ModelContext.Provider>
  );
}

// Custom hook to use the context
export function useModelContext() {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModelContext must be used within a ModelProvider');
  }
  return context;
}
