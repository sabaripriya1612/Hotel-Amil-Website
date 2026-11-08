export const brandLogo = "/images/logo1.png";

/**
 * Maps the semantic image keys used across the site (rooms, facilities,
 * gallery, blog, hero) to the authentic Hotel Amil photographs shipped in /public/images.
 */
export const imageCatalog: Record<string, string> = {
  // Hotel Exterior & Entrance
  "hotel-exterior": "/images/enter.png",
  "hotel-entrance": "/images/enter.png",
  "hotel-entrance-2": "/images/enter2.png",
  "hotel-night-entrance": "/images/nightenter.png",
  "hotel-front-pool": "/images/frontimpoo.jpeg",
  "hotel-facade": "/images/front1.jpeg",
  "hotel-grounds": "/images/front2.jpeg",
  "hotel-landscape": "/images/front3.jpeg",

  // Lobby & Reception
  lobby: "/images/loby.png",
  loby: "/images/loby.png",
  reception: "/images/reeception.png",
  reeception: "/images/reeception.png",

  // Rooms & Suites
  "executive-single-room": "/images/single1.jpeg",
  "executive-single-room-2": "/images/single2.jpeg",
  "executive-single-room-3": "/images/single3.jpeg",
  "executive-single-room-4": "/images/single4.jpeg",
  "executive-double-room": "/images/double1.jpeg",
  "executive-double-room-2": "/images/double2.jpeg",
  "executive-double-room-3": "/images/double3.jpeg",
  "executive-double-room-4": "/images/double4.jpeg",
  "deluxe-room": "/images/deluxe1.jpeg",
  "deluxe-room-2": "/images/deluxe2.jpeg",
  "deluxe-room-3": "/images/deluxe3.jpeg",
  "family-room": "/images/family1.jpeg",
  "family-room-2": "/images/family2.jpeg",
  "family-room-3": "/images/family3.jpeg",

  // Direct room image filename aliases
  family1: "/images/family1.jpeg",
  family2: "/images/family2.jpeg",
  family3: "/images/family3.jpeg",
  single1: "/images/single1.jpeg",
  single2: "/images/single2.jpeg",
  deluxe1: "/images/deluxe1.jpeg",
  deluxe2: "/images/deluxe2.jpeg",
  deluxe3: "/images/deluxe3.jpeg",
  double1: "/images/double1.jpeg",
  double2: "/images/double2.jpeg",
  bath1: "/images/bath1.jpeg",
  bath: "/images/bath1.jpeg",
  bathroom2: "/images/bathroom2.jpeg",
  cuboard1: "/images/cuboard1.jpeg",
  cuboard: "/images/cuboard1.jpeg",

  // 360 Panorama keys
  "room-360": "/images/360/room-360.jpg",
  "Exclusivesingle360-room": "/images/360/Executivesingle360-room.png",
  "Executivesingle360-room": "/images/360/Executivesingle360-room.png",
  "deluxe360-room": "/images/360/deluxe360-room.png",
  "Executivedouble360-room": "/images/360/Executivedouble360-room.png",
  "executivedouble360-room": "/images/360/Executivedouble360-room.png",
  "executive-double-360": "/images/360/Executivedouble360-room.png",

  // Room Amenities & Details
  "room-bathroom": "/images/bath1.jpeg",
  "room-bathroom-2": "/images/bathroom2.jpeg",
  "room-wardrobe": "/images/cuboard1.jpeg",

  // Dining & Lounge
  restaurant: "/images/reest.png",
  "restaurant-buffet": "/images/restaa.png",
  "restaurant-dining": "/images/restt2.png",
  catering: "/images/restaa.png",
  "outdoor-catering": "/images/restaa.png",
  cafe: "/images/cafe.png",
  "amil-cafe": "/images/cafe.png",
  "kings-bar": "/images/bar1.png",
  "bar-lounge": "/images/barimg2.png",
  "bar-cocktails": "/images/barimg3.png",
  "bar-counter": "/images/barimg4.png",
  "bar-ambience": "/images/bar5.jpeg",

  // Swimming Pool & Garden
  pool: "/images/swim1.png",
  "pool-deck": "/images/dayswim1.png",
  "pool-sunlight": "/images/dayswim2.png",
  "pool-palm": "/images/swdaytree.png",
  "pool-lush": "/images/swtree.png",
  "pool-night": "/images/n8swim1.png",
  "pool-night-lights": "/images/n8swim1.png",
  "pool-dusk": "/images/dimswim.png",
  "pool-lap": "/images/swim2.png",
  "pool-side": "/images/sswim.jpeg",

  // Banquets, Halls & Events
  banquet: "/images/banhoot.png",
  "banquet-stage": "/images/banhoot2.png",
  "grand-hall": "/images/hall.png",
  "haal": "/images/haal.jpg",
  "hall2": "/images/hall2.jpg",
  "halll": "/images/halll.jpg",
  conference: "/images/mainhall4.jpeg",
  "meeting-hall": "/images/mainhall2.jpeg",
  "event-hall": "/images/mainhall1.jpeg",
  "party-hall": "/images/partyhall1.jpeg",
  "party-hall-2": "/images/partyhall2.jpeg",
  celebrations: "/images/celebration1.jpeg",
  celebration1: "/images/celebration1.jpeg",
  celebration2: "/images/celebration2.jpeg",
  celebration3: "/images/celebration3.jpeg",
  celebration4: "/images/celebration4.jpeg",

  // Parking & Transportation
  parking: "/images/parking.jpeg",
  "parking-driveway": "/images/car-parking.png",
  "car-parking": "/images/car-parking.png",
  "car 2": "/images/car 2.png",
  "cafe-bathroom": "/images/cafe bathroom.jpeg",

  // Hero & Fallbacks
  hero: "/images/fronthero.jpeg",

  // Attractions & Nearby Heritage
  "blog-temple": "/images/andaal.png",
  "blog-falls": "/images/ayyanarkovil.png",
  "blog-family": "/images/family1.jpeg",
  "blog-events": "/images/partyladu.jpeg",
  temple: "/images/andaal.png",
  "temple-2": "/images/andaal.png",
  "temple-3": "/images/sankarankovil1.png",
  "temple-4": "/images/thirumalai1.png",
  falls: "/images/ayyanarkovil.png",
  "andal-temple": "/images/andaal.png",
  "ayyanar-kovil": "/images/ayyanarkovil.png",
  "rakachi-amman": "/images/rakashi amman kovil.png",
  thirumalai: "/images/thirumalai1.png",
  kalugumalai: "/images/kalugumalai.png",
  sankarankovil: "/images/sankarankovil1.png",
  kasi: "/images/kasi1.png",
  "1": "/images/1.png",
};

