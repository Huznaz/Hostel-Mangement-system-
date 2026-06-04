
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Room, rooms } from '@/data/hotelData';
import { Wifi, Coffee, Utensils, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail } from '@/utils/emailValidation';

const amenityIcons: Record<string, JSX.Element> = {
  'Free WiFi': <Wifi className="h-4 w-4" />,
  'Coffee maker': <Coffee className="h-4 w-4" />,
  'Mini-bar': <Utensils className="h-4 w-4" />,
  'CheckCircle': <CheckCircle className="h-4 w-4" />,
};

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = rooms.find(r => r.id === Number(id));
  const { user } = useAuth();
  
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
  const [adults, setAdults] = useState<string>("1");
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError(null);
    }
  };

  const handleEmailBlur = () => {
    const error = validateEmail(email);
    setEmailError(error);
  };
  
  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Room Not Found</h2>
          <p className="text-gray-600 mb-6">Sorry, the room you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/rooms')}>
            Back to Rooms
          </Button>
        </div>
      </div>
    );
  }
  
  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate) return room.price;
    const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    return room.price * Math.max(1, days);
  };

  const handleBookRoom = async () => {
    try {
      if (!checkInDate || !checkOutDate) {
        toast({
          title: "Please select dates",
          description: "Check-in and check-out dates are required",
          variant: "destructive",
        });
        return;
      }

      if (!guestName || !email || !phone) {
        toast({
          title: "Missing information",
          description: "Please fill in all contact details",
          variant: "destructive",
        });
        return;
      }

      // Validate email before booking
      const emailValidationError = validateEmail(email);
      if (emailValidationError) {
        setEmailError(emailValidationError);
        return;
      }
      
      setIsBooking(true);
      
      // Format dates for database
      const checkInDateString = checkInDate.toISOString().split('T')[0];
      const checkOutDateString = checkOutDate.toISOString().split('T')[0];
      const totalGuests = Number(adults);
      const totalPrice = calculateTotalPrice();
      
      // Create booking in database
      const { data, error } = await supabase
        .from('orders')
        .insert({
          room_id: room.id,
          room_name: room.name,
          user_id: user?.id || '00000000-0000-0000-0000-000000000000', // Use guest ID if not logged in
          check_in_date: checkInDateString,
          check_out_date: checkOutDateString,
          guests: totalGuests,
          total_price: totalPrice,
          status: 'pending',
          payment_method: 'pay_at_hotel',
          special_requests: ''
        })
        .select();
      
      if (error) {
        console.error('Booking error:', error);
        toast({
          title: "Booking Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsBooking(false);
        return;
      }
      
      // Show success message
      toast({
        title: "Booking Successful!",
        description: `Your stay at ${room.name} has been booked. Booking ID: ${data[0].id.slice(0, 8)}`,
        variant: "default",
      });
      
      // Navigate to home or booking confirmation page
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Room details (two-thirds) */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-serif font-bold mb-2">{room.name}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline" className="bg-hotel-beige/50">
              {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}
            </Badge>
            <Badge variant="outline" className="bg-hotel-beige/50">
              {room.size} m²
            </Badge>
            <Badge variant="outline" className="bg-hotel-beige/50">
              {room.type}
            </Badge>
            {room.breakfast && (
              <Badge className="bg-hotel-gold text-white">
                Breakfast Included
              </Badge>
            )}
            {room.pets && (
              <Badge variant="outline" className="bg-hotel-beige/50">
                Pets Allowed
              </Badge>
            )}
          </div>
          
          {/* Room image carousel */}
          <Carousel className="mb-8">
            <CarouselContent>
              {room.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-[16/9] overflow-hidden rounded-lg">
                    <img 
                      src={image} 
                      alt={`${room.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          
          {/* Room description */}
          <div className="mb-8">
            <h2 className="text-xl font-serif font-semibold mb-4">Description</h2>
            <p className="text-gray-600 mb-4">{room.description}</p>
          </div>
          
          {/* Room amenities */}
          <div>
            <h2 className="text-xl font-serif font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {room.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <div className="mr-2 text-hotel-gold">
                    {amenityIcons[amenity] || <CheckCircle className="h-4 w-4" />}
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Booking form (one-third) */}
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-semibold mb-2">Book This Room</h3>
                  <p className="text-2xl font-bold text-hotel-gold mb-4">
                    KSH {room.price} <span className="text-sm text-gray-500 font-normal">/night</span>
                  </p>
                  <p className="text-sm font-semibold text-gray-600">
                    Total: KSH {calculateTotalPrice().toLocaleString()} 
                    {checkInDate && checkOutDate && (
                      <span className="font-normal"> for {Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)))} night(s)</span>
                    )}
                  </p>
                </div>
                
                {/* Check-in/out dates */}
                <div className="space-y-4">
                  <Label>Select Dates</Label>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="text-sm mb-2 block">Check-in</Label>
                      <div className="border rounded-md">
                        <Calendar
                          mode="single"
                          selected={checkInDate}
                          onSelect={setCheckInDate}
                          className="p-3"
                          disabled={(date) => date < new Date()}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block">Check-out</Label>
                      <div className="border rounded-md">
                        <Calendar
                          mode="single"
                          selected={checkOutDate}
                          onSelect={setCheckOutDate}
                          className="p-3"
                          disabled={(date) => date <= (checkInDate || new Date())}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Guests */}
                <div className="space-y-2">
                  <Label>Number of Adults</Label>
                  <Select value={adults} onValueChange={setAdults}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of adults" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(room.capacity)].map((_, i) => (
                        <SelectItem key={i} value={(i + 1).toString()}>
                          {i + 1} {i === 0 ? 'Adult' : 'Adults'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Contact Info */}
                <div className="space-y-2">
                  <Label>Contact Information</Label>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm" htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Enter your full name" 
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm" htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                        className={emailError ? "border-red-500" : ""}
                      />
                      {emailError && (
                        <p className="text-sm text-red-500 mt-1">{emailError}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm" htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        placeholder="Enter your phone number" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Book Button */}
                <Button 
                  className="w-full bg-hotel-gold hover:bg-amber-600 text-white"
                  onClick={handleBookRoom}
                  disabled={isBooking || !!emailError}
                >
                  {isBooking ? "Processing..." : "Book Now"}
                </Button>
                
                <p className="text-sm text-gray-500 text-center">
                  No credit card required to book. Pay at hotel.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
