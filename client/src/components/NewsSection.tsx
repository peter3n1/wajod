const NewsSection = () => {
  const newsItems = [
    {
      title: "WhatsApp Introduces New Privacy Controls",
      date: "Mar 1, 2025",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      link: "#"
    },
    {
      title: "Voices From The Team: Our Culture in Action",
      date: "Feb 15, 2025",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      link: "#"
    },
    {
      title: "Building Better Messaging for Remote Communities",
      date: "Jan 29, 2025",
      image: "https://images.unsplash.com/photo-1488229297570-58520851e868?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      link: "#"
    }
  ];

  return (
    <section id="news" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-12 text-center">Latest WhatsApp News</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-lg overflow-hidden shadow-sm transition-transform hover:shadow-md hover:-translate-y-1"
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-2">{item.date}</p>
                <a 
                  href={item.link} 
                  className="text-whatsapp-darkgreen font-medium hover:underline"
                >
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
