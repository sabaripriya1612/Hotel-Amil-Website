export type FoodCategory = "breakfast" | "lunch" | "dinner" | "starters" | "desserts";

export interface FoodMenuItem {
  id: string;
  name: string;
  category: FoodCategory[];
  image: string;
  description?: string;
  price?: string;
  dietary?: "veg" | "non-veg";
  badge?: string;
}

export const foodCategories: {
  id: FoodCategory;
  label: string;
  subtitle: string;
  timeNote: string;
}[] = [
  {
    id: "breakfast",
    label: "Breakfast",
    subtitle: "Morning Delights & Hot Tawa Specials",
    timeNote: "Served 7:30 AM – 10:30 AM",
  },
  {
    id: "lunch",
    label: "Lunch",
    subtitle: "Authentic Meals, Biryanis & Tandoori Breads",
    timeNote: "Served 12:00 PM – 3:30 PM",
  },
  {
    id: "dinner",
    label: "Dinner",
    subtitle: "Hearty Evening Feasts, Curries & Grills",
    timeNote: "Served 7:00 PM – 11:00 PM",
  },
  {
    id: "starters",
    label: "Starters",
    subtitle: "Crispy Appetizers, Tandoori Skewers & Bites",
    timeNote: "Available All Day",
  },
  {
    id: "desserts",
    label: "Desserts",
    subtitle: "Traditional Sweets, Rich Halwas & Chilled Delights",
    timeNote: "Available All Day",
  },
];

// Defined dishes with real image mappings and authentic descriptions
const dosa: FoodMenuItem = {
  id: "dosa",
  name: "Dosa",
  category: ["breakfast"],
  image: "/images/food/Dosa with Vada and Chutneys.jpeg",
  description:
    "Crisp golden South Indian crepe served with crispy medu vada, spiced sambar, and freshly ground coconut and tomato chutneys.",
  dietary: "veg",
};

const venPongal: FoodMenuItem = {
  id: "ven-pongal",
  name: "Ven Pongal",
  category: ["breakfast"],
  image: "/images/food/ven-pongal.jpeg",
  description:
    "Traditional South Indian ghee ven pongal prepared with fragrant raw rice and yellow moong dal, tempered with whole black pepper, cumin seeds, ginger, and crunchy golden cashews.",
  dietary: "veg",
};

const southIndianBreakfastPlatter: FoodMenuItem = {
  id: "south-indian-breakfast-platter",
  name: "South Indian Breakfast Platter (Idli, Vada, Pongal)",
  category: ["breakfast"],
  image: "/images/food/South Indian Tiffin Platter.jpeg",
  description:
    "Wholesome morning combination of fluffy steamed idlis, golden medu vada, and ghee ven pongal served with aromatic sambar and assorted chutneys.",
  dietary: "veg",
};

const parotta: FoodMenuItem = {
  id: "parotta",
  name: "Parotta",
  category: ["breakfast", "lunch", "dinner"],
  image: "/images/food/Parotta.jpeg",
  description:
    "Authentic multi-layered flaky South Indian parotta, hand-tossed and griddled hot on the tawa.",
  dietary: "veg",
};

const southIndianMeals: FoodMenuItem = {
  id: "south-indian-meals",
  name: "South Indian Meals",
  category: ["lunch", "dinner"],
  image: "/images/food/South Indian Meals.jpeg",
  description:
    "Traditional multi-course thali feast featuring steamed rice, aromatic sambar, rasam, kootu, vegetable poriyal, crisp appalam, curd, and payasam.",
  dietary: "veg",
};

const chickenBiryani: FoodMenuItem = {
  id: "chicken-biryani",
  name: "Chicken Biryani",
  category: ["lunch", "dinner"],
  image: "/images/food/Chicken Biryani.jpeg",
  description:
    "Fragrant aged rice slow-cooked on dum with tender marinated chicken, saffron, fresh mint, and rich regional spices.",
  dietary: "non-veg",
};

const eggBiryani: FoodMenuItem = {
  id: "egg-biryani",
  name: "Egg Biryani",
  category: ["lunch", "dinner"],
  image: "/images/food/Egg-Biryani.jpg",
  description:
    "Aromatic dum-cooked basmati rice delicately spiced and layered with seasoned boiled eggs, caramelized onions, and fresh mint.",
  dietary: "non-veg",
};

const chickenFriedRice: FoodMenuItem = {
  id: "chicken-fried-rice",
  name: "Chicken Fried Rice",
  category: ["lunch", "dinner"],
  image: "/images/food/Chicken Fried Rice.jpeg",
  description:
    "Fragrant long-grain rice wok-tossed on high flame with seasoned chicken shreds, farm eggs, and crisp garden vegetables.",
  dietary: "non-veg",
};

const chickenMasalaCurry: FoodMenuItem = {
  id: "chicken-masala-curry",
  name: "Chicken Masala Curry",
  category: ["lunch", "dinner"],
  image: "/images/food/Chicken Masala Curry.jpeg",
  description:
    "Traditional homestyle chicken curry simmered in a rich onion-tomato gravy with freshly ground spices and roasted coriander.",
  dietary: "non-veg",
};

const butterChicken: FoodMenuItem = {
  id: "butter-chicken",
  name: "Butter Chicken",
  category: ["lunch", "dinner"],
  image: "/images/food/Butter Chicken.jpeg",
  description:
    "Tender boneless chicken simmered in a velvety, buttery tomato gravy infused with aromatic fenugreek and mild cream.",
  dietary: "non-veg",
};

const grilledFish: FoodMenuItem = {
  id: "grilled-fish",
  name: "Grilled Fish",
  category: ["lunch", "dinner"],
  image: "/images/food/Grilled Fish.jpeg",
  description:
    "Fresh tender fish steak delicately seasoned with coastal herbs, crushed peppercorns, and lemon garlic butter, griddled golden.",
  dietary: "non-veg",
};

const garlicNaan: FoodMenuItem = {
  id: "garlic-naan",
  name: "Garlic Naan",
  category: ["lunch", "dinner"],
  image: "/images/food/Garlic Naan.jpeg",
  description:
    "Clay-oven baked leavened flatbread topped with minced garlic and coriander, generously brushed with melted butter.",
  dietary: "veg",
};

const cheeseNaan: FoodMenuItem = {
  id: "cheese-naan",
  name: "Cheese Naan",
  category: ["lunch", "dinner"],
  image: "/images/food/Butter Garlic Naan.jpeg",
  description:
    "Soft tandoori naan stuffed and glazed with rich melted cheese and golden butter.",
  dietary: "veg",
};

const chickenLollipop: FoodMenuItem = {
  id: "chicken-lollipop",
  name: "Chicken Lollipop",
  category: ["starters"],
  image: "/images/food/Chicken Lollipop.jpeg",
  description:
    "Frenched chicken winglets coated in a savory spiced batter, fried until crisp and tossed in house special sauce.",
  dietary: "non-veg",
};

const chilliChicken: FoodMenuItem = {
  id: "chilli-chicken",
  name: "Chilli Chicken",
  category: ["starters"],
  image: "/images/food/Chilli Chicken.jpeg",
  description:
    "Tender chicken wok-tossed with crisp bell peppers, onions, ginger, garlic, and dark soy in classic Indo-Chinese style.",
  dietary: "non-veg",
};

const tandooriChicken: FoodMenuItem = {
  id: "tandoori-chicken",
  name: "Tandoori Chicken",
  category: ["starters"],
  image: "/images/food/Tandoori Chicken.jpeg",
  description:
    "Succulent bone-in chicken marinated in spiced hung yogurt and roasted to smoky perfection in our traditional clay tandoor.",
  dietary: "non-veg",
};

const chicken65: FoodMenuItem = {
  id: "chicken-65",
  name: "Chicken 65",
  category: ["starters"],
  image: "/images/food/Chicken 65.jpeg",
  description:
    "Crispy, deep-fried chicken tossed with tempered curry leaves, green chilies, garlic, and fiery South Indian red spices.",
  dietary: "non-veg",
};

const chickenDrumsticks: FoodMenuItem = {
  id: "chicken-drumsticks",
  name: "Chicken Drumsticks",
  category: ["starters"],
  image: "/images/food/Chicken Drumsticks.jpeg",
  description:
    "Juicy chicken legs marinated in freshly pounded dry-rub spices and gently cooked for tender, flavorful meat.",
  dietary: "non-veg",
};

const chickenPakora: FoodMenuItem = {
  id: "chicken-pakora",
  name: "Chicken Pakora",
  category: ["starters"],
  image: "/images/food/Chicken Pakora.jpeg",
  description:
    "Bite-sized chicken chunks dipped in spiced gram flour batter with ajwain and herbs, fried to a golden crunch.",
  dietary: "non-veg",
};

const gobiPepperFry: FoodMenuItem = {
  id: "gobi-pepper-fry",
  name: "Gobi Pepper Fry",
  category: ["starters"],
  image: "/images/food/Gobi Pepper Fry.jpeg",
  description:
    "Crisp cauliflower florets sauteed with freshly crushed black peppercorns, curry leaves, ginger, and green chilies.",
  dietary: "veg",
};

const crispyChilliChicken: FoodMenuItem = {
  id: "crispy-chilli-chicken",
  name: "Crispy Chilli Chicken",
  category: ["starters"],
  image: "/images/food/Crispy Chilli Chicken.jpeg",
  description:
    "Extra crisp chicken pieces glazed with spicy chili paste, sweet notes, toasted sesame, and fresh spring onions.",
  dietary: "non-veg",
};

const paneerTikka: FoodMenuItem = {
  id: "paneer-tikka",
  name: "Paneer Tikka",
  category: ["starters"],
  image: "/images/food/Paneer Tikka.jpeg",
  description:
    "Fresh cottage cheese cubes and bell peppers tossed in tandoori marinade and skewered to a charred finish.",
  dietary: "veg",
};

const hariyaliTikka: FoodMenuItem = {
  id: "hariyali-tikka",
  name: "Hariyali Tikka",
  category: ["starters"],
  image: "/images/food/Hariyali Tikka.jpeg",
  description:
    "Boneless chicken cubes marinated in an aromatic paste of fresh garden mint, cilantro, hung curd, and roasted cumin.",
  dietary: "non-veg",
};

const vegetableCutlets: FoodMenuItem = {
  id: "vegetable-cutlets-french-fries",
  name: "Vegetable Cutlets with French Fries",
  category: ["starters"],
  image: "/images/food/Vegetable Cutlets with French Fries.jpeg",
  description:
    "Hearty spiced vegetable patties breaded and pan-seared golden, served alongside crisp salted french fries.",
  dietary: "veg",
};

const halwa: FoodMenuItem = {
  id: "halwa",
  name: "Halwa",
  category: ["desserts"],
  image: "/images/food/halwa.png",
  description:
    "Rich, traditional melt-in-mouth wheat halwa slow-cooked with pure ghee and roasted cashews, infused with aromatic cardamom.",
  dietary: "veg",
};

const iceCream: FoodMenuItem = {
  id: "ice-cream",
  name: "Ice Cream",
  category: ["desserts"],
  image: "/images/food/ice.png",
  description:
    "Rich and velvety chilled ice cream scoops served with delightful dessert toppings.",
  dietary: "veg",
};

const breadHalwa: FoodMenuItem = {
  id: "bread-halwa",
  name: "Bread Halwa",
  category: ["desserts"],
  image: "/images/food/bread.png",
  description:
    "Royal South Indian delicacy of crisp golden bread simmered in milk, ghee, cardamom, and roasted dry fruits.",
  dietary: "veg",
};

/**
 * Exact food order specified per category:
 *
 * Breakfast:
 * 1. Dosa
 * 2. Ven Pongal
 * 3. South Indian Breakfast Platter (Idli, Vada, Pongal)
 * 4. Parotta
 *
 * Lunch:
 * 1. South Indian Meals
 * 2. Chicken Biryani
 * 3. Egg Biryani
 * 4. Chicken Fried Rice
 * 5. Chicken Masala Curry
 * 6. Butter Chicken
 * 7. Grilled Fish
 * 8. Parotta
 * 9. Garlic Naan
 * 10. Cheese Naan
 *
 * Dinner:
 * 1. South Indian Meals
 * 2. Chicken Biryani
 * 3. Egg Biryani
 * 4. Chicken Fried Rice
 * 5. Chicken Masala Curry
 * 6. Butter Chicken
 * 7. Grilled Fish
 * 8. Parotta
 * 9. Garlic Naan
 * 10. Cheese Naan
 *
 * Starters:
 * 1. Chicken Lollipop
 * 2. Chilli Chicken
 * 3. Tandoori Chicken
 * 4. Chicken 65
 * 5. Chicken Drumsticks
 * 6. Chicken Pakora
 * 7. Gobi Pepper Fry
 * 8. Crispy Chilli Chicken
 * 9. Paneer Tikka
 * 10. Hariyali Tikka
 * 11. Vegetable Cutlets with French Fries
 *
 * Desserts:
 * 1. Halwa
 * 2. Ice Cream
 * 3. Bread Halwa
 */
export const menuByCategory: Record<FoodCategory, FoodMenuItem[]> = {
  breakfast: [dosa, venPongal, southIndianBreakfastPlatter, parotta],
  lunch: [
    southIndianMeals,
    chickenBiryani,
    eggBiryani,
    chickenFriedRice,
    chickenMasalaCurry,
    butterChicken,
    grilledFish,
    parotta,
    garlicNaan,
    cheeseNaan,
  ],
  dinner: [
    southIndianMeals,
    chickenBiryani,
    eggBiryani,
    chickenFriedRice,
    chickenMasalaCurry,
    butterChicken,
    grilledFish,
    parotta,
    garlicNaan,
    cheeseNaan,
  ],
  starters: [
    chickenLollipop,
    chilliChicken,
    tandooriChicken,
    chicken65,
    chickenDrumsticks,
    chickenPakora,
    gobiPepperFry,
    crispyChilliChicken,
    paneerTikka,
    hariyaliTikka,
    vegetableCutlets,
  ],
  desserts: [
    halwa,
    iceCream,
    breadHalwa,
  ],
};

// All unique items
export const foodMenuItems: FoodMenuItem[] = [
  dosa,
  venPongal,
  southIndianBreakfastPlatter,
  parotta,
  southIndianMeals,
  chickenBiryani,
  eggBiryani,
  chickenFriedRice,
  chickenMasalaCurry,
  butterChicken,
  grilledFish,
  garlicNaan,
  cheeseNaan,
  chickenLollipop,
  chilliChicken,
  tandooriChicken,
  chicken65,
  chickenDrumsticks,
  chickenPakora,
  gobiPepperFry,
  crispyChilliChicken,
  paneerTikka,
  hariyaliTikka,
  vegetableCutlets,
  halwa,
  iceCream,
  breadHalwa,
];

export function getFoodItemsByCategory(category: FoodCategory): FoodMenuItem[] {
  return menuByCategory[category] ?? [];
}
