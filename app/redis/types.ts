export interface RedisData {
  key: string;
  value: string;
  timestamp: number;
}

export interface RedisStats {
  totalKeys: number;
  testKeys: number;
  memoryUsage: string;
  redisInfo: string;
}