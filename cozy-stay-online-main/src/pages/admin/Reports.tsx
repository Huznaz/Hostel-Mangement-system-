import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRooms } from '@/hooks/useRooms';
import { isRoomAvailable, type OrderAvailability } from '@/utils/allocation';
import { Download, BarChart3, Receipt } from 'lucide-react';

interface OrderRow {
  id: string;
  room_id: number;
  room_name: string;
  status: string;
  total_price: number;
  check_in_date: string;
  check_out_date: string;
}

interface FinancialRow {
  id: string;
  order_id: string | null;
  amount: number;
  payment_method: string | null;
  status: string;
  created_at: string;
}

const Reports = () => {
  const { rooms } = useRooms();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [financial, setFinancial] = useState<FinancialRow[]>([]);
  const [rangeStart, setRangeStart] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 10);
  });
  const [rangeEnd, setRangeEnd] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    (async () => {
      const [oRes, fRes] = await Promise.all([
        supabase.from('orders').select('id, room_id, room_name, status, total_price, check_in_date, check_out_date'),
        supabase.from('financial_records').select('id, order_id, amount, payment_method, status, created_at').order('created_at', { ascending: false }),
      ]);
      if (oRes.data) setOrders(oRes.data as OrderRow[]);
      if (fRes.data) setFinancial(fRes.data as FinancialRow[]);
    })();
  }, []);

  const activeOrders: OrderAvailability[] = orders
    .filter((o) => ['pending', 'confirmed'].includes(o.status))
    .map((o) => ({
      room_id: o.room_id,
      check_in_date: o.check_in_date,
      check_out_date: o.check_out_date,
      status: o.status,
    }));

  const occupancy = useMemo(() => {
    const total = rooms.length || 1;
    const occupied = rooms.filter((r) =>
      !isRoomAvailable(r.id, rangeStart, rangeEnd, activeOrders),
    ).length;
    const rate = Math.round((occupied / total) * 100);
    return { total, occupied, available: total - occupied, rate };
  }, [rooms, activeOrders, rangeStart, rangeEnd]);

  const financeSummary = useMemo(() => {
    const inRange = financial.filter((f) => {
      const d = f.created_at.slice(0, 10);
      return d >= rangeStart && d <= rangeEnd;
    });
    return {
      totalBilled: inRange.reduce((s, f) => s + Number(f.amount), 0),
      paid: inRange.filter((f) => f.status === 'paid').reduce((s, f) => s + Number(f.amount), 0),
      pending: inRange.filter((f) => f.status === 'pending').reduce((s, f) => s + Number(f.amount), 0),
      count: inRange.length,
    };
  }, [financial, rangeStart, rangeEnd]);

  const exportOccupancyCsv = () => {
    const rows = [
      ['Report', 'Occupancy'],
      ['Period', `${rangeStart} to ${rangeEnd}`],
      ['Total rooms', occupancy.total],
      ['Occupied (in period)', occupancy.occupied],
      ['Available', occupancy.available],
      ['Occupancy rate %', occupancy.rate],
      [],
      ['Room', 'Block', 'Type', 'Status'],
      ...rooms.map((r) => [
        r.name,
        r.block ?? '',
        r.type,
        isRoomAvailable(r.id, rangeStart, rangeEnd, activeOrders) ? 'Available' : 'Occupied',
      ]),
    ];
    downloadCsv(rows, 'occupancy-report.csv');
  };

  const exportFinanceCsv = () => {
    const rows = [
      ['ID', 'Order', 'Amount', 'Method', 'Status', 'Date'],
      ...financial.map((f) => [
        f.id.slice(0, 8),
        f.order_id?.slice(0, 8) ?? '',
        f.amount,
        f.payment_method ?? '',
        f.status,
        new Date(f.created_at).toLocaleDateString('en-KE'),
      ]),
    ];
    downloadCsv(rows, 'financial-records.csv');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <BarChart3 className="h-7 w-7 text-hotel-gold" />
        Reports & Analytics
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Report period</CardTitle>
          <CardDescription>Filter occupancy and financial summaries</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div>
            <Label>From</Label>
            <Input type="date" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} />
          </div>
          <div>
            <Label>To</Label>
            <Input type="date" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Occupancy report</CardTitle>
              <CardDescription>{rangeStart} — {rangeEnd}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={exportOccupancyCsv}>
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Stat label="Total rooms" value={occupancy.total} />
            <Stat label="Occupied" value={occupancy.occupied} />
            <Stat label="Available" value={occupancy.available} />
            <Stat label="Occupancy rate" value={`${occupancy.rate}%`} highlight />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Financial records
              </CardTitle>
              <CardDescription>Ledger for the selected period</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={exportFinanceCsv}>
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Stat label="Records" value={financeSummary.count} />
            <Stat label="Total billed" value={`KSH ${financeSummary.totalBilled.toLocaleString()}`} />
            <Stat label="Paid" value={`KSH ${financeSummary.paid.toLocaleString()}`} highlight />
            <Stat label="Pending" value={`KSH ${financeSummary.pending.toLocaleString()}`} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Financial ledger</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Method</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {financial.slice(0, 20).map((f) => (
                <tr key={f.id} className="border-b border-gray-100">
                  <td className="py-2 pr-4">{new Date(f.created_at).toLocaleDateString('en-KE')}</td>
                  <td className="py-2 pr-4">KSH {Number(f.amount).toLocaleString()}</td>
                  <td className="py-2 pr-4 capitalize">{f.payment_method ?? '—'}</td>
                  <td className="py-2 capitalize">{f.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-xl font-bold ${highlight ? 'text-hotel-gold' : 'text-gray-900'}`}>
        {value}
      </div>
    </div>
  );
}

function downloadCsv(rows: (string | number)[][], filename: string) {
  const csv = rows.map((r) => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv,' + encodeURIComponent(csv);
  a.download = filename;
  a.click();
}

export default Reports;
