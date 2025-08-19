'use client';

import { useState } from 'react';
import Chart from '@/components/Chart';
import TabNavigation from '../../components/TabNavigation';

export default function GraphPage() {
  const [chartHeight, setChartHeight] = useState(800);
  // 차트에 표시할 시리즈 데이터 정의
  const chartSeries = [
    {
      name: 'Price',
      type: 'line' as const,
      data: [],
      color: '#3b82f6',
      lineWidth: 2,
      turboThreshold: 0,  // 모든 데이터 포인트 표시
      yAxis: 0,
      visible: true,  // Price만 처음에 표시
      tooltip: {
        valueDecimals: 2,
        valuePrefix: '$',
        valueSuffix: ' USD'
      },
      customData: {
        dataSource: 'coinprice',
      }
      // 커스텀 데이터 저장
      // customData: {
      //   dataSource: 'coinprice',
      //   lastUpdate: new Date().toISOString(),
      //   category: 'crypto',
      //   priority: 1,
      //   metadata: {
      //     exchange: 'binance',
      //     currency: 'USD',
      //     interval: '1d'
      //   }
      // }
    },
    {
      name: 'HashRate',
      type: 'line' as const,
      data: [],
      color: '#10b981',
      lineWidth: 2,
      turboThreshold: 0,  // 모든 데이터 포인트 표시
      yAxis: 1,
      visible: true,  // 처음에 표시
      tooltip: {
        valueDecimals: 2,
        valueSuffix: ' TH/s'
      },
      customData: {
        dataSource: 'hashrate',
      }
    },
    {
      name: 'Block Reward',
      type: 'line' as const,
      data: [],
      color: '#f59e0b',
      lineWidth: 2,
      turboThreshold: 0,  // 모든 데이터 포인트 표시
      yAxis: 2,
      visible: false,  // 처음에는 숨김
      tooltip: {
        valueDecimals: 8,
        valueSuffix: ' BTC'
      },
      customData: {
        dataSource: 'blockreward',
      }
    },
    {
      name: 'Total Fee',
      type: 'line' as const,
      data: [],
      color: '#ef4444',
      lineWidth: 2,
      turboThreshold: 0,  // 모든 데이터 포인트 표시
      yAxis: 3,
      visible: false,  // 처음에는 숨김
      tooltip: {
        valueDecimals: 8,
        valueSuffix: ' BTC'
      },
      customData: {
        dataSource: 'totalfee',
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <TabNavigation />
      <main className="container mx-auto px-1 py-5">
        {/* <div className="max-w-7xl mx-auto"> */}
        <div className="max-w-full mx-auto px-1">
          {/* 높이 조절 버튼 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 mb-4 border border-gray-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">차트 높이 조절</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setChartHeight(500)}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    chartHeight === 500 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  작게 (500px)
                </button>
                <button
                  onClick={() => setChartHeight(700)}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    chartHeight === 700 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  보통 (700px)
                </button>
                <button
                  onClick={() => setChartHeight(800)}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    chartHeight === 800 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  기본 (800px)
                </button>
                <button
                  onClick={() => setChartHeight(1000)}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    chartHeight === 1000 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  크게 (1000px)
                </button>
                <button
                  onClick={() => setChartHeight(1200)}
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    chartHeight === 1200 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  매우 크게 (1200px)
                </button>
              </div>
            </div>
          </div>

          <Chart 
            series={chartSeries}
            title="Chart"
            firstloding={2}
            height={chartHeight}
          />
        </div>
      </main>
    </div>
  );
}