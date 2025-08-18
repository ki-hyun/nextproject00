import Chart from '@/components/Chart';
import TabNavigation from '../../components/TabNavigation';

export default function GraphPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <TabNavigation />
      <main className="container mx-auto px-1 py-5">
        <div className="max-w-7xl mx-auto">
          <Chart />
        </div>
      </main>
    </div>
  );
}