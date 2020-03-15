import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, Label, Checkbox, CheckboxGroup, Navigator } from '@tarojs/components'
import { AtIcon, AtFloatLayout, AtCalendar } from 'taro-ui'
import './bussiness_detail.styl'

// import { navigateTo } from '../../../utils/util'

import icon_logo from '../../../static/imgs/icon.jpg'
import icon_save from '../../../static/imgs/icon_save.svg'
import icon_map from '../../../static/imgs/icon_map.svg'
import icon_clock from '../../../static/imgs/icon_clock.svg'
import icon_phone_2 from '../../../static/imgs/icon_phone_2.svg'

import HalfScreenLayout from '../../../components/half-screen-layout/half-screen-layout'
import LineCharts from '../../../components/line-charts/line-charts'
import CheckList from '../../../components/check-list/check-list'

export default class BussinessDetail extends Component {

  constructor (props) {
    super(props)
    this.state = {
      layoutShow: false,
      isOpened: false,
      goodsList: [
        { name: '桥主' },
        { name: '主力' },
        { name: '哈尼' },
        { name: '三地' }
      ],
      orderInfo: {
        currentDate: '',
        checkedProtocol: true,
      },
      checkList: [
        { value: '9:00', disabled: false, checked: false },
        { value: '9:00', disabled: false, checked: false },
        { value: '9:00', disabled: false, checked: false },
        { value: '9:00', disabled: false, checked: false },
        { value: '9:00', disabled: false, checked: false },
      ],
      checkList2: [
        { value: '9:00', disabled: false, checked: false },
        { value: '9:00', disabled: false, checked: false },
        { value: '9:00', disabled: false, checked: false },
        { value: '9:00', disabled: false, checked: false },
        { value: '9:00', disabled: false, checked: false },
      ],
    }
  }

  componentWillMount () { }

  componentDidMount () {
    Taro.setNavigationBarTitle({ title: this.$router.params.businessName })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '快预约',
    "usingComponents": {
      "ec-canvas": "../../../components/ec-canvas/ec-canvas"
    }
  }

  refLineChart = (node) => this.lineChart = node

