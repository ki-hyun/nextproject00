import { getSimple } from '@/lib/redis';
import MiningClient from './MiningClient';

export default async function MiningPage() {
  // Fetch 'asics' data from Redis.
  // It resolves to an array or null.
  let asicsData = [];
  try {
    const rawData = await getSimple('asics');
    if (Array.isArray(rawData)) {
      asicsData = rawData;
    }
  } catch (err) {
    console.error("Failed to fetch asics data from Redis:", err);
  }

  return (
    <MiningClient asicsData={asicsData} />
  );
}