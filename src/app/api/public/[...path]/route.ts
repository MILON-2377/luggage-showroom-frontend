import "server-only";

import { createProxyHandler } from "@/src/lib/api/server/create-proxy-handler";


const handler = createProxyHandler("PUBLIC");

export {
    handler as GET,
    handler as POST,
    handler as PUT,
    handler as PATCH,
    handler as DELETE,
    handler as HEAD,
};