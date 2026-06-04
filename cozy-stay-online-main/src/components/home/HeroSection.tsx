
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="hero-section h-screen flex items-center justify-center text-center text-white">
      <div className="animate-fade-in space-y-6 px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight">
          Welcome to <br /><span className="text-hotel-gold">ZamZam</span>
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
          Where travelers become friends and adventures begin
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/rooms">
            <Button size="lg" className="bg-hotel-gold hover:bg-amber-600 text-white">
              Browse Rooms
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Contact Us <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
