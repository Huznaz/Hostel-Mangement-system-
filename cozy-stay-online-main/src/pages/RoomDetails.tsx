
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoomDetail from '@/components/rooms/RoomDetail';

const RoomDetails = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-hotel-beige py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-center">Room Details</h1>
          <div className="w-24 h-1 bg-hotel-gold mx-auto mt-4"></div>
        </div>
      </div>
      
      <main className="flex-grow py-12 bg-hotel-light-beige">
        <RoomDetail />
      </main>
      
      <Footer />
    </div>
  );
};

export default RoomDetails;
