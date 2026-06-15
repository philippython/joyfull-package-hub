import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const handler = await import(join(__dirname, "server-bundle.js"));

export default async (req, context) => {
  return handler.default.fetch(req, process.env, context);
};

export const config = {
  path: "/*",
  excludedPath: ["/assets/*"],
};
