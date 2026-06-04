
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
import { Room, rooms } from '@/data/hostelData';
import RoomImage from '@/components/rooms/RoomImage';
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
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(new Date(Date.now() + 120 * 24 * 60 * 60 * 1000));
  const [adults, setAdults] = useState<string>("1");
  const [guestName, setGuestName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [university, setUniversity] = useState("");
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
  
  const calculateMonths = () => {
    if (!checkInDate || !checkOutDate) return 1;
    const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.ceil(days / 30));
  };

  const calculateTotalPrice = () => room.price * calculateMonths();

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

      if (!guestName || !email || !phone || !studentId || !university) {
        toast({
          title: "Missing information",
          description: "Please fill in all student and contact details",
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
          user_id: user?.id || '00000000-0000-0000-0000-000000000000',
          check_in_date: checkInDateString,
          check_out_date: checkOutDateString,
          guests: totalGuests,
          total_price: totalPrice,
          status: 'pending',
          payment_method: 'pay_at_hostel',
          student_id: studentId,
          university,
          contact_name: guestName,
          contact_email: email,
          contact_phone: phone,
          special_requests: null,
        })
        .select();
      
      if (error) {
        console.error('Booking error:', error);
        toast({
          title: "Application Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsBooking(false);
        return;
      }
      
      // Show success message
      toast({
        title: "Application Submitted!",
        description: `Your room application for ${room.name} is pending approval. Ref: ${data[0].id.slice(0, 8)}`,
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
        description: "There was an error submitting your application. Please try again.",
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
              {room.capacity} {room.capacity === 1 ? 'Student' : 'Students'}
            </Badge>
            <Badge variant="outline" className="bg-hotel-beige/50">
              {room.size} m²
            </Badge>
            <Badge variant="outline" className="bg-hotel-beige/50">
              {room.type}
            </Badge>
            {room.breakfast && (
              <Badge className="bg-hotel-gold text-white">
                Meals Plan
              </Badge>
            )}
            {room.pets && (
              <Badge variant="outline" className="bg-hotel-beige/50">
                Private Bathroom
              </Badge>
            )}
          </div>
          
          {/* Room image carousel */}
          <Carousel className="mb-8">
            <CarouselContent>
              {room.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-[16/9] overflow-hidden rounded-lg">
                    <RoomImage
                      src={image}
                      alt={`${room.name} - Image ${index + 1}`}
                      size="detail"
                      className="rounded-lg"
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
                  <h3 className="text-xl font-serif font-semibold mb-2">Apply for This Room</h3>
                  <p className="text-2xl font-bold text-hotel-gold mb-4">
                    KSH {room.price} <span className="text-sm text-gray-500 font-normal">/month</span>
                  </p>
                  <p className="text-sm font-semibold text-gray-600">
                    Estimated total: KSH {calculateTotalPrice().toLocaleString()} 
                    {checkInDate && checkOutDate && (
                      <span className="font-normal"> for {calculateMonths()} month(s)</span>
                    )}
                  </p>
                </div>
                
                {/* Check-in/out dates */}
                <div className="space-y-4">
                  <Label>Semester / Stay Period</Label>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="text-sm mb-2 block">Move-in date</Label>
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
                      <Label className="text-sm mb-2 block">Move-out date</Label>
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
                  <Label>Occupants</Label>
                  <Select value={adults} onValueChange={setAdults}>
                    <SelectTrigger>
                      <SelectValue placeholder="Number of students" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(room.capacity)].map((_, i) => (
                        <SelectItem key={i} value={(i + 1).toString()}>
                          {i + 1} {i === 0 ? 'Student' : 'Students'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Student Details</Label>
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
                      <Label className="text-sm" htmlFor="studentId">Student ID / Registration No.</Label>
                      <Input 
                        id="studentId" 
                        placeholder="e.g. STU/2024/001" 
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm" htmlFor="university">University / College</Label>
                      <Input 
                        id="university" 
                        placeholder="e.g. University of Nairobi" 
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm" htmlFor="email">Student Email</Label>
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
                  {isBooking ? "Submitting..." : "Submit Application"}
                </Button>
                
                <p className="text-sm text-gray-500 text-center">
                  Applications are reviewed by the warden. Pay fees at the hostel office after approval.
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
