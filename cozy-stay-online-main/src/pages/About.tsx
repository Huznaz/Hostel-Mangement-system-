
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Map from '@/components/Map';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-hotel-beige py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">About ZamZam</h1>
            <div className="w-24 h-1 bg-hotel-gold mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Learn about our story, mission, and the team behind your perfect stay
            </p>
          </div>
        </div>
      </div>
      
      <main className="flex-grow">
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Founded with a vision to provide comfortable and affordable accommodation in Nairobi, ZamZam began as a small hostel that quickly grew into a beloved destination for travelers from all corners of the world.
                </p>
                <p className="text-gray-600 mb-4">
                  Our commitment to exceptional hospitality and creating a welcoming environment has made us a preferred choice for both local and international guests looking for a memorable stay in Nairobi.
                </p>
                <p className="text-gray-600">
                  Today, ZamZam continues to grow while maintaining its core values of affordability, comfort, and genuine Kenyan hospitality.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80" 
                  alt="ZamZam Hostel" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-4">Meet Our Team</h2>
              <div className="w-24 h-1 bg-hotel-gold mx-auto mb-6"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80" 
                    alt="Sarah Kimani" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-serif font-semibold">Sarah Kimani</h3>
                <p className="text-hotel-gold mb-2">General Manager</p>
                <p className="text-gray-600 text-sm">
                  Leading our team with dedication and excellence.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80" 
                    alt="James Omondi" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-serif font-semibold">James Omondi</h3>
                <p className="text-hotel-gold mb-2">Guest Relations</p>
                <p className="text-gray-600 text-sm">
                  Ensuring every guest feels welcomed and valued.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80" 
                    alt="Lucy Wanjiku" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-serif font-semibold">Lucy Wanjiku</h3>
                <p className="text-hotel-gold mb-2">Housekeeping Manager</p>
                <p className="text-gray-600 text-sm">
                  Maintaining our high standards of comfort and cleanliness.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 rounded-full overflow-hidden w-40 h-40 mx-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80" 
                    alt="David Mutua" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-serif font-semibold">David Mutua</h3>
                <p className="text-hotel-gold mb-2">Security Manager</p>
                <p className="text-gray-600 text-sm">
                  Ensuring the safety and security of our guests.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-hotel-light-beige">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-4">Find Us</h2>
              <div className="w-24 h-1 bg-hotel-gold mx-auto mb-6"></div>
            </div>
            <div className="h-[500px] rounded-lg overflow-hidden shadow-lg">
              <Map />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