/** High-resolution photos used by the rotating home hero slider in exact user order:
 * 1. day front, 2. loby, 3. reest, 4. reeception, 5. deluxe2, 6. hall, 7. 1, 8. day night */
export const photoSlides = [
  {
    src: "/images/day front.png",
    alt: "Hotel Amil Front View - Daylight",
    title: "Luxury Beyond Expectations",
    subtitle: "A 3-Star sanctuary along Tenkasi Main Road, Rajapalayam",
  },
  {
    src: "/images/loby.png",
    alt: "Hotel Amil Grand Lobby",
    title: "Warm Hospitality & Grand Lobby",
    subtitle: "Welcoming spaces designed for your comfort and relaxation",
  },
  {
    src: "/images/reest.png",
    alt: "Saffron Restaurant Multi-Cuisine Fine Dining",
    title: "Exquisite Culinary Delights",
    subtitle: "Authentic Chettinad, North Indian, Tandoori & Continental cuisine",
  },
  {
    src: "/images/reeception.png",
    alt: "Hotel Amil Front Desk & Reception",
    title: "24/7 Front Desk & Concierge",
    subtitle: "Prompt, attentive service to assist you throughout your stay",
  },
  {
    src: "/images/deluxe2.jpeg",
    alt: "Hotel Amil Premium Deluxe Room",
    title: "Refined Luxury Accommodations",
    subtitle: "Air-conditioned rooms with scenic balcony views and complimentary breakfast",
  },
  {
    src: "/images/hall.png",
    alt: "Hotel Amil Banquet & Event Hall",
    title: "Elegant Event Spaces",
    subtitle: "150+ seating capacity with bespoke stage decor and banquet arrangements",
  },
  {
    src: "/images/1.png",
    alt: "Hotel Amil Premier Experience",
    title: "Contemporary Elegance & Comfort",
    subtitle: "Excellence in every detail of your stay at Rajapalayam",
  },
  {
    src: "/images/day night.png",
    alt: "Hotel Amil Evening & Night Ambience",
    title: "Serene Evening Ambience",
    subtitle: "Illuminated luxury, comfortable stays & personalized hospitality",
  },
];

/** Maps each facility slug to curated, authentic photos for detail pages and carousels. */
export const facilitySlides: Record<string, string[]> = {
  "saffron-manor-restaurant": [
    "/images/reest.png",
    "/images/restaa.png",
    "/images/restt2.png",
  ],
  "amil-cafe": [
    "/images/cafe.png",
    "/images/cafe bathroom.jpeg",
  ],
  "outdoor-catering": [
    "/images/restaa.png",
    "/images/reest.png",
    "/images/restt2.png",
  ],
  "kings-bar": [
    "/images/bar1.png",
    "/images/barimg2.png",
    "/images/barimg3.png",
    "/images/barimg4.png",
    "/images/bar5.jpeg",
    "/images/bar6.jpeg",
  ],
  "swimming-pool": [
    "/images/swim1.png",
    "/images/dayswim1.png",
    "/images/dayswim2.png",
    "/images/swdaytree.png",
    "/images/swtree.png",
    "/images/n8swim1.png",
    "/images/dimswim.png",
    "/images/swim2.png",
  ],
  "banquet-hall": [
    "/images/hall.png",
    "/images/banhoot.png",
    "/images/banhoot2.png",
    "/images/hall2.png",
    "/images/haal.jpg",
    "/images/hall2.jpg",
    "/images/halll.jpg",
  ],
  "conference-hall": [
    "/images/mainhall4.jpeg",
    "/images/mainhall2.jpeg",
    "/images/hall.png",
  ],
  celebrations: [
    "/images/celebration1.jpeg",
    "/images/celebration2.jpeg",
    "/images/celebration3.jpeg",
    "/images/celebration4.jpeg",
  ],
  "reception-events": [
    "/images/celebration1.jpeg",
    "/images/celebration2.jpeg",
    "/images/celebration3.jpeg",
    "/images/celebration4.jpeg",
  ],
  "car-parking": [
    "/images/car-parking.png",
    "/images/car 2.png",
    "/images/parking.jpeg",
  ],
};

export function resolveImage(name: string): string | undefined {
  if (name.startsWith("/") || name.startsWith("http")) {
    return name;
  }
  return imageCatalog[name];
}