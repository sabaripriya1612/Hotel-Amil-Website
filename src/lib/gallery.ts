export type GalleryItem = {
  id: string;
  src: string;
  title: string;
  description: string;
  category: "Rooms" | "Dining" | "Pool" | "Events" | "Hotel";
};

export const galleryItems: GalleryItem[] = [
  // Hotel Architecture & Grounds
  {
    id: "g1",
    src: "hotel-exterior",
    title: "Grand Entrance Avenue",
    description: "Welcoming facade along Tenkasi Main Road, Rajapalayam",
    category: "Hotel",
  },
  {
    id: "g2",
    src: "lobby",
    title: "Lobby & Reception",
    description: "Air-conditioned luxury reception lounge with 24/7 concierge",
    category: "Hotel",
  },
  {
    id: "g3",
    src: "hotel-front-pool",
    title: "Poolside Hotel Facade",
    description: "Panoramic view of hotel premises and swimming pool",
    category: "Hotel",
  },
  {
    id: "g4",
    src: "hotel-night-entrance",
    title: "Illuminated Night Gateway",
    description: "Grand night lighting welcoming late-night travellers",
    category: "Hotel",
  },

  // Rooms & Suites
  {
    id: "g5",
    src: "deluxe-room",
    title: "Deluxe King Room",
    description: "Plush king bed, hill-view balcony, smart TV and work desk",
    category: "Rooms",
  },
  {
    id: "g6",
    src: "executive-double-room",
    title: "Executive Double Room",
    description: "Spacious luxury room curated for couples and business executives",
    category: "Rooms",
  },
  {
    id: "g7",
    src: "family-room",
    title: "Family Suite",
    description: "Generous multi-bed layout accommodating up to 4 guests with ease",
    category: "Rooms",
  },
  {
    id: "g8",
    src: "executive-single-room",
    title: "Executive Single Room",
    description: "Quiet and comfortable haven tailored for solo travellers",
    category: "Rooms",
  },
  {
    id: "g9",
    src: "room-bathroom",
    title: "Modern En-Suite Bathroom",
    description: "Sparkling clean bath with hot/cold shower and luxury toiletries",
    category: "Rooms",
  },

  // Dining & Bars
  {
    id: "g10",
    src: "restaurant",
    title: "Saffron Manor Restaurant",
    description: "Multi-cuisine fine dining serving Chettinad, Indian & Continental",
    category: "Dining",
  },
  {
    id: "g11",
    src: "restaurant-buffet",
    title: "Buffet & Breakfast Counter",
    description: "Complimentary South Indian breakfast spread with freshly made dosas",
    category: "Dining",
  },
  {
    id: "g12",
    src: "cafe",
    title: "Amil 24/7 Cafe",
    description: "Artisan filter coffee, fresh teas, snacks and confectionery",
    category: "Dining",
  },
  {
    id: "g13",
    src: "kings-bar",
    title: "Kings Bar Lounge",
    description: "Premium cocktail lounge with draught beer and ambient music",
    category: "Dining",
  },
  {
    id: "g14",
    src: "bar-cocktails",
    title: "Signature Beverages",
    description: "Curated spirits, imported wine selection and fresh mocktails",
    category: "Dining",
  },

  // Swimming Pool & Recreation
  {
    id: "g15",
    src: "pool",
    title: "Crystal Azure Pool",
    description: "Pristine, temperature-regulated pool with separate kids shallow zone",
    category: "Pool",
  },
  {
    id: "g16",
    src: "pool-deck",
    title: "Sun Deck & Loungers",
    description: "Relax poolside under the shade of tropical palm trees",
    category: "Pool",
  },
  {
    id: "g17",
    src: "pool-night",
    title: "Evening Ambient Swim",
    description: "Mood underwater illumination for serene late-afternoon dips",
    category: "Pool",
  },

  // Banquets & Events
  {
    id: "g18",
    src: "banquet",
    title: "Grand Banquet Hall",
    description: "Opulent hall accommodating 150+ guests for weddings & receptions",
    category: "Events",
  },
  {
    id: "g19",
    src: "grand-hall",
    title: "Celebration Stage & Dining",
    description: "Custom lighting, audiovisual setup and catering stations",
    category: "Events",
  },
  {
    id: "g20",
    src: "conference",
    title: "Executive Conference Hall",
    description: "High-speed Wi-Fi, projector setup and corporate seating",
    category: "Events",
  },
];

export const galleryCategories = ["All", "Hotel", "Rooms", "Dining", "Pool", "Events"] as const;