'use client';

import { useEffect, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { getDataSimple } from "@/lib/data";

// Highcharts용 데이터 타입 [timestamp, value]
type ChartDataPoint = [number, number];

export default function Graph3Page() {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  const options: Highcharts.Options = {
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'inherit'
      }
    },
    
    rangeSelector: {
      selected: 4,
      buttonTheme: {
        fill: 'rgba(59, 130, 246, 0.1)',
        stroke: 'rgba(59, 130, 246, 0.5)',
        style: {
          color: '#3b82f6'
        },
        states: {
          hover: {
            fill: 'rgba(59, 130, 246, 0.2)',
            stroke: '#3b82f6',
            style: {
              color: '#2563eb'
            }
          },
          select: {
            fill: '#3b82f6',
            stroke: '#3b82f6',
            style: {
              color: 'white'
            }
          }
        }
      },
      inputBoxBorderColor: 'rgba(59, 130, 246, 0.3)',
      inputStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        color: '#374151'
      },
      labelStyle: {
        color: '#6b7280'
      }
    },

    title: {
      text: 'Investment Simulator',
      style: {
        color: '#111827',
        fontSize: '24px',
        fontWeight: 'bold'
      }
    },

    yAxis: [{
      // 첫 번째 Y축: Bitcoin Price
      opposite: false,
      labels: {
        align: 'left',
        x: 0,
        style: {
          color: '#6b7280'
        }
      },
      gridLineColor: 'rgba(0, 0, 0, 0.05)',
      title: {
        // text: 'Bitcoin Price (USD)',
        style: {
          color: '#3b82f6'
        }
      }
    }, {
      // 두 번째 Y축: Hash Rate
      opposite: true,
      labels: {
        align: 'right',
        x: 0,
        style: {
          color: '#6b7280'
        }
      },
      gridLineColor: 'rgba(0, 0, 0, 0.05)',
      title: {
        // text: 'Hash Rate (TH/s)',
        style: {
          color: '#10b981'
        }
      }
    }],

    // xAxis: {
    //   labels: {
    //     style: {
    //       color: '#6b7280'
    //     }
    //   },
    //   lineColor: 'rgba(0, 0, 0, 0.1)',
    //   tickColor: 'rgba(0, 0, 0, 0.1)'
    // },

    legend: {
      enabled: true,
      itemStyle: {
        color: '#374151',
        fontWeight: 'normal'
      },
      itemHoverStyle: {
        color: '#111827'
      }
    },

    tooltip: {
      shared: false,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: 8,
      shadow: {
        color: 'rgba(0, 0, 0, 0.1)',
        offsetX: 0,
        offsetY: 2,
        opacity: 0.5,
        width: 3
      },
      style: {
        color: '#374151'
      }
    },

    plotOptions: {
      series: {
        tooltip: {
          valueDecimals: 2
        }
      }
    },
    
    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function() {
          return Highcharts.dateFormat('%Y-%m-%d', this.value as number);
        },
        style: {
          color: '#6b7280'
        }
      },
      lineColor: 'rgba(0, 0, 0, 0.1)',
      tickColor: 'rgba(0, 0, 0, 0.1)'
    },

    responsive: {
      rules: [
        {
          condition: {
            minWidth: 1200
          },
          chartOptions: {
            legend: {
              align: 'right',
              layout: 'proximate',
              labelFormat: '{name}'
            }
          }
        }
      ]
    },

    series: [
      {
        name: 'Price',
        type: 'line',
        data: [],
        color: '#3b82f6',
        lineWidth: 2,
        turboThreshold: 0,  // 모든 데이터 포인트 표시
        yAxis: 0,
        tooltip: {
          valueDecimals: 2,
          valuePrefix: '$',
          valueSuffix: ' USD'
        }
      },
      {
        name: 'HashRate',
        type: 'line',
        data: [],
        color: '#10b981',
        lineWidth: 2,
        turboThreshold: 0,  // 모든 데이터 포인트 표시
        yAxis: 1,
        tooltip: {
          valueDecimals: 2,
          valueSuffix: ' TH/s'
        }
      }
    ],

    credits: {
      enabled: false
    },

    navigator: {
      maskFill: 'rgba(59, 130, 246, 0.1)',
      outlineColor: 'rgba(59, 130, 246, 0.3)',
      handles: {
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb'
      }
    },

    scrollbar: {
      barBackgroundColor: 'rgba(0, 0, 0, 0.05)',
      barBorderColor: 'rgba(0, 0, 0, 0.05)',
      buttonBackgroundColor: 'rgba(0, 0, 0, 0.05)',
      buttonBorderColor: 'rgba(0, 0, 0, 0.05)',
      trackBackgroundColor: 'rgba(0, 0, 0, 0.02)',
      trackBorderColor: 'rgba(0, 0, 0, 0.02)'
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Redis에서 coinprice 데이터 로드
        const _coinprice = await getDataSimple<ChartDataPoint>("coinprice");
        const _hashrate = await getDataSimple<ChartDataPoint>("hashrate");
        // const _hashrate = await getDataSimple<ChartDataPoint>("hashrate");
        // const _hashrate = await getDataSimple<ChartDataPoint>("hashrate");

        // hashrate

        // { timestamp: 1293840000000, value: 130.32210291 }

        // console.log(result2)

        // // 외부 데이터도 로드 (두 번째 시리즈용)
        // const response = await fetch(
        //   'https://cdn.jsdelivr.net/gh/highcharts/highcharts@a9dcb12aad/samples/data/investment-simulator.json'
        // );
        // const data = await response.json();



        // console.log('Redis result:', result);
        // console.log('Redis result2:', result2);
        
        if (chartComponentRef.current && _coinprice.success && _coinprice.data) {
          const chart = chartComponentRef.current.chart;
          // 첫 번째 시리즈: Bitcoin 데이터 업데이트
          chart.series[0].setData(_coinprice.data, false);
          
          // 두 번째 시리즈: Hash Rate 데이터 업데이트
          if (_hashrate.success && _hashrate.data) {
            chart.series[1].setData(_hashrate.data, false);
          }
          
          // 차트 다시 그리기
          chart.redraw();
        } else {
          console.log('Data loading failed:', _coinprice.error);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            Investment Simulator Chart
          </h1>
          <p className="text-gray-600">
            Track your investment performance over time with interactive charts
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100" style={{ height: '800px' }}>
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={options}
            ref={chartComponentRef}
            containerProps={{ style: { height: '100%', width: '100%' } }}
          />
        </div>
        
      </div>
    </div>
  );
}