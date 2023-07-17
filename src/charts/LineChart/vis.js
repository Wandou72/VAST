import * as echarts from 'echarts';
import * as d3 from 'd3';

const draw = (props) => {
    const data = props.data;
    let initial_index;
    let dict = {};
    for (let i = 0; i < data.nodes.length; i++) {
        if (dict.hasOwnProperty(data.nodes[i].community)) dict[data.nodes[i].community] += 1;
        else dict[data.nodes[i].community] = 1;
    }
    console.log(dict);

    var chartDom = document.getElementById('vis-linechart');
    echarts.dispose(chartDom);
    var myChart = echarts.init(chartDom, null, {
        width: window.innerWidth * 0.54,
        height: window.innerHeight * 0.19
    });
    var option;

    let xAxisData = Object.keys(dict);
    let data1 = Object.values(dict);

    var emphasisStyle = {
        itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)'
        }
    };
    option = {
        brush: {
            toolbox: ['lineX', 'lineY', 'polygon', 'keep', 'clear'],
            xAxisIndex: 0
        },
        toolbox: {
            feature: {
                magicType: {},
                dataView: {},
            },
            itemSize: 16, // 调整 toolbox 中图标的大小
        },
        tooltip: {},
        xAxis: {
            name: 'Community',
            data: xAxisData,
            axisLine: { onZero: true },
            splitLine: { show: false },
            splitArea: { show: false },
            nameLocation: 'center',
            nameGap: 30
        },
        yAxis: {
            name: 'Node Count',
        },
        grid: {
            bottom: 45,
            left: 35,
            right: 20,
        },
        series: [
            {
            name: 'community',
            type: 'bar',
            stack: 'one',
            emphasis: emphasisStyle,
            data: data1
            }
        ]
    };

    myChart.on('brushSelected', function (params) {
        var brushed = [];
        var brushComponent = params.batch[0];
        for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
            var rawIndices = brushComponent.selected[sIdx].dataIndex;
            brushed.push('[Series ' + sIdx + '] ' + rawIndices.join(', '));
        }
        myChart.setOption({
            title: {
            backgroundColor: '#333',
            text: 'SELECTED DATA INDICES: \n' + brushed.join('\n'),
            bottom: 0,
            right: '10%',
            width: 100,
            textStyle: {
                fontSize: 12,
                color: '#fff'
            },
            lazyUpdate: true,
            },
        }, false);

        var selectedIndices = brushComponent.selected[0].dataIndex;
        initial_index = selectedIndices.slice(); // 记录初始的 final_index
        console.log(brushComponent.selected[0])
    });

    myChart.on('brushEnd', function () {
        var final_index=[]
        for(let i = 0; i < initial_index.length; i++){
            final_index[i] = Number(xAxisData[initial_index[i]])
        }
        console.log(final_index);
        props.onChangeCommunity(final_index);
    });


    option && myChart.setOption(option);


}

export default draw;