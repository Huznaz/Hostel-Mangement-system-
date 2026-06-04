
import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoomFilters, { FilterValues } from '@/components/rooms/RoomFilters';
import RoomList from '@/components/rooms/RoomList';
import { useRooms, PRICE_MIN, PRICE_MAX } from '@/hooks/useRooms';
import { useOrderAvailability } from '@/hooks/useOrderAvailability';
import { isRoomAvailable } from '@/utils/allocation';

const Rooms = () => {
  const { rooms, loading: roomsLoading } = useRooms();
  const { orders, loading: ordersLoading } = useOrderAvailability();

  const [filters, setFilters] = useState<FilterValues>({
    priceRange: [PRICE_MIN, PRICE_MAX],
    capacity: 1,
    breakfast: false,
    pets: false
  });

  const loading = roomsLoading || ordersLoading;

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesPrice =
        room.price >= filters.priceRange[0] && room.price <= filters.priceRange[1];
      const matchesCapacity = room.capacity >= filters.capacity;
      const matchesBreakfast = !filters.breakfast || room.breakfast;
      const matchesPets = !filters.pets || room.pets;
      const availableNow = isRoomAvailable(
        room.id,
        new Date().toISOString().slice(0, 10),
        new Date().toISOString().slice(0, 10),
        orders,
      );
      return (
        matchesPrice &&
        matchesCapacity &&
        matchesBreakfast &&
        matchesPets &&
        availableNow
      );
    });
  }, [filters, rooms, orders]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-hotel-beige py-16 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4">Available Rooms</h1>
            <div className="w-24 h-1 bg-hotel-gold mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Browse dormitories, shared rooms, and private allocations. Apply online for your semester stay.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <RoomFilters onFilterChange={handleFilterChange} />
            </div>
            
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <span>Loading available allocations...</span>
                </div>
              ) : filteredRooms.length > 0 ? (
                <RoomList rooms={filteredRooms} />
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <h3 className="text-xl font-medium mb-2">No rooms match your filters</h3>
                  <p className="text-gray-600">Try adjusting your filters or check back later for availability.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Rooms;
