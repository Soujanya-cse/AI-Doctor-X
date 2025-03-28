import { useModelContext } from '@/context/ModelContext';
import { getSeverityLevel, getSeverityColor } from '@/lib/constants';
import { motion } from 'framer-motion';

export default function RightSidebar() {
  const { 
    selectedOrgan, 
    progression,
    organs, 
    diseases,
    selectedDisease
  } = useModelContext();

  // Get selected organ details
  const organ = organs.find(o => o.id === selectedOrgan);
  
  // Get selected disease details
  const disease = diseases.find(d => d.id === selectedDisease);
  
  // Get affected organ from progression
  const affectedOrgan = progression?.affectedOrgans.find(o => o.organId === selectedOrgan);
  
  // Get severity level
  const severityLevel = affectedOrgan ? getSeverityLevel(affectedOrgan.severity) : 'low';
  
  // Get severity percentage (1-10 scale to 0-100%)
  const severityPercentage = affectedOrgan ? (affectedOrgan.severity / 10) * 100 : 10;
  
  // Treatment options with effectiveness ratings
  const treatmentOptions = [
    {
      name: "Physical Therapy",
      description: "Joint-specific exercises",
      effectiveness: 90
    },
    {
      name: "Anti-inflammatory",
      description: "Targeted medication",
      effectiveness: 75
    },
    {
      name: "Lifestyle Modification",
      description: "Weight management & activity",
      effectiveness: 85
    }
  ];

  return (
    <div className="card p-5 order-3 lg:col-span-1">
      <h3 className="text-xl font-semibold text-primary mb-4">Disease Analysis</h3>
      
      {/* Selected area information */}
      <div className="mb-6">
        <motion.div 
          className={`p-3 rounded bg-light-blue/30 border-l-4 ${severityLevel === 'low' ? 'border-success' : severityLevel === 'medium' ? 'border-warning' : 'border-destructive'} mb-3`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h4 className="text-white font-medium">
            {organ?.name || 'Select an organ'}
          </h4>
          <p className="text-sm text-white/70">
            {disease ? `${disease.name} - ${severityLevel === 'low' ? 'Mild' : severityLevel === 'medium' ? 'Moderate' : 'Severe'} Stage` : 'No disease detected'}
          </p>
        </motion.div>
        
        <div className="space-y-3">
          <div>
            <h5 className="text-white/80 text-sm font-medium">Severity Level</h5>
            <motion.div 
              className="w-full bg-dark/50 rounded-full h-2 mt-1"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="bg-gradient-to-r from-success to-destructive h-2 rounded-full" 
                style={{ width: `${severityPercentage}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${severityPercentage}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              ></motion.div>
            </motion.div>
            <div className="flex justify-between text-xs text-white/50 mt-1">
              <span>Mild</span>
              <span>Moderate</span>
              <span>Severe</span>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h5 className="text-white/80 text-sm font-medium">Progression Rate</h5>
            <div className="flex items-center space-x-2">
              <span className="text-destructive text-lg font-bold">+{disease?.progressionRate ? (disease.progressionRate * 10).toFixed(0) : 5}%</span>
              <span className="text-xs text-white/50">per month without intervention</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Detailed AI analysis */}
      <div className="mb-6">
        <h4 className="text-white/90 font-medium flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent mr-2">
            <path d="M2 3v18h12V3H2Z"></path>
            <path d="m8 15-4-4 1.5-1.5L8 12l5-5 1.5 1.5-6.5 6.5Z"></path>
            <path d="M22 6h-8"></path>
            <path d="M22 10h-8"></path>
            <path d="M22 14h-8"></path>
            <path d="M22 18h-8"></path>
          </svg> Detailed Analysis
        </h4>
        
        <div className="space-y-4 max-h-40 overflow-y-auto pr-2">
          <motion.p 
            className="text-sm text-white/70"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {disease?.description || "Select an organ or disease to view detailed analysis"}
          </motion.p>
          
          {disease && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <p className="text-sm text-white/70 mb-2">Common symptoms include:</p>
              <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                {disease.symptoms.map((symptom, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    {symptom}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
          
          {progression && (
            <motion.p 
              className="text-sm text-white/70"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              The current rate of progression indicates potential for {severityLevel === 'low' ? 'mild' : severityLevel === 'medium' ? 'moderate' : 'severe'} impact within 6 months without appropriate intervention.
            </motion.p>
          )}
        </div>
      </div>
      
      {/* Treatment options */}
      <div className="mb-6">
        <h4 className="text-white/90 font-medium flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent mr-2">
            <path d="m8 21-5-5 5-5"></path>
            <path d="M19 6v5a5 5 0 0 1-5 5H4"></path>
          </svg> Treatment Options
        </h4>
        
        <div className="space-y-3">
          {treatmentOptions.map((treatment, index) => (
            <motion.div 
              key={index}
              className="p-3 rounded bg-light-blue/30 border border-primary/20 flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <div>
                <p className="text-white/90 font-medium">{treatment.name}</p>
                <p className="text-xs text-white/60">{treatment.description}</p>
              </div>
              <div className="text-primary text-sm font-medium">
                {treatment.effectiveness}% 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline ml-1">
                  <path d="M7 10v12"></path>
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Actions buttons */}
      <div>
        <div className="flex space-x-3">
          <button className="flex-1 py-2 rounded bg-primary text-dark font-medium hover:bg-primary/90 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg> Consult Doctor
          </button>
          <button className="flex-1 py-2 rounded bg-transparent border border-primary/50 text-primary hover:bg-primary/10 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" x2="8" y1="13" y2="13"></line>
              <line x1="16" x2="8" y1="17" y2="17"></line>
              <line x1="10" x2="8" y1="9" y2="9"></line>
            </svg> View Report
          </button>
        </div>
      </div>
    </div>
  );
}
