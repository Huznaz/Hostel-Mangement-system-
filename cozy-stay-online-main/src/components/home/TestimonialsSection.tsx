
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Emily Johnson',
    location: 'New York, USA',
    image: '/avatar-1.jpg',
    rating: 5,
    text: 'Our stay at CozyStay was absolutely perfect! The room was immaculate, staff was friendly and attentive, and the amenities were top-notch. We particularly enjoyed the breakfast - such a wide variety of delicious options!'
  },
  {
    id: 2,
    name: 'David Chen',
    location: 'Toronto, Canada',
    image: '/avatar-2.jpg',
    rating: 5,
    text: 'This hotel exceeded all my expectations. The attention to detail is remarkable - from the welcome drink to the turndown service. The bed was the most comfortable I\'ve ever slept in at a hotel. Will definitely return!'
  },
  {
    id: 3,
    name: 'Sophia Martinez',
    location: 'Miami, USA',
    image: '/avatar-3.jpg',
    rating: 4,
    text: 'What a beautiful property! The ocean view from our room was breathtaking. The staff went above and beyond to make our anniversary special. My only suggestion would be to extend the pool hours, but overall it was an amazing experience.'
  },
  {
    id: 4,
    name: 'James Wilson',
    location: 'London, UK',
    image: '/avatar-4.jpg',
    rating: 5,
    text: 'As a frequent business traveler, I\'ve stayed in many hotels, but CozyStay stands out for its excellent service and attention to the needs of business guests. The Executive Business Suite was perfect - quiet, comfortable, and well-equipped.'
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3);
  
  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const goToNext = () => {
    if (currentIndex < testimonials.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <section className="py-16 bg-hotel-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Guest Experiences</h2>
          <div className="w-24 h-1 bg-hotel-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it - here's what our guests have to say
          </p>
        </div>
        
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < testimonial.rating ? "fill-hotel-gold text-hotel-gold" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Navigation buttons */}
          <button 
            onClick={goToPrev} 
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={goToNext} 
            disabled={currentIndex >= testimonials.length - 3}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
