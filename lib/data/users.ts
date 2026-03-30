export type UserRole = "admin" | "customer" | "viewer";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
};

export const users: User[] = [
  {
    id: "user-001",
    name: "Alice Admin",
    email: "alice@flowguard-demo.com",
    role: "admin",
    password: "admin1234",
  },
  {
    id: "user-002",
    name: "Chris Customer",
    email: "chris@example.com",
    role: "customer",
    password: "customer1234",
  },
  {
    id: "user-003",
    name: "Vera Viewer",
    email: "vera@example.com",
    role: "viewer",
    password: "viewer1234",
  },
];
