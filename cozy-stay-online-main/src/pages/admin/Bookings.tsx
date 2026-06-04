import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Clock, Search, Filter, Download, CalendarDays, Users, Receipt } from 'lucide-react';

interface Order {
  id: string;
  room_name: string;
  room_id: number;
  user_id: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_price: number;
  status: string;
  payment_method: string | null;
  special_requests: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  pending:   { label: 'Pending',   bg: 'bg-yellow-100', text: 'text-yellow-800' },
  confirmed: { label: 'Confirmed', bg: 'bg-green-100',  text: 'text-green-800'  },
  cancelled: { label: 'Cancelled', bg: 'bg-red-100',    text: 'text-red-800'    },
  completed: { label: 'Completed', bg: 'bg-blue-100',   text: 'text-blue-800'   },
};

const BookingsPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
    const channel = supabase
      .channel('admin:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders').select('*').order('created_at', { ascending: false });
    if (!error) setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update booking.', variant: 'destructive' });
    } else {
      toast({ title: `Booking ${status}`, description: `Booking has been ${status}.` });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    }
    setUpdating(null);
  };

  const exportCSV = () => {
    const rows = [
      ['ID', 'Room', 'Check In', 'Check Out', 'Guests', 'Price', 'Status', 'Payment', 'Booked On'],
      ...filtered.map(o => [
        o.id.slice(0, 8), o.room_name, o.check_in_date, o.check_out_date,
        o.guests, o.total_price, o.status, o.payment_method || '', 
        new Date(o.created_at).toLocaleDateString()
      ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv,' + encodeURIComponent(csv);
    a.download = 'bookings.csv';
    a.click();
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
  const nights = (i: string, o: string) => Math.round((new Date(o).getTime() - new Date(i).getTime()) / 86400000);

  const filtered = orders.filter(o => {
    const matchSearch = o.room_name.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    revenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total_price, 0),
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <Button onClick={exportCSV} variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: stats.total, color: 'text-gray-900' },
          { label: 'Pending',        value: stats.pending, color: 'text-yellow-600' },
          { label: 'Confirmed',      value: stats.confirmed, color: 'text-green-600' },
          { label: 'Total Revenue',  value: `KSH ${stats.revenue.toLocaleString()}`, color: 'text-hotel-gold' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by room or booking ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize
                ${filterStatus === s ? 'bg-hotel-gold text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading bookings...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No bookings found.</div>
          ) : (
            <div className="divide-y">
              {filtered.map(order => {
                const s = statusConfig[order.status] ?? statusConfig['pending'];
                const n = nights(order.check_in_date, order.check_out_date);
                const busy = updating === order.id;
                return (
                  <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">{order.room_name}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
                            {s.label}
                          </span>
                          {order.payment_method && (
                            <span className="text-xs text-gray-400 capitalize">{order.payment_method.replace(/_/g, ' ')}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                            {fmtDate(order.check_in_date)} → {fmtDate(order.check_out_date)}
                            <span className="text-gray-400">({n} night{n !== 1 ? 's' : ''})</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-gray-400" />
                            {order.guests} guest{order.guests !== 1 ? 's' : ''}
                          </span>
                          <span className="flex items-center gap-1">
                            <Receipt className="h-3.5 w-3.5 text-gray-400" />
                            <span className="font-mono text-xs">{order.id.slice(0, 8)}…</span>
                          </span>
                        </div>
                        {order.special_requests && (
                          <p className="mt-1.5 text-xs text-gray-500 bg-amber-50 px-2 py-1 rounded inline-block">
                            📝 {order.special_requests}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-bold text-gray-900">KSH {order.total_price.toLocaleString()}</div>
                          <div className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</div>
                        </div>

                        {order.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateStatus(order.id, 'confirmed')}
                              disabled={busy}
                              className="bg-green-600 hover:bg-green-700 text-white gap-1"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {busy ? '…' : 'Confirm'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(order.id, 'cancelled')}
                              disabled={busy}
                              className="border-red-200 text-red-600 hover:bg-red-50 gap-1"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              {busy ? '…' : 'Reject'}
                            </Button>
                          </div>
                        )}

                        {order.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(order.id, 'completed')}
                            disabled={busy}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 gap-1"
                          >
                            <Clock className="h-3.5 w-3.5" />
                            {busy ? '…' : 'Complete'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsPage;