'use client';

export default function DeleteIndexButton() {
  const handleDelete = () => {
    if (confirm('정말로 사이트 인덱스 디비전부를 지우시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      fetch('/api/clear-index-division', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('사이트 인덱스 디비전부가 성공적으로 삭제되었습니다.');
          window.location.reload();
        } else {
          alert('삭제 중 오류가 발생했습니다: ' + data.error);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('삭제 중 오류가 발생했습니다.');
      });
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