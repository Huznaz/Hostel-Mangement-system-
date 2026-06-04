import { unsplashPhoto } from "@/utils/unsplash";

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
  block?: string;
}

/** Verified Unsplash bedroom/dorm photos (webp, width-limited for fast loads). */
const img = (photoId: string) => unsplashPhoto(photoId);

export const rooms: Room[] = [
  {
    id: 1,
    name: 'Block A — 6-Bed Dorm',
    description: 'Shared dormitory with individual bed, locker, study lamp, and shared bathroom. Ideal for budget-conscious students.',
    price: 4500,
    images: [
      img('photo-1555854877-bab0e564b8d5'),
      img('photo-1590490359683-658d3d23f972'),
    ],
    capacity: 1,
    size: 18,
    breakfast: true,
    pets: false,
    featured: true,
    type: 'Dormitory',
    block: 'Block A',
    amenities: ['Personal Locker', 'Study Desk', 'WiFi', 'Shared Bathroom', '24/7 Security', 'Laundry Access'],
  },
  {
    id: 2,
    name: 'Block B — 4-Bed Dorm',
    description: 'Smaller dorm wing with fewer beds per room, quieter environment, and the same core student amenities.',
    price: 5500,
    images: [
      img('photo-1522771739844-6a9f6d5f14af'),
      img('photo-1555854877-bab0e564b8d5'),
    ],
    capacity: 1,
    size: 16,
    breakfast: true,
    pets: false,
    featured: true,
    type: 'Dormitory',
    block: 'Block B',
    amenities: ['Locker', 'Power Outlet', 'WiFi', 'Shared Bathroom', 'Common Kitchen', 'Night Security'],
  },
  {
    id: 3,
    name: 'Female-Only Dorm — Block C',
    description: 'Secure female-only dormitory with dedicated warden, restricted access, and study-friendly layout.',
    price: 5000,
    images: [
      img('photo-1522771739844-6a9f6d5f14af'),
      img('photo-1590490359683-658d3d23f972'),
    ],
    capacity: 1,
    size: 17,
    breakfast: true,
    pets: false,
    featured: true,
    type: 'Female Dorm',
    block: 'Block C',
    amenities: ['Female-Only Wing', 'Locker', 'WiFi', 'Shared Bathroom', 'Study Area', 'Warden on Duty'],
  },
  {
    id: 4,
    name: 'Twin Sharing Room',
    description: 'Two students share one room with twin beds, wardrobe space, and a dedicated study corner.',
    price: 7500,
    images: [
      img('photo-1595576508898-0ad5c879a061'),
      img('photo-1631049307264-da0ec9d70304'),
    ],
    capacity: 2,
    size: 14,
    breakfast: true,
    pets: true,
    featured: true,
    type: 'Shared Room',
    block: 'Block D',
    amenities: ['Twin Beds', 'Private Bathroom', 'Desk per Bed', 'WiFi', 'Wardrobe', 'Meals Plan'],
  },
  {
    id: 5,
    name: 'Private Single Room',
    description: 'Private room for one student who needs quiet study time and more personal space.',
    price: 9500,
    images: [
      img('photo-1631049307264-da0ec9d70304'),
      img('photo-1631049552057-403cdb8f0658'),
    ],
    capacity: 1,
    size: 12,
    breakfast: true,
    pets: true,
    featured: true,
    type: 'Private Room',
    block: 'Block E',
    amenities: ['Single Bed', 'Private Bathroom', 'Study Desk', 'WiFi', 'Wardrobe', 'Meals Plan'],
  },
  {
    id: 6,
    name: 'Study Suite — Private',
    description: 'Premium private room with extended desk space, bookshelf, and high-speed WiFi for research students.',
    price: 11000,
    images: [
      img('photo-1618773928121-c32242e63f39'),
      img('photo-1631049421450-348ccd7f8949'),
    ],
    capacity: 1,
    size: 15,
    breakfast: true,
    pets: true,
    featured: false,
    type: 'Private Room',
    block: 'Block E',
    amenities: ['Large Study Desk', 'Bookshelf', 'Private Bathroom', 'WiFi', 'AC', 'Meals Plan'],
  },
  {
    id: 7,
    name: 'Postgraduate Room',
    description: 'Quiet floor allocation for postgraduate students with flexible check-in and extended library hours access.',
    price: 10500,
    images: [
      img('photo-1505693416388-ac5ce068fe85'),
      img('photo-1631049307264-da0ec9d70304'),
    ],
    capacity: 1,
    size: 13,
    breakfast: false,
    pets: true,
    featured: false,
    type: 'Private Room',
    block: 'PG Wing',
    amenities: ['Quiet Floor', 'Private Bathroom', 'WiFi', 'Extended Access', 'Desk', 'Kitchenette'],
  },
  {
    id: 8,
    name: 'Accessible Room',
    description: 'Ground-floor room designed for students with mobility needs, with ramp access and adapted bathroom.',
    price: 8500,
    images: [
      img('photo-1578683010236-d716f9a3f461'),
      img('photo-1595576508898-0ad5c879a061'),
    ],
    capacity: 1,
    size: 14,
    breakfast: true,
    pets: true,
    featured: false,
    type: 'Accessible',
    block: 'Ground Floor',
    amenities: ['Ramp Access', 'Adapted Bathroom', 'WiFi', 'Ground Floor', 'Warden Support', 'Desk'],
  },
  {
    id: 9,
    name: 'International Students Wing',
    description: 'Dedicated wing for international students with orientation support and flexible semester billing.',
    price: 12000,
    images: [
      img('photo-1582719478250-c89cae4dc85b'),
      img('photo-1582719471384-894fbb16e074'),
    ],
    capacity: 1,
    size: 14,
    breakfast: true,
    pets: true,
    featured: false,
    type: 'Private Room',
    block: 'Intl Wing',
    amenities: ['Private Bathroom', 'WiFi', 'Orientation Desk', 'Meals Plan', 'Laundry', '24/7 Security'],
  },
  {
    id: 10,
    name: 'Short-Term Semester Bed',
    description: 'Flexible allocation for exchange students or short semester stays in a 8-bed dorm section.',
    price: 6000,
    images: [
      img('photo-1555854877-bab0e564b8d5'),
      img('photo-1522771739844-6a9f6d5f14af'),
    ],
    capacity: 1,
    size: 20,
    breakfast: false,
    pets: false,
    featured: false,
    type: 'Dormitory',
    block: 'Exchange Block',
    amenities: ['Locker', 'WiFi', 'Shared Bathroom', 'Flexible Dates', 'Common Room', 'Security'],
  },
];

export const PRICE_MIN = 4500;
export const PRICE_MAX = 12000;
