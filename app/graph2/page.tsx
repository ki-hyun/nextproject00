'use client';

import { useState, useEffect } from 'react';
import { getPrice11Data } from './actions';
import TabNavigation from '../../components/TabNavigation';
import dynamic from 'next/dynamic';

// Highcharts를 동적으로 import (SSR 비활성화)
const HighchartsReact = dynamic(
  () => import('highcharts-react-official'),
  { ssr: false }
);

interface ChartData {
  timestamp: number;
  price: number;
}

export default function Graph2Page() {
  const [priceData, setPriceData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [Highcharts, setHighcharts] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드에서만 Highcharts 로드
  useEffect(() => {
    setIsClient(true);
    const loadHighcharts = async () => {
      try {
        const HC = (await import('highcharts/highstock')).default;
        
        // Highstock은 이미 stock 기능이 포함되어 있음
        // 추가 모듈은 선택적으로 로드
        if (typeof HC === 'object' && HC) {
          try {
            // exporting 모듈 로드 (오류 시 무시)
            const exportingModule = await import('highcharts/modules/exporting');
            const Exporting: any = exportingModule.default || exportingModule;
            if (typeof Exporting === 'function') {
              Exporting(HC);
            }
          } catch (e) {
            console.warn('Exporting module could not be loaded:', e);
          }
          
          try {
            // fullscreen 모듈 로드 (오류 시 무시)
            const fullscreenModule = await import('highcharts/modules/full-screen');
            const Fullscreen: any = fullscreenModule.default || fullscreenModule;
            if (typeof Fullscreen === 'function') {
              Fullscreen(HC);
            }
          } catch (e) {
            console.warn('Fullscreen module could not be loaded:', e);
          }
          
          setHighcharts(HC);
        }
      } catch (error) {
        console.error('Failed to load Highcharts:', error);
        // 기본 Highcharts만 로드 시도
        try {
          const basicHC = (await import('highcharts')).default;
          setHighcharts(basicHC);
        } catch (basicError) {
          console.error('Failed to load basic Highcharts:', basicError);
        }
      }
    };
    loadHighcharts();
  }, []);

  // Redis에서 price11 데이터 로드
  useEffect(() => {
    const loadPriceData = async () => {
      try {
        setLoading(true);
        const result = await getPrice11Data();
        
        console.log('Price11 data:', result);

        if (result.success && result.data) {
          // timestamp 기준으로 정렬 (과거 -> 최신)
          const sortedData = [...result.data].sort((a, b) => a.timestamp - b.timestamp);
          
          if (sortedData.length > 0) {
            setPriceData(sortedData);
            setError(null);
          } else {
            setError('데이터가 없습니다');
          }
        } else {
          setError(result.error || '데이터를 불러올 수 없습니다');
        }
      } catch (err) {
        setError('데이터 로드 중 오류가 발생했습니다');
        console.error('Price data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPriceData();
  }, []);

  // 기간별 데이터 필터링
  const getFilteredData = () => {
    if (priceData.length === 0) return [];
    
    const now = Date.now();
    let cutoffTime = 0;
    
    switch(selectedPeriod) {
      case '1d':
        cutoffTime = now - (24 * 60 * 60 * 1000);
        break;
      case '7d':
        cutoffTime = now - (7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffTime = now - (30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        cutoffTime = now - (90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        cutoffTime = now - (365 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        return priceData.map(item => [item.timestamp, item.price]);
    }
    
    return priceData
      .filter(item => item.timestamp >= cutoffTime)
      .map(item => [item.timestamp, item.price]);
  };

  // Highcharts 설정 (CoinWarz 스타일)
  const chartOptions: any = {
    chart: {
      type: 'area',
      backgroundColor: '#ffffff',
      style: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      },
      height: 500,
      zoomType: 'x'
    },
    title: {
      text: 'Bitcoin Hashrate Chart',
      style: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333'
      }
    },
    subtitle: {
      text: 'Historical hashrate data from Redis (price11)',
      style: {
        fontSize: '14px',
        color: '#666'
      }
    },
    xAxis: {
      type: 'datetime',
      gridLineWidth: 1,
      gridLineColor: '#f0f0f0',
      labels: {
        style: {
          color: '#666',
          fontSize: '12px'
        }
      },
      crosshair: {
        width: 1,
        color: '#999',
        dashStyle: 'Dash'
      }
    },
    yAxis: {
      title: {
        text: 'Hashrate (EH/s)',
        style: {
          color: '#666',
          fontSize: '14px'
        }
      },
      gridLineColor: '#f0f0f0',
      labels: {
        style: {
          color: '#666',
          fontSize: '12px'
        },
        formatter: function(this: any) {
          const value = Number(this.value);
          if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
          } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
          }
          return value.toFixed(2);
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#ccc',
      borderRadius: 8,
      borderWidth: 1,
      shadow: true,
      style: {
        fontSize: '12px',
        color: '#333'
      },
      xDateFormat: '%Y-%m-%d %H:%M',
      pointFormat: '<b>{series.name}:</b> {point.y:.2f} EH/s'
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, 'rgba(255, 165, 0, 0.5)'],
            [1, 'rgba(255, 165, 0, 0.1)']
          ]
        },
        marker: {
          radius: 2,
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 4
            }
          }
        },
        lineWidth: 2,
        lineColor: '#FF8C00',
        states: {
          hover: {
            lineWidth: 3
          }
        },
        threshold: null,
        turboThreshold: 0,  // 모든 데이터 포인트 표시
        boostThreshold: 0   // 부스트 모드 비활성화
      },
      series: {
        turboThreshold: 0,
        boostThreshold: 0
      }
    },
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom',
      borderWidth: 0,
      itemStyle: {
        color: '#666',
        fontSize: '12px'
      }
    },
    credits: {
      enabled: false
    },
    series: [{
      type: 'area',
      name: 'Hashrate',
      data: getFilteredData(),
      turboThreshold: 0,  // 데이터 포인트 제한 없음
      boostThreshold: 0   // 부스트 모드 제한 없음
    }],
    navigation: {
      buttonOptions: {
        theme: {
          stroke: '#ccc',
          fill: '#fff',
          states: {
            hover: {
              fill: '#f5f5f5'
            },
            select: {
              fill: '#e6e6e6'
            }
          }
        }
      }
    },
    rangeSelector: {
      buttons: [{
        type: 'day',
        count: 1,
        text: '1d'
      }, {
        type: 'week',
        count: 1,
        text: '7d'
      }, {
        type: 'month',
        count: 1,
        text: '30d'
      }, {
        type: 'month',
        count: 3,
        text: '90d'
      }, {
        type: 'year',
        count: 1,
        text: '1y'
      }, {
        type: 'all',
        text: 'All'
      }],
      selected: 5,
      inputEnabled: false
    },
    navigator: {
      enabled: true,
      series: {
        color: '#FF8C00',
        lineWidth: 1
      }
    },
    scrollbar: {
      enabled: true
    }
  };

  // 데이터 새로고침 함수
  const refreshData = async () => {
    try {
      setLoading(true);
      const result = await getPrice11Data();
      
      if (result.success && result.data) {
        const sortedData = [...result.data].sort((a, b) => a.timestamp - b.timestamp);
        
        if (sortedData.length > 0) {
          setPriceData(sortedData);
          setError(null);
        }
      } else {
        setError(result.error || '데이터를 불러올 수 없습니다');
      }
    } catch (err) {
      setError('데이터 새로고침 중 오류가 발생했습니다');
      console.error('Price data refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TabNavigation />
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Bitcoin Network Hashrate
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Real-time hashrate data from Redis (price11)
                </p>
              </div>
              <button 
                onClick={refreshData}
                disabled={loading}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                {loading ? '로딩...' : '새로고침'}
              </button>
            </div>

            {loading && (
              <div className="mt-4 text-sm text-blue-600 dark:text-blue-400">
                🔄 데이터 로딩 중...
              </div>
            )}

            {error && (
              <div className="mt-4 text-sm text-red-600 dark:text-red-400">
                ❌ {error}
              </div>
            )}
          </div>

          {/* Period Selection Buttons */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
            <div className="flex gap-2">
              {['1d', '7d', '30d', '90d', '1y', 'all'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {period === '1d' && '1 Day'}
                  {period === '7d' && '7 Days'}
                  {period === '30d' && '30 Days'}
                  {period === '90d' && '90 Days'}
                  {period === '1y' && '1 Year'}
                  {period === 'all' && 'All Time'}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Container */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            {!isClient || !Highcharts ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">⏳</div>
                  <div className="text-lg">차트 로딩 중...</div>
                </div>
              </div>
            ) : priceData.length > 0 ? (
              <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={chartOptions}
              />
            ) : (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">📊</div>
                  <div className="text-lg">데이터가 없습니다</div>
                  <div className="text-sm mt-2">새로고침 버튼을 눌러 데이터를 로드하세요</div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Section */}
          {priceData.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Data Points</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {priceData.length.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Latest Value</p>
                  <p className="text-xl font-bold text-orange-500">
                    {priceData[priceData.length - 1]?.price.toFixed(2)} EH/s
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Max Value</p>
                  <p className="text-xl font-bold text-green-500">
                    {Math.max(...priceData.map(d => d.price)).toFixed(2)} EH/s
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Min Value</p>
                  <p className="text-xl font-bold text-red-500">
                    {Math.min(...priceData.map(d => d.price)).toFixed(2)} EH/s
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}