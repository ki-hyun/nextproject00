"use server";

import { client, connectRedis } from "@/lib/redis";

export async function getPriceData(): Promise<{
  success: boolean;
  data?: Array<{ timestamp: number; price: number }>;
  error?: string;
}> {

    console.log("===================================getPriceData()")
  try {
    await connectRedis();
    
    // price00 키에서 데이터 가져오기
    const priceData = await client.get('price11');
    
    // console.log(priceData)

    if (!priceData) {
      return {
        success: true,
        data: []
      };
    }

    // {
    // timestamp: '1702771200000',
    // Open: '42237.88211302',
    // High: '42413.38579666',
    // Low: '41224.36450447',
    // Close: '41368.56431921',
    // Volume: '26705.39358420915'
    // },

    try {
      const parsedData = JSON.parse(priceData);
      
      // console.log(parsedData)

      // 데이터가 배열인지 확인하고 timestamp와 Close를 price로 변환
      const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      // 데이터 변환: timestamp는 숫자로, Close를 price로 매핑
      const transformedData = dataArray.map((item: {timestamp: string | number; Close: string | number}) => ({
        timestamp: typeof item.timestamp === 'string' ? parseInt(item.timestamp, 10) : item.timestamp,
        price: typeof item.Close === 'string' ? parseFloat(item.Close) : item.Close || 0
      }));

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