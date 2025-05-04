import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white shadow-md" 
          : "bg-gradient-to-r from-whatsapp-light via-white to-whatsapp-light"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Facebook_Meta_logo.png/800px-Facebook_Meta_logo.png" 
              alt="Meta Logo" 
              className="h-8 mr-3" 
            />
            <span className="font-semibold text-xl text-gray-800">
              <span className="text-whatsapp-darkgreen">WhatsApp</span> Careers
            </span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#about" className="font-medium text-neutral-600 hover:text-whatsapp-darkgreen transition">
              About
            </a>
            <a href="#testimonials" className="font-medium text-neutral-600 hover:text-whatsapp-darkgreen transition">
              Testimonials
            </a>
            <a href="#why-join" className="font-medium text-neutral-600 hover:text-whatsapp-darkgreen transition">
              Why Join
            </a>
            <a href="#news" className="font-medium text-neutral-600 hover:text-whatsapp-darkgreen transition">
              News
            </a>
            <a href="#jobs" className="font-medium text-neutral-600 hover:text-whatsapp-darkgreen transition">
              Jobs
            </a>
          </nav>
          
          {/* Mobile Navigation Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-64' : 'max-h-0'
          }`}
        >
          <div className="px-2 pt-2 pb-4 space-y-1">
            <a 
              href="#about" 
              className="block px-3 py-2 rounded-md font-medium hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <a 
              href="#testimonials" 
              className="block px-3 py-2 rounded-md font-medium hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <a 
              href="#why-join" 
              className="block px-3 py-2 rounded-md font-medium hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Why Join
            </a>
            <a 
              href="#news" 
              className="block px-3 py-2 rounded-md font-medium hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              News
            </a>
            <a 
              href="#jobs" 
              className="block px-3 py-2 rounded-md font-medium hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Jobs
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
