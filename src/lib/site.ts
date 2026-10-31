export const siteConfig = {
  name: "Hotel Amil",
  tagline: "3 Star Hotel in Rajapalayam",
  description:
    "Hotel Amil with 3 star facility offers 3 distinct rooms (deluxe, suite & family), multi cuisine restaurant, swimming pool, ample car parking, banquet hall and more.",
  city: "Rajapalayam",
  state: "Tamil Nadu",
  country: "India",
  address: "259-A, Tenkasi Main Road, Rajapalayam, Tamil Nadu",
  phones: ["+91 4563 233600", "+91 7867094947"],
  whatsapp: "914563233600",
  grievancePhone: "+91 8111007108",
  foodDeliveryPhone: "+91 4563 233600",
  email: "reservations@hotelamil.com",
  checkIn: "12:00 PM",
  checkOut: "12:00 PM",
  freeChildAge: 8,
  breakfastTime: "7:30 AM – 9:30 AM",
  currency: "₹",
  mapsEmbed:
    "https://www.google.com/maps?q=Hotel%20Amil%2C%20259-A%20Tenkasi%20Main%20Road%2C%20Rajapalayam%2C%20Tamil%20Nadu&z=15&output=embed",
  mapsDirections:
    "https://www.google.com/maps/dir/?api=1&destination=Hotel%20Amil%2C%20259-A%20Tenkasi%20Main%20Road%2C%20Rajapalayam%2C%20Tamil%20Nadu",
} as const;

export type SiteConfig = typeof siteConfig;

export const hotelPolicies = {
  checkInTime: "12:00 PM",
  checkOutTime: "12:00 PM",
  freeChildAge: 8,
  freeChildNote: "Children below 8 years stay free (non-chargeable).",
  cancellation: {
    full: { days: 7, label: "7 or more days before check-in", refund: "Full Refund" },
    late: { days: 1, label: "Within 24 hours before check-in", refund: "No Refund" },
    note: "Free cancellation up to 7 days before check-in. No refund within 24 hours of check-in.",
  },
  cpPlan: {
    label: "CP Plan — Continental Plan",
    description: "Complimentary continental breakfast included with your stay.",
    breakfastTime: "7:30 AM – 9:30 AM",
  },
  rules: [
    "No pets allowed on the premises.",
    "No outside liquor & food permitted.",
    "Visitors are allowed as per hotel policy.",
    "Extra bed available on request.",
    "Room occupancy is strictly limited to the noted number of persons.",
  ],
  barRestriction: "Below 21 years not allowed in Kings Bar.",
} as const;