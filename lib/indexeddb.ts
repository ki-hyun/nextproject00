// IndexedDB helper functions for caching chart data

const DB_NAME = 'ChartDataCache';
const DB_VERSION = 1;
const STORE_NAME = 'chartData';

interface CachedData {
  key: string;
  data: any;
  timestamp: number;
}

// Format timestamp to YYMMDD format
const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const yy = date.getFullYear().toString().slice(-2);
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  return `${yy}${mm}${dd}`;
};

// Initialize IndexedDB
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

// Save data to IndexedDB
export const saveToIndexedDB = async (key: string, data: any, timestamp: number): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const cachedData: CachedData = {
      key,
      data,
      timestamp: timestamp
      // timestamp: Date.now()     // timestamp는 number 타입입니다.
    };
    // 세이브 할때 가장 마지막 데이터의 timestamp

    const request = store.put(cachedData); // put(): 같은 key가 있으면 덮어쓰기, 없으면 새로 생성 // add(): 같은 key가 있으면 에러, 없을 때만 추가
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        // console.log(`Data saved to IndexedDB with key: ${key}`);
        resolve();
      };
      request.onerror = () => {
        // reject(new Error(`Failed to save data with key: ${key}`));
      };
    });
  } catch (error) {
    console.error('Error saving to IndexedDB:', error);
    throw error;
  }
};

// Load data from IndexedDB
export const loadFromIndexedDB = async (key: string): Promise<any | null> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // console.log(`Data loaded from IndexedDB with key: ${key}`);
          resolve(result.data);
        } else {
          // console.log(`No data found in IndexedDB for key: ${key}`);
          resolve(null);
        }
      };
      request.onerror = () => {
        reject(new Error(`Failed to load data with key: ${key}`));
      };
    });
  } catch (error) {
    console.error('Error loading from IndexedDB:', error);
    return null;
  }
};

// Check if cached data is still valid (optional: add expiration logic)
export const isCacheValid = async (key: string, maxAgeMs: number = 3600000): Promise<boolean> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);
    
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          
          const age = Date.now() - result.timestamp;
          // console.log(`Cache timestamp: ${formatTimestamp(result.timestamp)}, Age: ${Math.round(age / 1000)}s`);
          // console.log(`저장된 Cache timestamp: ${formatTimestamp(result.timestamp)}`);
          
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayTimestamp = yesterday.getTime();

          // const currentTimestamp = Date.now();
          
          // const _day_cache = formatTimestamp(result.timestamp)
          const _day_cache = '250810'
          const _day_check = new Date(yesterdayTimestamp).toISOString().slice(2,10).replace(/-/g,'');
          
          // const currentDateTime = new Date(yesterdayTimestamp).toISOString().slice(2,16).replace('T','_').replace(/[-:]/g,'');  // "241211_1530"

          // console.log(`시간: ${currentYYMMDD}, ${currentDateTime}`);
          // console.log(parseInt(_day_check), parseInt(formatTimestamp(result.timestamp)));

          // resolve(age < maxAgeMs);
          // resolve(_day_check <= _day_cache); // 캐쉬된 날짜가 어제보다 뒤임
          resolve(true)
        } else {
          resolve(false);
        }
      };
      request.onerror = () => {
        resolve(false);
      };
    });
  } catch (error) {
    console.error('Error checking cache validity:', error);
    return false;
  }
};

// Clear all cached data (optional)
export const clearCache = async (): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('IndexedDB cache cleared');
        resolve();
      };
      request.onerror = () => {
        reject(new Error('Failed to clear cache'));
      };
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    throw error;
  }
};