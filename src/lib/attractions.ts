export type AttractionCategory = "temple" | "falls" | "nature" | "heritage";

export type Attraction = {
  id: string;
  name: string;
  tagline: string;
  category: AttractionCategory;
  categoryLabel: string;
  description: string;
  distance: string;
  travelTime: string;
  timings: string;
  entryFee: string;
  highlights: string[];
  image: string; // primary image
  images: string[]; // all photos for dynamic scroll
};

export const attractions: Attraction[] = [
  {
    id: "srivilliputhur-andal-temple",
    name: "Srivilliputhur Arulmigu Andal Temple",
    tagline: "Tamil Nadu State Emblem & 11-Tiered Tower (192 Ft)",
    category: "temple",
    categoryLabel: "Temple & Sacred Heritage",
    description:
      "A celebrated 108 Divya Desam shrine featuring the iconic 192-foot Rajagopuram — the official emblem of Tamil Nadu. Revered for Dravidian architecture and centuries of spiritual heritage.",
    distance: "20 km from Hotel Amil",
    travelTime: "~25 mins drive",
    timings: "6:00 AM – 1:00 PM | 4:00 PM – 9:00 PM",
    entryFee: "Free Darshan",
    highlights: [
      "Official Tamil Nadu emblem Rajagopuram",
      "Celebrated 108 Divya Desam shrine",
      "Birthplace of Sri Andal & Periyalwar",
    ],
    image: "/images/andaal.png",
    images: [
      "/images/andaal.png",
      "/images/andaal1.png",
      "/images/andaal2.png",
      "/images/andaal3.png",
    ],
  },
  {
    id: "ayyanar-kovil-falls",
    name: "Ayyanar Kovil & Forest Waterfalls",
    tagline: "Serene Woodland Shrine & Cascading Stream in Western Ghats",
    category: "falls",
    categoryLabel: "Nature & Mountain Waterfalls",
    description:
      "Nestled in the Western Ghats foothills, this serene forest shrine features pristine mountain streams and cascading waterfalls — ideal for peaceful morning darshan and refreshing dips.",
    distance: "12 km from Hotel Amil",
    travelTime: "~20 mins drive",
    timings: "6:30 AM – 5:30 PM",
    entryFee: "Free Entry",
    highlights: [
      "Natural mountain stream & cascading falls",
      "Lush Western Ghats foothill scenery",
      "Peaceful woodland guardian deity temple",
    ],
    image: "/images/ayyanarkovil.png",
    images: [
      "/images/ayyanarkovil.png",
      "/images/water ayya1.png",
      "/images/water ayya2.png",
      "/images/water ayya3.png",
    ],
  },
  {
    id: "rakachi-amman-kovil",
    name: "Rakachi Amman Kovil & Waterfalls",
    tagline: "Scenic Foothill Shrine & Cascading Forest Waters",
    category: "temple",
    categoryLabel: "Sacred Shrine & Streams",
    description:
      "An ancient foothill forest shrine dedicated to Goddess Rakachi Amman, situated amidst natural rock pools and gentle mountain streams flowing from the Western Ghats.",
    distance: "15 km from Hotel Amil",
    travelTime: "~25 mins drive",
    timings: "7:00 AM – 6:00 PM",
    entryFee: "Free Entry",
    highlights: [
      "Revered Goddess Rakachi Amman shrine",
      "Natural rock pools & foothill streams",
      "Tranquil forest atmosphere & cool breeze",
    ],
    image: "/images/rakashi amman kovil.png",
    images: [
      "/images/water rakachi1.png",
      "/images/rakashi amman kovil.png",
      "/images/water rakachi2.png",
      "/images/water rakachi3.png",
    ],
  },
  {
    id: "thirumalai-kovil",
    name: "Thirumalai Kovil (Thirumalai Kumaraswamy Temple)",
    tagline: "Panoramic Hilltop Abode of Lord Murugan",
    category: "temple",
    categoryLabel: "Hilltop Temple & Panoramic Views",
    description:
      "Perched atop an emerald hillock with 360-degree panoramic Western Ghats views, this revered Lord Murugan temple is accessible via a winding ghat road or traditional steps.",
    distance: "52 km from Hotel Amil",
    travelTime: "~1 hr drive",
    timings: "6:00 AM – 1:00 PM | 5:00 PM – 8:30 PM",
    entryFee: "Free Darshan",
    highlights: [
      "Breathtaking 360° hilltop views of valleys",
      "Dedicated to Lord Murugan (Kumaraswamy)",
      "Scenic ghat road & stone steps walkway",
    ],
    image: "/images/thirumalai1.png",
    images: [
      "/images/thirumalai1.png",
      "/images/thirumalai2.png",
      "/images/thirumalai3.png",
      "/images/thirumalai4.png",
    ],
  },
  {
    id: "kalugumalai",
    name: "Kalugumalai Rock-Cut Temples & Monoliths",
    tagline: "The 'Ellora of South India' & 8th-Century Monolithic Art",
    category: "heritage",
    categoryLabel: "Archaeological Marvel & Heritage",
    description:
      "Celebrated as the 'Ellora of South India', this 8th-century archaeological marvel features the monolithic Vettuvan Kovil and ancient Jain bas-relief sculptures carved from a single hill.",
    distance: "45 km from Hotel Amil",
    travelTime: "~50 mins drive",
    timings: "6:00 AM – 6:00 PM",
    entryFee: "Free / ASI Protected Monument",
    highlights: [
      "Monolithic Vettuvan Kovil rock-cut shrine",
      "Intricate 8th-century Pandya stone carving",
      "Historic Jain bas-relief sculptures",
    ],
    image: "/images/kalugumalai.png",
    images: [
      "/images/kalugumalai.png",
      "/images/kalugumalai1.png",
      "/images/kalugumalai2.png",
      "/images/kalugumalai3.png",
    ],
  },
  {
    id: "sankaran-kovil",
    name: "Sri Sankaranarayana Swamy Temple (Sankaran Kovil)",
    tagline: "Sacred Confluence of Shiva & Vishnu with Goddess Gomathi Ambal",
    category: "temple",
    categoryLabel: "Major Pilgrimage & Dravidian Heritage",
    description:
      "A historic 11th-century temple enshrining the divine half-Shiva, half-Vishnu deity, revered for Goddess Gomathi Ambal and sacred healing earth (Puttru Mann).",
    distance: "48 km from Hotel Amil",
    travelTime: "~50 mins drive",
    timings: "5:30 AM – 12:30 PM | 4:00 PM – 9:00 PM",
    entryFee: "Free Darshan",
    highlights: [
      "Unique half-Shiva & half-Vishnu sanctum",
      "Miraculous sacred earth (Puttru Mann)",
      "Goddess Gomathi Ambal shrine",
    ],
    image: "/images/sankarankovil1.png",
    images: [
      "/images/sankarankovil1.png",
      "/images/sankarankovil2.png",
    ],
  },
  {
    id: "kasi-kovil",
    name: "Kasi Viswanathar Kovil, Tenkasi",
    tagline: "Grand 180-Foot Rajagopuram & Melodic Musical Stone Pillars",
    category: "temple",
    categoryLabel: "Historic Dravidian Monument",
    description:
      "Built in the 15th century by Pandyan King Parakkirama Pandian, Tenkasi's landmark temple is renowned for its imposing 180-foot Rajagopuram and melodic musical stone pillars.",
    distance: "58 km from Hotel Amil",
    travelTime: "~1 hr drive",
    timings: "6:00 AM – 12:00 PM | 4:00 PM – 8:30 PM",
    entryFee: "Free Darshan",
    highlights: [
      "180-foot towering Rajagopuram",
      "Acoustic musical stone pillars",
      "Sacred 'Southern Kasi' pilgrimage heritage",
    ],
    image: "/images/kasi1.png",
    images: [
      "/images/kasi1.png",
      "/images/kasi2.png",
      "/images/kasi3.png",
      "/images/kasi4.png",
    ],
  },
  {
    id: "kutralam-waterfalls",
    name: "Kutralam (Courtallam) Waterfalls",
    tagline: "Spa of South India & Cascading Herbal Waterfalls",
    category: "falls",
    categoryLabel: "Nature & Mountain Waterfalls",
    description:
      "Famed as the 'Spa of South India', Courtallam features therapeutic herbal waterfalls cascading down the Western Ghats. Renowned for Five Falls (Aintharuvi), Main Falls (Peraruvi), Old Courtallam, and Tiger Falls.",
    distance: "64 km from Hotel Amil",
    travelTime: "~1 hr 15 mins drive",
    timings: "Open 24 Hours / Daytime Recommended",
    entryFee: "Free Entry",
    highlights: [
      "Five Falls, Main Falls & Old Falls",
      "Therapeutic herbal mountain streams",
      "Scenic Western Ghats nature retreat",
    ],
    image: "/images/five.png",
    images: [
      "/images/five.png",
      "/images/main.png",
      "/images/old.png",
      "/images/tiger.png",
    ],
  },
];

export function getAttractionById(id: string): Attraction | undefined {
  return attractions.find((attraction) => attraction.id === id);
}

export function getAttractionsByCategory(
  category: AttractionCategory
): Attraction[] {
  return attractions.filter((attraction) => attraction.category === category);
}