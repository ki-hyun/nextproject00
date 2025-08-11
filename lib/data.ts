"use server";

import { client, connectRedis } from "@/lib/redis";

export async function getDataSimple<T>(_key: string): Promise<{
  success: boolean;
  data?: T[];
  error?: string;
}> {

    console.log("=================================== getDataSimple<T>(_key: string): Promise<{")
  try {
    await connectRedis();
    
    // price 키에서 데이터 가져오기 (요구사항대로)
    const priceData = await client.get(_key);
    
    // console.log(priceData)

    if (!priceData) {
      return {
        success: true,
        data: []
      };
    }

    try {
      const parsedData = JSON.parse(priceData);
      // console.log(parsedData)

      // 데이터가 배열인지 확인하고 timestamp와 Close를 price로 변환
      const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];      
      // console.log(dataArray)

      // 데이터 변환: [timestamp, value] 배열 형식으로 변환
      const transformedData = dataArray
        .map((item: any) => [
          parseInt(item.timestamp),
          parseFloat(item.value)
        ])
        .sort((a, b) => a[0] - b[0]) as T[]; // timestamp(첫 번째 요소) 기준 오름차순 정렬

      // console.log(transformedData)

      return {
        success: true,
        data: transformedData
      };
    } catch (parseError) {
      console.error("Price data parsing error:", parseError);
      return {
        success: false,
        error: "가격 데이터 파싱 중 오류가 발생했습니다"
      };
    }
    
  } catch (error) {
    console.error("Redis getPriceData 에러:", error);
    return {
      success: false,
      error: "Redis 연결 또는 조회 중 오류가 발생했습니다"
    };
  }
}


export async function getData<T>(_key: string): Promise<{
  success: boolean;
  data?: T[];
  error?: string;
}> {

    // console.log("=================================== getData<T>(_key: string): Promise<{")
  try {
    await connectRedis();
    
    // price 키에서 데이터 가져오기 (요구사항대로)
    const priceData = await client.get(_key);
    
    // console.log(priceData)

    if (!priceData) {
      return {
        success: true,
        data: []
      };
    }

    try {
      const parsedData = JSON.parse(priceData);
      
      // console.log(parsedData)

      // 데이터가 배열인지 확인하고 timestamp와 Close를 price로 변환
      const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      

      // // 데이터 변환: timestamp는 숫자로, Close를 price로 매핑
      // const transformedData = dataArray.map((item: {timestamp: string | number; Close: string | number}) => ({
      //   timestamp: typeof item.timestamp === 'string' ? parseInt(item.timestamp, 10) : item.timestamp,
      //   price: typeof item.Close === 'string' ? parseFloat(item.Close) : item.Close || 0
      // }));

      // 데이터 변환: timestamp는 parseInt, Close는 Value로 명칭 변경하고 parseInt
      const transformedData = dataArray
        .map((item: any) => ({
          // ...item,
          timestamp: parseInt(item.timestamp),
          value: parseInt(item.Close)
        }))
        .sort((a, b) => a.timestamp - b.timestamp) as T[]; // timestamp 기준 오름차순 정렬

      // console.log(transformedData)

      return {
        success: true,
        data: transformedData
      };
    } catch (parseError) {
      console.error("Price data parsing error:", parseError);
      return {
        success: false,
        error: "가격 데이터 파싱 중 오류가 발생했습니다"
      };
    }
    
  } catch (error) {
    console.error("Redis getPriceData 에러:", error);
    return {
      success: false,
      error: "Redis 연결 또는 조회 중 오류가 발생했습니다"
    };
  }
}


export async function getData222<T>(_key: string): Promise<{
  success: boolean;
  data?: T[];
  error?: string;
}> {

    // console.log("=================================== getData22222222222<T>(_key: string): Promise<{")
  try {
    await connectRedis();
    
    // price 키에서 데이터 가져오기 (요구사항대로)
    const priceData = await client.get(_key);
    
    // console.log(priceData)

    if (!priceData) {
      return {
        success: true,
        data: []
      };
    }

    try {
      const parsedData = JSON.parse(priceData);
      
      // console.log(parsedData)

      // 데이터가 배열인지 확인하고 timestamp와 Close를 price로 변환
      const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      

      // // 데이터 변환: timestamp는 숫자로, Close를 price로 매핑
      // const transformedData = dataArray.map((item: {timestamp: string | number; Close: string | number}) => ({
      //   timestamp: typeof item.timestamp === 'string' ? parseInt(item.timestamp, 10) : item.timestamp,
      //   price: typeof item.Close === 'string' ? parseFloat(item.Close) : item.Close || 0
      // }));



      // 데이터 변환: timestamp는 parseInt, Close는 Value로 명칭 변경하고 parseInt
      const transformedData = dataArray
        .map((item: any) => ({
          // ...item,
          timestamp: parseInt(item.timestamp),
          value: parseFloat(item.hashrate)
        }))
        .sort((a, b) => a.timestamp - b.timestamp) as T[]; // timestamp 기준 오름차순 정렬

      // console.log(transformedData)

      return {
        success: true,
        data: transformedData
      };
    } catch (parseError) {
      console.error("Price data parsing error:", parseError);
      return {
        success: false,
        error: "가격 데이터 파싱 중 오류가 발생했습니다"
      };
    }
    
  } catch (error) {
    console.error("Redis getPriceData 에러:", error);
    return {
      success: false,
      error: "Redis 연결 또는 조회 중 오류가 발생했습니다"
    };
  }
}








// {
// timestamp: '1702771200000',
// Open: '42237.88211302',
// High: '42413.38579666',
// Low: '41224.36450447',
// Close: '41368.56431921',
// Volume: '26705.39358420915'
// },


// export { getData };