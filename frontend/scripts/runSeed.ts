import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  await import("./seedHistoricalEvents");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});