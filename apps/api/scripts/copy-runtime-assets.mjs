import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workspace = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceDirectory = resolve(workspace, "src");
const destinationDirectory = resolve(workspace, "dist");
const runtimeAssets = [
  "session-auth.js",
  "password-auth.js",
  "password-repository.js",
  "bootstrap-repository.js",
  "bootstrap-security.js",
];

await mkdir(destinationDirectory, { recursive: true });
for (const asset of runtimeAssets) {
  await copyFile(resolve(sourceDirectory, asset), resolve(destinationDirectory, asset));
}
console.log(`Copied runtime modules into the API bundle: ${runtimeAssets.join(", ")}.`);
