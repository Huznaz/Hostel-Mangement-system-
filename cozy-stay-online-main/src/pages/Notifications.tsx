import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { Bell } from 'lucide-react';

const NotificationsPage = () => {
  const { user } = useAuth();
  const { notifications, loading, unreadCount, markRead, markAllRead } = useNotifications();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <Link to="/auth">
            <Button className="bg-hotel-gold text-white">Login to view notifications</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="max-w-2xl mx-auto w-full px-4 pt-28 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
            <Bell className="h-7 w-7 text-hotel-gold" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-hotel-gold">{unreadCount} new</Badge>
            )}
          </h1>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              Mark all read
            </Button>
          )}
        </div>

        {loading ? (
          <p className="text-gray-400">Loading…</p>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              No notifications yet. You will be alerted when your allocation status changes.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <Card
                key={n.id}
                className={!n.read_at ? 'border-hotel-gold/50 bg-hotel-beige/20' : ''}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-medium text-gray-900">{n.title}</div>
                      <p className="text-sm text-gray-600 mt-1">{n.body}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(n.created_at).toLocaleString('en-KE')}
                      </p>
                    </div>
                    {!n.read_at && (
                      <Button variant="ghost" size="sm" onClick={() => markRead(n.id)}>
                        Mark read
                      </Button>
                    )}
                  </div>
                  {n.link && (
                    <Link to={n.link} className="text-sm text-hotel-gold hover:underline mt-2 inline-block">
                      View details →
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
