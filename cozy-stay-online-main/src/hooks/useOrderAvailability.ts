import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { OrderAvailability } from '@/utils/allocation';

export function useOrderAvailability() {
  const [orders, setOrders] = useState<OrderAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('room_id, check_in_date, check_out_date, status')
      .in('status', ['pending', 'confirmed']);

    if (!error && data) setOrders(data as OrderAvailability[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
    const channel = supabase
      .channel('public:orders-availability')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        fetchOrders,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  const bookedRoomIdsToday = (() => {
    const now = new Date().toISOString().slice(0, 10);
    return [
      ...new Set(
        orders
          .filter(
            (o) => o.check_in_date <= now && o.check_out_date >= now,
          )
          .map((o) => o.room_id),
      ),
    ];
  })();

  return { orders, loading, bookedRoomIdsToday, refetch: fetchOrders };
}
