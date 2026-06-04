import { supabase } from '@/integrations/supabase/client';

export async function logAudit(
  action: string,
  entityType: string,
  entityId?: string,
  details?: Record<string, unknown>,
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from('audit_log').insert({
    actor_id: user.id,
    action,
    entity_type: entityType,
    entity_id: entityId ?? null,
    details: details ?? {},
  });

  if (error) {
    console.warn('Audit log failed:', error.message);
  }
}
