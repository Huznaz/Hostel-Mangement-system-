
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OccupancyChartProps {
  data: Array<{ name: string; value: number }>;
}

const OccupancyChart = ({ data }: OccupancyChartProps) => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value}%`, 'Occupancy Rate']} />
          <Bar dataKey="value" fill="#D4AF37" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OccupancyChart;
