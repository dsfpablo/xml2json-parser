import NodeCache from "node-cache";

export const cache = new NodeCache({ stdTTL: 60 * 60, checkperiod: 60 * 10 }); // 1 hour TTL, check every 10 minutes
