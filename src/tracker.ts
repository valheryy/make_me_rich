import { TrackerOrchestrator } from "./services/TrackerOrchestrator";
import { printReport } from "./report/ConsoleReport";

async function main() {
  console.log("Fetching price history...");
  const orchestrator = new TrackerOrchestrator();
  const results = await orchestrator.runAll();
  printReport(results);
}

main().catch(console.error);
