import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, Shield } from 'lucide-react';

interface AuditRow {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

const Security = () => {
  const [logs, setLogs] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchLogs();
    const channel = supabase
      .channel('admin:audit')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_log' }, fetchLogs)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    setLogs((data as AuditRow[]) || []);
    setLoading(false);
  };

  const filtered = logs.filter(
    (l) =>
      !filter ||
      l.action.toLowerCase().includes(filter.toLowerCase()) ||
      l.entity_type.toLowerCase().includes(filter.toLowerCase()) ||
      (l.entity_id ?? '').includes(filter),
  );

  const exportCsv = () => {
    const rows = [
      ['Time', 'Actor', 'Action', 'Entity', 'Entity ID', 'Details'],
      ...filtered.map((l) => [
        new Date(l.created_at).toISOString(),
        l.actor_id?.slice(0, 8) ?? 'system',
        l.action,
        l.entity_type,
        l.entity_id ?? '',
        JSON.stringify(l.details ?? {}),
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv,' + encodeURIComponent(csv);
    a.download = 'audit-log.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Shield className="h-7 w-7 text-hotel-gold" />
        Security & access control
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Digital record-keeping</CardTitle>
          <CardDescription>
            Audit trail of allocation changes, messages, payments, and admin actions. Row-level security restricts data by role in Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Students: own profile, applications, messages, and notifications only</li>
            <li>Admins: full access via <code className="text-xs bg-gray-100 px-1 rounded">admin_users</code> table</li>
            <li>Public: read room catalog and active allocation dates for availability</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-base">Audit log</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Filter actions…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-48"
            />
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="max-h-[480px] overflow-y-auto">
          {loading ? (
            <p className="text-gray-400 text-sm">Loading audit log…</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-400 text-sm">No audit entries yet. Actions are logged as admins and students use the system.</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((l) => (
                <div key={l.id} className="border rounded-lg p-3 text-sm">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant="outline">{l.action}</Badge>
                    <span className="text-gray-500">{l.entity_type}</span>
                    {l.entity_id && (
                      <span className="font-mono text-xs text-gray-400">{l.entity_id.slice(0, 8)}…</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(l.created_at).toLocaleString('en-KE')}
                    {l.actor_id && ` · actor ${l.actor_id.slice(0, 8)}…`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;
