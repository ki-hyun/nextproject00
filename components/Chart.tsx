'use client';

import { useEffect, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { getDataSimple } from "@/lib/data";
import { saveToIndexedDB, loadFromIndexedDB, isCacheValid } from "@/lib/indexeddb";

// Highcharts용 데이터 타입 [timestamp, value]
type ChartDataPoint = [number, number];

async function loadchart(chart: Highcharts.Chart, _chartnum: number, _redraw: boolean){

  const CACHE_MAX_AGE = 60 * 60 * 1000; // 60분 캐시 유효 시간   현제 쓰지 않음

  // 시리즈의 customData에서 dataSource 가져오기
  const series = chart.series[_chartnum];
  const element = (series.options as any)?.customData?.dataSource;
  
  console.log('async function loadchart(chart: Highcharts.Chart, _chartnum: number){',element,_chartnum)

  if (!element) {
    console.log('No dataSource found in series customData');
    return;
  }
        
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

      // timestamp가 초 단위인지 밀리초 단위인지 확인 (13자리 미만이면 초 단위로 간주)
      if (coinpriceData && coinpriceData.length > 0) {
        const firstTimestamp = coinpriceData[0][0];
        // timestamp가 10자리 전후면 초 단위로 간주 (Unix timestamp는 보통 10자리)
        if (firstTimestamp < 10000000000) {
          console.log('Converting timestamps from seconds to milliseconds...');
          coinpriceData = coinpriceData.map(([timestamp, value]) => [
            timestamp * 1000, // 초를 밀리초로 변환
            value
          ]);
        }
      }

      // IndexedDB에 저장 (변환된 밀리초 단위로 저장)
      await saveToIndexedDB(element, coinpriceData, coinpriceData[coinpriceData.length-1][0]);
      // console.log('Coinprice data saved to IndexedDB');
    } else {
      console.log('Failed to fetch coinprice data:', _coinprice.error);
    }
  }

  // 차트와 시리즈가 존재하는지 확인
  if (chart && chart.series && chart.series[_chartnum] && coinpriceData) {
    chart.series[_chartnum].setData(coinpriceData, false);
  }

  if(_redraw){
    chart.redraw();
  }
}

async function addchart(chart: Highcharts.Chart, seriesConfig: any){
  
    // // 사용 예시
    // const newSeriesConfig = {
    //   name: 'New Data',
    //   type: 'line',
    //   color: '#ff6b6b',
    //   lineWidth: 2,
    //   yAxis: 0,
    //   visible: true,
    //   tooltip: {
    //     valueDecimals: 2,
    //     valueSuffix: ' units'
    //   }
    // };
  
    // // 새 시리즈 추가
    // await addchart(chart, newSeriesConfig);


  // 새로운 시리즈를 차트에 추가
  const newSeries = chart.addSeries(seriesConfig, false); // false: 즉시 redraw하지 않음
  
  // 새로 추가된 시리즈의 인덱스 가져오기
  const seriesIndex = chart.series.indexOf(newSeries);
  
  // 데이터 로드
  await loadchart(chart, seriesIndex, false);
  
  // 차트 다시 그리기
  chart.redraw();
  
  return newSeries;
}

// Props 타입 정의
interface ChartProps {
  series?: Highcharts.SeriesOptionsType[];
  title?: string;
  firstloding?: number;
  height?: number;
}

export default function Chart({ series = [], title = 'chart', firstloding = 2, height = 800 }: ChartProps) {
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
      text: title,
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
              // console.log(`Loading data for ${this.name}...`);
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
          condition: { // 이 크기 넘으면 오른쪽에 배치
            minWidth: 2000  // 예: 1400px로 변경
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

    series: series,

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
        // 차트가 준비되지 않았거나 시리즈가 없으면 리턴
        if (!chartComponentRef.current?.chart || !series.length) {
          console.log('아직 준비 안됨  Chart or series not ready yet...');
          return;
        }
        
        const chart = chartComponentRef.current.chart;

        for (let i = 0; i < firstloding; i++) {
          if (chart.series[i]) {
            await loadchart(chart, i, false);
          }
        }

        // // 시리즈가 준비될 때까지 기다림
        // if (!chart.series || chart.series.length === 0) {
        //   console.log('Chart series not ready yet...');
        //   setTimeout(() => loadData(), 100);
        //   return;
        // }

        // // 실제 존재하는 시리즈 개수만큼 로드
        // const seriesToLoad = Math.min(chart.series.length, 2);
        // for (let i = 0; i < seriesToLoad; i++) {
        //   if (chart.series[i] && chart.series[i].options) {
        //     await loadchart(chart, i, false);
        //   }
        // }


        chart.redraw();

      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [series]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100" style={{ height: `${height}px` }}>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={options}
        ref={chartComponentRef}
        containerProps={{ style: { height: '100%', width: '100%' } }}
      />
    </div>
  );
}