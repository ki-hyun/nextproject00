'use client';

import TabNavigation from '../../components/TabNavigation';

export default function FuturesPage() {
  const futuresData = [
    { symbol: 'BTCUSDT', price: '50,234', change: '+1.24%', volume: '1,234.5M', leverage: '최대 100x' },
    { symbol: 'ETHUSDT', price: '3,456', change: '-0.67%', volume: '567.8M', leverage: '최대 75x' },
    { symbol: 'ADAUSDT', price: '0.45', change: '+2.31%', volume: '89.1M', leverage: '최대 50x' },
    { symbol: 'SOLUSDT', price: '98.76', change: '+3.45%', volume: '234.5M', leverage: '최대 50x' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <TabNavigation />
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">📈</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">선물/마진 거래</h1>
              <p className="text-gray-600 dark:text-gray-300">레버리지 거래 및 선물 계약 정보</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">총 포지션 가치</h3>
                <p className="text-3xl font-bold">$125,430</p>
                <p className="text-sm opacity-80">+12.5% (오늘)</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">미실현 손익</h3>
                <p className="text-3xl font-bold">+$3,240</p>
                <p className="text-sm opacity-80">+2.65% ROE</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">심볼</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">가격 (USDT)</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">변동률</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">거래량</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">레버리지</th>
                  </tr>
                </thead>
                <tbody>
                  {futuresData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                      <td className="py-3 px-4 font-mono text-sm text-blue-600 dark:text-blue-400 font-bold">
                        {item.symbol}
                      </td>
                      <td className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                        {item.price}
                      </td>
                      <td className={`text-right py-3 px-4 font-semibold ${item.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {item.change}
                      </td>
                      <td className="text-right py-3 px-4 text-gray-500 dark:text-gray-400">
                        {item.volume}
                      </td>
                      <td className="text-right py-3 px-4 text-purple-600 dark:text-purple-400 font-medium">
                        {item.leverage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-semibold">
                롱 포지션
              </button>
              <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all font-semibold">
                숏 포지션
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold">
                포지션 관리
              </button>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                ⚠️ <strong>위험 고지:</strong> 레버리지 거래는 높은 위험을 수반합니다. 투자하기 전에 위험을 충분히 이해하시기 바랍니다.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}