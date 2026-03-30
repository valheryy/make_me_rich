import { MarketService } from "../services/MarketService";

export class MarketController {
  constructor(private marketService: MarketService) {}

  getQuote(symbol: string) {
    try {
      const quote = this.marketService.getQuote(symbol);
      return { status: 200, body: quote };
    } catch (e: any) {
      return { status: 404, body: { error: e.message } };
    }
  }

  listQuotes() {
    return { status: 200, body: this.marketService.getAllQuotes() };
  }
}
