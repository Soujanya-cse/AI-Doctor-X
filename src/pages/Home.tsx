import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import MainAppSection from '@/components/MainAppSection';
import AIChatbotSection from '@/components/AIChatbotSection';
import FeaturesSection from '@/components/FeaturesSection';
import { useModelContext } from '@/context/ModelContext';
import { useEffect } from 'react';

export default function Home() {
  const { loading } = useModelContext();
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto pt-20 pb-10 px-4 flex-grow">
        <HeroSection />
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <MainAppSection />
            <AIChatbotSection />
            <FeaturesSection />
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
