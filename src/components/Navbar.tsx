import { Link, useLocation } from 'wouter';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-card/50 border-b border-primary/20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-primary text-2xl font-bold glow-text mr-2">Doctor X</span>
          </Link>
          <span className="text-sm text-muted-foreground">AI-Powered Healthcare</span>
        </div>
        
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/">
            <span className={`${location === "/" ? "text-primary" : "text-foreground/80"} hover:text-primary transition cursor-pointer`}>Home</span>
          </Link>
          <Link href="/#disease-detection">
            <span className="text-foreground/80 hover:text-primary transition cursor-pointer">Disease Detection</span>
          </Link>
          <Link href="/ar">
            <span className={`${location === "/ar" ? "text-primary" : "text-foreground/80"} hover:text-primary transition cursor-pointer`}>AR View</span>
          </Link>
          <a href="#chatbot" className="text-foreground/80 hover:text-primary transition">AI Chatbot</a>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/#disease-detection">
            <span className="hidden md:block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition glow-border cursor-pointer">
              Get Started
            </span>
          </Link>
          <button 
            className="md:hidden text-foreground/80 hover:text-primary"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isMenuOpen ? "hidden" : "block"}>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isMenuOpen ? "block" : "hidden"}>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card/80 backdrop-blur-lg border-b border-primary/20 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <Link href="/">
              <span className={`${location === "/" ? "text-primary" : "text-foreground/80"} hover:text-primary transition py-2 px-4 rounded-lg block cursor-pointer`}>Home</span>
            </Link>
            <Link href="/#disease-detection">
              <span className="text-foreground/80 hover:text-primary transition py-2 px-4 rounded-lg block cursor-pointer" onClick={() => setIsMenuOpen(false)}>Disease Detection</span>
            </Link>
            <Link href="/ar">
              <span className={`${location === "/ar" ? "text-primary" : "text-foreground/80"} hover:text-primary transition py-2 px-4 rounded-lg block cursor-pointer`}>AR View</span>
            </Link>
            <a href="#chatbot" className="text-foreground/80 hover:text-primary transition py-2 px-4 rounded-lg block" onClick={() => setIsMenuOpen(false)}>AI Chatbot</a>
            <Link href="/#disease-detection">
              <span className="text-primary hover:bg-primary/10 transition py-2 px-4 rounded-lg border border-primary/30 block cursor-pointer" onClick={() => setIsMenuOpen(false)}>
                Get Started
              </span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
