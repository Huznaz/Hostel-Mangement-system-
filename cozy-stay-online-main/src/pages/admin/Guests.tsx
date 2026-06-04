import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';
import { Search, Users, CalendarDays, BedDouble, Mail } from 'lucide-react';

interface Order {
  id: string;
  room_name: string;
  guests: number;
  check_in_date: string;
  check_out_date: string;
  user_id: string;
  status: string;
  total_price: number;
  created_at: string;
}

interface GuestSummary {
  user_id: string;
  email: string;
  totalBookings: number;
  totalSpent: number;
  activeBooking: Order | null;
  lastBooking: Order;
}

const statusConfig: Record<string, { bg: string; text: string }> = {
  pending:   { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  confirmed: { bg: 'bg-green-100',  text: 'text-green-800'  },
  cancelled: { bg: 'bg-red-100',    text: 'text-red-800'    },
  completed: { bg: 'bg-blue-100',   text: 'text-blue-800'   },
};

const AdminGuests = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel('admin:guests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchData)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: ordersData } = await supabase
      .from('orders').select('*').order('created_at', { ascending: false });

    const { data: profilesData } = await supabase
      .from('profiles').select('id, username');

    const emailMap: Record<string, string> = {};
    if (profilesData) {
      profilesData.forEach((p: any) => {
        emailMap[p.id] = p.username || 'Guest';
      });
    }

    setOrders(ordersData || []);
    setUsers(emailMap);
    setLoading(false);
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

  // Group orders by user
  const guestMap: Record<string, GuestSummary> = {};
  orders.forEach(o => {
    if (!guestMap[o.user_id]) {
      guestMap[o.user_id] = {
        user_id: o.user_id,
        email: users[o.user_id] || o.user_id.slice(0, 8) + '…',
        totalBookings: 0,
        totalSpent: 0,
        activeBooking: null,
        lastBooking: o,
      };
    }
    const g = guestMap[o.user_id];
    g.totalBookings++;
    if (o.status !== 'cancelled') g.totalSpent += o.total_price;
    if (['pending', 'confirmed'].includes(o.status) && !g.activeBooking) g.activeBooking = o;
  });

  const guests = Object.values(guestMap);

  const filtered = guests.filter(g => {
    const matchSearch = g.email.toLowerCase().includes(search.toLowerCase()) ||
      g.user_id.includes(search) ||
      (g.activeBooking?.room_name || '').toLowerCase().includes(search.toLowerCase()) ||
      g.lastBooking.room_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && g.activeBooking !== null) ||
      (filterStatus === 'inactive' && g.activeBooking === null);
    return matchSearch && matchStatus;
  });

  const activeGuests = guests.filter(g => g.activeBooking).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Guests</h1>
        <div className="flex gap-3 text-sm">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
            {guests.length} Total Guests
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
            {activeGuests} Currently Active
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search guests, rooms..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map(s => (
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

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading guests...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No guests found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(guest => {
            const active = guest.activeBooking;
            const s = active ? statusConfig[active.status] : null;
            return (
              <Card key={guest.user_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {/* Guest header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-hotel-gold/10 border-2 border-hotel-gold/30 flex items-center justify-center font-bold text-hotel-gold">
                      {(guest.email[0] || 'G').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate text-sm">{guest.email}</span>
                      </div>
                      <div className="text-xs text-gray-400 font-mono">{guest.user_id.slice(0, 12)}…</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-gray-900">{guest.totalBookings}</div>
                      <div className="text-xs text-gray-400">Bookings</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-sm font-bold text-hotel-gold">KSH {guest.totalSpent.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Total Spent</div>
                    </div>
                  </div>

                  {/* Active booking */}
                  {active ? (
                    <div className="border border-green-200 bg-green-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-green-700 flex items-center gap-1">
                          <BedDouble className="h-3.5 w-3.5" /> Active Stay
                        </span>
                        {s && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}>
                            {active.status}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-800">{active.room_name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <CalendarDays className="h-3 w-3" />
                        {fmtDate(active.check_in_date)} → {fmtDate(active.check_out_date)}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {active.guests} guest{active.guests > 1 ? 's' : ''}
                        <span className="ml-auto font-medium text-gray-700">KSH {active.total_price.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-gray-100 bg-gray-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-400">No active booking</p>
                      <p className="text-xs text-gray-400">Last: <span className="text-gray-600">{guest.lastBooking.room_name}</span></p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminGuests;