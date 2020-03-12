import Taro, { Component } from '@tarojs/taro'
import echarts from '../ec-canvas/echarts'

export default class LineCharts extends Component {

  constructor (props) {
    super(props)
    this.state = {
      ec: {
        lazyLoad: true
      }
    }
  }

  config = {
    "usingComponents": {
      "ec-canvas": "../ec-canvas/ec-canvas"
    }
  }

  setChartData(chart, data) {
    let option = data
    chart.setOption(option);
  }

  refresh(data) {
    this.Chart.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // 像素
      })
      this.setChartData(chart, data)
      return chart
    })
  }

  refChart = node => (this.Chart = node);

  render () {
    const { ec } = this.state
    return (
      <ec-canvas ref={this.refChart} canvas-id='mychart-area' ec={ec}></ec-canvas>
    )
  }
}
