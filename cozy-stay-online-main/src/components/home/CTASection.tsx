
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section 
      className="py-24 bg-cover bg-center bg-no-repeat text-white relative"
      style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/cta-bg.jpg")'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
          Ready for Your Next Adventure?
        </h2>
        <p className="text-xl max-w-2xl mx-auto mb-8">
          Book your bed now and join our community of travelers from around the world.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/rooms">
            <Button size="lg" className="bg-hotel-gold hover:bg-amber-600 text-white">
              Book Your Stay Now
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Contact Us <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
