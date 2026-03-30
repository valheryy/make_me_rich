import { UserService } from "./UserService";
import { PortfolioService } from "./PortfolioService";
import { MarketService } from "./MarketService";

export type OrderSide = "buy" | "sell";

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
  total: number;
  executedAt: Date;
}

export class TradeService {
  private orders: Order[] = [];

  constructor(
    private userService: UserService,
    private portfolioService: PortfolioService,
    private marketService: MarketService
  ) {}

  buy(userId: string, symbol: string, quantity: number): Order {
    const quote = this.marketService.getQuote(symbol);
    const total = quote.price * quantity;
    const user = this.userService.findById(userId);
    if (!user) throw new Error(`User ${userId} not found`);
    if (user.balance < total) throw new Error(`Insufficient balance: need ${total}, have ${user.balance}`);

    this.userService.updateBalance(userId, -total);
    this.portfolioService.addPosition(userId, symbol, quantity, quote.price);

    const order: Order = {
      id: crypto.randomUUID(),
      userId,
      symbol,
      side: "buy",
      quantity,
      price: quote.price,
      total,
      executedAt: new Date(),
    };
    this.orders.push(order);
    return order;
  }

  sell(userId: string, symbol: string, quantity: number): Order {
    const quote = this.marketService.getQuote(symbol);
    const total = quote.price * quantity;

    this.portfolioService.removePosition(userId, symbol, quantity);
    this.userService.updateBalance(userId, total);

    const order: Order = {
      id: crypto.randomUUID(),
      userId,
      symbol,
      side: "sell",
      quantity,
      price: quote.price,
      total,
      executedAt: new Date(),
    };
    this.orders.push(order);
    return order;
  }

  getOrderHistory(userId: string): Order[] {
    return this.orders.filter((o) => o.userId === userId);
  }
}
