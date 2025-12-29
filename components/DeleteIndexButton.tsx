'use client';

// import { clearCache } from '@/lib/indexeddb';

export default function DeleteIndexButton() {
  const handleDelete = async () => {
    if (confirm('정말로 사이트 인덱스 디비전부를 지우시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        // console.log('IndexedDB 삭제 시작...');
        // await clearCache();
        // console.log('IndexedDB 삭제 완료');
        // alert('사이트 인덱스 디비전부가 성공적으로 삭제되었습니다.');
        
        // 추가: 전체 IndexedDB 데이터베이스 삭제 시도
        const deleteRequest = indexedDB.deleteDatabase('ChartDataCache');
        deleteRequest.onsuccess = () => {
          console.log('IndexedDB 데이터베이스 완전 삭제 완료');
        };
        deleteRequest.onerror = () => {
          console.log('IndexedDB 데이터베이스 삭제 중 오류');
        };
        
        window.location.reload();
      } catch (error) {
        console.error('Error clearing IndexedDB cache:', error);
        alert('삭제 중 오류가 발생했습니다: ' + error);
      }
    }
  };

  return (
    <div className="mt-6 text-center">
      <button 
        onClick={handleDelete}
        className="px-6 py-3 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        🗑️ 사이트 인덱스 디비전부 삭제
      </button>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        ⚠️ 주의: 이 작업은 되돌릴 수 없습니다
      </div>
    </div>
  );
}