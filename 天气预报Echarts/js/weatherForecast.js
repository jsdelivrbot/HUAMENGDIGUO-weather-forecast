const log = console.log.bind(console)

const e = (selector) => document.querySelector(selector)

const ajax = function(request) {
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType != undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function() {
        if (r.readyState == 4) {
            request.callback(r.response)
        }
    }
    if (request.method == 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

const requestWeather = (callback) => {
    let url = 'https://free-api.heweather.com/v5/forecast?city=qingdao&key=9041c70d00d947f5a3ce254c06c0cfa2'
    let request = {
        method: 'GET',
        url: url,
        callback : (data) => {
            data = JSON.parse(data)
            callback(data)
        }
    }
    ajax(request)
}

const configuredChart = function() {
    let element = e('#id-div-chart')
    let chart = echarts.init(element)
    return chart
}

const temperature = function(weather) {
    let w = {
        date: [],
        max: [],
        min: [],
        average: [],
    }
    let forecast = weather.daily_forecast
    for (var i = 0; i < forecast.length; i++) {
        let f = forecast[i]
        let t = f.tmp
        let a = (Number(t.max) + Number(t.min)) / 2

        w.max.push(t.max)
        w.min.push(t.min)
        w.date.push(f.date)
        w.average.push(a)
    }
    return w
}

// 指定图表的配置项和数据
const formattedWeather = function(weather) {
    let data = temperature(weather)
    let option = {
        title: {
            text: '未来三天青岛气温变化',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        grid: {
            right: '20%'
        },
        toolbox: {
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        legend: {
            data:['最高气温','最低气温','平均气温']
        },
        xAxis: [
            {
                type: 'category',
                data: data.date,
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '温度',
                min: -8,
                max: 8,
                interval: 4,
                position: 'right',
                axisLabel: {
                    formatter: '{value} °C'
                }
            },
        ],
        series: [
            {
                name:'最高气温',
                type:'bar',
                data: data.max,
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'最低气温',
                type:'bar',
                data: data.min,
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'平均气温',
                type:'line',
                data: data.average,
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
        ]
    }
    return option
}

// 使用刚指定的配置项和数据显示图表。
const renderChart = function(data) {
    var weather = data.HeWeather5[0]
    var chart = configuredChart()
    var weather = formattedWeather(weather)

    chart.setOption(weather)
}
const __main = function() {
    // 使用 fetchWeather 函数来获取数据, 通过 ajax 获取数据是一个异步过程
    // 所以后面的逻辑要放在回调函数中
    requestWeather(renderChart)
}

__main()
