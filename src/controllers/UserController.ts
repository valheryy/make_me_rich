import { UserService } from "../services/UserService";

export class UserController {
  constructor(private userService: UserService) {}

  createUser(body: { name: string; email: string }) {
    if (!body.name || !body.email) {
      return { status: 400, body: { error: "name and email are required" } };
    }
    const user = this.userService.create(body.name, body.email);
    return { status: 201, body: user };
  }

  getUser(id: string) {
    const user = this.userService.findById(id);
    if (!user) return { status: 404, body: { error: "User not found" } };
    return { status: 200, body: user };
  }

  listUsers() {
    return { status: 200, body: this.userService.findAll() };
  }

  deposit(id: string, body: { amount: number }) {
    if (!body.amount || body.amount <= 0) {
      return { status: 400, body: { error: "amount must be positive" } };
    }
    try {
      const user = this.userService.updateBalance(id, body.amount);
      return { status: 200, body: user };
    } catch (e: any) {
      return { status: 404, body: { error: e.message } };
    }
  }

  deleteUser(id: string) {
    const deleted = this.userService.delete(id);
    if (!deleted) return { status: 404, body: { error: "User not found" } };
    return { status: 204, body: null };
  }
}
