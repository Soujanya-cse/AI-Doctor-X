import { useState, useRef, useEffect } from 'react';
import { useModelContext } from '@/context/ModelContext';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getSeverityColor } from '@/lib/constants';
import Navbar from '@/components/Navbar';

export default function ARView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    organs, 
    diseases, 
    selectedDisease, 
    currentMonth, 
    progression, 
    setIsARMode, 
    getOrganSeverity 
  } = useModelContext();
  
  const [isARSupported, setIsARSupported] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [arInitialized, setARInitialized] = useState<boolean>(false);
  const [arActive, setARActive] = useState<boolean>(false);
  const [walkthroughStep, setWalkthroughStep] = useState<number>(0);
  const [arMeasurements, setARMeasurements] = useState<{
    heartRate: number;
    bloodPressure: string;
    oxygenLevel: number;
  }>({
    heartRate: 72,
    bloodPressure: "120/80",
    oxygenLevel: 98
  });

  // Notify context that we're in AR mode
  useEffect(() => {
    setIsARMode(true);
    
    // Clean up when component unmounts
    return () => {
      setIsARMode(false);
    };
  }, [setIsARMode]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Simulate AR loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto pt-20 pb-10 px-4 flex-grow">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-center mt-4 mb-6 glow-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Augmented Reality <span className="text-primary">Experience</span>
        </motion.h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : !isARSupported ? (
          <motion.div 
            className="card p-8 max-w-xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mx-auto mb-4">
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
              <circle cx="9" cy="9" r="2"></circle>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              <line x1="3" y1="3" x2="21" y2="21"></line>
            </svg>
            <h2 className="text-2xl font-bold mb-3">AR Not Supported</h2>
            <p className="text-white/70 mb-6">
              Your device or browser doesn't support WebXR Augmented Reality. Please try using a compatible device and browser like Chrome on Android or Safari on iOS.
            </p>
            <Link href="/">
              <a className="px-6 py-2.5 rounded-full bg-primary text-dark font-medium hover:bg-primary/90 transition inline-block">
                Return to Main View
              </a>
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="card p-6 max-w-xl mx-auto mb-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-3">AR Viewing Instructions</h2>
              <p className="text-white/70 mb-4">
                Click the "Start AR" button below, then point your camera at a flat surface. The 3D human model will appear, showing affected organs based on the selected disease and progression month.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-4 items-center">
                <div className="text-left">
                  <p className="text-sm text-white/90 mb-1">Currently viewing:</p>
                  <p className="text-primary font-medium">
                    {diseases.find(d => d.id === selectedDisease)?.name || 'No disease selected'} - Month {currentMonth}
                  </p>
                </div>
                <Link href="/">
                  <a className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition">
                    Change Selection
                  </a>
                </Link>
              </div>
            </motion.div>
            
            <div ref={containerRef} className="h-[65vh] w-full relative rounded-xl overflow-hidden shadow-lg shadow-primary/20">
              {/* AR scene will be rendered here */}
              {!arActive ? (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/50 backdrop-blur-sm p-4 rounded-lg text-white text-center max-w-xs pointer-events-auto">
                    <p>AR View will appear here after clicking "Start AR"</p>
                    <p className="text-sm text-white/70 mt-2">You'll need to grant camera permissions</p>
                    <button 
                      className="mt-4 px-5 py-2 bg-primary text-black rounded-full font-medium text-sm"
                      onClick={() => {
                        // Simulate AR activation
                        setARActive(true);
                        
                        // Start demo walkthrough after 2 seconds
                        setTimeout(() => {
                          setWalkthroughStep(1);
                          
                          // Demo AR measurements based on disease
                          if (selectedDisease === 'heartDisease') {
                            setARMeasurements({
                              heartRate: 92,
                              bloodPressure: "135/90",
                              oxygenLevel: 95
                            });
                          } else if (selectedDisease === 'liverDisease') {
                            setARMeasurements({
                              heartRate: 78,
                              bloodPressure: "125/85",
                              oxygenLevel: 97
                            });
                          } else if (selectedDisease === 'brainTumor') {
                            setARMeasurements({
                              heartRate: 85,
                              bloodPressure: "140/95",
                              oxygenLevel: 94
                            });
                          } else if (selectedDisease === 'lungDisease') {
                            setARMeasurements({
                              heartRate: 88,
                              bloodPressure: "130/88",
                              oxygenLevel: 91
                            });
                          }
                        }, 2000);
                      }}
                    >
                      Start Demo AR Mode
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Simulated AR overlay - would be overlaid on camera in real AR */}
                  <div className="absolute inset-0 ar-overlay">
                    <div className="absolute top-4 left-4 bg-dark-blue/80 backdrop-blur-sm p-2 rounded-lg border border-primary/30 text-xs text-white z-10">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2"></div>
                        <span>AR Active • Patient Analysis Mode</span>
                      </div>
                    </div>
                    
                    {/* Demo video with 3D model would be here in real AR */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full max-w-md aspect-[3/4] relative">
                        <div className="absolute inset-0 bg-dark-blue/80 rounded-xl flex items-center justify-center">
                          <div className="model-glow relative">
                            <img 
                              src="/assets/human-model-3d.png" 
                              alt="3D Human Model"
                              className="w-full h-full object-contain"
                            />
                            
                            {selectedDisease === 'heartDisease' && (
                              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-destructive/30 animate-pulse border-2 border-destructive">
                                <div className="absolute inset-0 rounded-full animate-ping bg-destructive/20 border border-destructive/50"></div>
                              </div>
                            )}
                            
                            {selectedDisease === 'brainTumor' && (
                              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-destructive/30 animate-pulse border-2 border-destructive">
                                <div className="absolute inset-0 rounded-full animate-ping bg-destructive/20 border border-destructive/50"></div>
                              </div>
                            )}
                            
                            {selectedDisease === 'liverDisease' && (
                              <div className="absolute top-[40%] right-[30%] w-12 h-12 rounded-full bg-destructive/30 animate-pulse border-2 border-destructive">
                                <div className="absolute inset-0 rounded-full animate-ping bg-destructive/20 border border-destructive/50"></div>
                              </div>
                            )}
                            
                            {selectedDisease === 'lungDisease' && (
                              <div className="absolute top-1/4 w-full flex justify-between px-10">
                                <div className="w-10 h-10 rounded-full bg-destructive/30 animate-pulse border-2 border-destructive">
                                  <div className="absolute inset-0 rounded-full animate-ping bg-destructive/20 border border-destructive/50"></div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-destructive/30 animate-pulse border-2 border-destructive">
                                  <div className="absolute inset-0 rounded-full animate-ping bg-destructive/20 border border-destructive/50"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* AR Measurements Panel */}
                    <div className="absolute bottom-4 right-4 bg-dark-blue/80 backdrop-blur-sm p-3 rounded-lg border border-primary/30 text-white z-10 max-w-[200px]">
                      <h3 className="text-primary text-xs mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M19 13c.34.4.66.82 1 1.25a4.91 4.91 0 0 1 1 2.7v1.05H3v-1.05a4.91 4.91 0 0 1 1-2.7c.34-.43.66-.85 1-1.25 1.92-2.25 1.92-5.5 0-7.75-.34-.4-.66-.82-1-1.25A4.91 4.91 0 0 1 3 3C3 1.9 3.9 1 5 1h14c1.1 0 2 .9 2 2a4.91 4.91 0 0 1-1 2.7c-.34.43-.66.85-1 1.25-1.92 2.25-1.92 5.5 0 7.75Z"></path>
                          <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                        </svg>
                        Real-time Vitals
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-white/70">Heart Rate:</span>
                          <span className={arMeasurements.heartRate > 80 ? "text-warning" : "text-success"}>
                            {arMeasurements.heartRate} BPM
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Blood Pressure:</span>
                          <span className={arMeasurements.bloodPressure !== "120/80" ? "text-warning" : "text-success"}>
                            {arMeasurements.bloodPressure}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Oxygen Level:</span>
                          <span className={arMeasurements.oxygenLevel < 95 ? "text-warning" : "text-success"}>
                            {arMeasurements.oxygenLevel}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* AR Walkthrough Controls */}
                    <div className="absolute left-1/2 bottom-4 -translate-x-1/2 bg-dark-blue/90 backdrop-blur-md p-3 rounded-lg border border-primary/30 text-white z-10 max-w-[90%] w-[400px]">
                      {walkthroughStep === 1 && (
                        <div className="text-center">
                          <h3 className="text-primary text-sm font-medium mb-2">Welcome to AR Walkthrough</h3>
                          <p className="text-xs text-white/80 mb-3">
                            This simulation shows how the AR experience would look on a compatible device. You can interact with the model and see real-time health data.
                          </p>
                          <button 
                            className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-1.5 rounded-md text-xs transition"
                            onClick={() => setWalkthroughStep(2)}
                          >
                            Next: Examine Disease
                          </button>
                        </div>
                      )}
                      
                      {walkthroughStep === 2 && (
                        <div className="text-center">
                          <h3 className="text-primary text-sm font-medium mb-1">
                            {diseases.find(d => d.id === selectedDisease)?.name || 'Medical Condition'} Detected
                          </h3>
                          <p className="text-xs text-white/80 mb-3">
                            This AR view highlights the affected areas in your body. The highlighted regions indicate where the disease is most active.
                          </p>
                          <div className="flex justify-center space-x-2">
                            <button 
                              className="bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1 rounded-md text-xs transition"
                              onClick={() => setWalkthroughStep(1)}
                            >
                              Previous
                            </button>
                            <button 
                              className="bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1 rounded-md text-xs transition"
                              onClick={() => setWalkthroughStep(3)}
                            >
                              Next: Health Analysis
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {walkthroughStep === 3 && (
                        <div className="text-center">
                          <h3 className="text-primary text-sm font-medium mb-1">
                            Health Risk Assessment
                          </h3>
                          <p className="text-xs text-white/80 mb-2">
                            Based on the detected condition and your vitals, Doctor X has calculated the following risk assessment:
                          </p>
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="bg-black/20 p-2 rounded border border-success/30 ring-1 ring-success/20">
                              <div className="text-success text-lg font-medium">Low</div>
                              <div className="text-[10px] text-white/60">Short-term Risk</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded border border-warning/30 ring-1 ring-warning/20">
                              <div className="text-warning text-lg font-medium">Moderate</div>
                              <div className="text-[10px] text-white/60">Long-term Risk</div>
                            </div>
                            <div className="bg-black/20 p-2 rounded border border-destructive/30 ring-1 ring-destructive/20">
                              <div className="text-destructive text-lg font-medium">
                                {currentMonth > 3 ? "High" : "Moderate"}
                              </div>
                              <div className="text-[10px] text-white/60">Progression Risk</div>
                            </div>
                          </div>
                          <div className="flex justify-center space-x-2">
                            <button 
                              className="bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1 rounded-md text-xs transition"
                              onClick={() => setWalkthroughStep(2)}
                            >
                              Previous
                            </button>
                            <button 
                              className="bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1 rounded-md text-xs transition"
                              onClick={() => setWalkthroughStep(4)}
                            >
                              Next: Recommendations
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {walkthroughStep === 4 && (
                        <div className="text-center">
                          <h3 className="text-primary text-sm font-medium mb-1">
                            Treatment Recommendations
                          </h3>
                          <p className="text-xs text-white/80 mb-2">
                            Based on our analysis, Doctor X recommends the following:
                          </p>
                          <ul className="text-xs text-left mb-3 space-y-1">
                            {progression?.recommendations.slice(0, 3).map((rec, i) => (
                              <li key={i} className="flex items-start">
                                <span className="text-primary mr-1">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="flex justify-center space-x-2">
                            <button 
                              className="bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1 rounded-md text-xs transition"
                              onClick={() => setWalkthroughStep(3)}
                            >
                              Previous
                            </button>
                            <Link href="/">
                              <a className="bg-primary text-dark px-3 py-1 rounded-md text-xs transition hover:bg-primary/90">
                                Exit AR Mode
                              </a>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}