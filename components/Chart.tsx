'use client';

import { useEffect, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { getDataSimple } from "@/lib/data";
import { saveToIndexedDB, loadFromIndexedDB, isCacheValid } from "@/lib/indexeddb";

// Highcharts용 데이터 타입 [timestamp, value]
type ChartDataPoint = [number, number];

async function loadchart(chart: Highcharts.Chart, _chartnum: number, _redraw: boolean) {

  const CACHE_MAX_AGE = 60 * 60 * 1000; // 60분 캐시 유효 시간   현제 쓰지 않음

  // 시리즈의 customData에서 dataSource 가져오기
  const series = chart.series[_chartnum];
  const element = (series.options as any)?.customData?.dataSource;

  console.log('async function loadchart(chart: Highcharts.Chart, _chartnum: number){', element, _chartnum)

  if (!element) {
    console.log('No dataSource found in series customData');
    return;
  }

  let coinpriceData = null;

  // 1. IndexedDB에서 캐시된 데이터 확인
  // const isCached = await isCacheValid(element, CACHE_MAX_AGE);

  // if (isCached) {
  //   // 캐시가 유효하면 IndexedDB에서 데이터 로드
  //   console.log(element,'인덱스 db에서 가져옴 Loading coinprice data from IndexedDB cache...');
  //   coinpriceData = await loadFromIndexedDB(element);
  // }

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

        // 데이터가 있을 때만 IndexedDB에 저장
        await saveToIndexedDB(element, coinpriceData, coinpriceData[coinpriceData.length - 1][0]);
      }
    } else {
      console.log('Failed to fetch coinprice data:', _coinprice.error);
    }
  }

  // 차트와 시리즈가 존재하는지 확인
  if (chart && chart.series && chart.series[_chartnum] && coinpriceData) {

    // // displayUnit이 trillion인 경우 데이터를 1조로 나누기
    // const displayUnit = (series.options as any)?.customData?.displayUnit;
    // if (displayUnit === 'trillion') {
    //   coinpriceData = coinpriceData.map(([timestamp, value]) => [
    //     timestamp,
    //     value / 1e12 // 1조로 나누기
    //   ]);
    // }


    chart.series[_chartnum].setData(coinpriceData, false);
  }

  if (_redraw) {
    chart.redraw();
  }
}

async function addchart(chart: Highcharts.Chart, seriesConfig: any) {

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
  defaultSelectedRange?: number;
}

