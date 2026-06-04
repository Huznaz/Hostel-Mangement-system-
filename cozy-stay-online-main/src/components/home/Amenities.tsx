
import { 
  Wifi, Coffee, Utensils, ShieldCheck, BookOpen, Users,
  GraduationCap, WashingMachine, Lock
} from 'lucide-react';

const amenities = [
  {
    icon: <Wifi size={40} />,
    title: 'Campus WiFi',
    description: 'High-speed internet across all blocks for classes and research',
  },
  {
    icon: <GraduationCap size={40} />,
    title: 'Study Zones',
    description: 'Quiet study rooms and group discussion areas open late',
  },
  {
    icon: <Coffee size={40} />,
    title: 'Meals Plan',
    description: 'Affordable breakfast and dinner options for residents',
  },
  {
    icon: <Utensils size={40} />,
    title: 'Shared Kitchen',
    description: 'Cook your own meals in fully equipped communal kitchens',
  },
  {
    icon: <BookOpen size={40} />,
    title: 'Library Corner',
    description: 'Textbook exchange and reading space near reception',
  },
  {
    icon: <Users size={40} />,
    title: 'Common Lounge',
    description: 'Social spaces to meet coursemates and unwind after lectures',
  },
  {
    icon: <ShieldCheck size={40} />,
    title: '24/7 Security',
    description: 'Gated access, CCTV, and wardens on duty every night',
  },
  {
    icon: <WashingMachine size={40} />,
    title: 'Laundry',
    description: 'On-site laundry facilities for all registered students',
  },
  {
    icon: <Lock size={40} />,
    title: 'Secure Lockers',
    description: 'Personal lockers for valuables in every dorm block',
  },
];

const Amenities = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Student Hostel Facilities</h2>
          <div className="w-24 h-1 bg-hotel-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything you need for a safe, productive semester on campus
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((amenity, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-hotel-light-beige rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="amenity-icon mb-4 inline-block text-hotel-gold">
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
