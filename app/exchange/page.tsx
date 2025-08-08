'use client';

import TabNavigation from '../../components/TabNavigation';

export default function ExchangePage() {
  const tradingPairs = [
    { pair: 'BTC/USDT', price: '50,234.50', change: '+1.24%', volume: '1.2B', high: '51,200', low: '49,800' },
    { pair: 'ETH/USDT', price: '3,456.78', change: '-0.67%', volume: '567M', high: '3,520', low: '3,400' },
    { pair: 'XRP/USDT', price: '0.6234', change: '+2.31%', volume: '234M', high: '0.6450', low: '0.6100' },
    { pair: 'ADA/USDT', price: '0.4567', change: '+1.89%', volume: '123M', high: '0.4650', low: '0.4400' },
  ];

  const orderbook = {
    sells: [
      { price: '50,240.00', amount: '0.1234', total: '6,199.62' },
      { price: '50,238.50', amount: '0.2567', total: '12,896.31' },
      { price: '50,237.25', amount: '0.3891', total: '19,544.87' },
      { price: '50,236.00', amount: '0.5123', total: '25,735.83' },
    ],
    buys: [
      { price: '50,233.75', amount: '0.4567', total: '22,944.31' },
      { price: '50,232.50', amount: '0.6789', total: '34,100.81' },
      { price: '50,231.25', amount: '0.8912', total: '44,778.13' },
      { price: '50,230.00', amount: '1.2345', total: '62,009.15' },
    ]
  };

  const recentTrades = [
    { price: '50,234.50', amount: '0.1234', time: '14:32:45', type: 'buy' },
    { price: '50,233.75', amount: '0.2567', time: '14:32:44', type: 'sell' },
    { price: '50,235.00', amount: '0.0891', time: '14:32:43', type: 'buy' },
    { price: '50,232.25', amount: '0.3456', time: '14:32:42', type: 'sell' },
    { price: '50,234.75', amount: '0.1789', time: '14:32:41', type: 'buy' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <TabNavigation />
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">📊</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">거래소/차트</h1>
            <p className="text-gray-600 dark:text-gray-300">실시간 거래 및 차트 분석</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* 차트 영역 */}
            <div className="lg:col-span-3 space-y-6">
              {/* 메인 차트 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">BTC/USDT</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">$50,234.50</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">+1.24%</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {['1m', '5m', '15m', '1h', '4h', '1d'].map((timeframe) => (
                      <button
                        key={timeframe}
                        className="px-3 py-1 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition-all"
                      >
                        {timeframe}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 차트 플레이스홀더 */}
                <div className="h-96 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📈</div>
                    <p className="text-gray-600 dark:text-gray-400">실시간 차트 영역</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">TradingView 또는 다른 차트 라이브러리 연동 가능</p>
                  </div>
                </div>
              </div>

              {/* 거래 현황 */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* 호가창 */}
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">호가창</h3>
                  <div className="space-y-4">
                    {/* 매도 호가 */}
                    <div>
                      <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">매도</h4>
                      <div className="space-y-1">
                        {orderbook.sells.map((order, index) => (
                          <div key={index} className="flex justify-between items-center text-xs py-1 px-2 rounded bg-red-50 dark:bg-red-900/10">
                            <span className="text-red-600 dark:text-red-400 font-mono">{order.price}</span>
                            <span className="text-gray-600 dark:text-gray-400">{order.amount}</span>
                            <span className="text-gray-500 dark:text-gray-500">{order.total}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 스프레드 */}
                    <div className="text-center py-2 border-y border-gray-200 dark:border-gray-600">
                      <span className="text-sm text-gray-500 dark:text-gray-400">스프레드: $1.25</span>
                    </div>

                    {/* 매수 호가 */}
                    <div>
                      <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">매수</h4>
                      <div className="space-y-1">
                        {orderbook.buys.map((order, index) => (
                          <div key={index} className="flex justify-between items-center text-xs py-1 px-2 rounded bg-green-50 dark:bg-green-900/10">
                            <span className="text-green-600 dark:text-green-400 font-mono">{order.price}</span>
                            <span className="text-gray-600 dark:text-gray-400">{order.amount}</span>
                            <span className="text-gray-500 dark:text-gray-500">{order.total}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 최근 거래 */}
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">최근 거래</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 pb-2 border-b border-gray-200 dark:border-gray-600">
                      <span>가격</span>
                      <span>수량</span>
                      <span>시간</span>
                    </div>
                    {recentTrades.map((trade, index) => (
                      <div key={index} className="flex justify-between items-center text-sm py-1">
                        <span className={`font-mono ${trade.type === 'buy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {trade.price}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">{trade.amount}</span>
                        <span className="text-gray-500 dark:text-gray-500 text-xs">{trade.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 거래 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">거래</h3>
                
                <div className="flex space-x-2 mb-4">
                  <button className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg font-medium">
                    매수
                  </button>
                  <button className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium">
                    매도
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">주문가격</label>
                    <input 
                      type="text" 
                      placeholder="50,234.50"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">주문수량</label>
                    <input 
                      type="text" 
                      placeholder="0.0000"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>총액:</span>
                    <span>0.00 USDT</span>
                  </div>

                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all">
                    매수 주문
                  </button>
                </div>
              </div>

              {/* 거래쌍 목록 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">거래쌍</h3>
                <div className="space-y-2">
                  {tradingPairs.map((pair, index) => (
                    <div key={index} className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{pair.pair}</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Vol: {pair.volume}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-gray-900 dark:text-white">{pair.price}</p>
                          <p className={`text-sm ${pair.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {pair.change}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 포트폴리오 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">내 포트폴리오</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">총 자산</span>
                    <span className="font-bold text-gray-900 dark:text-white">$25,430.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">오늘 수익</span>
                    <span className="font-bold text-green-600 dark:text-green-400">+$1,234.56</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">수익률</span>
                    <span className="font-bold text-green-600 dark:text-green-400">+5.12%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}