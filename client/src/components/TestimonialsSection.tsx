const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Elena",
      role: "Privacy Engineer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote: "Every day, I help build technology that gives people control over their own conversations. That's what drives me."
    },
    {
      name: "Jordan",
      role: "Software Engineer",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote: "I've never worked anywhere that empowers remote teams quite like this. The culture of trust is unmatched."
    },
    {
      name: "Priya",
      role: "Product Designer",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      quote: "Designing for a global audience at WhatsApp challenges me to think inclusively, every single day."
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-12 text-center">Hear From Our Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-col items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                <p className="text-whatsapp-darkgreen font-medium">{testimonial.role}</p>
              </div>
              <blockquote className="text-center italic text-gray-600">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
