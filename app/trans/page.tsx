'use client';

import React, { useState, useEffect } from 'react';

export default function TransPage() {
  const [timestamp, setTimestamp] = useState('');
  const [timezone, setTimezone] = useState(9);
  const [result, setResult] = useState<string | null>(null);
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);

  // JSON 포매터 상태
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [indentSize, setIndentSize] = useState(2);

  const timezones = [
    { label: 'UTC-12', value: -12 },
    { label: 'UTC-11', value: -11 },
    { label: 'UTC-10 (하와이)', value: -10 },
    { label: 'UTC-9 (알래스카)', value: -9 },
    { label: 'UTC-8 (태평양)', value: -8 },
    { label: 'UTC-7 (산악)', value: -7 },
    { label: 'UTC-6 (중부)', value: -6 },
    { label: 'UTC-5 (동부)', value: -5 },
    { label: 'UTC-4', value: -4 },
    { label: 'UTC-3', value: -3 },
    { label: 'UTC-2', value: -2 },
    { label: 'UTC-1', value: -1 },
    { label: 'UTC+0 (런던)', value: 0 },
    { label: 'UTC+1 (파리)', value: 1 },
    { label: 'UTC+2', value: 2 },
    { label: 'UTC+3 (모스크바)', value: 3 },
    { label: 'UTC+4', value: 4 },
    { label: 'UTC+5', value: 5 },
    { label: 'UTC+5:30 (인도)', value: 5.5 },
    { label: 'UTC+6', value: 6 },
    { label: 'UTC+7 (방콕)', value: 7 },
    { label: 'UTC+8 (싱가포르/중국)', value: 8 },
    { label: 'UTC+9 (한국/일본)', value: 9 },
    { label: 'UTC+10 (시드니)', value: 10 },
    { label: 'UTC+11', value: 11 },
    { label: 'UTC+12 (뉴질랜드)', value: 12 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    setCurrentTimestamp(Math.floor(Date.now() / 1000));
    return () => clearInterval(interval);
  }, []);

  const convertTimestamp = () => {
    if (!timestamp) {
      setResult(null);
      return;
    }

    const ts = parseInt(timestamp, 10);
    if (isNaN(ts)) {
      setResult('유효하지 않은 타임스탬프입니다.');
      return;
    }

    // 타임스탬프가 밀리초인지 초인지 판단 (13자리면 밀리초)
    const isMilliseconds = timestamp.length === 13;
    const dateMs = isMilliseconds ? ts : ts * 1000;

    // UTC 시간 계산
    const utcDate = new Date(dateMs);

    // 선택한 시간대로 변환
    const offsetMs = timezone * 60 * 60 * 1000;
    const localDate = new Date(utcDate.getTime() + offsetMs);

    const formatDate = (date: Date) => {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      const ms = String(date.getUTCMilliseconds()).padStart(3, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`;
    };

    const sign = timezone >= 0 ? '+' : '';
    setResult(`${formatDate(localDate)} (UTC${sign}${timezone})`);
  };

  useEffect(() => {
    convertTimestamp();
  }, [timestamp, timezone]);

  const handlePasteCurrentTimestamp = () => {
    setTimestamp(currentTimestamp.toString());
  };

  // JSON 포맷팅
  const formatJson = () => {
    if (!jsonInput.trim()) {
      setJsonOutput(null);
      setJsonError(null);
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setJsonOutput(formatted);
      setJsonError(null);
    } catch (e) {
      setJsonError((e as Error).message);
      setJsonOutput(null);
    }
  };

  useEffect(() => {
    formatJson();
  }, [jsonInput, indentSize]);

  const handleCopyJson = () => {
    if (jsonOutput) {
      navigator.clipboard.writeText(jsonOutput);
    }
  };

  const handleMinifyJson = () => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setJsonOutput(minified);
      setJsonError(null);
    } catch (e) {
      setJsonError((e as Error).message);
      setJsonOutput(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            타임스탬프 변환기
          </h1>

          {/* 현재 타임스탬프 */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg mb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">현재 Unix 타임스탬프</p>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                {currentTimestamp}
              </span>
              <button
                onClick={handlePasteCurrentTimestamp}
                className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                사용하기
              </button>
            </div>
          </div>

          {/* 입력 영역 */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              타임스탬프 입력 (초 또는 밀리초)
            </label>
            <input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="예: 1706745600 또는 1706745600000"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono"
            />
          </div>

          {/* 시간대 선택 */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              시간대 선택
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(parseFloat(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>

            {/* 빠른 선택 버튼 */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[0, 9, 8, -5, -8].map((tz) => (
                <button
                  key={tz}
                  onClick={() => setTimezone(tz)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    timezone === tz
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                >
                  UTC{tz >= 0 ? '+' : ''}{tz}
                </button>
              ))}
            </div>
          </div>

          {/* 결과 표시 */}
          {result && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">변환 결과</p>
              <p className="text-xl font-mono font-semibold text-green-600 dark:text-green-400">
                {result}
              </p>
            </div>
          )}

          {/* 구분선 */}
          <div className="my-6 border-t border-gray-300 dark:border-gray-600"></div>

          {/* JSON 포매터 */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            JSON 포매터
          </h2>

          {/* JSON 입력 */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              JSON 입력
            </label>
            <textarea
              value={jsonInput}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJsonInput(e.target.value)}
              placeholder='{"key": "value", "number": 123}'
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm resize-y"
            />

            {/* 옵션 */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">들여쓰기:</span>
                {[2, 4].map((size) => (
                  <button
                    key={size}
                    onClick={() => setIndentSize(size)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      indentSize === size
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    {size}칸
                  </button>
                ))}
              </div>
              <button
                onClick={handleMinifyJson}
                className="px-3 py-1 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                압축
              </button>
              <button
                onClick={handleCopyJson}
                disabled={!jsonOutput}
                className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                복사
              </button>
            </div>
          </div>

          {/* JSON 에러 */}
          {jsonError && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl p-3 mb-3">
              <p className="text-sm text-red-600 dark:text-red-400 font-mono">
                {jsonError}
              </p>
            </div>
          )}

          {/* JSON 결과 */}
          {jsonOutput && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">포맷팅 결과</p>
              <pre className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm overflow-x-auto whitespace-pre">
                {jsonOutput}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}