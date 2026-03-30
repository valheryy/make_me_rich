import { TradeService } from "../services/TradeService";

export class TradeController {
  constructor(private tradeService: TradeService) {}

  buy(userId: string, body: { symbol: string; quantity: number }) {
    if (!body.symbol || !body.quantity || body.quantity <= 0) {
      return { status: 400, body: { error: "symbol and positive quantity are required" } };
    }
    try {
      const order = this.tradeService.buy(userId, body.symbol, body.quantity);
      return { status: 201, body: order };
    } catch (e: any) {
      return { status: 400, body: { error: e.message } };
    }
  }

  sell(userId: string, body: { symbol: string; quantity: number }) {
    if (!body.symbol || !body.quantity || body.quantity <= 0) {
      return { status: 400, body: { error: "symbol and positive quantity are required" } };
    }
    try {
      const order = this.tradeService.sell(userId, body.symbol, body.quantity);
      return { status: 201, body: order };
    } catch (e: any) {
      return { status: 400, body: { error: e.message } };
    }
  }

  getHistory(userId: string) {
    return { status: 200, body: this.tradeService.getOrderHistory(userId) };
  }
}
