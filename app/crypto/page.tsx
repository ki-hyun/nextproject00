'use client';

import TabNavigation from '../../components/TabNavigation';

export default function CryptoPage() {
  const cryptoData = [
    { name: 'BTC', price: '7,892,099', change: '+0.59%', volume: '10,793 BTC' },
    { name: 'XRP', price: '1,245', change: '+2.31%', volume: '1,234,567 XRP' },
    { name: 'DOGE', price: '89', change: '-1.23%', volume: '5,678,901 DOGE' },
    { name: 'BNB', price: '456,789', change: '+0.87%', volume: '2,345 BNB' },
    { name: 'SOL', price: '123,456', change: '+3.45%', volume: '8,901 SOL' },
    { name: 'ADA', price: '789', change: '-0.67%', volume: '12,345 ADA' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <TabNavigation />
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">₿</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">암호화폐 시세</h1>
              <p className="text-gray-600 dark:text-gray-300">실시간 암호화폐 가격 정보</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">코인</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">가격 (KRW)</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">변동률</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">거래량</th>
                  </tr>
                </thead>
                <tbody>
                  {cryptoData.map((crypto, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                      <td className="py-3 px-4 font-mono text-sm text-blue-600 dark:text-blue-400 font-bold">
                        {crypto.name}
                      </td>
                      <td className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                        {crypto.price}
                      </td>
                      <td className={`text-right py-3 px-4 font-semibold ${crypto.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {crypto.change}
                      </td>
                      <td className="text-right py-3 px-4 text-gray-500 dark:text-gray-400">
                        {crypto.volume}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                * 가격 정보는 참고용이며 실시간이 아닙니다
              </p>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
                실시간 업데이트
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}