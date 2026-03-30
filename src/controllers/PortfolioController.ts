import { PortfolioService } from "../services/PortfolioService";
import { MarketService } from "../services/MarketService";

export class PortfolioController {
  constructor(
    private portfolioService: PortfolioService,
    private marketService: MarketService
  ) {}

  getPositions(userId: string) {
    const positions = this.portfolioService.getPositions(userId);
    return { status: 200, body: positions };
  }

  getPortfolioValue(userId: string) {
    const positions = this.portfolioService.getPositions(userId);
    const symbols = positions.map((p) => p.symbol);
    const prices = this.marketService.getPrices(symbols);
    const value = this.portfolioService.getValue(userId, prices);

    return {
      status: 200,
      body: {
        userId,
        positions,
        totalValue: value,
        prices,
      },
    };
  }
}
