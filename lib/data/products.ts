export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  category:
    | "Electronics"
    | "Clothing"
    | "Home & Garden"
    | "Sports"
    | "Books"
    | "Food & Drink";
  imageUrl: string;
  tags: string[];
  stock: number;
  createdAt: string;
};

export const products: Product[] = [
  {
    id: "prod-001",
    title: "Wireless Noise-Cancelling Headphones",
    description:
      "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and foldable design for travel.",
    price: 249.99,
    category: "Electronics",
    imageUrl: "https://picsum.photos/seed/prod-001/400/400",
    tags: ["audio", "wireless", "noise-cancelling", "premium"],
    stock: 42,
    createdAt: "2025-11-01T08:00:00.000Z",
  },
  {
    id: "prod-002",
    title: "Mechanical Keyboard TKL",
    description:
      "Tenkeyless mechanical keyboard with Cherry MX Red switches, RGB backlighting, and aluminum top plate.",
    price: 129.99,
    category: "Electronics",
    imageUrl: "https://picsum.photos/seed/prod-002/400/400",
    tags: ["keyboard", "mechanical", "rgb", "gaming"],
    stock: 28,
    createdAt: "2025-11-03T10:30:00.000Z",
  },
  {
    id: "prod-003",
    title: "USB-C 4-Port Hub",
    description:
      "Compact USB-C hub with 4K HDMI output, 3 USB-A ports, 100W pass-through charging, and SD card reader.",
    price: 49.99,
    category: "Electronics",
    imageUrl: "https://picsum.photos/seed/prod-003/400/400",
    tags: ["usb-c", "hub", "accessories", "productivity"],
    stock: 115,
    createdAt: "2025-11-05T14:00:00.000Z",
  },
  {
    id: "prod-004",
    title: "27-Inch 4K IPS Monitor",
    description:
      "Ultra-sharp 4K IPS display with 99% sRGB coverage, 60Hz refresh rate, adjustable stand, and USB-C connectivity.",
    price: 399.99,
    category: "Electronics",
    imageUrl: "https://picsum.photos/seed/prod-004/400/400",
    tags: ["monitor", "4k", "ips", "display"],
    stock: 17,
    createdAt: "2025-11-08T09:00:00.000Z",
  },
  {
    id: "prod-005",
    title: "Men's Merino Wool Crew Sweater",
    description:
      "Lightweight 100% merino wool sweater. Temperature-regulating, odor-resistant, and naturally soft. Available in six colors.",
    price: 89.99,
    category: "Clothing",
    imageUrl: "https://picsum.photos/seed/prod-005/400/400",
    tags: ["sweater", "merino", "wool", "men"],
    stock: 63,
    createdAt: "2025-10-20T11:00:00.000Z",
  },
  {
    id: "prod-006",
    title: "Women's Slim Fit Chinos",
    description:
      "Stretch-cotton chinos with a modern slim fit. Machine washable, wrinkle-resistant, and available in 8 colors.",
    price: 64.99,
    category: "Clothing",
    imageUrl: "https://picsum.photos/seed/prod-006/400/400",
    tags: ["chinos", "women", "trousers", "workwear"],
    stock: 91,
    createdAt: "2025-10-22T13:00:00.000Z",
  },
  {
    id: "prod-007",
    title: "Unisex Puffer Jacket",
    description:
      "Lightweight recycled-fill puffer jacket with packable design. Water-resistant shell and two hand pockets.",
    price: 119.99,
    category: "Clothing",
    imageUrl: "https://picsum.photos/seed/prod-007/400/400",
    tags: ["jacket", "puffer", "winter", "unisex"],
    stock: 38,
    createdAt: "2025-10-25T15:00:00.000Z",
  },
  {
    id: "prod-008",
    title: "Classic White Sneakers",
    description:
      "Minimalist leather sneakers with cushioned insole, rubber outsole, and a clean silhouette that pairs with everything.",
    price: 79.99,
    category: "Clothing",
    imageUrl: "https://picsum.photos/seed/prod-008/400/400",
    tags: ["sneakers", "shoes", "casual", "leather"],
    stock: 54,
    createdAt: "2025-10-28T09:30:00.000Z",
  },
  {
    id: "prod-009",
    title: "Stainless Steel Plant Pot Set",
    description:
      "Set of 3 brushed stainless steel planters with drainage holes and matching saucers. Sizes: 4\", 6\", 8\".",
    price: 44.99,
    category: "Home & Garden",
    imageUrl: "https://picsum.photos/seed/prod-009/400/400",
    tags: ["planters", "garden", "indoor", "set"],
    stock: 29,
    createdAt: "2025-11-02T10:00:00.000Z",
  },
  {
    id: "prod-010",
    title: "Bamboo Cutting Board with Juice Groove",
    description:
      "Extra-large end-grain bamboo cutting board with deep juice groove, non-slip feet, and built-in handles.",
    price: 34.99,
    category: "Home & Garden",
    imageUrl: "https://picsum.photos/seed/prod-010/400/400",
    tags: ["kitchen", "bamboo", "cutting board", "eco"],
    stock: 72,
    createdAt: "2025-11-04T12:00:00.000Z",
  },
  {
    id: "prod-011",
    title: "Scented Soy Candle — Sandalwood & Vanilla",
    description:
      "Hand-poured 8oz soy wax candle with a 50-hour burn time. Clean fragrance with base notes of sandalwood and warm vanilla.",
    price: 18.99,
    category: "Home & Garden",
    imageUrl: "https://picsum.photos/seed/prod-011/400/400",
    tags: ["candle", "soy", "fragrance", "home decor"],
    stock: 145,
    createdAt: "2025-11-06T08:00:00.000Z",
  },
  {
    id: "prod-012",
    title: "Adjustable Dumbbell Pair (5–52.5 lbs)",
    description:
      "Space-saving adjustable dumbbells that replace 15 sets of weights. Dial-select mechanism for quick weight changes.",
    price: 299.99,
    category: "Sports",
    imageUrl: "https://picsum.photos/seed/prod-012/400/400",
    tags: ["dumbbells", "weights", "fitness", "home gym"],
    stock: 11,
    createdAt: "2025-10-15T07:00:00.000Z",
  },
  {
    id: "prod-013",
    title: "Yoga Mat with Alignment Lines",
    description:
      "6mm thick non-slip TPE yoga mat with printed alignment guides. Includes carrying strap. 72\" x 24\".",
    price: 39.99,
    category: "Sports",
    imageUrl: "https://picsum.photos/seed/prod-013/400/400",
    tags: ["yoga", "mat", "fitness", "tpe"],
    stock: 88,
    createdAt: "2025-10-18T11:00:00.000Z",
  },
  {
    id: "prod-014",
    title: "Insulated 40oz Water Bottle",
    description:
      "Double-wall vacuum insulated stainless steel bottle. Keeps drinks cold 24h, hot 12h. Leak-proof lid.",
    price: 29.99,
    category: "Sports",
    imageUrl: "https://picsum.photos/seed/prod-014/400/400",
    tags: ["water bottle", "insulated", "hydration", "outdoor"],
    stock: 203,
    createdAt: "2025-10-20T14:00:00.000Z",
  },
  {
    id: "prod-015",
    title: "Trail Running Shoes",
    description:
      "Lightweight trail runners with Vibram outsole, rock-plate protection, and breathable mesh upper. Drop: 8mm.",
    price: 139.99,
    category: "Sports",
    imageUrl: "https://picsum.photos/seed/prod-015/400/400",
    tags: ["running", "trail", "shoes", "outdoor"],
    stock: 44,
    createdAt: "2025-10-23T09:00:00.000Z",
  },
  {
    id: "prod-016",
    title: "Atomic Habits",
    description:
      "James Clear's bestselling guide to building good habits and breaking bad ones using small, incremental changes. Paperback.",
    price: 16.99,
    category: "Books",
    imageUrl: "https://picsum.photos/seed/prod-016/400/400",
    tags: ["self-help", "habits", "productivity", "bestseller"],
    stock: 320,
    createdAt: "2025-09-10T08:00:00.000Z",
  },
  {
    id: "prod-017",
    title: "The Pragmatic Programmer (20th Anniversary Ed.)",
    description:
      "Classic software engineering text covering career tips, coding philosophy, and practical techniques for modern developers.",
    price: 49.99,
    category: "Books",
    imageUrl: "https://picsum.photos/seed/prod-017/400/400",
    tags: ["programming", "software", "engineering", "career"],
    stock: 156,
    createdAt: "2025-09-12T10:00:00.000Z",
  },
  {
    id: "prod-018",
    title: "The Midnight Library",
    description:
      "Matt Haig's novel about a woman who discovers a library between life and death containing books of alternate lives she could have lived.",
    price: 14.99,
    category: "Books",
    imageUrl: "https://picsum.photos/seed/prod-018/400/400",
    tags: ["fiction", "novel", "bestseller", "literary"],
    stock: 278,
    createdAt: "2025-09-15T12:00:00.000Z",
  },
  {
    id: "prod-019",
    title: "Single-Origin Ethiopian Coffee Beans (12oz)",
    description:
      "Light-roast whole bean coffee from the Yirgacheffe region. Tasting notes: blueberry, jasmine, dark chocolate.",
    price: 19.99,
    category: "Food & Drink",
    imageUrl: "https://picsum.photos/seed/prod-019/400/400",
    tags: ["coffee", "single-origin", "light roast", "beans"],
    stock: 88,
    createdAt: "2025-11-10T06:00:00.000Z",
  },
  {
    id: "prod-020",
    title: "Organic Matcha Ceremonial Grade (100g)",
    description:
      "Stone-ground first-flush ceremonial matcha from Uji, Japan. Vivid green color with a rich umami finish. Resealable tin.",
    price: 34.99,
    category: "Food & Drink",
    imageUrl: "https://picsum.photos/seed/prod-020/400/400",
    tags: ["matcha", "organic", "japanese", "tea"],
    stock: 67,
    createdAt: "2025-11-11T08:00:00.000Z",
  },
  {
    id: "prod-021",
    title: "Artisan Dark Chocolate Assortment (200g)",
    description:
      "Curated selection of 70–85% cacao single-origin dark chocolates. Six bars from Ecuador, Peru, Madagascar, and Ghana.",
    price: 28.99,
    category: "Food & Drink",
    imageUrl: "https://picsum.photos/seed/prod-021/400/400",
    tags: ["chocolate", "artisan", "dark", "gift"],
    stock: 114,
    createdAt: "2025-11-12T09:00:00.000Z",
  },
  {
    id: "prod-022",
    title: "Smart LED Desk Lamp",
    description:
      "Touch-controlled LED lamp with 5 color temperatures, 10 brightness levels, USB-A charging port, and memory function.",
    price: 59.99,
    category: "Electronics",
    imageUrl: "https://picsum.photos/seed/prod-022/400/400",
    tags: ["lamp", "led", "smart", "desk"],
    stock: 76,
    createdAt: "2025-11-07T11:00:00.000Z",
  },
  {
    id: "prod-023",
    title: "Linen Throw Blanket — Oatmeal",
    description:
      "Washed linen throw in a natural oatmeal tone. Breathable, pre-washed for softness, and machine washable. 50\" x 60\".",
    price: 55.99,
    category: "Home & Garden",
    imageUrl: "https://picsum.photos/seed/prod-023/400/400",
    tags: ["throw", "linen", "bedroom", "cozy"],
    stock: 49,
    createdAt: "2025-11-09T13:00:00.000Z",
  },
  {
    id: "prod-024",
    title: "Resistance Bands Set (5-Pack)",
    description:
      "Set of 5 latex resistance bands in 10–50 lb resistance levels. Includes carrying pouch and exercise guide.",
    price: 22.99,
    category: "Sports",
    imageUrl: "https://picsum.photos/seed/prod-024/400/400",
    tags: ["resistance bands", "fitness", "home gym", "set"],
    stock: 161,
    createdAt: "2025-10-30T10:00:00.000Z",
  },
];
