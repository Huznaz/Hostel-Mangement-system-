import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { logAudit } from '@/utils/auditLog';
import { createNotification } from '@/hooks/useNotifications';
import { Receipt } from 'lucide-react';

interface FinancialRow {
  id: string;
  order_id: string | null;
  user_id: string | null;
  amount: number;
  payment_method: string | null;
  status: string;
  reference: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

const AdminFinance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<FinancialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('financial_records')
      .select('*')
      .order('created_at', { ascending: false });
    setRecords((data as FinancialRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
    const channel = supabase
      .channel('admin:finance')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financial_records' }, fetchRecords)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markPaid = async (record: FinancialRow) => {
    setUpdating(record.id);
    const { error } = await supabase
      .from('financial_records')
      .update({ status: 'paid', recorded_by: user?.id })
      .eq('id', record.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      if (record.user_id) {
        await createNotification(
          record.user_id,
          'Payment recorded',
          `Your payment of KSH ${Number(record.amount).toLocaleString()} has been marked as paid.`,
          'payment',
          '/profile',
        );
      }
      await logAudit('payment_marked_paid', 'financial_record', record.id);
      toast({ title: 'Marked as paid' });
      fetchRecords();
    }
    setUpdating(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Receipt className="h-7 w-7 text-hotel-gold" />
        Financial records
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment ledger</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-400">Loading…</p>
          ) : records.length === 0 ? (
            <p className="text-gray-400 text-sm">No financial records. Records are created when allocations are confirmed.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Amount</th>
                    <th className="py-2 pr-4">Method</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100">
                      <td className="py-3 pr-4">{new Date(r.created_at).toLocaleDateString('en-KE')}</td>
                      <td className="py-3 pr-4 font-medium">KSH {Number(r.amount).toLocaleString()}</td>
                      <td className="py-3 pr-4 capitalize">{r.payment_method ?? '—'}</td>
                      <td className="py-3 pr-4">
                        <Badge className={statusColors[r.status] ?? ''}>{r.status}</Badge>
                      </td>
                      <td className="py-3">
                        {r.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updating === r.id}
                            onClick={() => markPaid(r)}
                          >
                            Mark paid
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFinance;
