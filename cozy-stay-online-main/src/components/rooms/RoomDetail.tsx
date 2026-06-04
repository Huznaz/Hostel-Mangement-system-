
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import RoomImage from '@/components/rooms/RoomImage';
import { Wifi, Coffee, Utensils, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail } from '@/utils/emailValidation';
import { useRooms } from '@/hooks/useRooms';
import { useHostelSettings } from '@/hooks/useHostelSettings';
import { useOrderAvailability } from '@/hooks/useOrderAvailability';
import { resolveAllocation, validateApplicationDates } from '@/utils/allocation';
import { logAudit } from '@/utils/auditLog';
import { createNotification } from '@/hooks/useNotifications';

const amenityIcons: Record<string, JSX.Element> = {
  'Free WiFi': <Wifi className="h-4 w-4" />,
  'Coffee maker': <Coffee className="h-4 w-4" />,
  'Mini-bar': <Utensils className="h-4 w-4" />,
  'CheckCircle': <CheckCircle className="h-4 w-4" />,
};

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, loading: roomsLoading } = useRooms();
  const { settings } = useHostelSettings();
  const { orders } = useOrderAvailability();
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

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('full_name, student_id, university, phone')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          if (data.full_name) setGuestName(data.full_name);
          if (data.student_id) setStudentId(data.student_id);
          if (data.university) setUniversity(data.university);
          if (data.phone) setPhone(data.phone);
        }
      });
  }, [user]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (emailError) setEmailError(null);
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };
  
  if (roomsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading room…</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Room Not Found</h2>
          <p className="text-gray-600 mb-6">Sorry, the room you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => navigate('/rooms')}>
            Back to Rooms
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-serif font-bold mb-2">Sign in required</h2>
            <p className="text-gray-600 mb-6">Student registration and login are required to submit a room application.</p>
            <Link to="/auth">
              <Button className="bg-hotel-gold text-white w-full">Login / Register</Button>
            </Link>
          </CardContent>
        </Card>
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

      const emailValidationError = validateEmail(email);
      if (emailValidationError) {
        setEmailError(emailValidationError);
        return;
      }

      const checkInDateString = checkInDate.toISOString().split('T')[0];
      const checkOutDateString = checkOutDate.toISOString().split('T')[0];

      const dateError = validateApplicationDates(checkInDateString, checkOutDateString, settings);
      if (dateError) {
        toast({ title: "Invalid dates", description: dateError, variant: "destructive" });
        return;
      }

      const autoAllocate = settings.auto_allocate === 'true';
      const resolved = resolveAllocation(
        room,
        rooms,
        orders,
        checkInDateString,
        checkOutDateString,
        autoAllocate,
      );

      if ('error' in resolved) {
        toast({ title: "Not available", description: resolved.error, variant: "destructive" });
        return;
      }

      const { room: allocatedRoom, status, autoAssigned } = resolved;
      
      setIsBooking(true);
      
      const totalGuests = Number(adults);
      const totalPrice = allocatedRoom.price * calculateMonths();
      
      const { data, error } = await supabase
        .from('orders')
        .insert({
          room_id: allocatedRoom.id,
          room_name: allocatedRoom.name,
          user_id: user.id,
          check_in_date: checkInDateString,
          check_out_date: checkOutDateString,
          guests: totalGuests,
          total_price: totalPrice,
          status,
          payment_method: 'pay_at_hostel',
          student_id: studentId,
          university,
          contact_name: guestName,
          contact_email: email,
          contact_phone: phone,
          special_requests: autoAssigned ? 'Auto-assigned to alternative room' : null,
        })
        .select();
      
      if (error) {
        toast({
          title: "Application Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsBooking(false);
        return;
      }

      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: guestName,
        student_id: studentId,
        university,
        phone,
        username: email,
        updated_at: new Date().toISOString(),
      });

      if (status === 'confirmed') {
        await supabase.from('financial_records').insert({
          order_id: data[0].id,
          user_id: user.id,
          amount: totalPrice,
          payment_method: 'pay_at_hostel',
          status: 'pending',
          notes: autoAssigned ? 'Auto-allocation' : 'Auto-confirmed allocation',
        });
        await createNotification(
          user.id,
          'Room allocated',
          autoAssigned
            ? `You were automatically assigned to ${allocatedRoom.name} for your selected dates.`
            : `Your application for ${allocatedRoom.name} has been confirmed.`,
          'allocation',
          '/profile',
        );
      } else {
        await createNotification(
          user.id,
          'Application received',
          `Your application for ${allocatedRoom.name} is pending warden approval.`,
          'allocation',
          '/profile',
        );
      }

      await logAudit('application_submitted', 'order', data[0].id, {
        status,
        autoAssigned,
        room_id: allocatedRoom.id,
      });
      
      toast({
        title: status === 'confirmed' ? "Room allocated!" : "Application Submitted!",
        description: status === 'confirmed'
          ? `${allocatedRoom.name} is confirmed. Ref: ${data[0].id.slice(0, 8)}`
          : `Pending approval. Ref: ${data[0].id.slice(0, 8)}`,
      });
      
      setTimeout(() => navigate('/profile'), 2000);
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

  const autoAllocateOn = settings.auto_allocate === 'true';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
            {room.block && (
              <Badge variant="outline" className="bg-hotel-beige/50">
                {room.block}
              </Badge>
            )}
            {room.breakfast && (
              <Badge className="bg-hotel-gold text-white">Meals Plan</Badge>
            )}
            {room.pets && (
              <Badge variant="outline" className="bg-hotel-beige/50">Private Bathroom</Badge>
            )}
          </div>
          
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
          
          <div className="mb-8">
            <h2 className="text-xl font-serif font-semibold mb-4">Description</h2>
            <p className="text-gray-600 mb-4">{room.description}</p>
          </div>
          
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
                  {autoAllocateOn && (
                    <p className="text-xs text-green-700 mt-2 bg-green-50 rounded px-2 py-1">
                      Automated allocation is enabled — available rooms may be confirmed instantly.
                    </p>
                  )}
                </div>
                
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
                      <Input id="name" placeholder="Enter your full name" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-sm" htmlFor="studentId">Student ID / Registration No.</Label>
                      <Input id="studentId" placeholder="e.g. STU/2024/001" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-sm" htmlFor="university">University / College</Label>
                      <Input id="university" placeholder="e.g. University of Nairobi" value={university} onChange={(e) => setUniversity(e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-sm" htmlFor="email">Student Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={handleEmailChange} onBlur={handleEmailBlur} className={emailError ? "border-red-500" : ""} />
                      {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
                    </div>
                    <div>
                      <Label className="text-sm" htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-hotel-gold hover:bg-amber-600 text-white"
                  onClick={handleBookRoom}
                  disabled={isBooking || !!emailError}
                >
                  {isBooking ? "Submitting..." : "Submit Application"}
                </Button>
                
                <p className="text-sm text-gray-500 text-center">
                  {autoAllocateOn
                    ? 'Available rooms are allocated automatically; otherwise the warden will review your application.'
                    : 'Applications are reviewed by the warden. Pay fees at the hostel office after approval.'}
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
