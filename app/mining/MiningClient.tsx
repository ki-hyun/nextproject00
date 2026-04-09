'use client';

import { useState, useEffect, useCallback } from 'react';
import DeleteIndexButton from '@/components/DeleteIndexButton';
import T from '@/components/T';

interface AsicData {
 name: string;
 release?: string;
 hashrate: string;
 power: string;
}

interface MiningClientProps {
 asicsData: AsicData[];
}

export default function MiningClient({ asicsData }: MiningClientProps) {
 // Calculator input states
 const [hashRate, setHashRate] = useState(200);
 const [powerConsumption, setPowerConsumption] = useState(3500);
 const [electricityRate, setElectricityRate] = useState(0.1);
 const [poolFee, setPoolFee] = useState(0);
 const [hardwareCost, setHardwareCost] = useState(0);
 const [btcPrice, setBtcPrice] = useState(67000);
 const [difficulty, setDifficulty] = useState(72676943932377);
 const [blockReward, setBlockReward] = useState(6.25);
 const [networkHashRate, setNetworkHashRate] = useState(520000000);

 // Results state
 const [results, setResults] = useState({
 hourly: { btc: 0, usd: 0, cost: 0, profit: 0 },
 daily: { btc: 0, usd: 0, cost: 0, profit: 0 },
 weekly: { btc: 0, usd: 0, cost: 0, profit: 0 },
 monthly: { btc: 0, usd: 0, cost: 0, profit: 0 }
 });

 // Clean data properties to numbers and strings for display
 const cleanedAsics = asicsData.map(asic => {
 // Remove leading/trailing escaped strings
 const name = asic.name?.replace(/^"|"$/g, '').replace(/^\\"|\\"$/g, '') || "Unknown Setup";
 
 let formattedRelease = asic.release || "";
 if (formattedRelease.length === 4 && !isNaN(Number(formattedRelease))) {
 formattedRelease = `20${formattedRelease.substring(0, 2)}-${formattedRelease.substring(2, 4)}`;
 }

 // Hashrate is in Hashes/s, convert to TH/s
 const hrNumeric = Number(asic.hashrate || 0) / 1000000000000;
 
 // Power is in Watts
 const powerNumeric = Number(asic.power || 0);

 return {
 name,
 releaseRaw: Number(asic.release || 0),
 releaseFormatted: formattedRelease,
 hashrate: hrNumeric,
 power: powerNumeric
 };
 }).sort((a, b) => b.releaseRaw - a.releaseRaw);

 // Mining profitability calculation
 const calculateProfitability = useCallback(() => {
 // Convert TH/s to H/s for calculation
 const hashRateHs = hashRate * Math.pow(10, 12);

 // Calculate expected BTC per second
 const btcPerSecond = (hashRateHs * blockReward) / (difficulty * Math.pow(2, 32) / Math.pow(10, 12));

 // Calculate power cost per hour
 const powerCostPerHour = (powerConsumption / 1000) * electricityRate;

 // Calculate for different time periods
 const periods = {
 hourly: {
 btc: btcPerSecond * 3600,
 cost: powerCostPerHour
 },
 daily: {
 btc: btcPerSecond * 86400,
 cost: powerCostPerHour * 24
 },
 weekly: {
 btc: btcPerSecond * 604800,
 cost: powerCostPerHour * 168
 },
 monthly: {
 btc: btcPerSecond * 2629746,
 cost: powerCostPerHour * 730
 }
 };

 // Calculate USD earnings and profit for each period
 const newResults: any = {};
 Object.keys(periods).forEach(period => {
 const { btc, cost } = periods[period as keyof typeof periods];
 const grossUsd = btc * btcPrice;
 const poolFeeAmount = grossUsd * (poolFee / 100);
 const netUsd = grossUsd - poolFeeAmount;
 const profit = netUsd - cost;

 newResults[period] = {
 btc: btc,
 usd: netUsd,
 cost: cost,
 profit: profit
 };
 });

 setResults(newResults);
 }, [hashRate, powerConsumption, electricityRate, poolFee, btcPrice, difficulty, blockReward]);

 useEffect(() => {
 calculateProfitability();
 }, [calculateProfitability]);

 const handleCalculate = () => {
 calculateProfitability();
 };

 return (
 <div className="min-h-screen bg-gray-50 transition-colors" style={{ backgroundColor: 'var(--theme-bg-light)' }}>
 <main className="container mx-auto px-6 py-16">
 <div className="max-w-6xl mx-auto">
 {/* Header */}
 <div className="text-center mb-12">
 <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-white font-bold text-2xl"
 style={{ backgroundColor: 'var(--theme-primary)' }}>
 ⛏️
 </div>
 <h1 className="text-3xl font-bold mb-2 text-gray-900">
 <T ns="mining" k="title" fallback="비트코인 마이닝 수익성 계산기" />
 </h1>
 <p className="opacity-80">
 <T ns="mining" k="subtitle" fallback="마이닝 장비 사양과 전기료를 입력하여 예상 수익을 계산해보세요" />
 </p>
 </div>

 {/* Popular Equipments (Moved to top and full width) */}
 <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm text-gray-900 ">
 <h3 className="text-lg font-bold mb-4">
 <T ns="mining" k="popular_equipment" fallback="인기 마이닝 장비" />
 </h3>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
 {cleanedAsics.length === 0 ? (
 <div className="p-3 text-sm opacity-60 col-span-full">No data found in Redis.</div>
 ) : (
 cleanedAsics.map((asic, idx) => (
 <div key={idx} 
 className="p-3 rounded-lg cursor-pointer transition-all hover:opacity-80 bg-black/5 border border-transparent hover:border-gray-300 :border-gray-600"
 onClick={() => {
 setHashRate(asic.hashrate);
 setPowerConsumption(asic.power);
 }}>
 <div className="flex items-start justify-between mb-2">
 <span className="font-medium text-sm mr-2 break-all">{asic.name}</span>
 <span className="text-xs px-2 py-1 rounded whitespace-nowrap shrink-0 mt-0.5" style={{ backgroundColor: 'var(--theme-primary)', color: 'var(--theme-text-on-primary)', opacity: 0.8 }}>
 <T ns="mining" k="select" fallback="선택" />
 </span>
 </div>
 <div className="text-xs opacity-70 flex justify-between mb-1">
 <p><T ns="mining" k="release_date" fallback="출시일" /></p>
 <p>{asic.releaseFormatted || "-"}</p>
 </div>
 <div className="text-xs opacity-70 flex justify-between">
 <p>{asic.hashrate.toFixed(0)} TH/s</p>
 <p>{asic.power}W</p>
 </div>
 </div>
 ))
 )}
 </div>
 </div>

 <div className="space-y-6">
 {/* Input Form */}
 <div className="space-y-6 text-gray-900">
 {/* Hardware Settings */}
 <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
 <h2 className="text-xl font-bold mb-6">
 <T ns="mining" k="hardware_settings" fallback="마이닝 하드웨어 설정" />
 </h2>

 <div className="grid md:grid-cols-2 gap-6">
 <div>
 <label className="block text-sm font-medium mb-2 opacity-80">
 <T ns="mining" k="hashrate" fallback="해시레이트 (TH/s)" />
 </label>
 <input
 type="number"
 value={hashRate}
 onChange={(e) => setHashRate(Number(e.target.value))}
 className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-opacity-50 transition-all text-black "
 style={{ borderColor: 'var(--theme-border)' }}
 placeholder="200"
 />
 </div>

 <div>
 <label className="block text-sm font-medium mb-2 opacity-80">
 <T ns="mining" k="power_consumption" fallback="전력 소비 (W)" />
 </label>
 <input
 type="number"
 value={powerConsumption}
 onChange={(e) => setPowerConsumption(Number(e.target.value))}
 className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-opacity-50 transition-all text-black "
 style={{ borderColor: 'var(--theme-border)' }}
 placeholder="3500"
 />
 </div>

 <div>
 <label className="block text-sm font-medium mb-2 opacity-80">
 <T ns="mining" k="electricity_rate" fallback="전기료 ($/kWh)" />
 </label>
 <input
 type="number"
 step="0.01"
 value={electricityRate}
 onChange={(e) => setElectricityRate(Number(e.target.value))}
 className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-opacity-50 transition-all text-black "
 style={{ borderColor: 'var(--theme-border)' }}
 placeholder="0.10"
 />
 </div>

 <div>
 <label className="block text-sm font-medium mb-2 opacity-80">
 <T ns="mining" k="pool_fee" fallback="풀 수수료 (%)" />
 </label>
 <input
 type="number"
 step="0.1"
 value={poolFee}
 onChange={(e) => setPoolFee(Number(e.target.value))}
 className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-opacity-50 transition-all text-black "
 style={{ borderColor: 'var(--theme-border)' }}
 placeholder="0.0"
 />
 </div>

 <div>
 <label className="block text-sm font-medium mb-2 opacity-80">
 <T ns="mining" k="hardware_cost" fallback="하드웨어 비용 ($)" />
 </label>
 <input
 type="number"
 value={hardwareCost}
 onChange={(e) => setHardwareCost(Number(e.target.value))}
 className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-opacity-50 transition-all text-black "
 style={{ borderColor: 'var(--theme-border)' }}
 placeholder="0"
 />
 </div>

 <div>
 <label className="block text-sm font-medium mb-2 opacity-80">
 <T ns="mining" k="btc_price" fallback="BTC 가격 ($)" />
 </label>
 <input
 type="number"
 value={btcPrice}
 onChange={(e) => setBtcPrice(Number(e.target.value))}
 className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-opacity-50 transition-all text-black "
 style={{ borderColor: 'var(--theme-border)' }}
 placeholder="67000"
 />
 </div>
 </div>

 <div className="mt-6">
 <button
 onClick={handleCalculate}
 className="w-full py-3 rounded-lg font-semibold shadow-md transition-all text-white hover:opacity-90 transform hover:-translate-y-0.5"
 style={{ backgroundColor: 'var(--theme-primary)', color: 'var(--theme-text-on-primary)' }}
 >
 <T ns="mining" k="calculate_button" fallback="수익성 계산하기" />
 </button>
 </div>
 </div>

 {/* Profitability Results */}
 <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm text-gray-900 ">
 <h3 className="text-lg font-bold mb-4">
 <T ns="mining" k="expected_profit" fallback="예상 수익" />
 </h3>

 <div className="space-y-4">
 {/* Hourly */}
 <div className="border rounded-lg p-4" style={{ borderColor: 'var(--theme-border)' }}>
 <h4 className="font-medium mb-3 opacity-90"><T ns="mining" k="hourly" fallback="시간당" /></h4>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
 <div className="p-3 rounded-lg bg-black/5 ">
 <p className="text-xs opacity-70">BTC</p>
 <p className="text-sm font-bold text-blue-500">{results.hourly.btc.toFixed(8)}</p>
 </div>
 <div className="p-3 rounded-lg bg-black/5 ">
 <p className="text-xs opacity-70"><T ns="mining" k="profit" fallback="수익" /></p>
 <p className="text-sm font-bold text-green-500">${results.hourly.usd.toFixed(2)}</p>
 </div>
 <div className="p-3 rounded-lg bg-black/5 ">
 <p className="text-xs opacity-70"><T ns="mining" k="electricity_cost" fallback="전기료" /></p>
 <p className="text-sm font-bold text-red-500">${results.hourly.cost.toFixed(2)}</p>
 </div>
 <div className="p-3 rounded-lg bg-black/5 ">
 <p className="text-xs opacity-70"><T ns="mining" k="net_profit" fallback="순이익" /></p>
 <p className={`text-sm font-bold ${results.hourly.profit >= 0 ? 'text-purple-500' : 'text-red-500'}`}>
 ${results.hourly.profit.toFixed(2)}
 </p>
 </div>
 </div>
 </div>

 {/* Daily */}
 <div className="border rounded-lg p-4" style={{ borderColor: 'var(--theme-border)' }}>
 <h4 className="font-medium mb-3 opacity-90"><T ns="mining" k="daily" fallback="일일" /></h4>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
 <div className="p-3 rounded-lg bg-black/5 ">
 <p className="text-xs opacity-70">BTC</p>
 <p className="text-sm font-bold text-blue-500">{results.daily.btc.toFixed(8)}</p>
 </div>
 <div className="p-3 rounded-lg bg-black/5 ">
 <p className="text-xs opacity-70"><T ns="mining" k="profit" fallback="수익" /></p>
 <p className="text-sm font-bold text-green-500">${results.daily.usd.toFixed(2)}</p>
 </div>
 <div className="p-3 rounded-lg bg-black/5 ">
 <p className="text-xs opacity-70"><T ns="mining" k="electricity_cost" fallback="전기료" /></p>
 <p className="text-sm font-bold text-red-500">${results.daily.cost.toFixed(2)}</p>
 </div>
 <div className="p-3 rounded-lg bg-black/5 ">
 <p className="text-xs opacity-70"><T ns="mining" k="net_profit" fallback="순이익" /></p>
 <p className={`text-sm font-bold ${results.daily.profit >= 0 ? 'text-purple-500' : 'text-red-500'}`}>
 ${results.daily.profit.toFixed(2)}
 </p>
 </div>
 </div>
 </div>

 {/* Weekly */}
 <div className="border rounded-lg p-4" style={{ borderColor: 'var(--theme-border)' }}>
 <h4 className="font-medium mb-3 opacity-90"><T ns="mining" k="weekly" fallback="주간" /></h4>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
 <div className="p-3 rounded-lg bg-black/5 ">
 <p className="text-xs opacity-70">BTC</p>
 <p className="text-sm font-bold text-blue-500">{results.weekly.btc.toFixed(8)}</p>
 </div>
 <div className="p-3 rounded-lg bg-black/5 ">
 <p className="text-xs opacity-70"><T ns="mining" k="profit" fallback="수익" /></p>
 <p className="text-sm font-bold text-green-500">${results.weekly.usd.toFixed(2)}</p>
 </div>
 <div className="p-3 rounded-lg bg-black/5 ">
 <p className="text-xs opacity-70"><T ns="mining" k="electricity_cost" fallback="전기료" /></p>
 <p className="text-sm font-bold text-red-500">${results.weekly.cost.toFixed(2)}</p>
 </div>
 <div className="p-3 rounded-lg bg-black/5 ">
 <p className="text-xs opacity-70"><T ns="mining" k="net_profit" fallback="순이익" /></p>
 <p className={`text-sm font-bold ${results.weekly.profit >= 0 ? 'text-purple-500' : 'text-red-500'}`}>
 ${results.weekly.profit.toFixed(2)}
 </p>
 </div>
 </div>
 </div>

 {/* Monthly */}
 <div className="border rounded-lg p-4" style={{ borderColor: 'var(--theme-border)' }}>
 <h4 className="font-medium mb-3 opacity-90"><T ns="mining" k="monthly" fallback="월간" /></h4>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
 <div className="p-3 rounded-lg bg-black/5 ">
 <p className="text-xs opacity-70">BTC</p>
 <p className="text-sm font-bold text-blue-500">{results.monthly.btc.toFixed(8)}</p>
 </div>
 <div className="p-3 rounded-lg bg-black/5 ">
 <p className="text-xs opacity-70"><T ns="mining" k="profit" fallback="수익" /></p>
 <p className="text-sm font-bold text-green-500">${results.monthly.usd.toFixed(2)}</p>
 </div>
 <div className="p-3 rounded-lg bg-black/5 ">
 <p className="text-xs opacity-70"><T ns="mining" k="electricity_cost" fallback="전기료" /></p>
 <p className="text-sm font-bold text-red-500">${results.monthly.cost.toFixed(2)}</p>
 </div>
 <div className="p-3 rounded-lg bg-black/5 ">
 <p className="text-xs opacity-70"><T ns="mining" k="net_profit" fallback="순이익" /></p>
 <p className={`text-sm font-bold ${results.monthly.profit >= 0 ? 'text-purple-500' : 'text-red-500'}`}>
 ${results.monthly.profit.toFixed(2)}
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Network Info */}
 <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm text-gray-900 ">
 <h3 className="text-lg font-bold mb-4">
 <T ns="mining" k="network_info" fallback="네트워크 정보" />
 </h3>
 <div className="space-y-4">
 <div>
 <label className="block text-sm font-medium mb-2 opacity-80">
 <T ns="mining" k="difficulty" fallback="난이도" />
 </label>
 <input
 type="number"
 value={difficulty}
 onChange={(e) => setDifficulty(Number(e.target.value))}
 className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-opacity-50 transition-all text-black "
 style={{ borderColor: 'var(--theme-border)' }}
 />
 </div>
 <div>
 <label className="block text-sm font-medium mb-2 opacity-80">
 <T ns="mining" k="block_reward" fallback="블록 보상 (BTC)" />
 </label>
 <input
 type="number"
 step="0.01"
 value={blockReward}
 onChange={(e) => setBlockReward(Number(e.target.value))}
 className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-opacity-50 transition-all text-black "
 style={{ borderColor: 'var(--theme-border)' }}
 />
 </div>
 <div>
 <label className="block text-sm font-medium mb-2 opacity-80">
 <T ns="mining" k="network_hashrate" fallback="네트워크 해시레이트 (TH/s)" />
 </label>
 <input
 type="number"
 value={networkHashRate}
 onChange={(e) => setNetworkHashRate(Number(e.target.value))}
 className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-opacity-50 transition-all text-black "
 style={{ borderColor: 'var(--theme-border)' }}
 />
 </div>
 </div>
 </div>
 
 {/* Calculation Notes */}
 <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
 <h3 className="text-lg font-bold mb-4">
 <T ns="mining" k="calculation_notes" fallback="계산 참고사항" />
 </h3>
 <div className="space-y-3 text-sm opacity-80">
 <div className="flex items-start space-x-2">
 <span className="text-blue-500 mt-0.5">ℹ️</span>
 <p><T ns="mining" k="note_1" fallback="실제 수익은 변경될 수 있습니다." /></p>
 </div>
 <div className="flex items-start space-x-2">
 <span className="text-yellow-500 mt-0.5">⚠️</span>
 <p><T ns="mining" k="note_2" fallback="유지보수 비용 등을 고려하세요." /></p>
 </div>
 <div className="flex items-start space-x-2">
 <span className="text-green-500 mt-0.5">💡</span>
 <p><T ns="mining" k="note_3" fallback="전기료가 가장 중요합니다." /></p>
 </div>
 </div>
 </div>

 {/* Disclaimer */}
 <div className="p-4 rounded-xl border bg-yellow-50/50 border-yellow-200 ">
 <div className="flex items-start space-x-2 mb-1">
 <span className="text-yellow-500 text-lg">⚠️</span>
 <p className="text-sm font-medium text-yellow-800 ">
 <T ns="mining" k="disclaimer_title" fallback="면책 조항" />
 </p>
 </div>
 <p className="text-xs text-yellow-700 ml-7">
 <T ns="mining" k="disclaimer_text" fallback="이 계산기는 참고용입니다." />
 </p>
 </div>

 {/* Site Admin Button */}
 <DeleteIndexButton />

 </div>
 </div>
 </div>
 </main>
 </div>
 );
}
