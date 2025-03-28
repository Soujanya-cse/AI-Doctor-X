import { useRef } from 'react';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import HumanModel from './3d/HumanModel';

export default function MainAppSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="disease-detection" className="mt-4 mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar with controls */}
        <LeftSidebar />
        
        {/* Center 3D model display */}
        <div className="order-1 lg:order-2 lg:col-span-1 flex justify-center items-center">
          <HumanModel />
        </div>
        
        {/* Right sidebar with detailed information */}
        <RightSidebar />
      </div>
    </section>
  );
}
