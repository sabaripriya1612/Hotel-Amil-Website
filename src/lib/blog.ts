export type BlogPost = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: "rajapalayam-temples",
    title: "Sacred Temples Near Rajapalayam: Srivilliputhur Andal Temple & Shrines",
    category: "Temples",
    excerpt:
      "From the majestic 11-tiered Rajagopuram of Srivilliputhur Andal Temple to Sankaran Kovil, explore the divine heritage surrounding Rajapalayam.",
    content:
      "Rajapalayam is surrounded by several revered temples that offer both profound spiritual solace and world-renowned Dravidian architectural beauty. The crowning jewel is the Srivilliputhur Andal Temple, whose iconic 11-tiered, 192-foot Rajagopuram serves as the official state emblem of Tamil Nadu. Dedicated to the poet-saint Goddess Andal and Lord Vadapathrasayee, it attracts thousands of pilgrims who marvel at its ancient carvings and spiritual grandeur.\n\nSankaran Kovil, approximately 48 km away, is another famous shrine of Lord Sankara Narayanan located at the sacred confluence of rivers. In addition, Rachakonda Amman Temple, Sri Velli Muthu Andaal Temple and Vallieswarar Kovil offer tranquil sanctuaries perfect for peaceful morning worship.\n\nWherever your spiritual journey leads, the concierge at Hotel Amil is pleased to assist with customized temple routes and vehicle arrangements. Return to the comfort of our luxury rooms, enjoy an authentic South Indian meal at Saffron Restaurant, and unwind by our azure swimming pool.",
    image: "blog-temple",
    author: "Hotel Amil Team",
    date: "18 Aug 2026",
    readTime: "3 min read",
  },
  {
    id: "ayyanar-falls-weekend",
    title: "Ayyanar Kovil & Falls — The Perfect Weekend Escape",
    category: "Falls",
    excerpt:
      "Just a scenic drive from Rajapalayam, Ayyanar Kovil & Falls offers pristine mountain streams, forest trails and spiritual serenity nestled in the Western Ghats.",
    content:
      "For a quick nature getaway and spiritual retreat, Ayyanar Kovil and Falls is the premier destination near Rajapalayam. Tucked deep within the verdant forested foothills of the Western Ghats, the sacred woodland Ayyanar Kovil sits alongside crystal-clear natural stream cascades, making it a beloved spot for both family outings and peaceful prayer.\n\nThe best time to visit is early morning, when the mist lingers over the Western Ghats and the mountain streams flow fresh and clean. Wear comfortable walking shoes to enjoy the riverside paths, and take in the calm forest ambience.\n\nAfter your refreshing mountain escape, return to the hospitality of Hotel Amil — enjoy a warm rain shower, delicious Chettinad specialties at Saffron Restaurant, and a dip in our pool.",
    image: "blog-falls",
    author: "Hotel Amil Team",
    date: "02 Aug 2026",
    readTime: "4 min read",
  },
  {
    id: "family-stay-guide",
    title: "A Complete Guide to a Family Stay in Rajapalayam",
    category: "Stay Guide",
    excerpt:
      "Everything your family needs for a comfortable, fun and safe stay at Hotel Amil — from rooms to food and activities.",
    content:
      "Planning a family trip to Rajapalayam? Our Family Rooms comfortably accommodate up to 4 persons plus one extra on request, and children below 8 years stay completely free.\n\nStart your day with complimentary breakfast at Saffron Restaurant between 7:30 and 9:30 AM, then head out to explore nearby temples or Ayyanar Falls. Back at the hotel, the swimming pool is open for daytime swimming (and night swimming is allowed when informing management in advance), and Amil Cafe serves coffee and snacks around the clock.\n\nFor celebrations, our conference hall and reception venues host birthdays, anniversaries and more — the team will even arrange themed backgrounds. With free, ample parking and a multi-cuisine restaurant on site, Hotel Amil makes family stays effortless.",
    image: "blog-family",
    author: "Hotel Amil Team",
    date: "20 Jul 2026",
    readTime: "4 min read",
  },
  {
    id: "events-at-hotel-amil",
    title: "Celebrate Your Milestones at Hotel Amil",
    category: "Events",
    excerpt:
      "Birthdays, baby showers, anniversaries and corporate meetings — discover how our venues make every occasion special.",
    content:
      "At Hotel Amil, we host every kind of celebration. Our Conference Hall is ideal for corporate meetings, birthdays, baby showers and surprise parties, complete with themed background setups on request.\n\nThe Banquet Hall seats 128 to 150 guests and is perfect for larger gatherings and functions, served with our buffet catering. Celebrations & Parties, meanwhile, cover surprise birthday parties, anniversaries, milestone moments and social gatherings — with custom balloon decor, theme backdrops, and cake setups arranged by our experienced team.\n\nWhatever the occasion, guests enjoy ample free parking and the full hospitality of a 3-star hotel. Get in touch through our contact page to plan your event today.",
    image: "blog-events",
    author: "Hotel Amil Team",
    date: "05 Jul 2026",
    readTime: "3 min read",
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.id === slug);
}