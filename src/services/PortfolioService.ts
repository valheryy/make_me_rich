export interface Position {
  symbol: string;
  quantity: number;
  avgCost: number;
}

export interface Portfolio {
  userId: string;
  positions: Map<string, Position>;
}

export class PortfolioService {
  private portfolios: Map<string, Portfolio> = new Map();

  getOrCreate(userId: string): Portfolio {
    if (!this.portfolios.has(userId)) {
      this.portfolios.set(userId, { userId, positions: new Map() });
    }
    return this.portfolios.get(userId)!;
  }

  addPosition(userId: string, symbol: string, quantity: number, price: number): Position {
    const portfolio = this.getOrCreate(userId);
    const existing = portfolio.positions.get(symbol);

    if (existing) {
      const totalCost = existing.avgCost * existing.quantity + price * quantity;
      existing.quantity += quantity;
      existing.avgCost = totalCost / existing.quantity;
      return existing;
    }

    const position: Position = { symbol, quantity, avgCost: price };
    portfolio.positions.set(symbol, position);
    return position;
  }

  removePosition(userId: string, symbol: string, quantity: number): Position {
    const portfolio = this.getOrCreate(userId);
    const position = portfolio.positions.get(symbol);
    if (!position) throw new Error(`No position in ${symbol}`);
    if (position.quantity < quantity) throw new Error(`Insufficient quantity in ${symbol}`);

    position.quantity -= quantity;
    if (position.quantity === 0) portfolio.positions.delete(symbol);
    return position;
  }

  getPositions(userId: string): Position[] {
    return Array.from(this.getOrCreate(userId).positions.values());
  }

  getValue(userId: string, prices: Record<string, number>): number {
    return this.getPositions(userId).reduce((total, pos) => {
      const price = prices[pos.symbol] ?? pos.avgCost;
      return total + pos.quantity * price;
    }, 0);
  }
}
