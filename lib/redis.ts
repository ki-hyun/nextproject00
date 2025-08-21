import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.log('Redis Client Error', err));

// 연결 상태 확인하고 연결
async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
}

// 데이터 저장 함수 (TTL 옵션 포함)
async function setSimple(_key: string, _value: unknown, _ttl?: number): Promise<boolean> {
  try {
    await connectRedis();
    
    // 값을 JSON 문자열로 변환하여 저장 (문자열이면 그대로, 객체/숫자면 JSON 변환)
    const valueToStore = typeof _value === 'string' ? _value : JSON.stringify(_value);
    
    // TTL이 있으면 EX 옵션과 함께 저장, 없으면 그냥 저장
    if (_ttl && _ttl > 0) {
      await client.set(_key, valueToStore, {
        EX: _ttl // TTL을 초 단위로 설정
      });
    } else {
      await client.set(_key, valueToStore);
    }
    
    return true;
  } catch (error) {
    console.error('Redis set error:', error);
    return false;
  }
}

// 데이터 조회 함수 (자동 JSON 파싱)
async function getSimple(_key: string): Promise<any> {
  try {
    await connectRedis();
    const data = await client.get(_key);
    
    if (!data) return null;
    
    // JSON 파싱 시도, 실패하면 원본 문자열 반환
    try {
      return JSON.parse(data);
    } catch {
      return data; // 파싱 실패시 원본 문자열 반환
    }
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

// 여러 키를 한번에 저장
async function setMultiple(keyValuePairs: Record<string, unknown>, _ttl?: number): Promise<boolean> {
  try {
    await connectRedis();
    
    const multi = client.multi();
    
    for (const [key, value] of Object.entries(keyValuePairs)) {
      const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
      
      if (_ttl && _ttl > 0) {
        multi.set(key, valueToStore, { EX: _ttl });
      } else {
        multi.set(key, valueToStore);
      }
    }
    
    await multi.exec();
    return true;
  } catch (error) {
    console.error('Redis setMultiple error:', error);
    return false;
  }
}

// 키 삭제 함수
async function deleteKey(_key: string): Promise<boolean> {
  try {
    await connectRedis();
    const result = await client.del(_key);
    return result > 0;
  } catch (error) {
    console.error('Redis delete error:', error);
    return false;
  }
}

// 키 존재 여부 확인
async function exists(_key: string): Promise<boolean> {
  try {
    await connectRedis();
    const result = await client.exists(_key);
    return result === 1;
  } catch (error) {
    console.error('Redis exists error:', error);
    return false;
  }
}

// TTL 확인 (남은 시간 초 단위)
async function getTTL(_key: string): Promise<number> {
  try {
    await connectRedis();
    return await client.ttl(_key);
  } catch (error) {
    console.error('Redis TTL error:', error);
    return -1;
  }
}

// 기존 함수 (호환성 유지)
async function getDataSimple(_key: string) {
  return await getSimple(_key);
}

export { 
  client, 
  connectRedis, 
  setSimple, 
  getSimple, 
  setMultiple,
  deleteKey,
  exists,
  getTTL,
  getDataSimple 
};