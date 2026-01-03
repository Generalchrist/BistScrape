import { LRUCache } from "lru-cache";

export const cache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 60 * 24 * 7, // 1 hafta
});