export default function Chart({ series = [], title = 'chart', firstloding = 2, height = 800, defaultSelectedRange = 0 }: ChartProps) {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  // 브라우저 로컬 시간대 오프셋(분)
  const timezoneOffset = -new Date().getTimezoneOffset();

  // 네비게이터 시리즈 활성화 여부 동적 조절 (Price 우선순위)
  const syncNavigator = (chart: Highcharts.Chart) => {
    if (!(chart as any).navigator || !(chart as any).navigator.series) return;

    const priceSeries = chart.series.find(s => (s.options as any).customData?.dataSource === 'price');
    const hashrateSeries = chart.series.find(s => (s.options as any).customData?.dataSource === 'hashrate');

    if (!priceSeries || !hashrateSeries) return;

    const priceNavSeries = (chart as any).navigator.series.find((s: any) => s.name === priceSeries.name);
    const hashrateNavSeries = (chart as any).navigator.series.find((s: any) => s.name === hashrateSeries.name);

    if (priceNavSeries && hashrateNavSeries) {
      // 원본 참조 복사본 보관
      if (!priceNavSeries.originalBaseSeries) priceNavSeries.originalBaseSeries = priceNavSeries.baseSeries || priceSeries;
      if (!hashrateNavSeries.originalBaseSeries) hashrateNavSeries.originalBaseSeries = hashrateNavSeries.baseSeries || hashrateSeries;
      if (!(priceSeries as any).originalNavigatorSeries) (priceSeries as any).originalNavigatorSeries = (priceSeries as any).navigatorSeries || priceNavSeries;
      if (!(hashrateSeries as any).originalNavigatorSeries) (hashrateSeries as any).originalNavigatorSeries = (hashrateSeries as any).navigatorSeries || hashrateNavSeries;

      const origPriceNav = (priceSeries as any).originalNavigatorSeries;
      const origHashrateNav = (hashrateSeries as any).originalNavigatorSeries;

      if (priceSeries.visible) {
        // Price 활성화 -> Price 네비게이터 우선 노출 및 HashRate 네비게이터 링크 차단/숨김
        (priceSeries as any).navigatorSeries = origPriceNav;
        origPriceNav.baseSeries = priceSeries;
        origPriceNav.setVisible(true, false);

        (hashrateSeries as any).navigatorSeries = undefined;
        origHashrateNav.baseSeries = undefined;
        origHashrateNav.setVisible(false, false);
      } else if (hashrateSeries.visible) {
        // Price 비활성화 & HashRate 활성화 -> HashRate 네비게이터 노출 및 Price 네비게이터 링크 차단/숨김
        (priceSeries as any).navigatorSeries = undefined;
        origPriceNav.baseSeries = undefined;
        origPriceNav.setVisible(false, false);

        (hashrateSeries as any).navigatorSeries = origHashrateNav;
        origHashrateNav.baseSeries = hashrateSeries;
        origHashrateNav.setVisible(true, false);
      } else {
        // 둘 다 꺼져 있는 경우 네비게이터 유지용 기본 설정 (HashRate 우선)
        (priceSeries as any).navigatorSeries = undefined;
        origPriceNav.baseSeries = undefined;
        origPriceNav.setVisible(false, false);

        (hashrateSeries as any).navigatorSeries = origHashrateNav;
        origHashrateNav.baseSeries = hashrateSeries;
        origHashrateNav.setVisible(true, false);
      }
      chart.redraw();
    }
  };

  // timestamp + offset(분) → 'YYYY-MM-DD HH:mm' 문자열
  const formatWithOffset = (timestamp: number, offsetMin: number) => {
    const d = new Date(timestamp + offsetMin * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  };

  // 큰 숫자를 단위에 맞게 자동 축약
  // seriesName에 'hash'가 포함되면 해시레이트 단위(TH/PH/EH) 적용, 그 외엔 K/M/B/T
  const formatValue = (value: number, seriesName: string): string => {
    const name = seriesName.toLowerCase();
    // price 시리즈는 축약 없이 전체 값 표시
    if (name.includes('price')) {
      return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    if (name.includes('hash')) {
      // 해시레이트: 원시 단위가 H/s라고 가정
      const units: [number, string][] = [
        [1e21, 'ZH/s'],
        [1e18, 'EH/s'],
        [1e15, 'PH/s'],
        [1e12, 'TH/s'],
        [1e9, 'GH/s'],
        [1e6, 'MH/s'],
        [1e3, 'KH/s'],
      ];
      for (const [div, label] of units) {
        if (Math.abs(value) >= div) {
          const formatted = (value / div).toLocaleString(undefined, { maximumFractionDigits: 2 });
          return `${formatted} ${label}`;
        }
      }
      return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} H/s`;
    }
    // 일반 숫자 ( K / M / B / T )
    const units: [number, string][] = [
      [1e12, 'T'],
      [1e9, 'B'],
      [1e6, 'M'],
      [1e3, 'K'],
    ];
    for (const [div, label] of units) {
      if (Math.abs(value) >= div) {
        const formatted = (value / div).toLocaleString(undefined, { maximumFractionDigits: 2 });
        return `${formatted}${label}`;
      }
    }
    return value.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  // tzLabel 표시용
  const tzSign = timezoneOffset >= 0 ? '+' : '-';
  const tzAbs = Math.abs(timezoneOffset);
  const tzHour = Math.floor(tzAbs / 60);
  const tzMin = tzAbs % 60 !== 0 ? ':' + String(tzAbs % 60).padStart(2, '0') : '';
  const currentTzLabel = `UTC${tzSign}${tzHour}${tzMin}`;

  const options: Highcharts.Options = {
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'inherit'
      }
    },

    rangeSelector: {
      selected: defaultSelectedRange,
      buttons: [{
        type: 'week',
        count: 1,
        text: '1w'
      }, {
        type: 'month',
        count: 1,
        text: '1m'
      }, {
        type: 'month',
        count: 3,
        text: '3m'
      }, {
        type: 'month',
        count: 6,
        text: '6m'
      }, {
        type: 'ytd',
        text: 'YTD'
      }, {
        type: 'year',
        count: 1,
        text: '1y'
      }, {
        type: 'all',
        text: 'All'
      }],
      buttonTheme: {
        fill: 'rgba(59, 130, 246, 0.1)',
        stroke: 'rgba(59, 130, 246, 0.5)',
        'stroke-width': 1,
        r: 6,
        padding: 4,
        style: {
          color: '#3b82f6',
          fontWeight: '600'
        },
        states: {
          hover: {
            fill: 'rgba(59, 130, 246, 0.2)',
            stroke: '#3b82f6',
            style: {
              color: '#2563eb',
              fontWeight: '600'
            }
          },
          select: {
            fill: '#3b82f6',
            stroke: '#2563eb',
            'stroke-width': 2,
            style: {
              color: '#ffffff',
              fontWeight: '700'
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
      // 세 번째 Y축: Block Reward / Difficulty
      opposite: false,
      labels: {
        enabled: false,
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
      shared: true,
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
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: function (this: any) {
        const x = this.x as number;
        const timeStr = formatWithOffset(x, timezoneOffset);
        let html = `<span style="font-size:11px;color:#6b7280">${timeStr} (${currentTzLabel})</span><br/>`;

        const chart = this.points ? this.points[0].series.chart : this.series?.chart;
        if (!chart) return html;

        chart.series.forEach((s: any) => {
          // Navigator나 내부 시리즈, 숨겨진 시리즈는 제외
          if (!s.visible || s.options.isInternal || s.name.includes('Navigator')) return;

          let val: number | null | undefined = null;

          // 정확히 일치하는 시간대의 point가 this.points에 있으면 그것을 사용
          const exactPoint = (this.points ?? []).find((p: any) => p.series === s);
          if (exactPoint && typeof exactPoint.y === 'number') {
            val = exactPoint.y;
          } else {
            // 없으면 해당 시리즈의 데이터 중 x와 가장 가깝거나 직전인 값을 찾음 (이진 탐색)
            const xData = s.processedXData || s.xData;
            const yData = s.processedYData || s.yData;
            if (xData && yData && xData.length > 0) {
              let idx = -1;
              let low = 0, high = xData.length - 1;
              // 범위를 벗어난 경우 처리
              if (x < xData[0]) {
                idx = -1; // 데이터 시작 전
              } else if (x >= xData[xData.length - 1]) {
                idx = xData.length - 1;
              } else {
                while (low <= high) {
                  const mid = Math.floor((low + high) / 2);
                  if (xData[mid] === x) {
                    idx = mid;
                    break;
                  } else if (xData[mid] < x) {
                    idx = mid;
                    low = mid + 1;
                  } else {
                    high = mid - 1;
                  }
                }
              }
              if (idx !== -1) val = yData[idx];
            }
          }

          if (val !== null && val !== undefined) {
            const formatted = formatValue(val, s.name);
            const color = s.color || '#374151';
            html += `<span style="color:${color}">●</span> <b>${s.name}</b>: ${formatted}<br/>`;
          }
        });

        return html;
      }
    },

    plotOptions: {
      series: {
        tooltip: {
          valueDecimals: 2
        },
        events: {
          legendItemClick: async function (this: Highcharts.Series) {
            // console.log(`Legend item clicked: ${this.name}`);
            const chart = this.chart;
            const seriesIndex = chart.series.indexOf(this);

            // 현재 숨겨진 상태에서 활성화하려는 경우이고, 데이터가 없는 경우에만 로드
            if (!this.visible && (!this.data || this.data.length === 0)) {
              // console.log(`Loading data for ${this.name}...`);
              await loadchart(chart, seriesIndex, true);
            }

            // 범례 상태 변경 완료 후 네비게이터 동기화
            setTimeout(() => {
              syncNavigator(chart);
            }, 0);
          }
        }
      }
    },

    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function () {
          return formatWithOffset(this.value as number, timezoneOffset).slice(0, 10); // YYYY-MM-DD
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
    console.log('[Chart.tsx] useEffect 실행됨', { seriesCount: series.length });
    let isMounted = true;

    const loadData = async () => {
      console.log('[Chart.tsx] loadData 호출됨');
      try {
        // 차트가 준비되지 않았거나 시리즈가 없으면 리턴
        if (!chartComponentRef.current?.chart || !series.length) {
          console.log('[Chart.tsx] 아직 준비 안됨 Chart or series not ready yet...', { 
            hasChart: !!chartComponentRef.current?.chart, 
            seriesLength: series.length 
          });
          return;
        }

        const chart = chartComponentRef.current.chart;
        console.log('[Chart.tsx] chart 준비 완료, 데이터 로드 시작', { firstloding });

        for (let i = 0; i < firstloding; i++) {
          console.log(`[Chart.tsx] ${i}번째 시리즈 확인 중...`);
          // 언마운트 됐거나 차트가 이미 파괴된 경우 중단
          if (!isMounted || !chart.series) {
            console.log(`[Chart.tsx] 중단됨. isMounted: ${isMounted}, hasChartSeries: ${!!chart.series}`);
            break;
          }

          if (i < chart.series.length && chart.series[i]) {
            console.log(`[Chart.tsx] ${i}번째 시리즈(${chart.series[i].name}) 데이터 로드 호출`);
            await loadchart(chart, i, false);
            console.log(`[Chart.tsx] ${i}번째 시리즈 데이터 로드 완료`);
          }
        }

        console.log('[Chart.tsx] 모든 초기 데이터 로드 완료, syncNavigator 호출 준비');
        // 아직 마운트 상태이고 차트가 유효할 때만 redraw
        if (isMounted && chart.series) {
          syncNavigator(chart); // 초기 상태에 따른 네비게이터 동기화
          console.log('[Chart.tsx] syncNavigator 완료, chart.redraw() 호출');
          chart.redraw();
          if ((chart as any).rangeSelector && typeof defaultSelectedRange === 'number') {
            (chart as any).rangeSelector.clickButton(defaultSelectedRange, true);
          }
        }

      } catch (error) {
        if (isMounted) {
          console.error('[Chart.tsx] Error loading data:', error);
        }
      }
    };

    loadData();

    // 언마운트 시 플래그 해제
    return () => {
      console.log('[Chart.tsx] 컴포넌트 언마운트됨');
      isMounted = false;
    };
  }, [series]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-gray-100" style={{ height: `${height}px` }}>
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