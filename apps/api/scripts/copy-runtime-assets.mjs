import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workspace = dirname(dirname(fileURLToPath(import.meta.url)));
const source = resolve(workspace, "src/session-auth.js");
const destination = resolve(workspace, "dist/session-auth.js");
await mkdir(dirname(destination), { recursive: true });
await copyFile(source, destination);
console.log("Copied the framework-neutral session resolver into the API runtime bundle.");
