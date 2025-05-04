import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-whatsapp-light via-white to-gray-50 opacity-90"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-whatsapp-green rounded-full opacity-10"></div>
        <div className="absolute top-40 right-10 w-20 h-20 bg-whatsapp-darkgreen rounded-full opacity-10"></div>
        <div className="absolute bottom-10 left-1/4 w-32 h-32 bg-whatsapp-light rounded-full opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-gray-800">
              <span className="text-whatsapp-darkgreen">Build What Matters</span> – Join WhatsApp
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              We're building private, secure, and simple communication for billions. 
              Explore opportunities where your work shapes the future of connection.
            </p>
            <Button 
              className="bg-whatsapp-green hover:bg-whatsapp-darkgreen text-white font-semibold py-3 px-6 shadow-md hover:shadow-lg transition-all"
              size="lg"
              asChild
            >
              <a href="#jobs">View Open Positions</a>
            </Button>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative z-10 bg-white p-2 rounded-lg shadow-xl transform transition-transform hover:scale-105 duration-300">
              <img 
                src="https://www.komando.com/wp-content/uploads/2023/03/WhatsApp-phone.jpg" 
                alt="Person using WhatsApp" 
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="absolute -bottom-4 right-4 w-32 h-32 z-20 bg-white p-1 rounded-full shadow-lg flex items-center justify-center">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1024px-WhatsApp.svg.png" 
                alt="WhatsApp Logo" 
                className="w-24 h-24"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
