
export interface Room {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  capacity: number;
  size: number;
  breakfast: boolean;
  pets: boolean;
  featured: boolean;
  type: string;
  amenities: string[];
}

export const rooms: Room[] = [
  {
    id: 1,
    name: "Deluxe Dorm Bed",
    description: "Comfortable bed in our spacious 6-bed dormitory with modern amenities and secure lockers.",
    price: 2500,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80"
    ],
    capacity: 1,
    size: 4,
    breakfast: true,
    pets: false,
    featured: true,
    type: "Dormitory",
    amenities: ["Personal Light", "Power Socket", "Locker", "AC", "Shared Bathroom", "Fresh Linens"]
  },
  {
    id: 2,
    name: "Private Single Room",
    description: "Cozy private room perfect for solo travelers seeking privacy and comfort.",
    price: 5000,
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1631049421450-348ccd7f8949?auto=format&fit=crop&q=80"
    ],
    capacity: 1,
    size: 12,
    breakfast: true,
    pets: true,
    featured: true,
    type: "Private Room",
    amenities: ["Private Bathroom", "AC", "TV", "Desk", "Wardrobe", "Free WiFi"]
  },
  {
    id: 3,
    name: "Twin Room",
    description: "Spacious room with two single beds, perfect for friends or family members traveling together.",
    price: 7500,
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595576508985-7d6d6e0d7f8f?auto=format&fit=crop&q=80"
    ],
    capacity: 2,
    size: 18,
    breakfast: true,
    pets: true,
    featured: true,
    type: "Private Room",
    amenities: ["Twin Beds", "Private Bathroom", "AC", "TV", "Mini Fridge", "Balcony"]
  },
  {
    id: 4,
    name: "Family Room",
    description: "Comfortable room designed for families, featuring a double bed and two single beds.",
    price: 12000,
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80"
    ],
    capacity: 4,
    size: 25,
    breakfast: true,
    pets: false,
    featured: false,
    type: "Family Room",
    amenities: ["Multiple Beds", "Private Bathroom", "AC", "TV", "Mini Kitchen", "Sitting Area"]
  },
  {
    id: 5,
    name: "Superior Ocean View Room",
    description: "Luxurious room with breathtaking ocean views and modern amenities.",
    price: 15000,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80"
    ],
    capacity: 2,
    size: 30,
    breakfast: true,
    pets: false,
    featured: false,
    type: "Deluxe",
    amenities: ["Ocean View", "King Bed", "Private Balcony", "Mini Bar", "Room Service", "Smart TV"]
  },
  {
    id: 6,
    name: "Executive Suite",
    description: "Spacious suite with separate living area and premium amenities.",
    price: 18000,
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618773928141-d92b99e3b2d7?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618773928102-0b06c8f8d8b6?auto=format&fit=crop&q=80"
    ],
    capacity: 2,
    size: 45,
    breakfast: true,
    pets: true,
    featured: false,
    type: "Suite",
    amenities: ["Living Room", "Work Desk", "Premium Toiletries", "Coffee Machine", "Safe", "High-Speed WiFi"]
  },
  {
    id: 7,
    name: "Garden View Room",
    description: "Peaceful room overlooking our beautiful gardens.",
    price: 8000,
    images: [
      "https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598928506748-c733c7c4e3c9?auto=format&fit=crop&q=80"
    ],
    capacity: 2,
    size: 25,
    breakfast: true,
    pets: true,
    featured: false,
    type: "Standard",
    amenities: ["Garden View", "Queen Bed", "Work Space", "AC", "TV", "Private Bathroom"]
  },
  {
    id: 8,
    name: "Budget Single Room",
    description: "Affordable comfort for solo travelers.",
    price: 3500,
    images: [
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80"
    ],
    capacity: 1,
    size: 15,
    breakfast: false,
    pets: false,
    featured: false,
    type: "Budget",
    amenities: ["Single Bed", "Shared Bathroom", "Locker", "WiFi", "Fan", "Desk"]
  },
  {
    id: 9,
    name: "Luxury Penthouse Suite",
    description: "Ultimate luxury with panoramic views and premium services.",
    price: 25000,
    images: [
      "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590073844006-33379da8c179?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590073844629-3c5717396022?auto=format&fit=crop&q=80"
    ],
    capacity: 4,
    size: 80,
    breakfast: true,
    pets: true,
    featured: true,
    type: "Penthouse",
    amenities: ["Panoramic View", "Private Terrace", "Kitchen", "Jacuzzi", "Butler Service", "Premium Bar"]
  },
  {
    id: 10,
    name: "Quad Dormitory",
    description: "Shared room perfect for groups or social travelers.",
    price: 2000,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555854877-5c3d1c3c44de?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555854877-5940b3f44a6b?auto=format&fit=crop&q=80"
    ],
    capacity: 1,
    size: 40,
    breakfast: true,
    pets: false,
    featured: false,
    type: "Dormitory",
    amenities: ["Bunk Bed", "Shared Bathroom", "Locker", "Common Area", "WiFi", "Reading Light"]
  },
  {
    id: 11,
    name: "Deluxe Triple Room",
    description: "Comfortable room for three with modern amenities.",
    price: 9000,
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80"
    ],
    capacity: 3,
    size: 35,
    breakfast: true,
    pets: false,
    featured: false,
    type: "Deluxe",
    amenities: ["Three Single Beds", "Private Bathroom", "AC", "TV", "Mini Fridge", "Safe"]
  },
  {
    id: 12,
    name: "Honeymoon Suite",
    description: "Romantic suite perfect for couples and special occasions.",
    price: 20000,
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618773928141-d92b99e3b2d7?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618773928102-0b06c8f8d8b6?auto=format&fit=crop&q=80"
    ],
    capacity: 2,
    size: 40,
    breakfast: true,
    pets: false,
    featured: true,
    type: "Suite",
    amenities: ["King Bed", "Jacuzzi", "Champagne Service", "Ocean View", "Private Balcony", "Romantic Setup"]
  },
  {
    id: 13,
    name: "Female Dormitory",
    description: "Safe and comfortable female-only dormitory.",
    price: 2200,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555854877-5c3d1c3c44de?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555854877-5940b3f44a6b?auto=format&fit=crop&q=80"
    ],
    capacity: 1,
    size: 35,
    breakfast: true,
    pets: false,
    featured: false,
    type: "Dormitory",
    amenities: ["Female Only", "Secure Access", "Private Lockers", "Vanity Area", "Reading Light", "Shared Bathroom"]
  },
  {
    id: 14,
    name: "Business Room",
    description: "Perfect for business travelers with work facilities.",
    price: 8500,
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1631049421450-348ccd7f8949?auto=format&fit=crop&q=80"
    ],
    capacity: 1,
    size: 25,
    breakfast: true,
    pets: false,
    featured: false,
    type: "Business",
    amenities: ["Work Desk", "Ergonomic Chair", "High-Speed Internet", "Coffee Machine", "Iron", "Business Services"]
  },
  {
    id: 15,
    name: "Two-Bedroom Apartment",
    description: "Spacious apartment-style accommodation for families or groups.",
    price: 16000,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80"
    ],
    capacity: 4,
    size: 65,
    breakfast: true,
    pets: true,
    featured: false,
    type: "Apartment",
    amenities: ["Two Bedrooms", "Kitchen", "Living Room", "Dining Area", "Washer/Dryer", "Balcony"]
  },
  {
    id: 16,
    name: "Studio Apartment",
    description: "Compact and complete living space for extended stays.",
    price: 9500,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80"
    ],
    capacity: 2,
    size: 35,
    breakfast: false,
    pets: true,
    featured: false,
    type: "Studio",
    amenities: ["Kitchenette", "Queen Bed", "Dining Area", "Smart TV", "Work Space", "Storage"]
  },
  {
    id: 17,
    name: "Accessible Room",
    description: "Specially designed room with accessibility features.",
    price: 7500,
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595576508985-7d6d6e0d7f8f?auto=format&fit=crop&q=80"
    ],
    capacity: 2,
    size: 40,
    breakfast: true,
    pets: true,
    featured: false,
    type: "Accessible",
    amenities: ["Wheelchair Accessible", "Roll-in Shower", "Emergency Cords", "Wide Doorways", "Support Rails", "Low Bed"]
  },
  {
    id: 18,
    name: "Premium Ocean Suite",
    description: "Luxury suite with premium ocean views and exclusive amenities.",
    price: 22000,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80"
    ],
    capacity: 2,
    size: 55,
    breakfast: true,
    pets: false,
    featured: true,
    type: "Premium",
    amenities: ["Premium Ocean View", "Private Butler", "Luxury Spa Access", "Premium Bar", "VIP Services", "Club Access"]
  },
  {
    id: 19,
    name: "Economy Twin Room",
    description: "Affordable option with two single beds.",
    price: 5500,
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595576508985-7d6d6e0d7f8f?auto=format&fit=crop&q=80"
    ],
    capacity: 2,
    size: 22,
    breakfast: false,
    pets: false,
    featured: false,
    type: "Economy",
    amenities: ["Twin Beds", "Basic Amenities", "Fan", "TV", "Shared Bathroom", "WiFi"]
  },
  {
    id: 20,
    name: "Family Suite with Kitchen",
    description: "Perfect for families who want to prepare their own meals.",
    price: 14000,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80"
    ],
    capacity: 4,
    size: 60,
    breakfast: true,
    pets: true,
    featured: false,
    type: "Family",
    amenities: ["Full Kitchen", "Family Room", "Multiple Beds", "Kids Area", "Dining Table", "Laundry"]
  },
  {
    id: 21,
    name: "Luxury Poolside Room",
    description: "Direct access to the pool area with private terrace.",
    price: 16500,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80"
    ],
    capacity: 2,
    size: 35,
    breakfast: true,
    pets: false,
    featured: true,
    type: "Luxury",
    amenities: ["Pool Access", "Private Terrace", "Sun Loungers", "Mini Bar", "Rain Shower", "Pool View"]
  },
  {
    id: 22,
    name: "Mixed Dormitory",
    description: "Social atmosphere in our mixed gender dormitory.",
    price: 2000,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555854877-5c3d1c3c44de?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555854877-5940b3f44a6b?auto=format&fit=crop&q=80"
    ],
    capacity: 1,
    size: 45,
    breakfast: true,
    pets: false,
    featured: false,
    type: "Dormitory",
    amenities: ["Mixed Gender", "Lockers", "Common Area", "Shared Bathroom", "Reading Light", "WiFi"]
  },
  {
    id: 23,
    name: "Junior Suite",
    description: "Elegant suite with extra living space.",
    price: 13500,
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618773928141-d92b99e3b2d7?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618773928102-0b06c8f8d8b6?auto=format&fit=crop&q=80"
    ],
    capacity: 2,
    size: 40,
    breakfast: true,
    pets: true,
    featured: false,
    type: "Suite",
    amenities: ["Seating Area", "King Bed", "Work Desk", "Mini Bar", "Bathtub", "City View"]
  },
  {
    id: 24,
    name: "Standard Double Room",
    description: "Comfortable room with a double bed.",
    price: 6500,
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1631049421450-348ccd7f8949?auto=format&fit=crop&q=80"
    ],
    capacity: 2,
    size: 25,
    breakfast: true,
    pets: false,
    featured: false,
    type: "Standard",
    amenities: ["Double Bed", "Private Bathroom", "TV", "AC", "WiFi", "Desk"]
  },
  {
    id: 25,
    name: "Presidential Suite",
    description: "The ultimate in luxury and sophistication.",
    price: 35000,
    images: [
      "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590073844006-33379da8c179?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590073844629-3c5717396022?auto=format&fit=crop&q=80"
    ],
    capacity: 4,
    size: 100,
    breakfast: true,
    pets: true,
    featured: true,
    type: "Presidential",
    amenities: ["Multiple Rooms", "Private Chef", "Butler", "Meeting Room", "Private Bar", "Security Service"]
  },
  {
    id: 26,
    name: "Garden Suite",
    description: "Beautiful suite with direct garden access.",
    price: 12000,
    images: [
      "https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598928506748-c733c7c4e3c9?auto=format&fit=crop&q=80"
    ],
    capacity: 2,
    size: 45,
    breakfast: true,
    pets: true,
    featured: false,
    type: "Suite",
    amenities: ["Garden Access", "Patio", "Sunbeds", "Mini Kitchen", "Living Area", "Garden View"]
  },
  {
    id: 27,
    name: "Economy Single",
    description: "Budget-friendly room for solo travelers.",
    price: 3000,
    images: [
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80"
    ],
    capacity: 1,
    size: 15,
    breakfast: false,
    pets: false,
    featured: false,
    type: "Economy",
    amenities: ["Single Bed", "Basic Amenities", "Fan", "Shared Bathroom", "WiFi", "Storage"]
  },
  {
    id: 28,
    name: "Deluxe Family Room",
    description: "Spacious room designed for family comfort.",
    price: 13000,
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80"
    ],
    capacity: 5,
    size: 50,
    breakfast: true,
    pets: true,
    featured: false,
    type: "Family",
    amenities: ["Multiple Beds", "Family Bathroom", "Play Area", "TV", "Mini Fridge", "Extra Storage"]
  },
  {
    id: 29,
    name: "Ocean View Suite",
    description: "Luxurious suite with panoramic ocean views.",
    price: 19000,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80"
    ],
    capacity: 2,
    size: 60,
    breakfast: true,
    pets: false,
    featured: true,
    type: "Suite",
    amenities: ["Ocean View", "King Bed", "Private Balcony", "Luxury Bathroom", "Room Service", "Seating Area"]
  },
  {
    id: 30,
    name: "Deluxe Mountain View Room",
    description: "Elegant room with stunning mountain views and premium amenities.",
    price: 12500,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80"
    ],
    capacity: 2,
    size: 38,
    breakfast: true,
    pets: false,
    featured: false,
    type: "Deluxe",
    amenities: ["Mountain View", "Queen Bed", "Work Desk", "Premium Toiletries", "Mini Bar", "Coffee Machine"]
  }
];
