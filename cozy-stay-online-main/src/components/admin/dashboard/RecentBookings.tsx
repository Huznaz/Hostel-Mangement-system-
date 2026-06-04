
import { BookCheck, BookX, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
}

interface RecentBookingsProps {
  orders: Order[];
  loading: boolean;
}

const RecentBookings = ({ orders, loading }: RecentBookingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>Latest 5 bookings in the system</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading bookings...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">No bookings found</div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-500' : 
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-500' : 
                  'bg-red-100 text-red-500'
                }`}>
                  {booking.status === 'confirmed' ? <BookCheck size={20} /> : 
                   booking.status === 'pending' ? <Clock size={20} /> : 
                   <BookX size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{booking.room_name}</p>
                  <p className="text-sm text-gray-500 truncate">Guests: {booking.guests}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">KSH {Number(booking.total_price).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentBookings;
