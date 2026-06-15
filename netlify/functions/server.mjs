import handler from "../../dist/server/server.js";

export default async (req, context) => {
  return handler.fetch(req, {}, context);
};

export const config = {
  path: "/*",
};
