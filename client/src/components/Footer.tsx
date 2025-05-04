import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="bg-whatsapp-green p-2 inline-block rounded-lg mb-6 flex items-center">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1024px-WhatsApp.svg.png" 
                alt="WhatsApp Logo" 
                className="h-8 w-8"
              />
              <span className="text-white font-bold ml-2 text-lg">WhatsApp</span>
            </div>
            <p className="text-gray-300 mb-4">
              Empowering connection with privacy at the core — across the world and every platform we build.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Meta Products</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Facebook</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Instagram</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">WhatsApp</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Messenger</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Meta Quest</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Careers</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Newsroom</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Investors</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Sustainability</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Policies</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Cookie Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition">Applicant Rights</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Meta Platforms, Inc. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
