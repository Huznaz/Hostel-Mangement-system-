import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-background/90 backdrop-blur-sm fixed w-full z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-serif font-bold text-hotel-gold">CozyStay</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-hotel-gold transition-colors">Home</Link>
            <Link to="/rooms" className="text-foreground hover:text-hotel-gold transition-colors">Rooms</Link>
            <Link to="/about" className="text-foreground hover:text-hotel-gold transition-colors">About</Link>
            <Link to="/contact" className="text-foreground hover:text-hotel-gold transition-colors">Contact</Link>
            
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" className="text-foreground hover:text-hotel-gold">
                    <User className="h-4 w-4 mr-2" />
                    My Bookings
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" className="border-hotel-gold text-hotel-gold hover:bg-hotel-gold hover:text-white">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  onClick={signOut} 
                  className="text-foreground hover:text-hotel-gold"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="border-hotel-gold text-hotel-gold hover:bg-hotel-gold hover:text-white">
                  Login / Register
                </Button>
              </Link>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-hotel-gold focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-b">
          <Link to="/" className="block px-3 py-2 text-foreground hover:text-hotel-gold">Home</Link>
          <Link to="/rooms" className="block px-3 py-2 text-foreground hover:text-hotel-gold">Rooms</Link>
          <Link to="/about" className="block px-3 py-2 text-foreground hover:text-hotel-gold">About</Link>
          <Link to="/contact" className="block px-3 py-2 text-foreground hover:text-hotel-gold">Contact</Link>
          
          {user ? (
            <>
              <Link to="/profile" className="block px-3 py-2 text-foreground hover:text-hotel-gold">My Bookings</Link>
              {isAdmin && (
                <Link to="/admin" className="block px-3 py-2 text-hotel-gold font-medium">Admin Dashboard</Link>
              )}
              <button 
                onClick={signOut}
                className="flex items-center w-full px-3 py-2 text-foreground hover:text-hotel-gold"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="block px-3 py-2 text-hotel-gold font-medium">Login / Register</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;