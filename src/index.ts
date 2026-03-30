import { UserService } from "./services/UserService";
import { MarketService } from "./services/MarketService";
import { PortfolioService } from "./services/PortfolioService";
import { TradeService } from "./services/TradeService";

import { UserController } from "./controllers/UserController";
import { MarketController } from "./controllers/MarketController";
import { TradeController } from "./controllers/TradeController";
import { PortfolioController } from "./controllers/PortfolioController";

import { SignalSkill } from "./skills/SignalSkill";
import { RiskSkill } from "./skills/RiskSkill";
import { MovingAverageSkill } from "./skills/MovingAverageSkill";

// Bootstrap
const userService = new UserService();
const marketService = new MarketService();
const portfolioService = new PortfolioService();
const tradeService = new TradeService(userService, portfolioService, marketService);

const userCtrl = new UserController(userService);
const marketCtrl = new MarketController(marketService);
const tradeCtrl = new TradeController(tradeService);
const portfolioCtrl = new PortfolioController(portfolioService, marketService);

const signalSkill = new SignalSkill();
const riskSkill = new RiskSkill();
const maSkill = new MovingAverageSkill();

// --- Demo run ---

// Create a user and deposit funds
const { body: alice } = userCtrl.createUser({ name: "Alice", email: "alice@example.com" });
userCtrl.deposit(alice.id, { amount: 50_000 });

// Check market
console.log("=== Market Quotes ===");
console.log(marketCtrl.listQuotes().body);

// Buy some stocks
console.log("\n=== Buy Orders ===");
console.log(tradeCtrl.buy(alice.id, { symbol: "AAPL", quantity: 10 }).body);
console.log(tradeCtrl.buy(alice.id, { symbol: "NVDA", quantity: 5 }).body);

// Portfolio value
console.log("\n=== Portfolio ===");
console.log(portfolioCtrl.getPortfolioValue(alice.id).body);

// Skills demo
const mockPrices = Array.from({ length: 50 }, (_, i) => 100 + Math.sin(i / 5) * 10 + i * 0.5);
console.log("\n=== Signal Analysis ===");
console.log(signalSkill.analyze("MOCK", mockPrices));

const returns = mockPrices.slice(1).map((p, i) => (p - mockPrices[i]) / mockPrices[i]);
console.log("\n=== Risk Metrics ===");
console.log({ volatility: riskSkill.volatility(returns), sharpe: riskSkill.sharpeRatio(returns), maxDrawdown: riskSkill.maxDrawdown(mockPrices) });

console.log("\n=== Moving Averages (last 5 values) ===");
const sma = maSkill.sma(mockPrices, 10);
const ema = maSkill.ema(mockPrices, 10);
console.log({ sma: sma.slice(-5), ema: ema.slice(-5) });
