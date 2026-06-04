
import { Hotel, BookCheck, Clock, CreditCard } from 'lucide-react';
import StatsCard from './StatsCard';

interface DashboardStatsProps {
  availableRooms: number;
  activeBookings: number;
  pendingBookings: number;
  totalRevenue: number;
}

const DashboardStats = ({ 
  availableRooms, 
  activeBookings, 
  pendingBookings, 
  totalRevenue 
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Available Rooms"
        value={availableRooms}
        icon={Hotel}
        iconColorClass="bg-blue-100 text-blue-500"
      />
      <StatsCard
        title="Active Bookings"
        value={activeBookings}
        icon={BookCheck}
        iconColorClass="bg-green-100 text-green-500"
      />
      <StatsCard
        title="Pending Bookings"
        value={pendingBookings}
        icon={Clock}
        iconColorClass="bg-yellow-100 text-yellow-500"
      />
      <StatsCard
        title="Total Revenue"
        value={`KSH ${totalRevenue.toLocaleString()}`}
        icon={CreditCard}
        iconColorClass="bg-purple-100 text-purple-500"
      />
    </div>
  );
};

export default DashboardStats;
