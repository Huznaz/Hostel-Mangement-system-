
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { logAudit } from '@/utils/auditLog';
import { CalendarDays, Users, BedDouble, Clock, CheckCircle2, XCircle, Hourglass, Receipt } from 'lucide-react';

interface Order {
  id: string;
  room_name: string;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_price: number;
  status: string;
  payment_method: string | null;
  special_requests: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-800 border-yellow-200',  icon: <Hourglass className="h-3 w-3" /> },
  confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-800 border-green-200',    icon: <CheckCircle2 className="h-3 w-3" /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200',          icon: <XCircle className="h-3 w-3" /> },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800 border-blue-200',       icon: <CheckCircle2 className="h-3 w-3" /> },
};

const Profile = () => {
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    student_id: '',
    university: '',
    phone: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchOrders();
    supabase
      .from('profiles')
      .select('full_name, student_id, university, phone')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfileForm({
            full_name: data.full_name ?? '',
            student_id: data.student_id ?? '',
            university: data.university ?? '',
            phone: data.phone ?? '',
          });
        }
      });
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const handleCancel = async (orderId: string) => {
    setCancelling(orderId);
    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId)
      .eq('user_id', user!.id);

    if (error) {
      toast({ title: 'Error', description: 'Could not cancel application.', variant: 'destructive' });
    } else {
      await logAudit('application_cancelled', 'order', orderId);
      toast({ title: 'Application Cancelled', description: 'Your room application has been cancelled.' });
      fetchOrders();
    }
    setCancelling(null);
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase.from('profiles').upsert(
      {
        id: user.id,
        full_name: profileForm.full_name,
        student_id: profileForm.student_id,
        university: profileForm.university,
        phone: profileForm.phone,
        username: user.email,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      await logAudit('profile_updated', 'profile', user.id);
      toast({ title: 'Profile saved' });
    }
    setSavingProfile(false);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });

  const months = (checkIn: string, checkOut: string) => {
    const days = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.ceil(days / 30));
  };

  const activeBookings  = orders.filter(o => ['pending', 'confirmed'].includes(o.status));
  const pastBookings    = orders.filter(o => ['completed', 'cancelled'].includes(o.status));
  const totalSpent      = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">

        {/* Header card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-hotel-gold/10 border-2 border-hotel-gold flex items-center justify-center text-2xl font-bold text-hotel-gold">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {profileForm.full_name || user?.email}
              </h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-xs text-gray-400">Member since {new Date(user?.created_at || '').toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 self-start sm:self-auto">
            <Link to="/notifications">
              <Button variant="outline" size="sm">Notifications</Button>
            </Link>
            <Link to="/messages">
              <Button variant="outline" size="sm">Messages</Button>
            </Link>
            <Button variant="outline" onClick={signOut} className="border-red-200 text-red-600 hover:bg-red-50">
              Sign Out
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Student profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Full name</Label>
                <Input
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm((p) => ({ ...p, full_name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Student ID</Label>
                <Input
                  value={profileForm.student_id}
                  onChange={(e) => setProfileForm((p) => ({ ...p, student_id: e.target.value }))}
                />
              </div>
              <div>
                <Label>University</Label>
                <Input
                  value={profileForm.university}
                  onChange={(e) => setProfileForm((p) => ({ ...p, university: e.target.value }))}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={savingProfile} className="bg-hotel-gold text-white">
                  {savingProfile ? 'Saving…' : 'Save profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Applications', value: orders.length },
            { label: 'Active',         value: activeBookings.length },
            { label: 'Total Spent',    value: `KSH ${totalSpent.toLocaleString()}` },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-hotel-gold">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading your allocations…</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border shadow-sm p-12 text-center">
            <BedDouble className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">No applications yet</h2>
            <p className="text-gray-500 mb-6">Browse available rooms and submit your first hostel application.</p>
            <Link to="/rooms">
              <Button className="bg-hotel-gold hover:bg-hotel-gold/90 text-white">Explore Rooms</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Active bookings */}
            {activeBookings.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Active Allocations</h2>
                <div className="space-y-4">
                  {activeBookings.map(order => (
                    <BookingCard
                      key={order.id}
                      order={order}
                      onCancel={handleCancel}
                      cancelling={cancelling}
                      formatDate={formatDate}
                      months={months}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Past bookings */}
            {pastBookings.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Past Allocations</h2>
                <div className="space-y-4">
                  {pastBookings.map(order => (
                    <BookingCard
                      key={order.id}
                      order={order}
                      onCancel={handleCancel}
                      cancelling={cancelling}
                      formatDate={formatDate}
                      months={months}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface CardProps {
  order: Order;
  onCancel: (id: string) => void;
  cancelling: string | null;
  formatDate: (d: string) => string;
  months: (i: string, o: string) => number;
}

const BookingCard = ({ order, onCancel, cancelling, formatDate, months }: CardProps) => {
  const s = statusConfig[order.status] ?? statusConfig['pending'];
  const n = months(order.check_in_date, order.check_out_date);
  const canCancel = order.status === 'pending';

  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

        {/* Left */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <BedDouble className="h-5 w-5 text-hotel-gold flex-shrink-0" />
            <h3 className="font-semibold text-gray-900">{order.room_name}</h3>
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${s.color}`}>
              {s.icon} {s.label}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-xs text-gray-400">Move-in</div>
                <div className="font-medium">{formatDate(order.check_in_date)}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-xs text-gray-400">Move-out</div>
                <div className="font-medium">{formatDate(order.check_out_date)}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-xs text-gray-400">Duration</div>
                <div className="font-medium">{n} month{n !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-xs text-gray-400">Occupants</div>
                <div className="font-medium">{order.guests}</div>
              </div>
            </div>
          </div>

          {order.special_requests && (
            <p className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
              <span className="font-medium">Special requests:</span> {order.special_requests}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <Receipt className="h-3 w-3" />
            Application ID: <span className="font-mono">{order.id.slice(0, 8)}…</span>
            {order.payment_method && (
              <span className="ml-2 capitalize">· {order.payment_method}</span>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:min-w-[110px]">
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">KSH {order.total_price.toLocaleString()}</div>
            <div className="text-xs text-gray-400">total</div>
          </div>
          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(order.id)}
              disabled={cancelling === order.id}
              className="border-red-200 text-red-600 hover:bg-red-50 text-xs"
            >
              {cancelling === order.id ? 'Cancelling…' : 'Cancel'}
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
