import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useModelContext } from '@/context/ModelContext';
import { 
  createScene, 
  createHumanModel, 
  addOrgans, 
  updateOrganSeverity, 
  getClickedOrgan, 
  handleResize, 
  startAnimationLoop, 
  cleanup 
} from '@/lib/3d/human-model';
import { motion } from 'framer-motion';

type ModelState = ReturnType<typeof createScene> | null;

export default function HumanModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modelState, setModelState] = useState<ModelState>(null);
  const { 
    organs, 
    setSelectedOrgan, 
    getOrganSeverity,
    currentMonth
  } = useModelContext();

  // Initialize the 3D scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    const newModelState = createScene(containerRef.current);
    setModelState(newModelState);
    
    // Create the human model
    createHumanModel(newModelState);
    
    // Set up animation loop
    startAnimationLoop(newModelState);
    
    // Handle window resizing
    const handleWindowResize = () => {
      if (containerRef.current && newModelState) {
        handleResize(newModelState, containerRef.current);
      }
    };
    
    window.addEventListener('resize', handleWindowResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      if (newModelState) {
        cleanup(newModelState);
      }
    };
  }, []);

  // Add organs when data is available
  useEffect(() => {
    if (modelState && organs.length > 0 && !modelState.organs.size) {
      addOrgans(modelState, organs);
    }
  }, [modelState, organs]);

  // Update organ severities when month changes
  useEffect(() => {
    if (!modelState || !organs.length) return;
    
    organs.forEach(organ => {
      const severity = getOrganSeverity(organ.id);
      updateOrganSeverity(modelState, organ.id, severity);
    });
  }, [modelState, organs, getOrganSeverity, currentMonth]);

  // Handle model click
  const handleModelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modelState) return;
    
    const organId = getClickedOrgan(modelState, e.nativeEvent);
    
    if (organId) {
      setSelectedOrgan(organId);
    }
  };

  return (
    <motion.div 
      className="model-container h-[500px] md:h-[600px] w-full flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      onClick={handleModelClick}
    >
      <div ref={containerRef} className="w-full h-full relative">
        {/* Model controls */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-dark-blue/70 backdrop-blur-sm rounded-full py-1 px-3 flex space-x-3">
          <button className="text-white/80 hover:text-primary transition" title="Zoom In">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
              <line x1="11" x2="11" y1="8" y2="14"></line>
              <line x1="8" x2="14" y1="11" y2="11"></line>
            </svg>
          </button>
          <button className="text-white/80 hover:text-primary transition" title="Zoom Out">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
              <line x1="8" x2="14" y1="11" y2="11"></line>
            </svg>
          </button>
          <button className="text-white/80 hover:text-primary transition" title="Rotate">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m2 12 5.6 5.6a9 9 0 0 0 12.8 0L22 16"></path>
              <path d="M22 12 16.4 6.4A9 9 0 0 0 3.6 6.4L2 8"></path>
              <line x1="7" x2="7" y1="22" y2="16"></line>
              <line x1="17" x2="17" y1="8" y2="2"></line>
            </svg>
          </button>
          <button className="text-white/80 hover:text-primary transition" title="Reset View">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 22v-6h6"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