  initChart() {
    const option = {
      grid: {
        left: '0',
        right: '3%',
        top: '8%',
        bottom: '0',
        borderColor: '#BFBFBF',
        containLabel: true
      },
      color: '#30CB9B',
      textStyle: {
        color: '#222'
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#BFBFBF'
            }
          },
          axisTick: {
            lineStyle: {
              color: '#BFBFBF'
            }
          },
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dotted'
            }
          },
        }
      ],
      series: [
        {
          name: '体温折线图',
          type: 'line',
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    }
    this.lineChart.refresh(option)
  }


  onClickPhone() {
    Taro.makePhoneCall({ phoneNumber: '15757179448' })
  }

  onClickDialogShow(item) {
    this.onChangeShow(true)
    this.initChart()
  }

  onChangeShow(layoutShow) {
    this.setState({ layoutShow })
  }

  onChangeIsOpened(isOpened) {
    this.setState({ isOpened })
  }

  onChangeCheckedProtocol(e) {
    let { orderInfo } = this.state
    orderInfo.checkedProtocol = e.detail.value.length > 0
    this.setState({ orderInfo })
  }

  onSelectDate(e) {
    let { orderInfo } = this.state
    orderInfo.currentDate = e.value.start
    this.setState({
      orderInfo,
      isOpened: false
    })
  }

  renderBusiness() {
    return (
      <View className='p-section-business'>
        <View className='u-title'>乔治快乐洗发水</View>
        <View className='u-img-list'>
          <Image className='u-img' src={icon_logo}></Image>
          <Image className='u-img' src={icon_logo}></Image>
          <Image className='u-img' src={icon_logo}></Image>
        </View>
        <View className='u-detail-list'>
          <View className='u-detail-item'>
            <Image className='u-detail-icon-1' src={icon_map} />
            <View className='u-detail-item-value'>蜀山街道22号</View>
            <Image className='u-detail-icon-2' src={icon_phone_2} onClick={this.onClickPhone} />
          </View>
          <View className='u-detail-item'>
            <Image className='u-detail-icon-1' src={icon_clock} />
            <View className='u-detail-item-value'>营业时间 09:00-21:00</View>
          </View>
        </View>
      </View>
    )
  }

  renderGoods() {
    const { goodsList } = this.state
    return (
      <View className='p-section-goods'>
        <View className='u-title'>发型师</View>
        <View className='list-style-sheet1'>
          {
            goodsList.map((item) =>
              <View className='sheet1-item-wrap' key={item.id}>
                <View className='sheet1-item'>
                  <Image className='sheet1-item-image' style={`width: ${Taro.pxTransform(88)}; height: ${Taro.pxTransform(88)};`} src={icon_logo}></Image>
                  <View className='sheet1-item-content'>
                    <View className='sheet1-item-text-1'>
                      <Text style={`margin-right: ${Taro.pxTransform(12)};`}>Tony</Text>
                      <Image className='icon_save' src={icon_save} />
                    </View>
                    <View className='sheet1-item-text-2'><Text decode>发型总监&emsp;洗剪吹￥100起</Text></View>
                    <View className='sheet1-item-text-2'>今日体温：<Text className='color-g'>36.5℃</Text></View>
                  </View>
                  <View>
                    <Button className='btn-style btn-orange u-btn' hoverClass='btn-hover' onClick={this.onClickDialogShow.bind(this, item)}>预约</Button>
                  </View>
                </View>
              </View>
            )
          }
        </View>
      </View>
    )
  }
  
  renderOrderDetail() {
    const { orderInfo, checkList, checkList2 } = this.state
    return (
      <View className='p-order-detail'>
        <View className='u-order-head'>
          <View className='u-head-title'>
            <View className='text-style-1'>Tony</View>
            <View className='u-title-icon'>
              <Image className='icon_save' src={icon_save} />
            </View>
            <View className='text-style-2'>近7日体温</View>
          </View>
          <View className='u-temperature-chart'>
            <LineCharts ref={this.refLineChart} />
          </View>
        </View>
        <View className='u-order-body'>
          <View className='u-date-choose' onClick={this.onChangeIsOpened.bind(this, true)}>
            { orderInfo.currentDate ? this.renderDate() : <View className='flex-1 color-888'>请选择日期</View> }
            <AtIcon value='chevron-right' size='14' color='#888'></AtIcon>
          </View>
          <View className='u-body-section'>
            <CheckList selectSingle checkList={checkList} onSelectedCheck={(option) => { this.setState({ checkList: option.checkList }) }} />
          </View>
          <View className='u-body-section'>
            <CheckList checkList={checkList2} onSelectedCheck={(option) => { this.setState({ checkList2: option.checkList }) }} />
          </View>
        </View>
        <View className='u-order-foot'>
          <Button className='btn-style btn-orange btn-large btn-circle-44' hoverClass='btn-hover' disabled onClick={this.onClickQuit}>立即预约</Button>
          <CheckboxGroup onChange={this.onChangeCheckedProtocol}>
            <View className='p-checkbox-protocol'>
              <Label className='u-label'>
                <Checkbox className='u-checkbox' color='#EC8140' checked={orderInfo.checkedProtocol}></Checkbox>
                <Text className='color-888'>已阅读协议</Text>
              </Label>
              <Navigator className='u-link' url='/pages/customer/user_edit/user_edit'>《协议链接》</Navigator>
            </View>
          </CheckboxGroup>
        </View>
      </View>
    )
  }

  renderDate() {
    const { orderInfo } = this.state
    const currentDate = orderInfo.currentDate
    const dateTranslateWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const yearMonthDay = `${new Date(currentDate).getFullYear()}年${new Date(currentDate).getMonth() + 1}月${new Date(currentDate).getDate()}日 `
    const weekDay = dateTranslateWeek[new Date(currentDate).getDay()]
    return (
      <View className='flex-1'>
        <Text className='color-222'>{yearMonthDay}</Text>
        <Text className='color-888'>{weekDay}</Text>
      </View>
    )
  }

  render () {
    const { layoutShow, orderInfo } = this.state
    return (
      <View className='p-page'>
        <View className='p-contain'>
          { this.renderBusiness() }
          { this.renderGoods() }
          <HalfScreenLayout show={layoutShow} onChangeShow={this.onChangeShow.bind(this)}>
            { this.renderOrderDetail() }
          </HalfScreenLayout>
        </View>
        <AtFloatLayout isOpened={this.state.isOpened} onClose={this.onChangeIsOpened.bind(this, false)}>
          <AtCalendar currentDate={orderInfo.currentDate} minDate={Date.now() - 1000 * 60 * 60 * 24} maxDate={Date.now() + 1000 * 60 * 60 * 24 * 60} onSelectDate={this.onSelectDate.bind(this)} />
        </AtFloatLayout>
      </View>
    )
  }
}
