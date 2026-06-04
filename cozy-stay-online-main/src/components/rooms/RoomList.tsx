import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Room } from '@/data/hotelData';

interface RoomListProps {
  rooms: Room[];
}

const RoomList = ({ rooms }: RoomListProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {rooms.length === 0 ? (
        <div className="col-span-2 text-center py-10">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No rooms match your criteria</h3>
          <p className="text-gray-500">Try adjusting your filters for more results.</p>
        </div>
      ) : (
        rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden flex flex-col">
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
            
            <CardContent className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-serif font-semibold">{room.name}</h3>
                <p className="text-hotel-gold font-bold">KSH {room.price}<span className="text-sm text-gray-500">/night</span></p>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">{room.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-hotel-beige/50">
                  {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}
                </Badge>
                <Badge variant="outline" className="bg-hotel-beige/50">
                  {room.size} m²
                </Badge>
                <Badge variant="outline" className="bg-hotel-beige/50">
                  {room.type}
                </Badge>
                {room.pets && (
                  <Badge variant="outline" className="bg-hotel-beige/50">
                    Pets Allowed
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {room.amenities.slice(0, 3).map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="justify-center">
                    {amenity}
                  </Badge>
                ))}
                {room.amenities.length > 3 && (
                  <Badge variant="secondary" className="justify-center">
                    +{room.amenities.length - 3} more
                  </Badge>
                )}
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
        ))
      )}
    </div>
  );
};

export default RoomList;
