'use client';

import { useState, useEffect } from 'react';
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
  initialDifficulty?: number;
  initialNetworkHashRateFormatted?: string;
  initialNetworkHashRateTHs?: number;
  initialBtcPrice?: number;
}

export default function MiningClient({ asicsData, initialDifficulty = 0, initialNetworkHashRateFormatted = '', initialNetworkHashRateTHs = 0, initialBtcPrice = 0 }: MiningClientProps) {
  const findS21 = () => {
    for (const asic of asicsData) {
      const name = asic.name?.replace(/^"|"$/g, '').replace(/^\\"|\\"$/g, '') || '';
      if (/antminer s21(\s*$)/i.test(name)) {
        return {
          name,
          hashrate: Number(asic.hashrate || 0) / 1000000000000,
          power: Number(asic.power || 0),
        };
      }
    }
    return null;
  };

  const s21Default = findS21();

  const [hashRate, setHashRate] = useState(s21Default?.hashrate ?? 200);
  const [powerConsumption, setPowerConsumption] = useState(s21Default?.power ?? 3500);
  const [electricityRate, setElectricityRate] = useState(0.1);
  const [poolFee, setPoolFee] = useState(0);
  const [monthlyDepreciation, setMonthlyDepreciation] = useState(0); // 감가상각 (월)
  const [monthlyOtherCost, setMonthlyOtherCost] = useState(0);       // 기타비용 (월)
  const [btcPrice, setBtcPrice] = useState(initialBtcPrice > 0 ? initialBtcPrice : 67000);
  const [appliedBtcPrice, setAppliedBtcPrice] = useState(btcPrice);
  const [difficulty, setDifficulty] = useState(initialDifficulty > 0 ? initialDifficulty : 72676943932377);
  const [blockReward, setBlockReward] = useState(3.125);
  const [selectedAsicName, setSelectedAsicName] = useState(s21Default?.name ?? '');
  const [asicSearch, setAsicSearch] = useState('');


  const [results, setResults] = useState({
    hourly:  { btc: 0, usd: 0, cost: 0, profit: 0 },
    daily:   { btc: 0, usd: 0, cost: 0, profit: 0 },
    weekly:  { btc: 0, usd: 0, cost: 0, profit: 0 },
    monthly: { btc: 0, usd: 0, cost: 0, profit: 0 },
    yearly:  { btc: 0, usd: 0, cost: 0, profit: 0 },
  });

  const cleanedAsics = asicsData.map(asic => {
    const name = asic.name?.replace(/^"|"$/g, '').replace(/^\\"|\\"$/g, '') || 'Unknown';
    let formattedRelease = asic.release || '';
    if (formattedRelease.length === 4 && !isNaN(Number(formattedRelease))) {
      formattedRelease = `20${formattedRelease.substring(0, 2)}-${formattedRelease.substring(2, 4)}`;
    }
    const hrNumeric = Number(asic.hashrate || 0) / 1000000000000;
    const powerNumeric = Number(asic.power || 0);
    return {
      name,
      releaseRaw: Number(asic.release || 0),
      releaseFormatted: formattedRelease,
      hashrate: hrNumeric,
      power: powerNumeric,
    };
  }).sort((a, b) => b.releaseRaw - a.releaseRaw);

  const calculateProfitability = () => {
    const hashRateHs = hashRate * Math.pow(10, 12);
    const btcPerSecond = (hashRateHs * blockReward) / (difficulty * Math.pow(2, 32));
    const powerCostPerHour = (powerConsumption / 1000) * electricityRate;

    // 월 비용 합산 후 각 기간으로 배분
    const totalMonthly     = monthlyDepreciation + monthlyOtherCost;
    const extraCostPerHour = totalMonthly / 730;
    const extraCostPerDay  = totalMonthly / 30.44;
    const extraCostPerWeek = totalMonthly / 4.345;

    const periods = {
      hourly:  { btc: btcPerSecond * 3600,     cost: powerCostPerHour + extraCostPerHour },
      daily:   { btc: btcPerSecond * 86400,    cost: powerCostPerHour * 24 + extraCostPerDay },
      weekly:  { btc: btcPerSecond * 604800,   cost: powerCostPerHour * 168 + extraCostPerWeek },
      monthly: { btc: btcPerSecond * 2629746,  cost: powerCostPerHour * 730 + totalMonthly },
      yearly:  { btc: btcPerSecond * 31556952, cost: powerCostPerHour * 8760 + totalMonthly * 12 },
    };

    const newResults: any = {};
    Object.keys(periods).forEach(period => {
      const { btc, cost } = periods[period as keyof typeof periods];
      const grossUsd = btc * btcPrice;
      const poolFeeAmount = grossUsd * (poolFee / 100);
      const netUsd = grossUsd - poolFeeAmount;
      newResults[period] = { btc, usd: netUsd, cost, profit: netUsd - cost };
    });
    setResults(newResults);
    setAppliedBtcPrice(btcPrice);
  };

  // 초기 로드 + ASIC 장비 선택 시 자동 계산
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    calculateProfitability();
  }, [selectedAsicName]);

  const periodRows = [
    { key: 'hourly',  label: <T ns="mining" k="hourly"  fallback="시간당" />, data: results.hourly },
    { key: 'daily',   label: <T ns="mining" k="daily"   fallback="일일" />,   data: results.daily },
    { key: 'weekly',  label: <T ns="mining" k="weekly"  fallback="주간" />,   data: results.weekly },
    { key: 'monthly', label: <T ns="mining" k="monthly" fallback="월간" />,   data: results.monthly },
    { key: 'yearly',  label: <T ns="mining" k="yearly"  fallback="연간" />,   data: results.yearly },
  ];

  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--theme-bg-light)' }}>
      <main className="container mx-auto px-0 py-4 md:px-4 md:py-10 max-w-7xl">

        {/* Header */}
        <div className="mb-8 px-4 md:px-0">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow text-xl"
                  style={{ backgroundColor: 'var(--theme-primary)' }}>
                  ⛏️
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  <T ns="mining" k="title" fallback="비트코인 마이닝 수익성 계산기" />
                </h1>
              </div>
              <p className="text-sm text-gray-500" style={{ paddingLeft: '3.25rem' }}>
                <T ns="mining" k="subtitle" fallback="마이닝 장비 사양과 전기료를 입력하여 예상 수익을 계산해보세요" />
              </p>
            </div>
            {selectedAsicName && (() => {
              const selectedAsic = cleanedAsics.find(a => a.name === selectedAsicName);
              return (
                <div className="flex flex-col items-end">
                  <p className="text-xs text-gray-400 mb-1">선택된 채굴기</p>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-sm border"
                    style={{ backgroundColor: 'var(--theme-primary)', borderColor: 'var(--theme-primary)', color: 'var(--theme-text-on-primary)' }}>
                    <span className="text-lg">⛏️</span>
                    <span className="text-lg font-bold">{selectedAsicName}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    {hashRate.toFixed(0)} TH/s · {powerConsumption}W
                    {selectedAsic?.releaseFormatted && ` (${selectedAsic.releaseFormatted})`}
                  </p>
                </div>
              );
            })()}
          </div>
        </div>

        {/* ASIC 장비 선택 */}
        <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50 shadow-sm text-gray-900">
          <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
            <h3 className="font-bold text-base">
              <T ns="mining" k="popular_equipment" fallback="인기 마이닝 장비" />
              {asicSearch && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  {cleanedAsics.filter(a => a.name.toLowerCase().includes(asicSearch.toLowerCase())).length}개 결과
                </span>
              )}
            </h3>
            <div className="relative">
              <input
                type="text"
                value={asicSearch}
                onChange={(e) => setAsicSearch(e.target.value)}
                placeholder="채굴기 검색..."
                className="pl-8 pr-3 py-1.5 rounded-lg border text-sm text-gray-800 focus:outline-none focus:ring-2 w-48"
                style={{ borderColor: 'var(--theme-border)' }}
              />
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {asicSearch && (
                <button
                  onClick={() => setAsicSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          {(() => {
            if (cleanedAsics.length === 0) return (
              <div className="p-3 text-sm text-gray-500">No data found in Redis.</div>
            );
            const filtered = cleanedAsics.filter(a =>
              a.name.toLowerCase().includes(asicSearch.toLowerCase())
            );
            return (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                {filtered.length === 0 ? (
                  <div className="p-3 text-sm text-gray-400 col-span-full text-center">검색 결과가 없습니다.</div>
                ) : filtered.map((asic, idx) => {
                  const efficiency = asic.power > 0 ? (asic.hashrate / (asic.power / 1000)).toFixed(1) : '-';
                  const effNum = Number(efficiency);
                  const effColor = effNum >= 100 ? '#22c55e' : effNum >= 50 ? '#f59e0b' : '#ef4444';
                  const isSelected = selectedAsicName === asic.name;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl cursor-pointer transition-all border"
                      style={{
                        backgroundColor: isSelected ? 'var(--theme-primary)' : 'transparent',
                        borderColor: isSelected ? 'var(--theme-primary)' : 'var(--theme-border)',
                        color: isSelected ? 'var(--theme-text-on-primary)' : 'inherit',
                      }}
                      onClick={() => {
                        setHashRate(asic.hashrate);
                        setPowerConsumption(asic.power);
                        setSelectedAsicName(asic.name);
                      }}
                    >
                      <p className="font-semibold text-xs leading-tight mb-2 line-clamp-2">{asic.name}</p>
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-xs">
                          <span className={isSelected ? 'opacity-80' : 'text-gray-500'}>{asic.hashrate.toFixed(0)} TH/s</span>
                          <span className={isSelected ? 'opacity-80' : 'text-gray-500'}>{asic.power}W</span>
                        </div>
                        <div className="flex justify-between text-xs items-center">
                          <span className={isSelected ? 'opacity-70' : 'text-gray-500'}><T ns="mining" k="efficiency" fallback="전성비" /></span>
                          <span className="font-bold" style={{ color: isSelected ? 'inherit' : effColor }}>
                            {efficiency} TH/kW
                          </span>
                        </div>
                        {asic.releaseFormatted && (
                          <p className={`text-xs text-right ${isSelected ? 'opacity-60' : 'text-gray-400'}`}>{asic.releaseFormatted}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* 총 마이닝 정보 */}
        {initialNetworkHashRateTHs > 0 && hashRate > 0 && (() => {
          const totalUnits = Math.round(initialNetworkHashRateTHs / hashRate);
          const totalPowerW = totalUnits * powerConsumption;
          const totalPowerGW = totalPowerW / 1e9;
          const totalElecCostPerHour = (totalPowerW / 1000) * electricityRate;
          const totalElecCostPerDay = totalElecCostPerHour * 24;

          const fmtUnits = (n: number) => n.toLocaleString('en-US');

          const fmtUSD = (n: number) => n.toLocaleString('en-US');

          return (
            <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50 shadow-sm text-gray-900">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-bold text-base">총 마이닝 정보</h3>
                <span className="text-xs text-gray-500">— {selectedAsicName || '선택된 장비'} 기준</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">추정 가동 대수</p>
                  <p className="text-xl font-bold text-gray-900">{fmtUnits(totalUnits)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">대</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">총 전력 소비</p>
                  <p className="text-xl font-bold text-gray-900">{totalPowerGW.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">GW</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">시간당 전기료</p>
                  <p className="text-xl font-bold text-gray-900">${fmtUSD(Math.round(totalElecCostPerHour))}</p>
                  <p className="text-xs text-gray-400 mt-0.5">USD/hr</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">일일 전기료</p>
                  <p className="text-xl font-bold text-gray-900">${fmtUSD(Math.round(totalElecCostPerDay))}</p>
                  <p className="text-xs text-gray-400 mt-0.5">USD/day</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                네트워크 해시레이트 {initialNetworkHashRateFormatted} ÷ {hashRate.toFixed(0)} TH/s × {powerConsumption}W 기준,
                전기료 ${electricityRate}/kWh 적용
              </p>
            </div>
          );
        })()}

        {/* 메인 2컬럼 */}
        <div className="grid lg:grid-cols-5 gap-6 lg:items-stretch">

          {/* 왼쪽: 입력 설정 (2/5) */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* 계산하기 버튼 */}
            <button
              onClick={calculateProfitability}
              className="w-full py-3 rounded-xl font-bold text-base shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
              style={{
                backgroundColor: 'var(--theme-primary)',
                color: 'var(--theme-text-on-primary)',
              }}
            >
              🔄 계산하기
            </button>

            {/* 하드웨어 설정 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50 shadow-sm text-gray-900">
              <h2 className="font-bold text-base mb-4">
                <T ns="mining" k="hardware_settings" fallback="마이닝 하드웨어 설정" />
              </h2>
              <div className="space-y-3">
                <InputRow
                  label={<T ns="mining" k="btc_price" fallback="BTC 가격" />}
                  unit="$"
                  value={btcPrice}
                  onChange={setBtcPrice}
                  step={100}
                  unitPosition="right"
                />
                <InputRow
                  label={<T ns="mining" k="hashrate" fallback="해시레이트" />}
                  unit="TH/s"
                  value={hashRate}
                  onChange={setHashRate}
                  step={1}
                />
                <InputRow
                  label={<T ns="mining" k="power_consumption" fallback="전력 소비" />}
                  unit="W"
                  value={powerConsumption}
                  onChange={setPowerConsumption}
                  step={10}
                />
                <InputRow
                  label={<T ns="mining" k="electricity_rate" fallback="전기료" />}
                  unit="$/kWh"
                  value={electricityRate}
                  onChange={setElectricityRate}
                  step={0.01}
                />
                <InputRow
                  label={<T ns="mining" k="pool_fee" fallback="풀 수수료" />}
                  unit="%"
                  value={poolFee}
                  onChange={setPoolFee}
                  step={0.1}
                />
                <div className="border-t pt-3 mt-1 space-y-3" style={{ borderColor: 'var(--theme-border)' }}>
                  <InputRow
                    label={<T ns="mining" k="monthly_depreciation" fallback="감가상각 (월)" />}
                    unit="$/월"
                    value={monthlyDepreciation}
                    onChange={setMonthlyDepreciation}
                    step={10}
                    unitPosition="right"
                  />
                  <InputRow
                    label={<T ns="mining" k="monthly_other_cost" fallback="기타비용 (월)" />}
                    unit="$/월"
                    value={monthlyOtherCost}
                    onChange={setMonthlyOtherCost}
                    step={10}
                    unitPosition="right"
                  />
                </div>
              </div>
            </div>

            {/* 네트워크 설정 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50 shadow-sm text-gray-900">
              <h2 className="font-bold text-base mb-4">
                <T ns="mining" k="network_info" fallback="네트워크 정보" />
              </h2>
              <div className="space-y-3">
                <InputRow
                  label={<T ns="mining" k="difficulty" fallback="난이도" />}
                  unit=""
                  value={difficulty}
                  onChange={setDifficulty}
                />
                <InputRow
                  label={<T ns="mining" k="block_reward" fallback="블록 보상" />}
                  unit=""
                  value={blockReward}
                  onChange={setBlockReward}
                  step={0.001}
                />
                <div className="grid items-center gap-2" style={{ gridTemplateColumns: '7rem 1fr 3rem' }}>
                  <label className="text-xs font-medium text-gray-600 whitespace-nowrap">
                    <T ns="mining" k="network_hashrate" fallback="네트워크 해시레이트" />
                  </label>
                  <div className="flex items-center gap-1">
                    <div className="w-full px-3 py-2 text-sm font-semibold text-gray-800 text-right">
                      {initialNetworkHashRateFormatted || 'N/A'}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500"></span>
                </div>
              </div>
            </div>

          </div>

          {/* 오른쪽: 결과 (3/5) */}
          <div className="lg:col-span-3 flex flex-col gap-4">

            {/* 일일 수익 요약 + 손익분기 BTC 가격 */}
            {(() => {
              // 손익분기 BTC 가격 계산: 순이익 = 0 → btcPrice = dailyCost / (dailyBtc × (1 - poolFee/100))
              const dailyBtc = results.daily.btc;
              const dailyCost = results.daily.cost;
              const feeMultiplier = 1 - poolFee / 100;
              const breakEvenPrice = dailyBtc > 0 && feeMultiplier > 0
                ? dailyCost / (dailyBtc * feeMultiplier)
                : 0;

              return (
                <div className="flex flex-col gap-4">
                  {/* 상단: 일일 예상 수익 */}
                  <div className="rounded-2xl p-6 border border-gray-200/50 shadow-sm flex flex-col gap-5"
                    style={{ backgroundColor: 'var(--theme-primary)', color: 'var(--theme-text-on-primary)' }}>

                    {/* 타이틀 */}
                    <p className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--theme-text-muted-on-primary)' }}>
                      <T ns="mining" k="daily" fallback="일일" /> <T ns="mining" k="expected_profit" fallback="예상 수익" />
                    </p>

                    {/* 순이익 강조 */}
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--theme-text-muted-on-primary)' }}>
                        <T ns="mining" k="net_profit" fallback="순이익" />
                      </p>
                      <p className="text-4xl font-bold tracking-tight"
                        style={{ color: results.daily.profit < 0 ? '#ef4444' : 'var(--theme-text-on-primary)' }}>
                        ${results.daily.profit.toFixed(2)}
                      </p>
                    </div>

                    {/* 구분선 */}
                    <div className="border-t" style={{ borderColor: 'var(--theme-text-muted-on-primary)', opacity: 0.3 }} />

                    {/* BTC / 수익 / 전기료 */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs mb-1" style={{ color: 'var(--theme-text-muted-on-primary)' }}>BTC</p>
                        <p className="text-base font-bold">{results.daily.btc.toFixed(6)}</p>
                      </div>
                      <div>
                        <p className="text-xs mb-1" style={{ color: 'var(--theme-text-muted-on-primary)' }}>
                          <T ns="mining" k="profit" fallback="수익" />
                        </p>
                        <p className="text-base font-bold">${results.daily.usd.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs mb-1" style={{ color: 'var(--theme-text-muted-on-primary)' }}>
                          <T ns="mining" k="electricity_cost" fallback="전기료" />
                        </p>
                        <p className="text-base font-bold">${results.daily.cost.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* 하단: 손익분기 BTC 가격 */}
                  <div className="rounded-2xl p-6 border border-gray-200/50 shadow-sm flex flex-col justify-between"
                    style={{ backgroundColor: breakEvenPrice > appliedBtcPrice ? '#fef2f2' : '#f0fdf4' }}>

                    {/* 타이틀 */}
                    <div>
                      <p className="text-sm font-semibold tracking-wide uppercase text-gray-500 mb-4">
                        손익분기 BTC 가격
                      </p>
                    </div>

                    {/* 손익분기 가격 */}
                    <div className="mb-4">
                      <p className="text-3xl font-bold tracking-tight text-gray-900">
                        ${breakEvenPrice > 0 ? breakEvenPrice.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 기간별 수익 표 */}
            <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm text-gray-900 overflow-auto">
              <div className="px-5 pt-4 pb-2">
                <h3 className="font-bold text-base">
                  <T ns="mining" k="expected_profit" fallback="예상 수익" />
                </h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--theme-border)' }}>
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">기간</th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase">BTC</th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase">
                      <T ns="mining" k="profit" fallback="수익" />
                    </th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase">
                      <T ns="mining" k="electricity_cost" fallback="전기료" />
                    </th>
                    <th className="px-5 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase">
                      <T ns="mining" k="net_profit" fallback="순이익" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {periodRows.map(({ key, label, data }) => (
                    <tr key={key}
                      className="border-b last:border-0 hover:bg-black/5 transition-colors"
                      style={{ borderColor: 'var(--theme-border)' }}>
                      <td className="px-5 py-3 font-medium text-sm">{label}</td>
                      <td className="px-3 py-3 text-right text-blue-500 font-mono text-xs">
                        {data.btc.toFixed(key === 'hourly' ? 8 : key === 'daily' ? 6 : key === 'yearly' ? 4 : 5)}
                      </td>
                      <td className="px-3 py-3 text-right text-green-600 font-medium">
                        ${data.usd.toFixed(2)}
                      </td>
                      <td className="px-3 py-3 text-right text-red-500 font-medium">
                        ${data.cost.toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-right font-bold">
                        <span className={data.profit >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                          ${data.profit.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* 참고사항 */}
        <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50 shadow-sm text-gray-900 space-y-2">
          <div className="flex gap-2 text-xs text-gray-600">
            <span>ℹ️</span>
            <p><T ns="mining" k="note_1" fallback="실제 수익은 네트워크 난이도 변화, 전기료 변동 등으로 달라질 수 있습니다." /></p>
          </div>
          <div className="flex gap-2 text-xs text-gray-600">
            <span>⚠️</span>
            <p><T ns="mining" k="note_2" fallback="풀 수수료, 하드웨어 감가상각, 유지보수 비용 등을 고려하세요." /></p>
          </div>
          <div className="flex gap-2 text-xs text-gray-600">
            <span>💡</span>
            <p><T ns="mining" k="note_3" fallback="전기료가 수익성에 가장 큰 영향을 미칩니다." /></p>
          </div>
        </div>

      </main>
    </div>
  );
}

function InputRow({
  label,
  unit,
  value,
  onChange,
  step = 1,
  unitPosition = 'right',
}: {
  label: React.ReactNode;
  unit: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  unitPosition?: 'left' | 'right';
}) {
  return (
    <div className="grid items-center gap-2" style={{ gridTemplateColumns: '7rem 1fr 3rem' }}>
      <label className="text-xs font-medium text-gray-600 whitespace-nowrap">
        {label}
      </label>
      <div className="flex items-center gap-1">
        {unitPosition === 'left' && (
          <span className="text-xs text-gray-500 shrink-0">{unit}</span>
        )}
        <input
          type="number"
          value={value}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg border text-sm text-black text-right focus:outline-none focus:ring-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          style={{ borderColor: 'var(--theme-border)' }}
        />
      </div>
      <span className="text-xs text-gray-500">
        {unitPosition === 'right' ? unit : ''}
      </span>
    </div>
  );
}
