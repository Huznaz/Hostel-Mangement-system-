
import { Users, BookCheck, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GuestStatsProps {
  totalGuests: number;
  averageStay: number;
  averageSpend: number;
  totalOrders: number;
}

const GuestStats = ({ totalGuests, averageStay, averageSpend, totalOrders }: GuestStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guest Statistics</CardTitle>
        <CardDescription>Current guest information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                <Users size={20} />
              </div>
              <div>
                <p className="font-medium">Total Guests</p>
                <p className="text-sm text-gray-500">Currently staying</p>
              </div>
            </div>
            <p className="text-xl font-bold">{totalGuests}</p>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                <BookCheck size={20} />
              </div>
              <div>
                <p className="font-medium">Average Stay</p>
                <p className="text-sm text-gray-500">In days</p>
              </div>
            </div>
            <p className="text-xl font-bold">{averageStay}</p>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="font-medium">Average Spend</p>
                <p className="text-sm text-gray-500">Per booking</p>
              </div>
            </div>
            <p className="text-xl font-bold">
              {totalOrders > 0 
                ? `KSH ${Math.round(averageSpend).toLocaleString()}`
                : 'KSH 0'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestStats;
