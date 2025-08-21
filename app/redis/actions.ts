"use server";

import { client, connectRedis } from "@/lib/redis";
import { RedisData, RedisStats } from "./types";

export async function addDataToRedis(prevState: unknown, formData: FormData) {
  try {
    await connectRedis();
    
    const key = `test_${Date.now()}`;
    const value = `Test data ${new Date().toLocaleString()}`;
    
    console.log("addDataToRedis------------------------")
    
    // Redis에 데이터 저장 (타임스탬프 포함)
    // const dataWithTimestamp = {
    //   value: value,
    //   timestamp: new Date().toISOString()
    // };

    const dataWithTimestamp = {
      value: value,
      timestamp: Date.now() // 밀리초로 저장
    };

    console.log(JSON.stringify(dataWithTimestamp))

    await client.set(key, JSON.stringify(dataWithTimestamp));
    
    return { 
      success: true, 
      message: "데이터가 Redis에 저장되었습니다!",
      key: key 
    };
    
  } catch (error) {
    console.error("Redis ADD 에러:", error);
    return { 
      success: false, 
      error: "Redis 연결 또는 저장 중 오류가 발생했습니다" 
    };
  }
}

export async function getDataFromRedis(): Promise<{ success: boolean; data?: RedisData[]; error?: string }> {
  try {
    await connectRedis();
    
    // test_로 시작하는 모든 키 가져오기
    // const keys = await client.keys('test_*');
    // const keys = await client.keys('block_*');
    const keys = await client.keys('*');

    if (keys.length === 0) {
      return {
        success: true,
        data: []
      };
    }
    
    // 모든 키의 값 가져오기
    const values = await client.mGet(keys);
    
    const data: RedisData[] = [];
    
    console.log("getDataFromRedis()------------",keys.length)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = values[i];
      
      // console.log(key)
      // console.log(value)

      if (value) {
        try {
          const parsedData = JSON.parse(value);

          data.push({
            key: key,
            value: parsedData.value,
            timestamp: parsedData.timestamp
          });

        } catch (parseError) {
          // JSON 파싱 실패 시 원본 값 사용
          data.push({
            key: key,
            value: value,
            timestamp: Date.now()
          });
        }
      }
    }
    
    // 타임스탬프 기준 내림차순 정렬 (최신 데이터가 위에)
    data.sort((a, b) => b.timestamp - a.timestamp);
    
    return {
      success: true,
      data: data
    };
    
  } catch (error) {
    console.error("Redis GET 에러:", error);
    return { 
      success: false, 
      error: "Redis 연결 또는 조회 중 오류가 발생했습니다" 
    };
  }
}

export async function clearDataFromRedis(prevState: unknown, formData: FormData) {
  try {
    await connectRedis();
    
    // test_로 시작하는 모든 키 가져오기
    const keys = await client.keys('test_*');
    
    if (keys.length > 0) {
      // 모든 테스트 키 삭제
      await client.del(keys);
    }
    
    return { 
      success: true, 
      message: `${keys.length}개의 테스트 데이터가 삭제되었습니다!`,
      deletedCount: keys.length
    };
    
  } catch (error) {
    console.error("Redis CLEAR 에러:", error);
    return { 
      success: false, 
      error: "Redis 연결 또는 삭제 중 오류가 발생했습니다" 
    };
  }
}

export async function getRedisStats(): Promise<{ 
  success: boolean; 
  stats?: RedisStats; 
  error?: string 
}> {
  try {
    await connectRedis();
    
    // 전체 키 개수 조회
    const allKeys = await client.keys('*');
    const totalKeys = allKeys.length;
    
    // 테스트 키 개수 조회
    const testKeys = await client.keys('block_*');
    const testKeyCount = testKeys.length;
    
    // Redis 메모리 사용량 조회
    const info = await client.info('memory');
    const memoryMatch = info.match(/used_memory_human:(.+)/);
    const memoryUsage = memoryMatch ? memoryMatch[1].trim() : '알 수 없음';
    
    // Redis 서버 정보
    const serverInfo = await client.info('server');
    const versionMatch = serverInfo.match(/redis_version:(.+)/);
    const redisVersion = versionMatch ? versionMatch[1].trim() : '알 수 없음';
    
    return {
      success: true,
      stats: {
        totalKeys: totalKeys,
        testKeys: testKeyCount,
        memoryUsage: memoryUsage,
        redisInfo: `Redis ${redisVersion}`
      }
    };
    
  } catch (error) {
    console.error("Redis STATS 에러:", error);
    return { 
      success: false, 
      error: "Redis 연결 또는 통계 조회 중 오류가 발생했습니다" 
    };
  }
}