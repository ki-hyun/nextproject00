'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getPriceData } from './actions';
import TabNavigation from '../../components/TabNavigation';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Brush, ReferenceLine
} from 'recharts';


interface ChartData {
  timestamp: number;
  Close: number;
}

export default function GraphPage() {
  const [priceData, setPriceData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('3y');
  const [filteredData, setFilteredData] = useState<ChartData[]>([]);
  const [brushIndexes, setBrushIndexes] = useState<{ startIndex?: number; endIndex?: number }>({});
  const [brushControlled, setBrushControlled] = useState<boolean>(false); // Brush 수동 조작 여부
  const [baseTimestamp, setBaseTimestamp] = useState<number | undefined>(undefined); // 기준 날짜 저장
  const [tempBrushIndexes, setTempBrushIndexes] = useState<{ startIndex?: number; endIndex?: number }>({}); // 임시 브러쉬 인덱스
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // timestamp를 읽기 쉬운 형식으로 변환
  const formatTimestamp = (timestamp: number): string => {
    // timestamp 값이 유효하지 않은 경우 처리
    if (!timestamp || isNaN(timestamp) || timestamp <= 0) {
      return 'N/A';
    }
    
    const date = new Date(timestamp);
    
    // Date 객체가 유효하지 않은 경우 처리
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    // YY/MM/DD 형식으로 표시
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  // 기간별 데이터 필터링 함수 (기준 timestamp 파라미터 추가)
  const filterDataByPeriod = (data: ChartData[], period: string, baseTimestamp?: number) => {
    // 데이터를 timestamp 기준으로 정렬 (과거 -> 최신 순서로)
    const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
    
    if (data.length === 0) return sortedData;
    
    // baseTimestamp가 제공되면 사용, 아니면 데이터의 최대 timestamp 사용
    const maxTimestamp = baseTimestamp || Math.max(...sortedData.map(d => d.timestamp));
    let cutoffTime: number;
    
    switch(period) {
      case '1w':
        cutoffTime = maxTimestamp - (7 * 24 * 60 * 60 * 1000);
        break;
      case '1m':
        cutoffTime = maxTimestamp - (30 * 24 * 60 * 60 * 1000);
        break;
      case '3m':
        cutoffTime = maxTimestamp - (90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        cutoffTime = maxTimestamp - (365 * 24 * 60 * 60 * 1000);
        break;
      case '3y':
        cutoffTime = maxTimestamp - (3 * 365 * 24 * 60 * 60 * 1000);
        break;
      case 'custom':
        // custom의 경우 현재 선택된 데이터 그대로 반환
        return sortedData;
      default:
        return sortedData;
    }
    
    console.log(`Period: ${period}, Base Timestamp: ${new Date(maxTimestamp).toISOString()}, Cutoff: ${new Date(cutoffTime).toISOString()}`);
    console.log(`Original data length: ${sortedData.length}`);
    
    // timestamp 직접 비교
    const filteredData = sortedData.filter(item => item.timestamp >= cutoffTime && item.timestamp <= maxTimestamp);
    console.log(`Filtered data length: ${filteredData.length}`);
    
    return filteredData;
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Redis에서 price00 데이터 로드
  useEffect(() => {
    const loadPriceData = async () => {
      try {
        setLoading(true);
        const result = await getPriceData();
        
        console.log(result)

        if (result.success && result.data) {
          // 데이터 변환: price를 Close로 매핑
          const transformedData: ChartData[] = result.data.map((item) => ({
            timestamp: item.timestamp,
            Close: item.price
          }));
          
          // timestamp 기준으로 정렬 (과거 -> 최신)
          transformedData.sort((a, b) => a.timestamp - b.timestamp);
          
          // 데이터 유효성 검증
          const validatedData = validateChartData(transformedData);
          
          if (validatedData.length > 0) {
            setPriceData(validatedData);
            setError(null);
          } else {
            setError('유효한 데이터가 없습니다');
            console.error('No valid data after validation');
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

  // 데이터 유효성 검증 함수
  const validateChartData = (data: ChartData[]): ChartData[] => {
    return data.filter(item => 
      item && 
      typeof item.timestamp === 'number' && 
      !isNaN(item.timestamp) && 
      item.timestamp > 0 &&
      typeof item.Close === 'number' && 
      !isNaN(item.Close) &&
      item.Close >= 0
    );
  };

  // Brush onChange 핸들러 (debounced)
  const handleBrushChange = useCallback((brushRange: any) => {
    if (brushRange && brushRange.startIndex !== undefined && brushRange.endIndex !== undefined) {
      const startIdx = Math.max(0, brushRange.startIndex);
      const endIdx = Math.min(priceData.length - 1, brushRange.endIndex);
      
      // 임시 브러쉬 인덱스 즉시 업데이트 (UI 반응성 유지)
      setTempBrushIndexes({
        startIndex: startIdx,
        endIndex: endIdx
      });
      
      // 기존 타이머 취소
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // 300ms 후 실제 차트 업데이트
      debounceTimerRef.current = setTimeout(() => {
        // 인덱스 유효성 검증
        if (startIdx <= endIdx && startIdx < priceData.length && endIdx >= 0) {
          setBrushIndexes({
            startIndex: startIdx,
            endIndex: endIdx
          });
          
          // Brush로 선택된 범위의 데이터만 필터링 (전체 데이터 기준)
          const selectedData = priceData.slice(startIdx, endIdx + 1);
          
          // 데이터 유효성 검증
          const validatedData = validateChartData(selectedData);
          
          if (validatedData.length > 0) {
            setFilteredData(validatedData);
            setBrushControlled(true); // Brush가 수동으로 조작됨을 표시
            setSelectedPeriod('custom'); // 기간을 custom으로 변경
            
            // 선택된 범위의 최신 날짜를 기준점으로 저장
            const maxSelectedTimestamp = Math.max(...validatedData.map(d => d.timestamp));
            setBaseTimestamp(maxSelectedTimestamp);
            
            console.log('Brush changed:', {
              startIndex: startIdx,
              endIndex: endIdx,
              originalLength: selectedData.length,
              validatedLength: validatedData.length,
              baseTimestamp: new Date(maxSelectedTimestamp).toISOString()
            });
          } else {
            console.warn('No valid data in brush selection, keeping current data');
          }
        }
      }, 300); // 300ms debounce delay
    }
  }, [priceData]);

  // 기간 선택 변경시 데이터 필터링 및 Brush 인덱스 설정
  useEffect(() => {
    // custom에서 다른 기간으로 변경될 때
    if (selectedPeriod !== 'custom' && priceData.length > 0) {
      // 저장된 기준 날짜 사용, 없으면 전체 데이터의 최신 날짜 사용
      const effectiveBaseTimestamp = baseTimestamp || Math.max(...priceData.map(d => d.timestamp));
      
      // 기준 날짜로부터 선택된 기간만큼의 데이터 필터링
      const filtered = filterDataByPeriod(priceData, selectedPeriod, effectiveBaseTimestamp);
      
      // 데이터 유효성 검증
      const validatedData = validateChartData(filtered);
      setFilteredData(validatedData);
      
      // Brush 인덱스 계산
      if (priceData.length === 0 || validatedData.length === 0) {
        setBrushIndexes({});
        setTempBrushIndexes({}); // 임시 브러쉬 인덱스도 초기화
      } else {
        // 필터링된 데이터의 첫 번째 항목이 전체 데이터에서 몇 번째인지 찾기
        const startIndex = priceData.findIndex(item => item.timestamp === validatedData[0].timestamp);
        const endIndex = priceData.findIndex(item => item.timestamp === validatedData[validatedData.length - 1].timestamp);
        const newIndexes = { 
          startIndex: startIndex >= 0 ? startIndex : 0, 
          endIndex: endIndex >= 0 ? endIndex : priceData.length - 1 
        };
        setBrushIndexes(newIndexes);
        setTempBrushIndexes(newIndexes); // 임시 브러쉬 인덱스도 동기화
      }
      
      // brushControlled는 유지하되, 현재 기준 날짜는 계속 유지
      setBrushControlled(false);
    }
  }, [selectedPeriod, priceData, baseTimestamp]);

  // 데이터 새로고침 함수
  const refreshData = async () => {
    try {
      setLoading(true);
      const result = await getPriceData();
      
      if (result.success && result.data) {
        // 데이터 변환: price를 Close로 매핑
        const transformedData: ChartData[] = result.data.map((item) => ({
          timestamp: item.timestamp,
          Close: item.price
        }));
        
        // timestamp 기준으로 정렬 (과거 -> 최신)
        transformedData.sort((a, b) => a.timestamp - b.timestamp);
        
        // 데이터 유효성 검증
        const validatedData = validateChartData(transformedData);
        
        if (validatedData.length > 0) {
          setPriceData(validatedData);
          
          // 저장된 기준 날짜를 사용하여 필터링
          const effectiveBaseTimestamp = baseTimestamp || Math.max(...validatedData.map(d => d.timestamp));
          
          const newFilteredData = validateChartData(filterDataByPeriod(validatedData, selectedPeriod, effectiveBaseTimestamp));
          setFilteredData(newFilteredData);
          setError(null);
        } else {
          setError('유효한 데이터가 없습니다');
          console.error('No valid data after validation in refresh');
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <TabNavigation />
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center mb-8">
              {/* <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">📈</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">가격 차트</h1>
              <p className="text-gray-600 dark:text-gray-300">Redis price00 키 데이터 시각화</p>
               */}
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

            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  가격 데이터 ({filteredData.length}개 포인트)
                </h2>
                <div className="flex gap-2">
                  {/* 차트 타입 선택 버튼들 */}
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex gap-1">
                    <button
                      onClick={() => setChartType('line')}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        chartType === 'line' 
                          ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      라인
                    </button>
                    <button
                      onClick={() => setChartType('bar')}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        chartType === 'bar' 
                          ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      바
                    </button>
                    <button
                      onClick={() => setChartType('area')}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        chartType === 'area' 
                          ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      영역
                    </button>
                  </div>
                  <button 
                    onClick={refreshData}
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition-colors"
                  >
                    {loading ? '로딩...' : '새로고침'}
                  </button>
                </div>
              </div>

              {/* 기간 선택 버튼들 - 차트 위에 배치 */}
              <div className="mb-3 flex justify-between items-center">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1 flex gap-1">
                  {['3y', '1y', '3m', '1m', '1w'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                        selectedPeriod === period
                          ? 'bg-indigo-500 text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                  {selectedPeriod === 'custom' && (
                    <div className="px-3 py-1.5 text-sm font-medium rounded bg-orange-500 text-white">
                      사용자 지정
                    </div>
                  )}
                  {baseTimestamp && (
                    <button
                      onClick={() => {
                        setBaseTimestamp(undefined);
                        setBrushControlled(false);
                        setSelectedPeriod('3y');
                      }}
                      className="px-3 py-1.5 text-sm font-medium rounded bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                      title="최신 날짜로 돌아가기"
                    >
                      ↺ 최신
                    </button>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  표시 데이터: <span className="font-medium text-gray-700 dark:text-gray-300">{filteredData.length}개</span>
                </div>
              </div>

              {/* Recharts 차트 */}
              <div className="h-96 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4">
                {priceData.length > 0 && filteredData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'line' ? (
                      <LineChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:opacity-20" />
                        <XAxis 
                          dataKey="timestamp" 
                          stroke="#6b7280"
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          tickFormatter={(value) => formatTimestamp(value)}
                        />
                        <YAxis 
                          stroke="#6b7280"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                          labelFormatter={(value) => formatTimestamp(value)}
                          formatter={(value: number) => [`$${value.toLocaleString()}`, '가격']}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="Close" 
                          stroke="#6366f1" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 5 }}
                          name="종가"
                        />
                        <Brush 
                          dataKey="timestamp" 
                          height={30} 
                          stroke="#6366f1"
                          fill="#e0e7ff"
                          tickFormatter={(value) => formatTimestamp(value)}
                          startIndex={tempBrushIndexes.startIndex !== undefined ? tempBrushIndexes.startIndex : brushIndexes.startIndex}
                          endIndex={tempBrushIndexes.endIndex !== undefined ? tempBrushIndexes.endIndex : brushIndexes.endIndex}
                          onChange={handleBrushChange}
                        />
                      </LineChart>
                    ) : chartType === 'bar' ? (
                      <BarChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:opacity-20" />
                        <XAxis 
                          dataKey="timestamp" 
                          stroke="#6b7280"
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          tickFormatter={(value) => formatTimestamp(value)}
                        />
                        <YAxis 
                          stroke="#6b7280"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                          labelFormatter={(value) => formatTimestamp(value)}
                          formatter={(value: number) => [`$${value.toLocaleString()}`, '가격']}
                        />
                        <Legend />
                        <Bar 
                          dataKey="Close" 
                          fill="#6366f1"
                          name="종가"
                          radius={[8, 8, 0, 0]}
                        />
                        <Brush 
                          dataKey="timestamp" 
                          height={30} 
                          stroke="#6366f1"
                          fill="#e0e7ff"
                          tickFormatter={(value) => formatTimestamp(value)}
                          startIndex={tempBrushIndexes.startIndex !== undefined ? tempBrushIndexes.startIndex : brushIndexes.startIndex}
                          endIndex={tempBrushIndexes.endIndex !== undefined ? tempBrushIndexes.endIndex : brushIndexes.endIndex}
                          onChange={handleBrushChange}
                        />
                      </BarChart>
                    ) : (
                      <AreaChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:opacity-20" />
                        <XAxis 
                          dataKey="timestamp" 
                          stroke="#6b7280"
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          tickFormatter={(value) => formatTimestamp(value)}
                        />
                        <YAxis 
                          stroke="#6b7280"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                          labelFormatter={(value) => formatTimestamp(value)}
                          formatter={(value: number) => [`$${value.toLocaleString()}`, '가격']}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="Close" 
                          stroke="#6366f1" 
                          fillOpacity={1}
                          fill="url(#colorClose)"
                          name="종가"
                        />
                        <Brush 
                          dataKey="timestamp" 
                          height={30} 
                          stroke="#6366f1"
                          fill="#e0e7ff"
                          tickFormatter={(value) => formatTimestamp(value)}
                          startIndex={tempBrushIndexes.startIndex !== undefined ? tempBrushIndexes.startIndex : brushIndexes.startIndex}
                          endIndex={tempBrushIndexes.endIndex !== undefined ? tempBrushIndexes.endIndex : brushIndexes.endIndex}
                          onChange={handleBrushChange}
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <div className="text-6xl mb-4">📊</div>
                      <div className="text-lg">데이터가 없습니다</div>
                      <div className="text-sm mt-2">새로고침 버튼을 눌러 데이터를 로드하세요</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 데이터 테이블 */}
            {filteredData.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">가격 데이터 테이블</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">시간</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">가격</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((row, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {formatTimestamp(row.timestamp)}
                          </td>
                          <td className="text-right py-3 px-4 font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                            ${(row.Close || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redis에서 실시간으로 데이터를 가져옵니다 • 새로고침으로 최신 데이터 확인
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}