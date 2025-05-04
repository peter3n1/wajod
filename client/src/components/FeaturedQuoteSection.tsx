const FeaturedQuoteSection = () => {
  return (
    <section className="py-16 bg-whatsapp-light">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/3 mb-8 md:mb-0">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80" 
              alt="Tyrone" 
              className="rounded-lg shadow-md w-full max-w-sm mx-auto"
            />
          </div>
          <div className="md:w-2/3 md:pl-12">
            <blockquote className="text-xl md:text-2xl italic text-gray-800 leading-relaxed mb-4">
              "It's powerful to know that the work I do makes real life better for millions of people — not just online, but in how they connect with the world."
            </blockquote>
            <div className="flex items-center">
              <div className="h-px bg-whatsapp-darkgreen flex-grow mr-4"></div>
              <p className="font-semibold">Tyrone, Security Engineer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedQuoteSection;
