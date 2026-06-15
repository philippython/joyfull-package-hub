import handler from "../../dist/server/server.js";

export default async (req, context) => {
  return handler.fetch(req, process.env, context);
};

export const config = {
  path: "/*",
  excludedPath: ["/assets/*"],
};
