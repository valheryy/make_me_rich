export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  createdAt: Date;
}

export class UserService {
  private users: Map<string, User> = new Map();

  create(name: string, email: string): User {
    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      balance: 0,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }

  findAll(): User[] {
    return Array.from(this.users.values());
  }

  updateBalance(id: string, amount: number): User {
    const user = this.users.get(id);
    if (!user) throw new Error(`User ${id} not found`);
    user.balance += amount;
    return user;
  }

  delete(id: string): boolean {
    return this.users.delete(id);
  }
}
