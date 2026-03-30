import { AssetAnalysis } from "../services/AverageTrackerService";

const SIGNAL_ICON: Record<string, string> = {
  STRONG_BUY:  "🟢🟢",
  BUY:         "🟢  ",
  HOLD:        "⚪  ",
  SELL:        "🔴  ",
  STRONG_SELL: "🔴🔴",
};

export function printReport(analyses: AssetAnalysis[]): void {
  const now = new Date().toLocaleString();
  console.log(`\n${"═".repeat(72)}`);
  console.log(`  MUNGER 48-MONTH TRACKER  —  ${now}`);
  console.log(`${"═".repeat(72)}`);

  for (const a of analyses) {
    const icon = SIGNAL_ICON[a.signal] ?? "   ";
    const devStr = `${a.deviation >= 0 ? "+" : ""}${(a.deviation * 100).toFixed(1)}%`;
    const avgStr = formatPrice(a.avg48);
    const curStr = formatPrice(a.currentPrice);

    console.log();
    console.log(`  ${icon}  ${a.name.padEnd(18)} (${a.symbol})`);
    console.log(`       Current : ${curStr.padStart(12)}`);
    console.log(`       48m Avg : ${avgStr.padStart(12)}`);
    console.log(`       Dev     : ${devStr.padStart(12)}`);
    console.log(`       Signal  : ${a.signal}`);
    console.log(`       Action  : ${a.suggestedAction}`);
  }

  console.log(`\n${"═".repeat(72)}\n`);

  // Summary table
  console.log("  SUMMARY");
  console.log("  " + "─".repeat(68));
  console.log(`  ${"Asset".padEnd(20)} ${"Price".padStart(12)} ${"48m Avg".padStart(12)} ${"Dev".padStart(8)}  Signal`);
  console.log("  " + "─".repeat(68));
  for (const a of analyses) {
    const dev = `${a.deviation >= 0 ? "+" : ""}${(a.deviation * 100).toFixed(1)}%`;
    console.log(
      `  ${a.name.padEnd(20)} ${formatPrice(a.currentPrice).padStart(12)} ${formatPrice(a.avg48).padStart(12)} ${dev.padStart(8)}  ${a.signal}`
    );
  }
  console.log("  " + "─".repeat(68));
}

function formatPrice(p: number): string {
  if (p >= 1000) return p.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  if (p >= 1)    return p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return p.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}
