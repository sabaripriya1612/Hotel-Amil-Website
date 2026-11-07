export type RoomType =
  | "Family"
  | "Executive Single"
  | "Deluxe"
  | "Executive Double";

export type Room = {
  id: string;
  slug: string;
  name: string;
  type: RoomType;
  shortDescription: string;
  description: string;
  price: number; // per night, inclusive of tax (GST)
  gst: number; // included GST amount shown in price breakdown
  basePrice: number; // before GST
  extraPersonCharge: number; // per extra person per night
  maxGuests: number; // included persons (e.g., 2)
  maxExtraPersons: number; // +1
  totalRooms: number; // inventory count
  bed: string;
  size: string;
  view: string;
  images: string[];
  /**
   * Optional equirectangular 360° panorama for the spherical room viewer.
   * Drop the file into public/images/360/ — the 360° badge appears automatically.
   */
  panorama360?: string;
  amenities: string[];
  featured: boolean;
};

export const EXTRA_PERSON_CHARGE = 1050;

export const roomAmenities = [
  { name: "Hill View Private Balcony" },
  { name: "Air Conditioned" },
  { name: "Flat Screen TV" },
  { name: "Electric Kettle" },
  { name: "Refrigerator" },
  { name: "Private Safety Locker" },
  { name: "Excellent Room Comfort" },
  { name: "Extra Bed (On Request)" },
  { name: "Free WiFi" },
];

export const rooms: Room[] = [
  {
    id: "family-room",
    slug: "family-room",
    name: "Family Room",
    type: "Family",
    shortDescription:
      "Roomy family accommodation for up to 4 plus one extra person.",
    description:
      "The Family Room is designed for families with space for 4 persons plus 1 extra on request. Enjoy a relaxed stay with the whole family along with the hill view balcony and full amenities.",
    price: 7875,
    gst: 1201.27,
    basePrice: 6673.73,
    extraPersonCharge: EXTRA_PERSON_CHARGE,
    maxGuests: 4,
    maxExtraPersons: 1,
    totalRooms: 8,
    bed: "2 Beds (Double + Single)",
    size: "Family Suite",
    view: "Hill View",
    images: ["family1", "family2", "family3", "bath1", "bathroom2", "cuboard1"],
    panorama360: "/images/360/room-360.jpg",
    amenities: roomAmenities.map((a) => a.name),
    featured: true,
  },
  {
    id: "executive-single-room",
    slug: "executive-single-room",
    name: "Executive Single Room",
    type: "Executive Single",
    shortDescription:
      "Comfortable executive room for business travellers and solo guests.",
    description:
      "Our Executive Single Room offers a comfortable stay with a private hill view balcony and all modern amenities. Perfect for business travellers and solo guests visiting Rajapalayam.",
    price: 2625,
    gst: 281.25,
    basePrice: 2343.75,
    extraPersonCharge: EXTRA_PERSON_CHARGE,
    maxGuests: 2,
    maxExtraPersons: 1,
    totalRooms: 29,
    bed: "Single Bed",
    size: "One Room Suite",
    view: "Hill View",
    images: ["single1", "single2", "bath1", "cuboard1"],
    panorama360: "/images/360/Executivesingle360-room.png",
    amenities: roomAmenities.map((a) => a.name),
    featured: true,
  },
  {
    id: "deluxe-room",
    slug: "deluxe-room",
    name: "Deluxe Room",
    type: "Deluxe",
    shortDescription: "Premium comfort with a large bed and refined interiors.",
    description:
      "Our Deluxe Room offers a premium stay experience with superior furnishings, a comfortable bed and generous space. The perfect choice for those looking for extra comfort in Rajapalayam.",
    price: 4725,
    gst: 506.25,
    basePrice: 4218.75,
    extraPersonCharge: EXTRA_PERSON_CHARGE,
    maxGuests: 2,
    maxExtraPersons: 1,
    totalRooms: 12,
    bed: "King / Queen Bed",
    size: "Deluxe Suite",
    view: "Hill View",
    images: ["deluxe1", "deluxe2", "deluxe3", "cuboard1", "bath1"],
    panorama360: "/images/360/deluxe360-room.png",
    amenities: roomAmenities.map((a) => a.name),
    featured: true,
  },
  {
    id: "executive-double-room",
    slug: "executive-double-room",
    name: "Executive Double Room",
    type: "Executive Double",
    shortDescription:
      "Spacious room with a double bed for couples and small families.",
    description:
      "The Executive Double Room features a comfortable double bed and ample space for couples or colleagues travelling together. Enjoy the hill view from your private balcony.",
    price: 3675,
    gst: 393.75,
    basePrice: 3281.25,
    extraPersonCharge: EXTRA_PERSON_CHARGE,
    maxGuests: 2,
    maxExtraPersons: 1,
    totalRooms: 29,
    bed: "Double Bed",
    size: "One Room Suite",
    view: "Hill View",
    images: ["double1", "double2", "cuboard1"],
    panorama360: "/images/360/Executivedouble360-room.png",
    amenities: roomAmenities.map((a) => a.name),
    featured: true,
  },
];

export const roomCategories = [
  { id: "family", name: "Family", description: "Space for the whole family" },
  { id: "executive-single", name: "Executive Single", description: "Comfort for solo travellers" },
  { id: "deluxe", name: "Deluxe", description: "Premium comfort" },
  { id: "executive-double", name: "Executive Double", description: "Spacious comfort for couples" },
] as const;

export function getRoomBySlug(slug: string): Room | undefined {
  return rooms.find((room) => room.slug === slug);
}

export function getRoomById(id: string): Room | undefined {
  return rooms.find((room) => room.id === id);
}

export function formatPrice(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}