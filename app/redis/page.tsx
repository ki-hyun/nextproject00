"use client";

import React, { useState, useEffect } from "react";
import { useActionState } from "react";
import { addDataToRedis, getDataFromRedis, clearDataFromRedis, getRedisStats } from "./actions";
import { RedisData, RedisStats } from "./types";
import DeleteIndexButton from '@/components/DeleteIndexButton';

export default function RedisTestPage() {
  const [data, setData] = useState<RedisData[]>([]);
  const [stats, setStats] = useState<RedisStats | null>(null);
  const [message, setMessage] = useState("");

  const [addState, addAction] = useActionState(addDataToRedis, null);
  const [clearState, clearAction] = useActionState(clearDataFromRedis, null);

  const handleGetData = async () => {
    setMessage("데이터를 가져오는 중...");
    try {
      const result = await getDataFromRedis();

      if (result.success) {
        setData(result.data || []);
        setMessage(`${result.data?.length || 0}개의 데이터를 가져왔습니다!`);
      } else {
        setMessage("에러: " + result.error);
      }
    } catch (error) {
      setMessage("에러: " + error);
    }
  };

  const handleGetStats = async () => {
    setMessage("Redis 통계를 조회하는 중...");
    try {
      const result = await getRedisStats();

      if (result.success && result.stats) {
        setStats(result.stats);
        setMessage(`Redis 통계 정보가 업데이트되었습니다!`);
      } else {
        setMessage("에러: " + result.error);
      }
    } catch (error) {
      setMessage("에러: " + error);
    }
  };

  // 서버 액션 결과 처리 (useEffect 사용)
  React.useEffect(() => {
    if (addState?.success && addState.message) {
      setMessage(addState.message);
    } else if (addState?.error) {
      setMessage(`에러: ${addState.error}`);
    }
  }, [addState]);

  React.useEffect(() => {
    if (clearState?.success && clearState.message) {
      setMessage(clearState.message);
      setData([]); // 삭제 성공 시 화면의 데이터도 클리어
    } else if (clearState?.error) {
      setMessage(`에러: ${clearState.error}`);
    }
  }, [clearState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">R</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Redis 테스트</h1>
              <p className="text-gray-600 dark:text-gray-300">Redis 데이터 저장 및 조회 테스트 페이지</p>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <form action={addAction}>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  🔄 데이터 추가
                </button>
              </form>

              <button
                onClick={handleGetData}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                📋 데이터 조회
              </button>

              <button
                onClick={handleGetStats}
                className="bg-gradient-to-r from-indigo-500 to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                📊 Redis 통계
              </button>

              <form action={clearAction}>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  🗑️ 데이터 삭제
                </button>
              </form>
            </div>

            <DeleteIndexButton />

            {/* Message */}
            {message && (
              <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
                  {message}
                </p>
              </div>
            )}
          </div>

          {/* Redis Stats Display */}
          {stats && (
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Redis 통계</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-4">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.totalKeys}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      전체 키
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-4">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {stats.testKeys}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      테스트 키
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-4">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {stats.memoryUsage}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      메모리 사용량
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-orange-100 dark:bg-orange-900/30 rounded-xl p-4">
                    <div className="text-sm font-bold text-orange-600 dark:text-orange-400">
                      {stats.redisInfo}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      서버 정보
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Display */}
          {data.length > 0 && (
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Redis 데이터</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">키</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">값</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50">
                        <td className="py-3 px-4 font-mono text-sm text-blue-600 dark:text-blue-400">
                          {item.key}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                          {item.value}
                        </td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                          {new Date(item.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  총 {data.length}개의 데이터
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}