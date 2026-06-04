
import { 
  Wifi, Coffee, Utensils, Waves, Dumbbell, 
  Car, ShieldCheck, Clock, Users, Bookmark, BookOpen, Tent
} from 'lucide-react';

const amenities = [
  {
    icon: <Wifi size={40} />,
    title: 'Free WiFi',
    description: 'Stay connected with high-speed internet throughout the hostel'
  },
  {
    icon: <Users size={40} />,
    title: 'Common Areas',
    description: 'Meet fellow travelers in our comfortable shared spaces'
  },
  {
    icon: <Coffee size={40} />,
    title: 'Complimentary Breakfast',
    description: 'Start your day with our simple yet satisfying breakfast options'
  },
  {
    icon: <Utensils size={40} />,
    title: 'Shared Kitchen',
    description: 'Fully equipped kitchen facilities for preparing your own meals'
  },
  {
    icon: <BookOpen size={40} />,
    title: 'Book Exchange',
    description: 'Leave a book, take a book from our community collection'
  },
  {
    icon: <Tent size={40} />,
    title: 'Outdoor Area',
    description: 'Relax in our cozy outdoor space with fellow travelers'
  },
  {
    icon: <ShieldCheck size={40} />,
    title: '24/7 Security',
    description: 'Your safety is our priority with round-the-clock security'
  },
  {
    icon: <Bookmark size={40} />,
    title: 'Tour Booking',
    description: 'Let us help you book local tours and experiences'
  }
];

const Amenities = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Hostel Amenities</h2>
          <div className="w-24 h-1 bg-hotel-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Enjoy our backpacker-friendly facilities designed for comfort and community
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.map((amenity, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-hotel-light-beige rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="amenity-icon mb-4 inline-block">
                {amenity.icon}
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">{amenity.title}</h3>
              <p className="text-gray-600">{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
