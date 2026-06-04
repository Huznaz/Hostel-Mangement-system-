
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { HOSTEL_NAME } from '@/constants/brand';

const testimonials = [
  {
    id: 1,
    name: 'Grace Wanjiru',
    location: 'University of Nairobi',
    image: '/avatar-1.jpg',
    rating: 5,
    text: `${HOSTEL_NAME} made my first year so much easier. I applied online, got allocated to Block B, and the wardens are always helpful. The study room is my favourite spot!`,
  },
  {
    id: 2,
    name: 'Brian Otieno',
    location: 'JKUAT',
    image: '/avatar-2.jpg',
    rating: 5,
    text: 'Affordable dorm bed with reliable WiFi for online classes. The allocation process was straightforward and I could track my application status in my profile.',
  },
  {
    id: 3,
    name: 'Amina Hassan',
    location: 'Strathmore University',
    image: '/avatar-3.jpg',
    rating: 5,
    text: 'The female-only wing felt safe and well managed. Meals plan is great value and the common kitchen helps when I want to cook on weekends.',
  },
  {
    id: 4,
    name: 'Kevin Mutua',
    location: 'Postgraduate — UoN',
    image: '/avatar-4.jpg',
    rating: 5,
    text: 'As a postgrad student I needed quiet space. The PG wing allocation was perfect — private room, flexible semester dates, and admin approved my application quickly.',
  },
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
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Student Experiences</h2>
          <div className="w-24 h-1 bg-hotel-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from students who live and study at {HOSTEL_NAME}
          </p>
        </div>
        
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-hotel-gold text-hotel-gold" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">&ldquo;{testimonial.text}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-8 gap-4">
            <button 
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-white shadow-md disabled:opacity-50"
            >
              <ChevronLeft className="h-6 w-6 text-hotel-gold" />
            </button>
            <button 
              onClick={goToNext}
              disabled={currentIndex >= testimonials.length - 3}
              className="p-2 rounded-full bg-white shadow-md disabled:opacity-50"
            >
              <ChevronRight className="h-6 w-6 text-hotel-gold" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
