import { getRealTimeHashrate, formatHashrate } from "@/lib/getRealTimeInfo";
import Chart from '@/components/Chart';
import DeleteIndexButton from '@/components/DeleteIndexButton';
import T from '@/components/T';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

export default async function BlockPage() {

  const chartSeries = [
    {
      name: 'Price',
      type: 'line' as const,
      data: [],
      color: '#d35400',
      lineWidth: 2,
      turboThreshold: 0,
      yAxis: 0,
      visible: true,
      tooltip: { valueDecimals: 2, valuePrefix: '$', valueSuffix: ' USD' },
      customData: { dataSource: 'price' }
    },
    {
      name: 'HashRate',
      type: 'line' as const,
      data: [],
      color: '#27ae60',
      lineWidth: 2,
      turboThreshold: 0,
      yAxis: 1,
      visible: true,
      tooltip: { valueDecimals: 2, valueSuffix: 'TH/s' },
      customData: { dataSource: 'hashrate' }
    },
    {
      name: 'Difficulty',
      type: 'line' as const,
      data: [],
      color: '#f1c40f',
      lineWidth: 2,
      turboThreshold: 0,
      yAxis: 2,
      visible: false,
      tooltip: { valueDecimals: 2, valueSuffix: '' },
      customData: { dataSource: 'difficulty', displayUnit: 'trillion' }
    },
  ];

  const _realtimehashrate = await getRealTimeHashrate();

  const BLOCKS_PER_ADJUSTMENT = 2016;
  const currentHeight = _realtimehashrate?.currentBlockHeight || 0;
  const blocksUntilAdjustment = BLOCKS_PER_ADJUSTMENT - (currentHeight % BLOCKS_PER_ADJUSTMENT);
  const nextAdjustmentBlock = currentHeight + blocksUntilAdjustment;
  const progressPercent = (currentHeight % BLOCKS_PER_ADJUSTMENT) / BLOCKS_PER_ADJUSTMENT * 100;

  let currentDifficultyAvgBlockTime = 10;
  if (_realtimehashrate?.lastDifficultyAdjustmentTime && currentHeight > _realtimehashrate?.lastDifficultyAdjustmentBlock) {
    const blocksSince = currentHeight - _realtimehashrate.lastDifficultyAdjustmentBlock;
    const timeSince = Date.now() - _realtimehashrate.lastDifficultyAdjustmentTime;
    currentDifficultyAvgBlockTime = (timeSince / (1000 * 60)) / blocksSince;
  }

  const minutesUntilAdjustment = blocksUntilAdjustment * currentDifficultyAvgBlockTime;
  const hoursUntilAdjustment = minutesUntilAdjustment / 60;

  const TARGET_BLOCK_TIME = 10;
  const currentDifficulty = _realtimehashrate?.difficulty || 0;
  let adjustmentRatio = TARGET_BLOCK_TIME / currentDifficultyAvgBlockTime;
  adjustmentRatio = Math.max(0.25, Math.min(4, adjustmentRatio));
  const expectedNextDifficulty = currentDifficulty * adjustmentRatio;
  const difficultyChangePercent = (adjustmentRatio - 1) * 100;

  const timeDiff = Date.now() - _realtimehashrate.timestamp;
  const secs = Math.floor(timeDiff / 1000);
  const mins = Math.floor(secs / 60);
  const hrs = Math.floor(mins / 60);
  const elapsedLabel = hrs > 0 ? `${hrs}시간 ${mins % 60}분 전` : mins > 0 ? `${mins}분 ${secs % 60}초 전` : `${secs}초 전`;

  const updatedAt = new Date(_realtimehashrate.timestamp).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });

  return (
    <div className="min-h-screen bg-transparent">
      <main className="max-w-screen-xl mx-auto px-4 py-6 md:px-6 md:py-8">

        {/* ── 페이지 헤더 ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--theme-text-on-primary)' }}>
              <T ns="hashrate" k="title" />
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--theme-text-muted-on-primary)' }}>
              <T ns="hashrate" k="subtitle" />
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm" style={{ color: 'var(--theme-text-muted-on-primary)' }}>
              <T ns="hashrate" k="last_updated" />:{' '}
              <span className="font-medium" style={{ color: 'var(--theme-text-on-primary)' }}>{updatedAt}</span>
            </p>
            <p className="text-xs" style={{ color: 'var(--theme-text-muted-on-primary)' }}>{elapsedLabel}</p>
          </div>
        </div>

        {/* ── 통계 카드 4개 ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs text-gray-400 mb-3">⚡ <T ns="hashrate" k="card_hashrate" /></p>
            <p className="text-xl font-bold text-violet-600">
              {_realtimehashrate?.hash_rate ? formatHashrate(_realtimehashrate.hash_rate) : 'N/A'}
            </p>
            <p className="text-xs text-gray-400 mt-2"><T ns="hashrate" k="card_hashrate_sub" /></p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs text-gray-400 mb-3">⛏️ <T ns="hashrate" k="card_difficulty" /></p>
            <p className="text-xl font-bold text-orange-500">
              {currentDifficulty ? (currentDifficulty / 1e12).toFixed(2) + ' T' : 'N/A'}
            </p>
            <p className="text-xs text-gray-400 mt-2"><T ns="hashrate" k="card_difficulty_sub" /></p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs text-gray-400 mb-3">🎯 <T ns="hashrate" k="card_next_difficulty" /></p>
            <p className="text-xl font-bold text-blue-600">
              {expectedNextDifficulty ? (expectedNextDifficulty / 1e12).toFixed(2) + ' T' : 'N/A'}
            </p>
            <p className={`text-xs mt-2 font-medium ${difficultyChangePercent > 0 ? 'text-red-400' : 'text-green-500'}`}>
              {difficultyChangePercent > 0 ? '▲' : '▼'}{' '}
              {difficultyChangePercent > 0 ? '+' : ''}{difficultyChangePercent.toFixed(2)}%{' '}
              <T ns="hashrate" k={difficultyChangePercent > 0 ? 'increase' : 'decrease'} />
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs text-gray-400 mb-3">⏱️ <T ns="hashrate" k="card_block_time" /></p>
            <p className="text-xl font-bold text-teal-600">
              {currentDifficultyAvgBlockTime ? currentDifficultyAvgBlockTime.toFixed(2) + ' 분' : 'N/A'}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              <T ns="hashrate" k="card_block_time_sub_prefix" />
              {_realtimehashrate?.lastDifficultyAdjustmentBlock?.toLocaleString() || '-'}
              <T ns="hashrate" k="card_block_time_sub_suffix" />
            </p>
          </div>

        </div>

        {/* ── 난이도 조정 진행 카드 ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 mb-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-800">
                <T ns="hashrate" k="adj_title" />
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                <T ns="hashrate" k="adj_subtitle" />
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-3xl font-extrabold text-indigo-600">{progressPercent.toFixed(1)}%</p>
              <p className="text-xs text-gray-400">
                {(currentHeight % BLOCKS_PER_ADJUSTMENT).toLocaleString()}
                {' / '}
                {BLOCKS_PER_ADJUSTMENT.toLocaleString()}
                <T ns="hashrate" k="adj_blocks_suffix" />
              </p>
            </div>
          </div>

          {/* 진행 바 */}
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>#{(_realtimehashrate?.lastDifficultyAdjustmentBlock || (currentHeight - (currentHeight % BLOCKS_PER_ADJUSTMENT))).toLocaleString()}</span>
              <span>#{nextAdjustmentBlock.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="h-4 rounded-full bg-indigo-500 transition-all duration-700"
                style={{ width: `${progressPercent.toFixed(1)}%` }}
              />
            </div>
          </div>

          {/* 하단 3 박스 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
              <p className="text-xs text-gray-400 mb-1"><T ns="hashrate" k="adj_remaining" /></p>
              <p className="text-lg font-bold text-orange-500">{blocksUntilAdjustment.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
              <p className="text-xs text-gray-400 mb-1"><T ns="hashrate" k="adj_current" /></p>
              <p className="text-lg font-bold text-blue-500">{currentHeight.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
              <p className="text-xs text-gray-400 mb-1"><T ns="hashrate" k="adj_eta" /></p>
              <p className="text-lg font-bold text-purple-500">
                {(() => {
                  const d = Math.floor(hoursUntilAdjustment / 24);
                  const h = Math.floor(hoursUntilAdjustment % 24);
                  return d > 0
                    ? <>{d}<T ns="hashrate" k="adj_eta_day" /> {h}<T ns="hashrate" k="adj_eta_hour" /></>
                    : <>{h}<T ns="hashrate" k="adj_eta_hour" /></>;
                })()}
              </p>
            </div>
          </div>
        </div>

        {/* ── 차트 카드 ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-800">
              <T ns="hashrate" k="chart_title" />
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              <T ns="hashrate" k="chart_subtitle" />
            </p>
          </div>
          <Chart
            series={chartSeries}
            title=""
            firstloding={3}
            height={560}
          />
        </div>

        <DeleteIndexButton />

      </main>
    </div>
  );
}