/graph3 페이지 만들어줘

https://www.coinwarz.com/mining/bitcoin/hashrate-chart 
여기에 있는 차트와 최대한 같게 만들어줘

highcharts 라이브러리를 사용해줘

./actions.ts 의 getPriceData() 함수로 데이터 가져와

{
    timestamp: '1702771200000',
    Open: '42237.88211302',
    High: '42413.38579666',
    Low: '41224.36450447',
    Close: '41368.56431921',
    Volume: '26705.39358420915'
},

차트의 데이터 구조야 시간은 timestamp   가격값은 Close 사용해줘