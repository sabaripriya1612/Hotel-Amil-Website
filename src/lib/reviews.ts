export type Review = {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  source: string;
};

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Suresh Kumar",
    rating: 5,
    date: "12 Jul 2026",
    comment:
      "Excellent stay! Clean rooms, tasty food and very polite staff. The swimming pool is well maintained. Highly recommended for family trips to Rajapalayam.",
    source: "Google",
  },
  {
    id: "r2",
    name: "Priya R",
    rating: 5,
    date: "28 Jun 2026",
    comment:
      "We celebrated our daughter's birthday at the conference hall. The decoration and catering were superb. Kids loved the party!",
    source: "Google",
  },
  {
    id: "r3",
    name: "Mohamed Irfan",
    rating: 4,
    date: "15 Jun 2026",
    comment:
      "Good value for money. Rooms are spacious and the breakfast spread at Saffron Restaurant was wonderful. Parking is very spacious too.",
    source: "Google",
  },
  {
    id: "r4",
    name: "Lakshmi Narayanan",
    rating: 5,
    date: "02 Jun 2026",
    comment:
      "We had our company's meeting in the conference hall. Excellent AC, projector and sound system. The team handled everything smoothly.",
    source: "Google",
  },
  {
    id: "r5",
    name: "Karthik & Divya",
    rating: 5,
    date: "20 May 2026",
    comment:
      "Wonderful anniversary celebration at the banquet hall. Beautiful arrangements and hospitable staff. Will definitely come back.",
    source: "Google",
  },
  {
    id: "r6",
    name: "Venkatesh A",
    rating: 4,
    date: "05 May 2026",
    comment:
      "Comfortable rooms and the free breakfast was great. Children below 8 stayed free which was a nice bonus for our family.",
    source: "Google",
  },
];