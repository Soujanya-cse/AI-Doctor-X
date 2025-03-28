import { Link } from 'wouter';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="py-8 md:py-16">
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold glow-text">
          The Future of <span className="text-primary">Healthcare</span>
        </h1>
        <p className="text-foreground/60 mt-4 max-w-xl mx-auto">
          Explore the revolutionary AI-powered, AR-enhanced healthcare platform for advanced disease detection and progression tracking.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-3 sm:space-y-0">
          <Link href="/#disease-detection">
            <span className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/20 cursor-pointer inline-block">
              Try Disease Detection
            </span>
          </Link>
          <button className="px-6 py-2.5 rounded-full bg-transparent border border-primary/50 text-primary hover:bg-primary/10 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg> Watch Demo
          </button>
        </div>
      </motion.div>
    </section>
  );
}
