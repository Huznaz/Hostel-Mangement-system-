import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { HostelSettingsMap } from '@/utils/allocation';

const DEFAULTS: HostelSettingsMap = {
  min_advance_days: '7',
  max_advance_days: '365',
  auto_allocate: 'true',
};

export function useHostelSettings() {
  const [settings, setSettings] = useState<HostelSettingsMap>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('hotel_settings').select('key, value');
    const map: HostelSettingsMap = { ...DEFAULTS };
    if (data) {
      data.forEach((row: { key: string; value: string }) => {
        map[row.key as keyof HostelSettingsMap] = row.value;
      });
    }
    setSettings(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, loading, refetch: fetchSettings };
}
