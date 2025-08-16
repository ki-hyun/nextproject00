'use client';

import { useEffect, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { getDataSimple } from "@/lib/data";
import { saveToIndexedDB, loadFromIndexedDB, isCacheValid } from "@/lib/indexeddb";

// Highcharts용 데이터 타입 [timestamp, value]
type ChartDataPoint = [number, number];

async function loadchart(chart: Highcharts.Chart, _chartnum: number, _redraw: boolean){

  console.log('async function loadchart(chart: Highcharts.Chart, _chartnum: number){',_chartnum)

  const DBCACHE_KEY = ['coinprice','hashrate','blockreward','totalfee'];
  const CACHE_MAX_AGE = 60 * 60 * 1000; // 60분 캐시 유효 시간   현제 쓰지 않음

  const element = DBCACHE_KEY[_chartnum];
        
  let coinpriceData = null;

  // 1. IndexedDB에서 캐시된 데이터 확인
  const isCached = await isCacheValid(element, CACHE_MAX_AGE);

  if (isCached) {
    // 캐시가 유효하면 IndexedDB에서 데이터 로드
    console.log(element,'인덱스 db에서 가져옴 Loading coinprice data from IndexedDB cache...');
    coinpriceData = await loadFromIndexedDB(element);
  }

  // 2. 캐시가 없거나 만료되었으면 서버에서 데이터 가져오기
  if (!coinpriceData) {
    console.log('서버에서 가져옴 Fetching coinprice data from server...');
    const _coinprice = await getDataSimple<ChartDataPoint>(element);
    
    if (_coinprice.success && _coinprice.data) {
      coinpriceData = _coinprice.data;

      // IndexedDB에 저장
      await saveToIndexedDB(element, coinpriceData, coinpriceData[coinpriceData.length-1][0]);
      // console.log('Coinprice data saved to IndexedDB');
    } else {
      console.log('Failed to fetch coinprice data:', _coinprice.error);
    }
  }

  // if (chartComponentRef.current && coinpriceData) {
    chart.series[_chartnum].setData(coinpriceData, false);
  // }

  if(_redraw){
    chart.redraw();
  }
}


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
    }, {
      // 세 번째 Y축: Block Reward
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
        // text: 'Block Reward (BTC)',
        style: {
          color: '#f59e0b'
        }
      }
    }, {
      // 네 번째 Y축: Total Fee
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
        // text: 'Total Fee (BTC)',
        style: {
          color: '#ef4444'
        }
      }
    }],

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
        },
        events: {
          legendItemClick: async function(this: Highcharts.Series) {
            // console.log(`Legend item clicked: ${this.name}`);
            // console.log(`Current visibility: ${this.visible ? 'visible' : 'hidden'}`);
            
            // 차트 객체는 this.chart로 가져옴
            const chart = this.chart;
            
            // 시리즈 인덱스 찾기
            const seriesIndex = chart.series.indexOf(this);
            
            // 현재 숨겨진 상태에서 활성화하려는 경우이고, 데이터가 없는 경우에만 로드
            if (this.visible && (!this.data || this.data.length === 0)) {
              console.log(`Loading data for ${this.name}...`);
              await loadchart(chart, seriesIndex, true);
            }
            
            // return false; // 기본 show/hide 동작 막기
          }
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
        visible: true,  // Price만 처음에 표시
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
        visible: true,  // 처음에는 숨김
        tooltip: {
          valueDecimals: 2,
          valueSuffix: ' TH/s'
        }
      },
      {
        name: 'Block Reward',
        type: 'line',
        data: [],
        color: '#f59e0b',
        lineWidth: 2,
        turboThreshold: 0,  // 모든 데이터 포인트 표시
        yAxis: 2,
        visible: false,  // 처음에는 숨김
        tooltip: {
          valueDecimals: 8,
          valueSuffix: ' BTC'
        }
      },
      {
        name: 'Total Fee',
        type: 'line',
        data: [],
        color: '#ef4444',
        lineWidth: 2,
        turboThreshold: 0,  // 모든 데이터 포인트 표시
        yAxis: 3,
        visible: false,  // 처음에는 숨김
        tooltip: {
          valueDecimals: 8,
          valueSuffix: ' BTC'
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
        
        // const CACHE_KEY = 'coinprice_data';
        
        const DBCACHE_KEY = ['coinprice','hashrate','blockreward','totalfee'];
        const CACHE_MAX_AGE = 60 * 60 * 1000; // 60분 캐시 유효 시간   현제 쓰지 않음
        
        // 차트가 준비되지 않았으면 리턴
        if (!chartComponentRef.current?.chart) {
          console.log('Chart not ready yet, retrying...');
          // setTimeout(() => loadData(), 100);
          return;
        }
        
        const chart = chartComponentRef.current.chart;

        await loadchart(chart, 0, false);
        await loadchart(chart, 1, false);

        chart.redraw();

        // // for (let index = 0; index < DBCACHE_KEY.length; index++) {
        // for (let index = 0; index < 1; index++) {
        //   const element = DBCACHE_KEY[index];
          
        //   let coinpriceData = null;

        //   // 1. IndexedDB에서 캐시된 데이터 확인
        //   const isCached = await isCacheValid(element, CACHE_MAX_AGE);

        //   if (isCached) {
        //     // 캐시가 유효하면 IndexedDB에서 데이터 로드
        //     console.log(element,'인덱스 db에서 가져옴 Loading coinprice data from IndexedDB cache...');
        //     coinpriceData = await loadFromIndexedDB(element);
        //   }

        //   // 2. 캐시가 없거나 만료되었으면 서버에서 데이터 가져오기
        //   if (!coinpriceData) {
        //     console.log('서버에서 가져옴 Fetching coinprice data from server...');
        //     const _coinprice = await getDataSimple<ChartDataPoint>(element);
            
        //     if (_coinprice.success && _coinprice.data) {
        //       coinpriceData = _coinprice.data;

        //       // IndexedDB에 저장
        //       await saveToIndexedDB(element, coinpriceData, coinpriceData[coinpriceData.length-1][0]);
        //       // console.log('Coinprice data saved to IndexedDB');
        //     } else {
        //       console.log('Failed to fetch coinprice data:', _coinprice.error);
        //     }
        //   }

        //   if (chartComponentRef.current && coinpriceData) {
        //     chart.series[index].setData(coinpriceData, false);
        //   }
        // }
        
        // chart.redraw();
        

        // // 1. IndexedDB에서 캐시된 데이터 확인
        // const isCached = await isCacheValid(CACHE_KEY, CACHE_MAX_AGE);
        
        // if (isCached) {
        //   // 캐시가 유효하면 IndexedDB에서 데이터 로드
        //   console.log('인덱스 db에서 가져옴 Loading coinprice data from IndexedDB cache...');
        //   coinpriceData = await loadFromIndexedDB(CACHE_KEY);
        // }
        
        // // 2. 캐시가 없거나 만료되었으면 서버에서 데이터 가져오기
        // if (!coinpriceData) {
        //   console.log('서버에서 가져옴 Fetching coinprice data from server...');
        //   const _coinprice = await getDataSimple<ChartDataPoint>("coinprice");
          
        //   if (_coinprice.success && _coinprice.data) {
        //     coinpriceData = _coinprice.data;

        //     // const date = new Date(timestamp);
        //     // console.log(parseInt(coinpriceData[coinpriceData.length-1]))
        //     // console.log("체크----------------",parseInt(coinpriceData[coinpriceData.length-1][0]))
        //     // const _lasttimestemp = parseInt(coinpriceData[coinpriceData.length-1][0])
        //     // console.log(new Date(_lasttimestemp))

        //     // IndexedDB에 저장
        //     await saveToIndexedDB(CACHE_KEY, coinpriceData, parseInt(coinpriceData[coinpriceData.length-1][0]));
        //     // console.log('Coinprice data saved to IndexedDB');
        //   } else {
        //     console.log('Failed to fetch coinprice data:', _coinprice.error);
        //   }
        // }
        
        // // 나머지 데이터는 항상 서버에서 가져오기 (필요시 이것도 캐싱 가능)
        // const _hashrate = await getDataSimple<ChartDataPoint>("hashrate");
        // const _blockreward = await getDataSimple<ChartDataPoint>("blockreward");
        // const _totalfee = await getDataSimple<ChartDataPoint>("totalfee");
        
        // 차트 업데이트
        // if (chartComponentRef.current && coinpriceData) {
        //   const chart = chartComponentRef.current.chart;
          
        //   // 첫 번째 시리즈: Bitcoin 데이터 업데이트
        //   chart.series[0].setData(coinpriceData, false);
          
        //   // // 두 번째 시리즈: Hash Rate 데이터 업데이트
        //   // if (_hashrate.success && _hashrate.data) {
        //     chart.series[1].setData(_hashrate.data, false);
        //   // }
          
        //   // // 세 번째 시리즈: Block Reward 데이터 업데이트
        //   // if (_blockreward.success && _blockreward.data) {
        //     chart.series[2].setData(_blockreward.data, false);
        //   // }
          
        //   // // 네 번째 시리즈: Total Fee 데이터 업데이트
        //   // if (_totalfee.success && _totalfee.data) {
        //   //   chart.series[3].setData(_totalfee.data, false);
        //   // }
          
        //   // 차트 다시 그리기
        //   chart.redraw();
        // } else if (!coinpriceData) {
        //   console.log('No coinprice data available');
        // }
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