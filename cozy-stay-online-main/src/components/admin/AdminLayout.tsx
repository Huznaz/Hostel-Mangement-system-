
import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Hotel, CalendarDays, Users, 
  Settings, LogOut, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}

const NavItem = ({ icon, label, href, isActive }: NavItemProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
      isActive 
        ? "bg-hotel-gold text-white" 
        : "text-gray-600 hover:bg-gray-100"
    )}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const AdminLayout = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r p-4 flex-shrink-0">
        <div className="flex items-center gap-2 px-2 py-3 mb-6">
          <span className="text-xl font-serif font-bold text-hotel-gold">CozyStay</span>
          <span className="text-sm font-medium text-gray-500">Admin</span>
        </div>
        
        <nav className="space-y-1 flex-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            href="/admin" 
            isActive={isActive('/admin')} 
          />
          <NavItem 
            icon={<Hotel size={20} />} 
            label="Rooms" 
            href="/admin/rooms" 
            isActive={isActive('/admin/rooms')} 
          />
          <NavItem 
            icon={<CalendarDays size={20} />} 
            label="Bookings" 
            href="/admin/bookings" 
            isActive={isActive('/admin/bookings')} 
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Guests" 
            href="/admin/guests" 
            isActive={isActive('/admin/guests')} 
          />
          <NavItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            href="/admin/settings" 
            isActive={isActive('/admin/settings')} 
          />
        </nav>
        
        <Button 
          variant="outline" 
          className="mt-6 w-full justify-start gap-2 text-gray-600"
          onClick={() => signOut()}
        >
          <LogOut size={20} />
          Logout
        </Button>
      </aside>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <aside className={cn(
        "md:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-200 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold text-hotel-gold">CozyStay</span>
            <span className="text-sm font-medium text-gray-500">Admin</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            href="/admin" 
            isActive={isActive('/admin')} 
          />
          <NavItem 
            icon={<Hotel size={20} />} 
            label="Rooms" 
            href="/admin/rooms" 
            isActive={isActive('/admin/rooms')} 
          />
          <NavItem 
            icon={<CalendarDays size={20} />} 
            label="Bookings" 
            href="/admin/bookings" 
            isActive={isActive('/admin/bookings')} 
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Guests" 
            href="/admin/guests" 
            isActive={isActive('/admin/guests')} 
          />
          <NavItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            href="/admin/settings" 
            isActive={isActive('/admin/settings')} 
          />
        </nav>
        
        <Button 
          variant="outline" 
          className="mx-4 mt-6 w-[calc(100%-32px)] justify-start gap-2 text-gray-600"
          onClick={() => signOut()}
        >
          <LogOut size={20} />
          Logout
        </Button>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-medium">
              {isActive('/admin') && 'Dashboard'}
              {isActive('/admin/rooms') && 'Room Management'}
              {isActive('/admin/bookings') && 'Booking Management'}
              {isActive('/admin/guests') && 'Guest Management'}
              {isActive('/admin/settings') && 'Settings'}
            </h1>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src="/admin-avatar.jpg" />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        
        {/* Main content container */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
