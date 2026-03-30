export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  productId: string;
  title: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
};

export const orders: Order[] = [
  {
    id: "ord-001",
    customerName: "Samantha Lee",
    customerEmail: "samantha.lee@example.com",
    items: [
      { productId: "prod-001", title: "Wireless Noise-Cancelling Headphones", quantity: 1, price: 249.99 },
      { productId: "prod-003", title: "USB-C 4-Port Hub", quantity: 2, price: 49.99 },
    ],
    status: "delivered",
    total: 349.97,
    createdAt: "2026-01-05T14:22:00.000Z",
    updatedAt: "2026-01-10T09:15:00.000Z",
  },
  {
    id: "ord-002",
    customerName: "Marcus Johnson",
    customerEmail: "marcus.johnson@example.com",
    items: [
      { productId: "prod-012", title: "Adjustable Dumbbell Pair (5–52.5 lbs)", quantity: 1, price: 299.99 },
      { productId: "prod-013", title: "Yoga Mat with Alignment Lines", quantity: 1, price: 39.99 },
      { productId: "prod-024", title: "Resistance Bands Set (5-Pack)", quantity: 2, price: 22.99 },
    ],
    status: "shipped",
    total: 385.96,
    createdAt: "2026-01-12T10:05:00.000Z",
    updatedAt: "2026-01-14T16:40:00.000Z",
  },
  {
    id: "ord-003",
    customerName: "Priya Sharma",
    customerEmail: "priya.sharma@example.com",
    items: [
      { productId: "prod-016", title: "Atomic Habits", quantity: 1, price: 16.99 },
      { productId: "prod-018", title: "The Midnight Library", quantity: 1, price: 14.99 },
      { productId: "prod-017", title: "The Pragmatic Programmer (20th Anniversary Ed.)", quantity: 1, price: 49.99 },
    ],
    status: "delivered",
    total: 81.97,
    createdAt: "2026-01-08T09:30:00.000Z",
    updatedAt: "2026-01-12T11:20:00.000Z",
  },
  {
    id: "ord-004",
    customerName: "Derek Owens",
    customerEmail: "derek.owens@example.com",
    items: [
      { productId: "prod-004", title: "27-Inch 4K IPS Monitor", quantity: 1, price: 399.99 },
      { productId: "prod-002", title: "Mechanical Keyboard TKL", quantity: 1, price: 129.99 },
      { productId: "prod-022", title: "Smart LED Desk Lamp", quantity: 1, price: 59.99 },
    ],
    status: "processing",
    total: 589.97,
    createdAt: "2026-01-18T15:45:00.000Z",
    updatedAt: "2026-01-19T08:00:00.000Z",
  },
  {
    id: "ord-005",
    customerName: "Aisha Mwangi",
    customerEmail: "aisha.mwangi@example.com",
    items: [
      { productId: "prod-019", title: "Single-Origin Ethiopian Coffee Beans (12oz)", quantity: 3, price: 19.99 },
      { productId: "prod-020", title: "Organic Matcha Ceremonial Grade (100g)", quantity: 1, price: 34.99 },
      { productId: "prod-021", title: "Artisan Dark Chocolate Assortment (200g)", quantity: 2, price: 28.99 },
    ],
    status: "delivered",
    total: 152.94,
    createdAt: "2026-01-03T07:10:00.000Z",
    updatedAt: "2026-01-07T14:30:00.000Z",
  },
  {
    id: "ord-006",
    customerName: "Carlos Vega",
    customerEmail: "carlos.vega@example.com",
    items: [
      { productId: "prod-007", title: "Unisex Puffer Jacket", quantity: 1, price: 119.99 },
      { productId: "prod-008", title: "Classic White Sneakers", quantity: 1, price: 79.99 },
    ],
    status: "cancelled",
    total: 199.98,
    createdAt: "2026-01-15T11:00:00.000Z",
    updatedAt: "2026-01-16T09:30:00.000Z",
  },
  {
    id: "ord-007",
    customerName: "Rachel Kim",
    customerEmail: "rachel.kim@example.com",
    items: [
      { productId: "prod-009", title: "Stainless Steel Plant Pot Set", quantity: 1, price: 44.99 },
      { productId: "prod-010", title: "Bamboo Cutting Board with Juice Groove", quantity: 1, price: 34.99 },
      { productId: "prod-011", title: "Scented Soy Candle — Sandalwood & Vanilla", quantity: 2, price: 18.99 },
      { productId: "prod-023", title: "Linen Throw Blanket — Oatmeal", quantity: 1, price: 55.99 },
    ],
    status: "delivered",
    total: 173.95,
    createdAt: "2025-12-28T16:00:00.000Z",
    updatedAt: "2026-01-03T10:00:00.000Z",
  },
  {
    id: "ord-008",
    customerName: "Tom Eriksson",
    customerEmail: "tom.eriksson@example.com",
    items: [
      { productId: "prod-014", title: "Insulated 40oz Water Bottle", quantity: 2, price: 29.99 },
      { productId: "prod-015", title: "Trail Running Shoes", quantity: 1, price: 139.99 },
    ],
    status: "shipped",
    total: 199.97,
    createdAt: "2026-01-20T13:30:00.000Z",
    updatedAt: "2026-01-22T07:45:00.000Z",
  },
  {
    id: "ord-009",
    customerName: "Yuki Tanaka",
    customerEmail: "yuki.tanaka@example.com",
    items: [
      { productId: "prod-005", title: "Men's Merino Wool Crew Sweater", quantity: 1, price: 89.99 },
      { productId: "prod-006", title: "Women's Slim Fit Chinos", quantity: 2, price: 64.99 },
    ],
    status: "pending",
    total: 219.97,
    createdAt: "2026-01-25T17:15:00.000Z",
    updatedAt: "2026-01-25T17:15:00.000Z",
  },
  {
    id: "ord-010",
    customerName: "Fatima Hassan",
    customerEmail: "fatima.hassan@example.com",
    items: [
      { productId: "prod-001", title: "Wireless Noise-Cancelling Headphones", quantity: 1, price: 249.99 },
      { productId: "prod-022", title: "Smart LED Desk Lamp", quantity: 1, price: 59.99 },
    ],
    status: "processing",
    total: 309.98,
    createdAt: "2026-01-24T09:00:00.000Z",
    updatedAt: "2026-01-24T14:20:00.000Z",
  },
  {
    id: "ord-011",
    customerName: "Noah Williams",
    customerEmail: "noah.williams@example.com",
    items: [
      { productId: "prod-017", title: "The Pragmatic Programmer (20th Anniversary Ed.)", quantity: 1, price: 49.99 },
      { productId: "prod-002", title: "Mechanical Keyboard TKL", quantity: 1, price: 129.99 },
      { productId: "prod-003", title: "USB-C 4-Port Hub", quantity: 1, price: 49.99 },
    ],
    status: "delivered",
    total: 229.97,
    createdAt: "2026-01-02T11:10:00.000Z",
    updatedAt: "2026-01-07T08:55:00.000Z",
  },
  {
    id: "ord-012",
    customerName: "Isabella Rossi",
    customerEmail: "isabella.rossi@example.com",
    items: [
      { productId: "prod-021", title: "Artisan Dark Chocolate Assortment (200g)", quantity: 3, price: 28.99 },
      { productId: "prod-011", title: "Scented Soy Candle — Sandalwood & Vanilla", quantity: 4, price: 18.99 },
    ],
    status: "shipped",
    total: 162.93,
    createdAt: "2026-01-21T08:30:00.000Z",
    updatedAt: "2026-01-23T12:00:00.000Z",
  },
  {
    id: "ord-013",
    customerName: "Liam O'Brien",
    customerEmail: "liam.obrien@example.com",
    items: [
      { productId: "prod-004", title: "27-Inch 4K IPS Monitor", quantity: 1, price: 399.99 },
    ],
    status: "pending",
    total: 399.99,
    createdAt: "2026-01-26T10:00:00.000Z",
    updatedAt: "2026-01-26T10:00:00.000Z",
  },
  {
    id: "ord-014",
    customerName: "Mei Chen",
    customerEmail: "mei.chen@example.com",
    items: [
      { productId: "prod-013", title: "Yoga Mat with Alignment Lines", quantity: 1, price: 39.99 },
      { productId: "prod-014", title: "Insulated 40oz Water Bottle", quantity: 1, price: 29.99 },
      { productId: "prod-024", title: "Resistance Bands Set (5-Pack)", quantity: 1, price: 22.99 },
      { productId: "prod-020", title: "Organic Matcha Ceremonial Grade (100g)", quantity: 2, price: 34.99 },
    ],
    status: "delivered",
    total: 162.95,
    createdAt: "2025-12-20T07:00:00.000Z",
    updatedAt: "2025-12-26T15:45:00.000Z",
  },
  {
    id: "ord-015",
    customerName: "James Okafor",
    customerEmail: "james.okafor@example.com",
    items: [
      { productId: "prod-007", title: "Unisex Puffer Jacket", quantity: 1, price: 119.99 },
      { productId: "prod-015", title: "Trail Running Shoes", quantity: 1, price: 139.99 },
      { productId: "prod-008", title: "Classic White Sneakers", quantity: 1, price: 79.99 },
    ],
    status: "processing",
    total: 339.97,
    createdAt: "2026-01-23T14:55:00.000Z",
    updatedAt: "2026-01-24T08:10:00.000Z",
  },
];
