import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { rooms } from '@/data/hotelData';

const FeaturedRooms = () => {
  const featuredRooms = rooms.filter(room => room.featured);

  return (
    <section className="py-16 bg-hotel-light-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Popular Accommodations</h2>
          <div className="w-24 h-1 bg-hotel-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find the perfect bed or room for your stay, from shared dormitories to private rooms
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={room.images[0]} 
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {room.breakfast && (
                  <Badge className="absolute top-4 right-4 bg-hotel-gold text-white">
                    Breakfast Included
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif font-semibold">{room.name}</h3>
                  <p className="text-hotel-gold font-bold">KSH {room.price}<span className="text-sm text-gray-500">/night</span></p>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-hotel-beige/50">
                    {room.capacity} {room.capacity === 1 ? 'Bed' : 'Beds'}
                  </Badge>
                  <Badge variant="outline" className="bg-hotel-beige/50">
                    {room.size} m²
                  </Badge>
                  <Badge variant="outline" className="bg-hotel-beige/50">
                    {room.type}
                  </Badge>
                </div>
              </CardContent>
              
              <CardFooter className="border-t p-6">
                <Link to={`/rooms/${room.id}`} className="w-full">
                  <Button className="w-full bg-hotel-brown hover:bg-hotel-dark-brown text-white">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/rooms">
            <Button variant="outline" className="border-hotel-gold text-hotel-gold hover:bg-hotel-gold hover:text-white">
              View All Accommodations
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRooms;
