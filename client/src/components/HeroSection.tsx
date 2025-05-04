import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Build What Matters – Join WhatsApp
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
              We're building private, secure, and simple communication for billions. 
              Explore opportunities where your work shapes the future of connection.
            </p>
            <Button 
              className="bg-whatsapp-green hover:bg-whatsapp-darkgreen text-white font-semibold py-3 px-6"
              size="lg"
              asChild
            >
              <a href="#jobs">View Open Positions</a>
            </Button>
          </div>
          <div className="md:w-1/2 relative">
            <img 
              src="https://wa-production-ac05.up.railway.app/Meta%20Pro%20Support_%20Facebook%20and%20Instagram_files/182887082_173356221337864_1646903397817465068_n.png" 
              alt="Person using WhatsApp" 
              className="w-3/4 object-cover rounded-lg shadow-lg z-10 relative"
            />
            <div className="absolute bottom-0 right-0 w-2/3 z-0">
              <img 
                src="https://images.unsplash.com/photo-1611746872915-64382b5c2a98?q=80&w=2000&auto=format&fit=crop" 
                alt="WhatsApp interface" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
