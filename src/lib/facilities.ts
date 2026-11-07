export type Facility = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  details: { label: string; value: string }[];
  highlights: string[];
  policies?: string[];
  ctaLabel: string;
};

export const facilities: Facility[] = [
  {
    id: "saffron-manor-restaurant",
    slug: "saffron-manor-restaurant",
    name: "Saffron Restaurant",
    tagline: "Multi-cuisine fine dining in Rajapalayam",
    description:
      "Saffron Restaurant is a multi cuisine restaurant for fine dining in Rajapalayam. It serves world popular food items, North Indian & South Indian food created carefully to satisfy your taste. Air conditioned with good ambiance dining hall is the best place in Rajapalayam to relish good food with your family and friends. Saffron Restaurant also caters buffet for events and meetings.",
    image: "restaurant",
    details: [
      { label: "Cuisine", value: "Multi-cuisine (North & South Indian, Tandoori, Continental)" },
      { label: "Breakfast", value: "7:30 AM – 10:30 AM (CP Plan Buffet 7:30 – 9:30 AM)" },
      { label: "Lunch", value: "12:00 PM – 3:30 PM (South Indian Meals, Biryanis & A la Carte)" },
      { label: "Dinner", value: "7:00 PM – 11:00 PM (Tandoori Grills, Curries & Breads)" },
      { label: "Dining Ambience", value: "Air-conditioned luxury fine dining hall" },
      { label: "Buffet & Catering", value: "Available for meetings, parties & events" },
    ],
    highlights: ["Fine dining", "Buffet for events", "Air conditioned", "Family friendly"],
    ctaLabel: "Table Reservation",
  },
  {
    id: "amil-cafe",
    slug: "amil-cafe",
    name: "Amil Cafe",
    tagline: "Coffee, tea & snacks — day and night",
    description:
      "Amil Cafe keeps the energy going around the clock. Enjoy fresh coffee, tea and light snacks at any hour. The cafe features a clean and comfortable seating area with neat washrooms available for both men and women.",
    image: "cafe",
    details: [
      { label: "Timing", value: "Open 24/7" },
      { label: "Menu", value: "Coffee, tea & snacks" },
      { label: "Restrooms", value: "Neat washrooms for men & women" },
    ],
    highlights: ["Open 24/7", "Fresh coffee & tea", "Snacks", "Clean restrooms"],
    ctaLabel: "Visit Amil Cafe",
  },
  {
    id: "kings-bar",
    slug: "kings-bar",
    name: "Kings Bar",
    tagline: "The best bar in Rajapalayam",
    description:
      "A large floor, cool music, superb seating and lighting arrangements make Kings Bar the best bar in Rajapalayam. Host private cocktail parties and celebrations with us in a stylish and lively setting.",
    image: "kings-bar",
    details: [
      { label: "Timing", value: "11:00 AM – 12:00 AM" },
      { label: "Age Restriction", value: "Below 21 not allowed" },
      { label: "Private Events", value: "Cocktail parties & celebrations" },
    ],
    highlights: ["Private cocktail parties", "Celebrations", "Music & lighting", "Fine spirits & draughts"],
    policies: [
      "Below 21 years are not allowed.",
      "Outside liquor is not allowed.",
      "Valid ID required for entry.",
    ],
    ctaLabel: "Plan a Celebration",
  },
  {
    id: "swimming-pool",
    slug: "swimming-pool",
    name: "Swimming Pool",
    tagline: "Relax in the outdoor pool (Daytime & Night with Prior Notice)",
    description:
      "Relax in the crystal-clear outdoor swimming pool during your stay at Hotel Amil, Rajapalayam. The pool is open for daytime swimming, and night-time swimming is also allowed provided guests inform hotel management/front desk previously. Wi-Fi is available around the pool area.",
    image: "pool",
    details: [
      { label: "Timing", value: "7:00 AM – 6:30 PM (Daytime)" },
      { label: "Night Access", value: "Allowed (Prior notice to management required)" },
      { label: "Wi-Fi", value: "Available around the pool" },
      { label: "Access", value: "For resident hotel guests" },
    ],
    highlights: ["Daytime swimming", "Night swimming allowed (inform previously)", "Wi-Fi available", "Refreshing outdoor pool"],
    policies: [
      "Night-time swimming is allowed only when guests inform hotel management/reception in advance.",
      "All bathers must take a cleansing shower before entering the pool.",
      "A swimmer leaving the swimming area to use the toilet must take a second cleansing shower before returning.",
      "No unsupervised small children allowed in the pool or pool area.",
      "Persons who appear to be under the influence of alcohol or drugs will be denied admission.",
      "Food, drink, gum and tobacco are prohibited except in designated areas.",
      "Swimmers must wear appropriate swimming attire.",
      "Soap, shampoo, oil, body wash inside the swimming pool strictly prohibited.",
      "All infants and anyone not toilet trained must wear leak-free swim pants while in the pool.",
      "Children are prohibited from using the pool without an adult in attendance.",
      "Bathers are required to take a cleansing shower using warm water before entering the pool and before returning to the pool following use of the toilet.",
      "No food, drink, bottles or wrappers are permitted in the immediate area of the swimming pool or on the decks surrounding the pool.",
      "No running, boisterous or rough play.",
    ],
    ctaLabel: "See Pool Photos",
  },
  {
    id: "banquet-hall",
    slug: "banquet-hall",
    name: "Banquet Hall",
    tagline: "Grand hall for weddings & large events",
    description:
      "Our fully air-conditioned banquet hall accommodates working professionals with a seating capacity of 128 to 150. With ample car parking and buffet options it is the best venue in Rajapalayam for corporate meetings and family events.",
    image: "banquet",
    details: [
      { label: "Capacity", value: "128–150 seats" },
      { label: "Ideal For", value: "Working professionals, weddings, functions" },
      { label: "Parking", value: "Ample free parking" },
    ],
    highlights: ["128–150 seats", "Corporate meetings", "Family events", "Buffet options"],
    policies: [
      "No food, liquor or soft drinks allowed inside the hall.",
      "Food & beverages must be arranged through the hotel.",
    ],
    ctaLabel: "Enquire for an Event",
  },
  {
    id: "conference-hall",
    slug: "conference-hall",
    name: "Conference Hall",
    tagline: "Corporate & celebration venue",
    description:
      "Our Conference Hall is perfect for corporate meetings, birthdays, baby showers and surprise parties. Decorate with your own background themes and host an event that everyone remembers.",
    image: "conference",
    details: [
      { label: "Events", value: "Corporate · Birthday · Baby Shower · Surprise Party" },
      { label: "Setup", value: "Background / theme images on request" },
      { label: "Capacity", value: "Ideal for meetings & parties" },
    ],
    highlights: ["Corporate events", "Birthday parties", "Baby showers", "Surprise parties"],
    ctaLabel: "Book the Conference Hall",
  },
  {
    id: "celebrations",
    slug: "celebrations",
    name: "Celebrations & Parties",
    tagline: "Surprise birthdays, anniversaries & milestones",
    description:
      "Celebrate life's happiest moments at Hotel Amil in Rajapalayam! From magical surprise birthday parties and milestone anniversaries to festive family gatherings, baby showers, and intimate social events, our dedicated team takes care of custom theme decorations, personalized backdrops, balloon styling, lighting, music, and mouth-watering multi-cuisine catering so you can celebrate worry-free.",
    image: "celebration1",
    details: [
      { label: "Occasions", value: "Surprise Birthday Party · Anniversary · Milestone" },
      { label: "Theme Decor", value: "Custom balloon arches, backdrop themes & lighting on request" },
      { label: "Cake & Catering", value: "Special cake arrangements & delicious multi-cuisine buffet" },
      { label: "Support", value: "Dedicated party coordinator, sound system & photo areas" },
    ],
    highlights: [
      "Surprise birthday parties",
      "Anniversary celebrations",
      "Custom theme backdrops",
      "Bespoke catering & cake setup",
    ],
    policies: [
      "Advance booking recommended to arrange personalized party themes and balloon decor.",
      "Custom backdrop themes, balloon arches, and ambient lighting arranged on request.",
      "Dedicated assistance for surprise entries, cake-cutting ceremonies, and photo moments.",
      "Multi-cuisine buffet and snack counters available tailored to your celebration.",
    ],
    ctaLabel: "Plan Your Celebration",
  },
  {
    id: "car-parking",
    slug: "car-parking",
    name: "Car Parking",
    tagline: "Free, ample parking for guests",
    description:
      "Hotel Amil offers spacious, free car parking for all hotel guests — whether you are staying with us, dining at the restaurant or attending an event at the banquet hall.",
    image: "parking",
    details: [
      { label: "Parking", value: "Free for all guests" },
      { label: "Capacity", value: "Ample space" },
    ],
    highlights: ["Free parking", "Spacious area", "For guests & visitors"],
    ctaLabel: "Get Directions",
  },
];

export function getFacilityBySlug(slug: string): Facility | undefined {
  if (slug === "reception-events" || slug === "celebration") {
    return facilities.find((facility) => facility.slug === "celebrations");
  }
  return facilities.find((facility) => facility.slug === slug);
}