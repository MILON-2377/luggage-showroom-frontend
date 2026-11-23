
import { createAuthenticatedProxyHandler } from "@/src/lib/api/server/create-authenticated-proxy-handler";


const handler = createAuthenticatedProxyHandler();

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as HEAD,
};