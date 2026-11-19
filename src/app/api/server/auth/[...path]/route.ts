import "server-only";

import { createAuthProxyHandler } from "@/src/lib/api/server/create-auth-proxy-handler";


const handler = createAuthProxyHandler();

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as HEAD,
};