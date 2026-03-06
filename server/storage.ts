import { type User } from "@shared/schema";

export interface IStorage {
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private users: User[];

  constructor() {
    this.users = [
      {
        id: 1,
        email: "employee@test.com",
        password: "password123",
        role: "employee",
      },
      {
        id: 2,
        email: "client@test.com",
        password: "password123",
        role: "client",
      },
      {
        id: 3,
        email: "admin@example.com",
        password: "Password123!",
        role: "employee",
      },
    ];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }
}

export const storage = new MemStorage();
