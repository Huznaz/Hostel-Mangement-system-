import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { logAudit } from '@/utils/auditLog';
import { createNotification } from '@/hooks/useNotifications';
import { MessageSquare, Reply } from 'lucide-react';

interface MessageRow {
  id: string;
  from_user_id: string | null;
  to_user_id: string | null;
  subject: string;
  body: string;
  sender_name: string | null;
  sender_email: string | null;
  is_read: boolean;
  created_at: string;
}

const AdminMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MessageRow | null>(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    setMessages((data as MessageRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel('admin:messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchMessages)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const inbox = messages.filter((m) => m.to_user_id === null || m.from_user_id !== user?.id);

  const markRead = async (id: string) => {
    await supabase.from('messages').update({ is_read: true }).eq('id', id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected?.from_user_id || !reply.trim() || !user) return;
    setSending(true);
    const { error } = await supabase.from('messages').insert({
      from_user_id: user.id,
      to_user_id: selected.from_user_id,
      subject: `Re: ${selected.subject}`,
      body: reply.trim(),
      sender_name: 'Hostel Management',
    });
    if (error) {
      toast({ title: 'Reply failed', description: error.message, variant: 'destructive' });
    } else {
      await createNotification(
        selected.from_user_id,
        'New message from management',
        reply.trim().slice(0, 120),
        'message',
        '/messages',
      );
      await logAudit('message_reply', 'message', selected.id);
      toast({ title: 'Reply sent' });
      setReply('');
      setSelected(null);
      fetchMessages();
    }
    setSending(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <MessageSquare className="h-7 w-7 text-hotel-gold" />
        Communication
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inbox</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[520px] overflow-y-auto space-y-2">
            {loading ? (
              <p className="text-gray-400 text-sm">Loading…</p>
            ) : inbox.length === 0 ? (
              <p className="text-gray-400 text-sm">No messages.</p>
            ) : (
              inbox.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelected(m);
                    if (!m.is_read) markRead(m.id);
                  }}
                  className={`w-full text-left rounded-lg border p-3 hover:bg-gray-50 ${selected?.id === m.id ? 'border-hotel-gold bg-hotel-beige/20' : ''}`}
                >
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-sm truncate">{m.subject}</span>
                    {!m.is_read && <Badge className="bg-hotel-gold shrink-0">New</Badge>}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {m.sender_name || m.sender_email || 'Student'} ·{' '}
                    {new Date(m.created_at).toLocaleDateString('en-KE')}
                  </p>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Reply className="h-4 w-4" />
              {selected ? 'Reply' : 'Select a message'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selected ? (
              <>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="font-medium">{selected.subject}</p>
                  <p className="text-gray-600 mt-2 whitespace-pre-wrap">{selected.body}</p>
                </div>
                {selected.from_user_id ? (
                  <form onSubmit={handleReply} className="space-y-3">
                    <div>
                      <Label>Your reply</Label>
                      <Textarea
                        rows={4}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={sending} className="bg-hotel-gold text-white">
                      Send reply
                    </Button>
                  </form>
                ) : (
                  <p className="text-sm text-gray-500">Anonymous contact — reply by email if provided.</p>
                )}
              </>
            ) : (
              <p className="text-gray-400 text-sm">Choose a message from the inbox to respond.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMessages;
