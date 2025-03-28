import { useState } from 'react';
import { Link } from 'wouter';
import { PROGRESSION_MONTHS, getSeverityLevel } from '@/lib/constants';
import { useModelContext } from '@/context/ModelContext';
import ARQRCode from './ARQRCode';
import { motion } from 'framer-motion';

export default function LeftSidebar() {
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const { 
    progression, 
    currentMonth, 
    selectedDisease,
    diseases,
    setCurrentMonth,
    setSelectedDisease,
    setIsARMode
  } = useModelContext();

  // Handle timeline slider change
  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMonth(parseInt(e.target.value));
  };

  // Handle play animation button
  const handlePlayAnimation = () => {
    if (isAnimationPlaying) return;
    
    setIsAnimationPlaying(true);
    let month = 0;
    
    const interval = setInterval(() => {
      if (month >= 6) {
        clearInterval(interval);
        setIsAnimationPlaying(false);
        return;
      }
      
      month++;
      setCurrentMonth(month);
    }, 1000);
  };

  // Render organ status items
  const renderOrganStatus = () => {
    if (!progression) return null;
    
    return progression.affectedOrgans.map((organ, index) => {
      const severityLevel = getSeverityLevel(organ.severity);
      
      let bgClass = 'bg-success/10 border-success/30';
      let textClass = 'text-success';
      let icon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 mr-2">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
        </svg>
      );
      
      if (severityLevel === 'medium') {
        bgClass = 'bg-warning/10 border-warning/30';
        textClass = 'text-warning';
        icon = (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 mr-2">
            <path d="M4.8 4.8a7 7 0 0 1 10.3 5.5h1.9l.5-1c.2-.3.2-.5.2-.7a7 7 0 0 0-8-7 7 7 0 0 0-4.9 2.2Z"></path>
            <path d="M3.7 3.7a7 7 0 0 0-1.1 8.2A4.8 4.8 0 0 0 6 16.7l1.7 1c.2.2.5.3.7.3.7 0 1-.5 1.2-1l1-2a2 2 0 0 1 3.1-.7c.4.5.7 1.2.5 1.9l-1.3 5.2a2 2 0 0 0 1.4 2.4c.7.2 1.5-.1 1.9-.7l1.8-2.7c.5-.8.4-1.8-.3-2.5-1.5-1.4-2-3.5-1.4-5.3"></path>
            <path d="M13.1 14.9 9.2 11c-.3-.3-.5-.7-.5-1.1 0-.8.7-1.5 1.5-1.5a1.5 1.5 0 0 1 1 .4l2.9 3c.3.3.6.8.5 1.2 0 .7-.5 1.3-1.2 1.4-.3.1-.7 0-1-.2l-.3-.3Z"></path>
          </svg>
        );
      } else if (severityLevel === 'high') {
        bgClass = 'bg-destructive/10 border-destructive/30';
        textClass = 'text-destructive';
        icon = (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 mr-2">
            <path d="M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
            <path d="M2 12a9 9 0 0 1 8 8"></path>
            <path d="M2 16a5 5 0 0 1 5 5"></path>
            <path d="M2 20a1 1 0 0 1 1 1"></path>
          </svg>
        );
      }
      
      return (
        <motion.div
          key={organ.organId}
          className={`p-3 rounded ${bgClass} flex items-start ${severityLevel !== 'low' ? 'issue-pulse' : ''}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <span className={textClass}>{icon}</span>
          <div>
            <p className={`${textClass} font-medium`}>{organ.organName}</p>
            <p className="text-xs text-white/60">
              {severityLevel === 'low' && 'All vital signs normal'}
              {severityLevel === 'medium' && 'Mild inflammation detected'}
              {severityLevel === 'high' && 'Significant disease progression'}
            </p>
          </div>
        </motion.div>
      );
    });
  };

  return (
    <div className="card p-5 lg:col-span-1 order-2 lg:order-1">
      <h3 className="text-xl font-semibold text-primary mb-4">System Controls</h3>
      
      {/* Disease detection section */}
      <div className="mb-6">
        <h4 className="text-white/90 font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent mr-2">
            <path d="M8 2v4"></path>
            <path d="M16 2v4"></path>
            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
            <circle cx="17" cy="8" r="2"></circle>
            <circle cx="17" cy="16" r="2"></circle>
            <circle cx="8" cy="16" r="2"></circle>
          </svg> Disease Detection
        </h4>
        <div className="mt-3 space-y-3">
          <div className="space-y-3">
            <button 
              className="w-full py-2 px-4 text-left rounded bg-light-blue/30 border border-primary/20 hover:bg-light-blue/50 transition flex justify-between items-center"
              onClick={() => {
                // Simulate a scanning effect and show results
                const originalText = "Run Full Body Scan";
                const btn = document.getElementById('scan-btn');
                if (btn) {
                  btn.innerHTML = "Scanning...";
                  btn.classList.add("bg-primary/30");
                  
                  // Show scanning animation
                  const scanDialog = document.getElementById('scan-dialog');
                  if (scanDialog) {
                    scanDialog.classList.remove('hidden');
                  }
                  
                  setTimeout(() => {
                    btn.innerHTML = "Scan Complete!";
                    
                    // Hide scanning animation, show results
                    if (scanDialog) {
                      scanDialog.classList.add('hidden');
                    }
                    
                    const resultsDialog = document.getElementById('results-dialog');
                    if (resultsDialog) {
                      resultsDialog.classList.remove('hidden');
                    }
                    
                    // Auto-select a disease based on "scan"
                    const randomDiseaseIndex = Math.floor(Math.random() * diseases.length);
                    setSelectedDisease(diseases[randomDiseaseIndex].id);
                    setCurrentMonth(0);
                    
                    setTimeout(() => {
                      btn.innerHTML = originalText;
                      btn.classList.remove("bg-primary/30");
                    }, 3000);
                  }, 3000);
                }
              }}
            >
              <span id="scan-btn">Run Full Body Scan</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"></path>
                <path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2"></path>
                <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"></path>
                <path d="M12 10a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V15h1"></path>
                <path d="M12 10V8"></path>
                <path d="M14 22c.32 0 .63-.05.92-.13C17.99 21.22 20 17.91 20 14a8 8 0 0 0-8-8c-2.2 0-4.2.88-5.65 2.31"></path>
                <circle cx="12" cy="10" r="6"></circle>
              </svg>
            </button>
            
            {/* Scanning animation dialog */}
            <div id="scan-dialog" className="hidden p-4 rounded bg-black/30 backdrop-blur-sm border border-primary/40 text-center">
              <div className="mb-3">
                <div className="animate-pulse flex space-x-4 justify-center mb-3">
                  <div className="h-4 w-28 bg-primary/30 rounded"></div>
                </div>
                <div className="w-full h-2 bg-dark-blue rounded-full">
                  <div className="h-2 bg-primary rounded-full animate-[scanning_3s_ease-in-out_infinite]"></div>
                </div>
              </div>
              <video 
                className="w-full max-w-md mx-auto rounded"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="https://assets.codepen.io/74321/body-scan-loop.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="text-xs text-white/60 mt-2">AI-powered body scan in progress...</p>
            </div>
            
            {/* Results dialog */}
            <div id="results-dialog" className="hidden p-4 rounded bg-light-blue/20 border border-primary/30">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-semibold text-primary">Scan Results</h5>
                <button 
                  className="text-white/60 hover:text-white"
                  onClick={() => {
                    const resultsDialog = document.getElementById('results-dialog');
                    if (resultsDialog) {
                      resultsDialog.classList.add('hidden');
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
              <p className="text-sm text-white/80 mb-2">Potential condition detected:</p>
              <div className="bg-dark-blue p-2 rounded mb-3">
                <p className="text-white font-medium">
                  {selectedDisease ? diseases.find(d => d.id === selectedDisease)?.name : 'Analyzing...'}
                </p>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="flex-1 py-1 px-3 rounded bg-primary/20 text-primary hover:bg-primary/30 transition text-xs"
                  onClick={() => {
                    // Auto select disease and set current month to 3 to show progression
                    setCurrentMonth(3);
                    
                    const resultsDialog = document.getElementById('results-dialog');
                    if (resultsDialog) {
                      resultsDialog.classList.add('hidden');
                    }
                  }}
                >
                  View Report
                </button>
                <button 
                  className="flex-1 py-1 px-3 rounded bg-primary text-black hover:bg-primary/90 transition text-xs"
                  onClick={() => {
                    // Show AI consultation dialog
                    const aiConsultDialog = document.getElementById('ai-consult-dialog');
                    const resultsDialog = document.getElementById('results-dialog');
                    
                    if (aiConsultDialog && resultsDialog) {
                      resultsDialog.classList.add('hidden');
                      aiConsultDialog.classList.remove('hidden');
                    }
                  }}
                >
                  Consult Doctor AI
                </button>
              </div>
            </div>
            
            {/* AI Consultation dialog */}
            <div id="ai-consult-dialog" className="hidden p-4 rounded bg-light-blue/20 border border-primary/30">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-semibold text-primary">Dr. X AI Consultation</h5>
                <button 
                  className="text-white/60 hover:text-white"
                  onClick={() => {
                    const aiConsultDialog = document.getElementById('ai-consult-dialog');
                    if (aiConsultDialog) {
                      aiConsultDialog.classList.add('hidden');
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto text-sm mb-3">
                <p className="text-white/90 mb-2">
                  Based on my analysis of your scan, I've detected signs of {selectedDisease ? diseases.find(d => d.id === selectedDisease)?.name.toLowerCase() : 'a condition'}.
                </p>
                <p className="text-white/90 mb-2">
                  I recommend viewing the 3D model to understand how this condition affects your body and how it might progress over time.
                </p>
                <p className="text-white/90">
                  Use the timeline slider to see the potential progression over months without treatment.
                </p>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="flex-1 py-1 px-3 rounded bg-primary/20 text-primary hover:bg-primary/30 transition text-xs"
                  onClick={() => {
                    const aiConsultDialog = document.getElementById('ai-consult-dialog');
                    if (aiConsultDialog) {
                      aiConsultDialog.classList.add('hidden');
                    }
                  }}
                >
                  Thanks, Doctor
                </button>
                <button 
                  className="flex-1 py-1 px-3 rounded bg-primary text-black hover:bg-primary/90 transition text-xs"
                  onClick={() => {
                    // Set current month to 0 to show beginning stage
                    setCurrentMonth(0);
                    
                    const aiConsultDialog = document.getElementById('ai-consult-dialog');
                    if (aiConsultDialog) {
                      aiConsultDialog.classList.add('hidden');
                    }
                  }}
                >
                  View Treatment Options
                </button>
              </div>
            </div>
          </div>
          
          {/* Disease Selection Dropdown */}
          <div className="p-3 rounded bg-light-blue/30 border border-primary/20">
            <h5 className="text-white/90 text-sm font-medium mb-2">Select Disease to Simulate</h5>
            <select 
              className="w-full p-2 rounded bg-dark-blue border border-primary/30 text-white/90"
              value={selectedDisease || ''}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedDisease(value === '' ? null : value);
                // Reset to month 0 when changing disease
                setCurrentMonth(0);
              }}
            >
              <option value="">Select a disease</option>
              {diseases.map((disease: { id: string; name: string }) => (
                <option key={disease.id} value={disease.id}>
                  {disease.name}
                </option>
              ))}
            </select>
          </div>
          
          {renderOrganStatus()}
        </div>
      </div>
      
      {/* Disease progression timeline */}
      <div className="mb-6">
        <h4 className="text-white/90 font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent mr-2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg> Disease Progression
        </h4>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-white/50 mb-1">
            <span>Current</span>
            <span>3 Months</span>
            <span>6 Months</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="6" 
            value={currentMonth} 
            onChange={handleTimelineChange}
            step="1" 
            className="w-full timeline-slider"
          />
          <div className="flex justify-between mt-2">
            <button 
              className="text-xs py-1 px-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePlayAnimation}
              disabled={isAnimationPlaying}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg> Play Animation
            </button>
            <span className="text-xs text-white/50 py-1">Current View: Month {currentMonth}</span>
          </div>
        </div>
      </div>
      
      {/* AI recommendations */}
      <div className="mb-6">
        <h4 className="text-white/90 font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent mr-2">
            <path d="M22 8s-1.75-1-4-1-4 1-4 1"></path>
            <path d="M18 7V3"></path>
            <path d="M22 12s-1.75-1-4-1-4 1-4 1"></path>
            <path d="M18 11v-1"></path>
            <path d="M22 16s-1.75-1-4-1-4 1-4 1"></path>
            <path d="M18 15v-1"></path>
            <path d="M10 20.93c-1.73.54-3.37.07-4-1.5-.63-1.57-.48-3.48.71-4.95 2.5-3 4.5-2.67 4.5-5.35 0-1.4-.57-2.12-1.78-2.12-1.05 0-1.91.45-2.21 1.32L6.5 8.5"></path>
            <path d="M11.18 15c-.5.87-1.35 1.5-2.45 1.5-1.57 0-2.92-1.19-2.92-2.75 0-1.35.92-2.5 2.21-2.74"></path>
          </svg> AI Recommendations
        </h4>
        <div className="mt-3 p-4 rounded bg-light-blue/30 border border-primary/20 space-y-3">
          {progression?.recommendations.map((recommendation, index) => (
            <motion.div 
              key={index} 
              className="flex items-start"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1 mr-2">
                {index % 3 === 0 && (
                  <path d="m9 9 2 2 4-4"></path>
                )}
                {index % 3 === 1 && (
                  <path d="M3 3v18h18"></path>
                )}
                {index % 3 === 2 && (
                  <path d="M8 2v4"></path>
                )}
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
              </svg>
              <div>
                <p className="text-white/90 font-medium">{recommendation}</p>
                <p className="text-xs text-white/60">AI recommendation based on health data</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* AR view launcher */}
      <div>
        <h4 className="text-white/90 font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent mr-2">
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            <circle cx="9" cy="9" r="2"></circle>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
          </svg> AR Experience
        </h4>
        <div className="mt-3 p-4 rounded bg-dark-blue border border-primary/20 text-center">
          <div className="mb-3">
            <p className="text-sm text-white/70">Scan QR code to experience in AR</p>
          </div>
          <ARQRCode />
          <Link href="/ar">
            <a 
              className="mt-4 w-full py-2 rounded bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition block relative overflow-hidden group"
              onClick={() => {
                // Set AR mode in the context
                setIsARMode(true);
              }}
            >
              <span className="absolute inset-0 bg-primary/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
              <span className="relative z-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1">
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg> 
                Launch AR Experience
              </span>
              <span className="absolute top-0 right-0 px-1.5 py-0.5 bg-primary/70 text-xs text-black font-bold rounded-bl">Live</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
