import { getSimple } from '@/lib/redis';
import { getRealTimeHashrate, formatHashrate } from '@/lib/getRealTimeInfo';
import MiningClient from './MiningClient';

export default async function MiningPage() {
  let asicsData = [];
  let initialDifficulty = 0;
  let initialNetworkHashRateFormatted = '';
  let initialNetworkHashRateTHs = 0;
  let initialBtcPrice = 0;

  try {
    const rawData = await getSimple('asics');
    if (Array.isArray(rawData)) {
      asicsData = rawData;
    }
  } catch (err) {
    console.error("Failed to fetch asics data from Redis:", err);
  }

  try {
    const rtData = await getRealTimeHashrate();
    if (rtData?.difficulty) {
      initialDifficulty = rtData.difficulty;
    }
    if (rtData?.hash_rate) {
      // coinwarz 파싱 성공 시 H/s, 실패 시 blockchain.info는 GH/s
      // GH/s 여부는 크기로 판단: 현재 네트워크 ~800 EH/s = 8e20 H/s vs 8e11 GH/s
      const hashRateHS = rtData.hash_rate < 1e15
        ? rtData.hash_rate * 1e9   // GH/s → H/s
        : rtData.hash_rate;        // 이미 H/s
      initialNetworkHashRateFormatted = formatHashrate(hashRateHS, 2);
      initialNetworkHashRateTHs = hashRateHS / 1e12;
    }
    if (rtData?.market_price_usd) {
      initialBtcPrice = Math.round(rtData.market_price_usd);
    }
  } catch (err) {
    console.error("Failed to fetch real-time hashrate data:", err);
  }

  return (
    <MiningClient
      asicsData={asicsData}
      initialDifficulty={initialDifficulty}
      initialNetworkHashRateFormatted={initialNetworkHashRateFormatted}
      initialNetworkHashRateTHs={initialNetworkHashRateTHs}
      initialBtcPrice={initialBtcPrice}
    />
  );
}