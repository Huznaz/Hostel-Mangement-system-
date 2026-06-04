
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { validateEmail } from '@/utils/emailValidation';
import { HOSTEL_EMAIL, HOSTEL_PHONE, HOSTEL_LOCATION } from '@/constants/brand';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { logAudit } from '@/utils/auditLog';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear email error when user starts typing
    if (name === 'email' && emailError) {
      setEmailError(null);
    }
  };

  const handleEmailBlur = () => {
    const error = validateEmail(formData.email);
    setEmailError(error);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailValidationError = validateEmail(formData.email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    if (!formData.message.trim()) {
      toast({ title: 'Message required', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await supabase.from('messages').insert({
      from_user_id: user?.id ?? null,
      to_user_id: null,
      subject: formData.subject.trim() || 'Contact form',
      body: formData.message.trim(),
      sender_name: formData.name.trim(),
      sender_email: formData.email.trim(),
    });

    if (error) {
      toast({
        title: 'Could not send message',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      await logAudit('contact_message', 'message', undefined, {
        subject: formData.subject,
        from: formData.email,
      });
      toast({
        title: "Message Sent!",
        description: user
          ? "Your message was sent to management. Check Messages for replies."
          : "Thank you for contacting us. We'll get back to you soon.",
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
      setEmailError(null);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-hotel-beige py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">Contact the Warden</h1>
            <div className="w-24 h-1 bg-hotel-gold mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Questions about room applications, allocations, or semester fees? Reach our hostel office.
            </p>
          </div>
        </div>
      </div>
      
      <main className="flex-grow py-16 bg-hotel-light-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-6">Get In Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="Enter your name" 
                      required 
                      className="border-gray-300 focus:border-hotel-gold focus:ring-hotel-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      onBlur={handleEmailBlur}
                      placeholder="Enter your email" 
                      required 
                      className={`border-gray-300 focus:border-hotel-gold focus:ring-hotel-gold ${emailError ? 'border-red-500' : ''}`}
                    />
                    {emailError && (
                      <p className="text-sm text-red-500">{emailError}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    placeholder="Enter message subject" 
                    required 
                    className="border-gray-300 focus:border-hotel-gold focus:ring-hotel-gold"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    placeholder="How can we help you?" 
                    rows={6} 
                    required 
                    className="border-gray-300 focus:border-hotel-gold focus:ring-hotel-gold"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-hotel-gold hover:bg-amber-600 text-white"
                  disabled={isSubmitting || !!emailError}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
            
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-6">Contact Information</h2>
              
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-hotel-gold/20 flex items-center justify-center text-hotel-gold mr-4">
                      <MapPin />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Our Location</h3>
                      <p className="text-gray-600">{HOSTEL_LOCATION}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-hotel-gold/20 flex items-center justify-center text-hotel-gold mr-4">
                      <Phone />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone Numbers</h3>
                      <p className="text-gray-600">WhatsApp/Call: {HOSTEL_PHONE}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-hotel-gold/20 flex items-center justify-center text-hotel-gold mr-4">
                      <Mail />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email Addresses</h3>
                      <p className="text-gray-600">Allocations: {HOSTEL_EMAIL}</p>
                      <p className="text-gray-600">General enquiries: {HOSTEL_EMAIL}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-hotel-gold/20 flex items-center justify-center text-hotel-gold mr-4">
                      <Clock />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Operating Hours</h3>
                      <p className="text-gray-600">Reception / Warden: 24/7</p>
                      <p className="text-gray-600">Meals: 6:30 AM - 9:00 PM</p>
                      <p className="text-gray-600">Office: Mon–Fri 8:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="h-64 bg-gray-200 rounded-lg overflow-hidden shadow-md">
                {/* In a real app, this would be a Google Map */}
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Google Map would be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
