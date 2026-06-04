
import { useOrders } from '@/hooks/useOrders';
import { useBookedRooms } from '@/hooks/useBookedRooms';
import { calculateDashboardMetrics, calculateMonthlyData, calculateRoomOccupancy } from '@/utils/dashboardMetrics';
import DashboardStats from './dashboard/DashboardStats';
import DashboardCharts from './dashboard/DashboardCharts';
import RecentBookings from './dashboard/RecentBookings';
import GuestStats from './dashboard/GuestStats';

const Dashboard = () => {
  const { orders, loading: ordersLoading } = useOrders();
  const { bookedRoomIds } = useBookedRooms();
  
  // Calculate dashboard metrics
  const metrics = calculateDashboardMetrics(orders, bookedRoomIds);
  const { revenueData, bookingData } = calculateMonthlyData(orders);
  const roomOccupancyData = calculateRoomOccupancy(orders);
  
  return (
    <div className="space-y-6">
      <DashboardStats
        availableRooms={metrics.availableRooms}
        activeBookings={metrics.activeBookings}
        pendingBookings={metrics.pendingBookings}
        totalRevenue={metrics.totalRevenue}
      />
      
      <DashboardCharts
        revenueData={revenueData}
        bookingData={bookingData}
        roomOccupancyData={roomOccupancyData}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentBookings orders={orders} loading={ordersLoading} />
        <GuestStats 
          totalGuests={metrics.totalGuests}
          averageStay={3.5}
          averageSpend={orders.length > 0 ? metrics.totalRevenue / orders.length : 0}
          totalOrders={orders.length}
        />
      </div>
    </div>
  );
};

export default Dashboard;
