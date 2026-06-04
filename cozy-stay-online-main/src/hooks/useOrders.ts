
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  room_name: string;
  user_id: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_price: number;
  status: string;
  created_at: string;
  room_id: number;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error);
          return;
        }
        
        if (data) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Exception fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
    
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
          fetchOrders();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { orders, loading };
};
