import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.log('Redis Client Error', err));

// 연결 상태 확인하고 연결
async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
}

export { client, connectRedis };