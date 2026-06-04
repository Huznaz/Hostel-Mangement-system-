import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';
import { Save, Building2, Clock, CreditCard, ShieldAlert, Loader2 } from 'lucide-react';
import { HOSTEL_NAME, HOSTEL_EMAIL } from '@/constants/brand';

type Settings = Record<string, string>;

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
      ${checked ? 'bg-hotel-gold' : 'bg-gray-200'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
      ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const AdminSettings = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('hotel_settings').select('key, value');
    if (!error && data) {
      const map: Settings = {};
      data.forEach((r: any) => { map[r.key] = r.value; });
      setSettings(map);
    }
    setLoading(false);
  };

  const set = (key: string, value: string) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  const toggle = (key: string) =>
    setSettings(prev => ({ ...prev, [key]: prev[key] === 'true' ? 'false' : 'true' }));

  const bool = (key: string) => settings[key] === 'true';

  const saveAll = async () => {
    setSaving(true);
    const upserts = Object.entries(settings).map(([key, value]) => ({
      key, value, updated_at: new Date().toISOString()
    }));
    const { error } = await supabase.from('hotel_settings').upsert(upserts, { onConflict: 'key' });
    if (error) {
      toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' });
    } else {
      toast({ title: 'Settings Saved', description: 'All settings have been updated.' });
    }
    setSaving(false);
  };

  const tabs = [
    { id: 'general',     label: 'General',     icon: <Building2 className="h-4 w-4" /> },
    { id: 'booking',     label: 'Allocations', icon: <Clock className="h-4 w-4" /> },
    { id: 'payment',     label: 'Payment',     icon: <CreditCard className="h-4 w-4" /> },
    { id: 'policy',      label: 'Policy',      icon: <ShieldAlert className="h-4 w-4" /> },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading settings…
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <Button
          onClick={saveAll}
          disabled={saving}
          className="bg-hotel-gold hover:bg-hotel-gold/90 text-white gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${activeTab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === 'general' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hostel Information</CardTitle>
            <CardDescription>Basic details shown to students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Hostel Name</Label>
                <Input value={settings['hotel_name'] || ''} onChange={e => set('hotel_name', e.target.value)} placeholder={HOSTEL_NAME} />
              </div>
              <div className="space-y-1.5">
                <Label>Currency</Label>
                <Input value={settings['currency'] || ''} onChange={e => set('currency', e.target.value)} placeholder="KSH" />
              </div>
              <div className="space-y-1.5">
                <Label>Contact Email</Label>
                <Input type="email" value={settings['hotel_email'] || ''} onChange={e => set('hotel_email', e.target.value)} placeholder={HOSTEL_EMAIL} />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input value={settings['hotel_phone'] || ''} onChange={e => set('hotel_phone', e.target.value)} placeholder="+254 700 000 000" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input value={settings['hotel_address'] || ''} onChange={e => set('hotel_address', e.target.value)} placeholder="Nairobi, Kenya" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking */}
      {activeTab === 'booking' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Allocation Rules</CardTitle>
            <CardDescription>Move-in/out times and advance application limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Check-in Time</Label>
                <Input type="time" value={settings['check_in_time'] || '14:00'} onChange={e => set('check_in_time', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Check-out Time</Label>
                <Input type="time" value={settings['check_out_time'] || '11:00'} onChange={e => set('check_out_time', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Min. Advance Application (days)</Label>
                <Input type="number" min="0" value={settings['min_advance_days'] || '1'} onChange={e => set('min_advance_days', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Max. Advance Application (days)</Label>
                <Input type="number" min="1" value={settings['max_advance_days'] || '365'} onChange={e => set('max_advance_days', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment */}
      {activeTab === 'payment' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Methods</CardTitle>
            <CardDescription>Enable or disable payment options for students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'payment_cash',  label: 'Pay at Hostel (Cash)', desc: 'Students pay at the hostel office' },
              { key: 'payment_mpesa', label: 'M-Pesa',              desc: 'Mobile money payment' },
              { key: 'payment_card',  label: 'Credit / Debit Card', desc: 'Card payments at reception' },
            ].map(p => (
              <div key={p.key} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{p.label}</div>
                  <div className="text-sm text-gray-500">{p.desc}</div>
                </div>
                <Toggle checked={bool(p.key)} onChange={() => toggle(p.key)} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Policy */}
      {activeTab === 'policy' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cancellation Policy</CardTitle>
            <CardDescription>Rules around student application cancellations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Free Cancellation Window (hours before check-in)</Label>
              <Input
                type="number"
                min="0"
                value={settings['cancellation_policy'] || '24'}
                onChange={e => set('cancellation_policy', e.target.value)}
              />
              <p className="text-xs text-gray-400">
                Students can cancel free of charge up to {settings['cancellation_policy'] || '24'} hours before move-in.
                Set to 0 to disable free cancellation.
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Current policy:</strong> Students may cancel applications up to{' '}
                <strong>{settings['cancellation_policy'] || '24'} hours</strong> before their scheduled check-in
                at {settings['check_in_time'] || '14:00'} without penalty.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save reminder */}
      <p className="text-xs text-gray-400 text-center">
        Changes are only saved when you click "Save Changes" above.
      </p>
    </div>
  );
};

export default AdminSettings;