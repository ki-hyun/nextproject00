'use server';

import { client, connectRedis } from '@/lib/redis';

interface PriceData {
  timestamp: number;
  price: number;
}

export async function getPrice11Data() {
  try {
    // Redis 연결
    await connectRedis();
    
    // Redis에서 price11 키로 데이터 가져오기
    const data = await client.get('price11');
    
    console.log('Raw data from Redis:', typeof data, data ? 'Data exists' : 'No data');
    
    // 데이터 크기 확인 (처음 500자만 출력)
    if (data && typeof data === 'string') {
      console.log('Data length:', data.length);
      console.log('First 500 chars:', data.substring(0, 500));
    }
    
    if (!data) {
      return { 
        success: false, 
        error: 'No data found in Redis for key: price11', 
        data: null 
      };
    }

    // 데이터가 문자열인 경우 파싱
    let parsedData: any;
    if (typeof data === 'string') {
      try {
        parsedData = JSON.parse(data);
        console.log('Parsed data type:', typeof parsedData, Array.isArray(parsedData) ? 'Array' : 'Not array');
        if (parsedData && typeof parsedData === 'object' && !Array.isArray(parsedData)) {
          console.log('Data keys:', Object.keys(parsedData));
        }
      } catch (parseError) {
        console.error('Failed to parse price11 data:', parseError);
        return { 
          success: false, 
          error: 'Failed to parse data from Redis', 
          data: null 
        };
      }
    } else {
      parsedData = data;
    }

    // 데이터 구조에 따라 다르게 처리
    let dataArray: any[] = [];
    
    // 배열인 경우
    if (Array.isArray(parsedData)) {
      dataArray = parsedData;
    } 
    // 객체인 경우 (타임스탬프가 키인 경우)
    else if (typeof parsedData === 'object' && parsedData !== null) {
      // 객체를 배열로 변환
      dataArray = Object.entries(parsedData).map(([key, value]) => {
        // 키가 타임스탬프일 수 있음
        const timestamp = parseInt(key);
        if (!isNaN(timestamp) && typeof value === 'number') {
          return { timestamp, price: value };
        }
        // value가 객체이고 price 속성이 있는 경우
        else if (typeof value === 'object' && value !== null && 'price' in value) {
          return { 
            timestamp: !isNaN(timestamp) ? timestamp : Date.now(),
            price: Number(value.price) || 0
          };
        }
        return null;
      }).filter(item => item !== null);
    }
    // 단일 객체인 경우
    else {
      dataArray = [parsedData];
    }

    console.log('Data array length before validation:', dataArray.length);
    if (dataArray.length > 0) {
      console.log('Sample data item:', dataArray[0]);
    }

    // 데이터 유효성 검증 및 변환 (더 유연하게)
    const validData = dataArray.filter(item => {
      if (!item || typeof item !== 'object') return false;
      
      // Date/날짜와 Close 속성 확인 (대소문자 무관)
      const hasDate = 'Date' in item || 'date' in item || '날짜' in item || 
                     'timestamp' in item || 'time' in item || 't' in item;
      const hasClose = 'Close' in item || 'close' in item || 
                      'price' in item || 'value' in item || 'p' in item || 'v' in item;
      
      return hasDate || hasClose;
    }).map(item => {
      // 다양한 속성명 처리
      let timestamp = item.Date || item.date || item['날짜'] || 
                     item.timestamp || item.time || item.t;
      let price = item.Close || item.close || 
                 item.price || item.value || item.p || item.v || 0;
      
      // 날짜 문자열을 타임스탬프로 변환
      if (typeof timestamp === 'string') {
        const parsedDate = new Date(timestamp);
        timestamp = parsedDate.getTime();
      } else {
        timestamp = Number(timestamp);
      }
      
      return {
        timestamp: timestamp,
        price: Number(price)
      };
    }).filter(item => 
      !isNaN(item.timestamp) && 
      !isNaN(item.price) && 
      item.timestamp > 0 &&
      item.price > 0  // 가격이 0보다 큰 경우만
    );

    console.log(`Valid data points: ${validData.length}`);

    if (validData.length === 0) {
      console.log('No valid data found in Redis');
      return { 
        success: false, 
        error: 'No valid data found after validation. Check Redis data structure.', 
        data: null 
      };
    }

    console.log(`Successfully retrieved ${validData.length} data points from price11`);
    
    return { 
      success: true, 
      data: validData,
      error: null 
    };
  } catch (error) {
    console.error('Error fetching price11 data from Redis:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: null 
    };
  }
}