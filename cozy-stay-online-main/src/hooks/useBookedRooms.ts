
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useBookedRooms = () => {
  const [bookedRoomIds, setBookedRoomIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          fetchBookedRooms();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { bookedRoomIds, loading };
};
