'use client';

import { useState } from 'react';
import TabNavigation from '../../components/TabNavigation';

export default function GraphPage() {
  const [activeChart, setActiveChart] = useState('line');

  const chartTypes = [
    { id: 'line', name: '선 그래프', icon: '📈' },
    { id: 'bar', name: '막대 그래프', icon: '📊' },
    { id: 'pie', name: '파이 차트', icon: '🥧' },
    { id: 'area', name: '영역 차트', icon: '🌊' },
    { id: 'scatter', name: '산점도', icon: '🔸' },
    { id: 'radar', name: '레이더 차트', icon: '🕸️' },
  ];

  const sampleData = [
    { month: '1월', value1: 65, value2: 28, value3: 98 },
    { month: '2월', value1: 59, value2: 48, value3: 40 },
    { month: '3월', value1: 80, value2: 40, value3: 19 },
    { month: '4월', value1: 81, value2: 19, value3: 96 },
    { month: '5월', value1: 56, value2: 96, value3: 27 },
    { month: '6월', value1: 55, value2: 27, value3: 100 },
  ];

  const metrics = [
    { label: '총 데이터 포인트', value: '1,234', color: 'bg-blue-500' },
    { label: '평균 증가율', value: '+12.5%', color: 'bg-green-500' },
    { label: '최대값', value: '856', color: 'bg-purple-500' },
    { label: '최소값', value: '23', color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <TabNavigation />
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">📈</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">그래프</h1>
            <p className="text-gray-600 dark:text-gray-300">데이터 시각화 및 그래프 차트</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* 메인 차트 영역 */}
            <div className="lg:col-span-3 space-y-6">
              {/* 차트 타입 선택 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">차트 타입</h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {chartTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setActiveChart(type.id)}
                      className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                        activeChart === type.id
                          ? 'bg-gradient-to-r from-indigo-500 to-cyan-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span className="text-2xl mb-1">{type.icon}</span>
                      <span className="text-xs font-medium">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 메인 차트 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {chartTypes.find(t => t.id === activeChart)?.name} - 월별 데이터
                  </h2>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                      내보내기
                    </button>
                    <button className="px-3 py-1 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                      새로고침
                    </button>
                  </div>
                </div>
                
                {/* 차트 플레이스홀더 */}
                <div className="h-96 bg-gradient-to-br from-indigo-100 to-cyan-100 dark:from-indigo-900/20 dark:to-cyan-900/20 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <div className="text-center z-10">
                    <div className="text-6xl mb-4">{chartTypes.find(t => t.id === activeChart)?.icon}</div>
                    <p className="text-gray-600 dark:text-gray-400 font-semibold">
                      {chartTypes.find(t => t.id === activeChart)?.name} 차트 영역
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      Chart.js, D3.js, Recharts 등 라이브러리 연동 가능
                    </p>
                  </div>
                  
                  {/* 가짜 차트 데이터 시각화 */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around h-32 px-8">
                    {sampleData.map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="bg-indigo-500/30 dark:bg-indigo-400/30 w-8 rounded-t-lg"
                          style={{ height: `${item.value1}%` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 데이터 테이블 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">데이터 테이블</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">월</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">데이터 1</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">데이터 2</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">데이터 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleData.map((row, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{row.month}</td>
                          <td className="text-right py-3 px-4 text-blue-600 dark:text-blue-400">{row.value1}</td>
                          <td className="text-right py-3 px-4 text-green-600 dark:text-green-400">{row.value2}</td>
                          <td className="text-right py-3 px-4 text-purple-600 dark:text-purple-400">{row.value3}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 메트릭스 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📊 주요 지표</h3>
                <div className="space-y-4">
                  {metrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${metric.color}`}></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{metric.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 차트 설정 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">⚙️ 차트 설정</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      애니메이션
                    </label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      그리드 표시
                    </label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      범례 표시
                    </label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      색상 테마
                    </label>
                    <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                      <option>기본</option>
                      <option>다크</option>
                      <option>컬러풀</option>
                      <option>모노크롬</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 데이터 소스 */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📋 데이터 소스</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                    <div className="font-medium text-gray-900 dark:text-white">CSV 파일</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">로컬 파일 업로드</div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                    <div className="font-medium text-gray-900 dark:text-white">API 연동</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">실시간 데이터</div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                    <div className="font-medium text-gray-900 dark:text-white">데이터베이스</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">DB 쿼리 연결</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}