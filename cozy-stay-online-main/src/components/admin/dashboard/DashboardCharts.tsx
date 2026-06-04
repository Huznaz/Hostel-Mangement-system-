
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RevenueChart from './RevenueChart';
import BookingsChart from './BookingsChart';
import OccupancyChart from './OccupancyChart';

interface ChartData {
  name: string;
  value: number;
}

interface DashboardChartsProps {
  revenueData: ChartData[];
  bookingData: ChartData[];
  roomOccupancyData: ChartData[];
}

const DashboardCharts = ({ revenueData, bookingData, roomOccupancyData }: DashboardChartsProps) => {
  return (
    <Tabs defaultValue="revenue">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-serif font-bold">Analytics</h2>
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
        </TabsList>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <TabsContent value="revenue" className="mt-0">
            <h3 className="text-lg font-medium mb-4">Monthly Revenue (2025)</h3>
            <RevenueChart data={revenueData} />
          </TabsContent>
          
          <TabsContent value="bookings" className="mt-0">
            <h3 className="text-lg font-medium mb-4">Monthly Bookings (2025)</h3>
            <BookingsChart data={bookingData} />
          </TabsContent>
          
          <TabsContent value="occupancy" className="mt-0">
            <h3 className="text-lg font-medium mb-4">Room Occupancy Rate (%)</h3>
            <OccupancyChart data={roomOccupancyData} />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
};

export default DashboardCharts;
