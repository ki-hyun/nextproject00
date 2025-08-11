"use server";

import { client, connectRedis } from "@/lib/redis";

export async function getData<T>(_key: string): Promise<{
  success: boolean;
  data?: T[];
  error?: string;
}> {

    console.log("=================================== getData<T>(_key: string): Promise<{")
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
      
      // 데이터 변환: 제네릭 타입에 맞게 변환
      const transformedData = dataArray.map((item: any) => ({
        ...item,  // 그대로 반환하거나 변환이 필요한 필드를 처리
      })) as T[]; // T[] 타입으로 변환

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