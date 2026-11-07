import { getRoomBySlug, EXTRA_PERSON_CHARGE } from "./rooms";

/**
 * Indian Hotel GST Pricing Engine (SAC Code 9963)
 * Rules:
 * - Declared tariff per room/unit per day:
 *   - Up to ₹7,500/night: 12% GST (6% CGST + 6% SGST)
 *   - Above ₹7,500/night: 18% GST (9% CGST + 9% SGST)
 * - Extra Person Charge: ₹1,050 (inclusive of GST)
 * - Children below 8 years stay free of charge (CP Plan policy)
 * - Check-in: 12:00 PM, Check-out: 11:00 AM
 */

export interface PricingBreakdown {
  roomSlug: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  childrenUnder8: number;
  extraPersons: number;

  // Tariff figures (all amounts in INR ₹)
  roomDailyPriceInclusive: number; // e.g. 3675
  roomDailyPriceBase: number; // e.g. 3281.25 (before GST)
  roomSubtotalBase: number; // roomDailyPriceBase * nights
  
  extraPersonDailyPriceInclusive: number; // 1050
  extraPersonDailyPriceBase: number; // 937.50 (before GST)
  extraPersonSubtotalBase: number; // extraPersonDailyPriceBase * extraPersons * nights

  subtotalBeforeTax: number;

  gstRatePercent: number; // 12 or 18
  cgstRatePercent: number; // 6 or 9
  sgstRatePercent: number; // 6 or 9

  cgstAmount: number;
  sgstAmount: number;
  totalGst: number;

  grandTotal: number;
}

export function calculateStayPricing(params: {
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  childrenUnder8: number;
}): { success: true; pricing: PricingBreakdown } | { success: false; error: string } {
  const { roomSlug, checkIn, checkOut, adults, children, childrenUnder8 } = params;

  const room = getRoomBySlug(roomSlug);
  if (!room) {
    return { success: false, error: "Invalid room category." };
  }

  // Calculate nights
  const checkInDate = new Date(checkIn + "T00:00:00Z");
  const checkOutDate = new Date(checkOut + "T00:00:00Z");
  const diffMs = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (nights <= 0) {
    return { success: false, error: "Check-out date must be after check-in date." };
  }
  if (nights > 30) {
    return { success: false, error: "Reservations for more than 30 consecutive nights require contacting the hotel directly." };
  }

  // Extra person calculations
  const chargeableChildren = Math.max(0, children - childrenUnder8);
  const totalOccupants = adults + chargeableChildren;
  const extraPersons = Math.max(0, totalOccupants - room.maxGuests);

  if (extraPersons > room.maxExtraPersons) {
    return {
      success: false,
      error: `Maximum ${room.maxGuests + room.maxExtraPersons} guests allowed (${room.maxGuests} base + ${room.maxExtraPersons} extra) in ${room.name}.`,
    };
  }

  // Determine GST bracket based on daily room tariff
  // In India: tariff > ₹7,500/night has 18% GST; ≤ ₹7,500 has 12% GST
  const isHighTaxBracket = room.price > 7500;
  const gstRatePercent = isHighTaxBracket ? 18 : 12;
  const cgstRatePercent = gstRatePercent / 2;
  const sgstRatePercent = gstRatePercent / 2;

  // Deconstruct prices to base + GST
  const gstMultiplier = 1 + gstRatePercent / 100;

  const roomDailyPriceInclusive = room.price;
  const roomDailyPriceBase = Math.round((roomDailyPriceInclusive / gstMultiplier) * 100) / 100;
  const roomSubtotalBase = Math.round(roomDailyPriceBase * nights * 100) / 100;

  const extraPersonDailyPriceInclusive = EXTRA_PERSON_CHARGE;
  const extraPersonDailyPriceBase = Math.round((extraPersonDailyPriceInclusive / gstMultiplier) * 100) / 100;
  const extraPersonSubtotalBase = Math.round(extraPersonDailyPriceBase * extraPersons * nights * 100) / 100;

  const subtotalBeforeTax = Math.round((roomSubtotalBase + extraPersonSubtotalBase) * 100) / 100;

  const cgstAmount = Math.round(((subtotalBeforeTax * cgstRatePercent) / 100) * 100) / 100;
  const sgstAmount = Math.round(((subtotalBeforeTax * sgstRatePercent) / 100) * 100) / 100;
  const totalGst = Math.round((cgstAmount + sgstAmount) * 100) / 100;

  // Grand total guarantees clean integer consistency with declared inclusive rates
  const grandTotal = (roomDailyPriceInclusive * nights) + (extraPersonDailyPriceInclusive * extraPersons * nights);

  return {
    success: true,
    pricing: {
      roomSlug: room.slug,
      roomName: room.name,
      checkIn,
      checkOut,
      nights,
      adults,
      children,
      childrenUnder8,
      extraPersons,
      roomDailyPriceInclusive,
      roomDailyPriceBase,
      roomSubtotalBase,
      extraPersonDailyPriceInclusive,
      extraPersonDailyPriceBase,
      extraPersonSubtotalBase,
      subtotalBeforeTax,
      gstRatePercent,
      cgstRatePercent,
      sgstRatePercent,
      cgstAmount,
      sgstAmount,
      totalGst,
      grandTotal,
    },
  };
}
