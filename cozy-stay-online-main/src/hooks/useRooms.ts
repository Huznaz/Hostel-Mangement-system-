import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { rooms as fallbackRooms, type Room, PRICE_MIN, PRICE_MAX } from '@/data/hostelData';
import { mapDbRoomToRoom, type DbRoomRow } from '@/utils/roomMapper';

export { PRICE_MIN, PRICE_MAX };

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>(fallbackRooms);
  const [loading, setLoading] = useState(true);
  const [fromDatabase, setFromDatabase] = useState(false);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('id');

    if (!error && data && data.length > 0) {
      setRooms((data as DbRoomRow[]).map(mapDbRoomToRoom));
      setFromDatabase(true);
    } else {
      setRooms(fallbackRooms);
      setFromDatabase(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRooms();
    const channel = supabase
      .channel('public:rooms-catalog')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, fetchRooms)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRooms]);

  return { rooms, loading, fromDatabase, refetch: fetchRooms };
}
