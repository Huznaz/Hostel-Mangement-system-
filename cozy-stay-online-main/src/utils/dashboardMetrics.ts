
import { rooms } from '@/data/hotelData';

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

export const calculateDashboardMetrics = (orders: Order[], bookedRoomIds: number[]) => {
  const totalRooms = rooms.length;
  const availableRooms = totalRooms - bookedRoomIds.length;
  const activeBookings = orders.filter(b => b.status === 'confirmed').length;
  const pendingBookings = orders.filter(b => b.status === 'pending').length;
  const totalGuests = orders.filter(b => b.status === 'confirmed')
    .reduce((acc, booking) => acc + booking.guests, 0);
  const totalRevenue = orders.reduce((acc, booking) => acc + Number(booking.total_price), 0);

  return {
    totalRooms,
    availableRooms,
    activeBookings,
    pendingBookings,
    totalGuests,
    totalRevenue
  };
};

export const calculateMonthlyData = (orders: Order[]) => {
  const monthlyRevenue: { [key: string]: number } = {};
  const monthlyBookings: { [key: string]: number } = {};
  
  // Initialize all months with 0
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  months.forEach(month => {
    monthlyRevenue[month] = 0;
    monthlyBookings[month] = 0;
  });

  // Calculate actual revenue and bookings
  orders.forEach(order => {
    const date = new Date(order.created_at);
    const month = months[date.getMonth()];
    monthlyRevenue[month] += Number(order.total_price);
    monthlyBookings[month] += 1;
  });

  // Convert to array format for charts
  const revenueData = months.map(month => ({
    name: month,
    value: monthlyRevenue[month]
  }));

  const bookingData = months.map(month => ({
    name: month,
    value: monthlyBookings[month]
  }));

  return { revenueData, bookingData };
};

export const calculateRoomOccupancy = (orders: Order[]) => {
  const occupancyMap = new Map();
  
  // Initialize occupancy for all room types
  const roomTypes = Array.from(new Set(rooms.map(room => room.type)));
  roomTypes.forEach(type => {
    occupancyMap.set(type, {
      total: rooms.filter(r => r.type === type).length,
      booked: 0
    });
  });

  // Count current bookings
  const now = new Date().toISOString().slice(0, 10);
  orders
    .filter(order => 
      order.status === 'confirmed' &&
      order.check_in_date <= now &&
      order.check_out_date >= now
    )
    .forEach(order => {
      const room = rooms.find(r => r.id === order.room_id);
      if (room) {
        const data = occupancyMap.get(room.type);
        data.booked += 1;
        occupancyMap.set(room.type, data);
      }
    });

  // Calculate percentages
  return Array.from(occupancyMap.entries()).map(([name, data]) => ({
    name,
    value: Math.round((data.booked / data.total) * 100) || 0
  }));
};
