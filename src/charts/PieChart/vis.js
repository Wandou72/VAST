import * as echarts from 'echarts';
import * as d3 from 'd3';

const draw = (props) => {
    const curNodeTypes = props.curNodeTypes;
    const curLinkTypes = props.curLinkTypes;
    
    
    var chartDom = document.getElementById('vis-piechart');
    echarts.dispose(chartDom);
    var myChart = echarts.init(chartDom, null, {
        width: window.innerWidth*0.22,
        height: window.innerHeight * 0.30});
    var option;
    
    console.log("hello")
    option = {
        tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
        },
        // legend: {
        // data: [
        //     'Direct',
        //     'Marketing',
        //     'Search Engine',
        //     'Email',
        //     'Union Ads',
        //     'Video Ads',
        //     'Baidu',
        //     'Google',
        //     'Bing',
        //     'Others'
        // ]
        // },
        series: [
        {
            name: 'Access From',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '40%'],
            label: {
                position: 'inner',
                fontSize: 14,
                fontWeight: 'bold',
                textBorderWidth: 2,
                textBorderColor: '#fff',
            },
            itemStyle: {
                borderRadius: 5,
                borderColor: '#fff',
                borderWidth: 2,
                color: function (params) {
                    let colorMap = {
                        'family_relationship': "#95de64",
                        'membership': "#ffc069",
                        'ownership': "#69c0ff",
                        'partnership': "#ff7875",
                    }
                    return colorMap[params.name]
                },
                },
            
            labelLine: {
                show: false
            },
            data: curLinkTypes
        },
        {
            name: 'Access From',
            type: 'pie',
            radius: ['50%', '70%'],
            labelLine: {
            length: 30
            },
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2,
                color: function (params) {
                    let colorMap = {
                        'person': "#52c41a",
                        'organization': "#1890ff",
                        'company': "#9254de",
                        'political_organization': "#ff85c0",
                        'location': "#9c755f",
                        'vessel': "#fa8c16",
                        'event': "#5cdbd3",
                        'movement': "#8c8c8c",
                        'None': "#ff4d4f",
                    }
                    return colorMap[params.name]
                }
            },
            // color: ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2"],
            label: {
            formatter: '{b|{b}}\n{hr|}\n  {c}  {per|{d}%}  ',
            backgroundColor: '#F6F8FC',
            borderColor: '#8C8D8E',
            borderWidth: 1,
            borderRadius: 4,
            rich: {
                a: {
                color: '#6E7079',
                lineHeight: 22,
                align: 'center'
                },
                hr: {
                borderColor: '#8C8D8E',
                width: '100%',
                borderWidth: 1,
                height: 0
                },
                b: {
                color: '#4C5058',
                fontSize: 14,
                fontWeight: 'bold',
                lineHeight: 22,
                align: 'center'
                },
                per: {
                color: '#fff',
                backgroundColor: '#4C5058',
                padding: [3, 4],
                borderRadius: 4,
                lineHeight: 33
                }
            }
            },
            data: curNodeTypes
        }
        ]
    };
    
    option && myChart.setOption(option);
}

export default draw;