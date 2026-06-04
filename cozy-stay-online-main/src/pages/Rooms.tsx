
import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoomFilters, { FilterValues } from '@/components/rooms/RoomFilters';
import RoomList from '@/components/rooms/RoomList';
import { rooms as baseRooms } from '@/data/hotelData';
import { supabase } from '@/integrations/supabase/client';

const Rooms = () => {
  const [filters, setFilters] = useState<FilterValues>({
    priceRange: [2200, 8500],
    capacity: 1,
    breakfast: false,
    pets: false
  });

  const [bookedRoomIds, setBookedRoomIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders/booked rooms from Supabase
    async function fetchBookedRooms() {
      setLoading(true);
      try {
        const now = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const { data, error } = await supabase
          .from('orders')
          .select('room_id, check_in_date, check_out_date, status')
          .in('status', ['pending', 'confirmed']);
        
        if (error) {
          console.error("Error fetching booked rooms:", error);
          setLoading(false);
          return;
        }
        
        if (data) {
          // Find rooms that are currently booked for today
          const booked = data.filter(
            (order: any) =>
              order.check_in_date <= now &&
              order.check_out_date >= now
          ).map((order: any) => order.room_id);
          
          console.log("Currently booked rooms:", booked);
          setBookedRoomIds(booked);
        }
      } catch (err) {
        console.error("Exception fetching booked rooms:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchBookedRooms();
    
    // Set up a subscription for real-time updates
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders'
        }, 
        () => {
          // Refetch booked rooms when orders table changes
          fetchBookedRooms();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredRooms = useMemo(() => {
    return baseRooms
      .filter(room => {
        const matchesPrice =
          room.price >= filters.priceRange[0] && room.price <= filters.priceRange[1];
        const matchesCapacity = room.capacity >= filters.capacity;
        const matchesBreakfast = !filters.breakfast || room.breakfast;
        const matchesPets = !filters.pets || room.pets;
        const isBooked = bookedRoomIds.includes(room.id);
        return (
          matchesPrice &&
          matchesCapacity &&
          matchesBreakfast &&
          matchesPets &&
          !isBooked
        );
      });
  }, [filters, bookedRoomIds]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-hotel-beige py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">Our Luxurious Rooms</h1>
            <div className="w-24 h-1 bg-hotel-gold mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover our selection of comfortable and elegant rooms designed for your perfect stay
            </p>
          </div>
        </div>
      </div>
      <main className="flex-grow py-12 bg-hotel-light-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <RoomFilters onFilterChange={handleFilterChange} />
            </div>
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-serif font-semibold mb-6">
                {filteredRooms.length} {filteredRooms.length === 1 ? 'Room' : 'Rooms'} Available
              </h2>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <span>Loading available rooms...</span>
                </div>
              ) : (
                <RoomList rooms={filteredRooms} />
              )}
              {filteredRooms.length === 0 && !loading && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No rooms available</h3>
                  <p className="text-gray-500">Try adjusting your filters or check back later.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Rooms;
