import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, Send } from 'lucide-react';
import { logAudit } from '@/utils/auditLog';

interface MessageRow {
  id: string;
  from_user_id: string | null;
  to_user_id: string | null;
  subject: string;
  body: string;
  sender_name: string | null;
  is_read: boolean;
  created_at: string;
}

const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
      .order('created_at', { ascending: false });
    setMessages((data as MessageRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    if (!user) return;
    const channel = supabase
      .channel(`messages:${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchMessages)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !subject.trim() || !body.trim()) return;
    setSending(true);
    const { error } = await supabase.from('messages').insert({
      from_user_id: user.id,
      to_user_id: null,
      subject: subject.trim(),
      body: body.trim(),
      sender_name: user.email?.split('@')[0] ?? 'Student',
      sender_email: user.email,
    });
    if (error) {
      toast({ title: 'Failed to send', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Message sent', description: 'Management will respond in this thread.' });
      setSubject('');
      setBody('');
      await logAudit('message_sent', 'message', undefined, { subject });
      fetchMessages();
    }
    setSending(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <p className="mb-4 text-gray-600">Sign in to message hostel management.</p>
              <Link to="/auth">
                <Button className="bg-hotel-gold text-white">Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto w-full px-4 pt-28 pb-16 flex-1">
        <h1 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
          <MessageSquare className="h-7 w-7 text-hotel-gold" />
          Messages
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">New message to management</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="body">Message</Label>
                  <Textarea
                    id="body"
                    rows={5}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={sending} className="bg-hotel-gold text-white w-full">
                  <Send className="h-4 w-4 mr-2" />
                  {sending ? 'Sending…' : 'Send to management'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Conversation history</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[480px] overflow-y-auto space-y-3">
              {loading ? (
                <p className="text-gray-400 text-sm">Loading…</p>
              ) : messages.length === 0 ? (
                <p className="text-gray-400 text-sm">No messages yet.</p>
              ) : (
                messages.map((m) => {
                  const fromMe = m.from_user_id === user.id;
                  return (
                    <div
                      key={m.id}
                      className={`rounded-lg border p-3 text-sm ${fromMe ? 'bg-hotel-beige/30 ml-4' : 'bg-white mr-4 border-hotel-gold/30'}`}
                    >
                      <div className="font-medium text-gray-900">{m.subject}</div>
                      <p className="text-gray-600 mt-1 whitespace-pre-wrap">{m.body}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {fromMe ? 'You' : 'Management'} ·{' '}
                        {new Date(m.created_at).toLocaleString('en-KE')}
                      </p>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;
