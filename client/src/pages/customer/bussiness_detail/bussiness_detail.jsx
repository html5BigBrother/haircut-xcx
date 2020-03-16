import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, Label, Checkbox, CheckboxGroup, Navigator } from '@tarojs/components'
import { AtIcon, AtFloatLayout, AtCalendar, AtMessage } from 'taro-ui'
import './bussiness_detail.styl'

import validate from '../../../utils/validate'
import { reLaunch, getUserInfo, showModal } from '../../../utils/util'
import { businessHours, businessProjects, businessBgs, baberImgs } from '../../../utils/enums'
import cloudRequest from '../../../utils/request_cloud'

import icon_save from '../../../static/imgs/icon_save.svg'
import icon_danger from '../../../static/imgs/icon_danger.svg'
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
      customerId: '',
      businessId: '',
      businessInfo: {
        name: '',
        openingTime: '',
        closingTime: '',
        phone: '',
        regions: [],
        address: '',
        fullAddress: '',
        barbers: []
      },
      orderInfo: {
        currentBarberName: '',
        currentBarberId: '',
        currentTemperature: '',
        currentDate: '',
        currentTime: '',
        currentProjects: [],
        timeList: [],
        projectList: [],
        checkedProtocol: true
      },
    }
  }

  componentDidMount () {
    Taro.setNavigationBarTitle({ title: this.$router.params.businessName })

    const businessId = this.$router.params.businessId
    const customerId = getUserInfo().id
    this.setState({ businessId, customerId })

    this.getBusinessDetail(this.$router.params.businessId)
  }

  config = {
    navigationBarTitleText: '快预约',
    "usingComponents": {
      "ec-canvas": "../../../components/ec-canvas/ec-canvas"
    }
  }

  refLineChart = (node) => this.lineChart = node

  initChart(chartData) {
    const option = {
      grid: {
        left: '0',
        right: '6%',
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
          data: chartData.dates
        }
      ],
      yAxis: [
        {
          type: 'value',
          min: 35,
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
          data: chartData.temperatures
        }
      ]
    }
    this.lineChart.refresh(option)
  }

  // 查询商家详情
  async getBusinessDetail(businessId) {
    Taro.showLoading({ title: '加载中', mask: true })
    const res = await cloudRequest({ name: 'getBusinessDetail', data: { businessId } })
    Taro.hideLoading()
    if (!res || res.code !== 'success') return

    const date = new Date().toLocaleDateString().replace(/(\/)/g, '-')
    Taro.showLoading({ title: '加载中', mask: true })
    const res2 = await cloudRequest({ name: 'getTemperatures', data: { businessId, date } })
    Taro.hideLoading()
    if (!res2 || res2.code !== 'success') return

    const { name, openingTime, closingTime, phone, regions, address, barbers } = res.data
    let tList = res2.data || []
    const regionsFilter = regions[0] === regions[1] ? regions.slice(1) : regions
    let reformBarbers = barbers.map(item => {
      const tfilter = tList.filter(item2 => item2.barberId === item._id)
      item.temperature = tfilter.length > 0 ? tfilter[0].temperature : ''
      return item
    })
    const businessInfo = {
      name,
      openingTime,
      closingTime,
      phone,
      regions,
      address,
      fullAddress: regionsFilter.join('') + address,
      barbers: reformBarbers
    }

    const { orderInfo } = this.state
    const businessHoursFilter = businessHours.slice(businessHours.indexOf(openingTime), businessHours.indexOf(closingTime) + 1)

    orderInfo.timeList = businessHoursFilter.map(item => {
      return {
        value: item,
        disabled: false,
        checked: false
      }
    })
    orderInfo.projectList = businessProjects.map(item => {
      return {
        value: item,
        disabled: false,
        checked: false
      }
    })

    this.setState({ businessInfo, orderInfo })
  }

  onClickPhone() {
    Taro.makePhoneCall({ phoneNumber: this.state.businessInfo.phone })
  }

  async onClickAppoint(baberItem) {
    const { orderInfo } = this.state

    Taro.showLoading({ title: '加载中', mask: true })
    const res = await cloudRequest({ name: 'getTemperatures', data: { businessId: this.state.businessId, barberId: baberItem._id } })
    Taro.hideLoading()
    if (!res || res.code !== 'success') return

    // 体温排序，取7天
    let temperatureList = res.data.filter(item => item.barberId === baberItem._id)
    temperatureList.sort((a, b) => {
      return new Date(a.date) - new Date(b.date)
    }).slice(0,7)
    let chartData = {
      dates: [],
      temperatures: []
    }
    temperatureList.forEach((item) => {
      const date = new Date(item.date).toLocaleDateString().split('/').slice(1).join('/')
      chartData.dates.push(date)
      chartData.temperatures.push(item.temperature)
    })

    orderInfo.currentBarberId = ''
    orderInfo.currentDate = ''
    orderInfo.currentTime = ''
    orderInfo.currentProjects = []
    orderInfo.currentBarberId = baberItem._id
    orderInfo.currentBarberName = baberItem.name
    orderInfo.currentTemperature = baberItem.temperature
    this.setState({ orderInfo })
    this.onChangeShow(true)
    this.initChart(chartData)
  }

  // 确认预约
  async onClickAppointSure() {
    const { customerId, businessId, orderInfo } = this.state
    const data = {
      customerId,
      businessId,
      barberId: orderInfo.currentBarberId,
      subscribeDate: orderInfo.currentDate,
      subscribeTime: orderInfo.currentTime,
      projects: orderInfo.currentProjects,
      type: 'self'
    }

    const vRes = validate([
      { type: 'vEmpty', value: orderInfo.currentDate, msg: '请选择日期' },
      { type: 'vEmpty', value: orderInfo.currentTime, msg: '请选择时间' },
      { type: 'vArrEmpty', value: orderInfo.currentProjects, msg: '请选择项目' },
    ])

    if (vRes !== true) {
      Taro.atMessage({ 'message': vRes, 'type': 'error', })
      return
    }

    Taro.showLoading({ title: '加载中', mask: true })
    const res = await cloudRequest({ name: 'subscribe', data })
    Taro.hideLoading()
    if (!res || res.code !== 'success') return

    this.onChangeShow(false)

    if(await showModal({
      title: '预约成功',
      content: '您可以在「预约」列表\n查看预约记录',
      showCancel: false,
      confirmText: '确认',
      confirmColor: '#2A9FFF'
    })) reLaunch('/pages/customer/index/index', { current: 1 })
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

  // 选择时间
  onChangeTimeList(option) {
    const { orderInfo } = this.state
    orderInfo.timeList = option.checkList
    orderInfo.currentTime = option.checkList.filter(item => item.checked)[0].value || ''

    this.setState({ orderInfo })
  }

  // 选择项目
  onChangeProjectList(option) {
    const { orderInfo } = this.state
    orderInfo.projectList = option.checkList
    orderInfo.currentProjects = option.checkList.filter(item => item.checked).map(item => item.value)

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
    const { businessInfo } = this.state
    return (
      <View className='p-section-business'>
        <View className='u-title'>{businessInfo.name}</View>
        <View className='u-img-list'>
          <Image className='u-img' src={businessBgs[0]}></Image>
          <Image className='u-img' src={businessBgs[1]}></Image>
          <Image className='u-img' src={businessBgs[2]}></Image>
        </View>
        <View className='u-detail-list'>
          <View className='u-detail-item'>
            <Image className='u-detail-icon-1' src={icon_map} />
            <View className='u-detail-item-value'>{businessInfo.fullAddress}</View>
            {businessInfo.phone && <Image className='u-detail-icon-2' src={icon_phone_2} onClick={this.onClickPhone} />}
          </View>
          <View className='u-detail-item'>
            <Image className='u-detail-icon-1' src={icon_clock} />
            <View className='u-detail-item-value'>营业时间 {`${businessInfo.openingTime}-${businessInfo.closingTime}`}</View>
          </View>
        </View>
      </View>
    )
  }

  renderGoods() {
    const { businessInfo } = this.state
    return (
      <View className='p-section-goods'>
        <View className='u-title'>发型师</View>
        <View className='list-style-sheet1'>
          {
            businessInfo.barbers.map((item, index) =>
              <View className='sheet1-item-wrap' key={item._id}>
                <View className='sheet1-item'>
                  <Image className='sheet1-item-image' style={`width: ${Taro.pxTransform(88)}; height: ${Taro.pxTransform(88)};`} src={baberImgs[index % baberImgs.length]}></Image>
                  <View className='sheet1-item-content'>
                    <View className='sheet1-item-text-1'>
                      <Text style={`margin-right: ${Taro.pxTransform(12)};`}>{item.name}</Text>
                      <Image className='icon_save' src={item.temperature >= 38 ? icon_danger : icon_save} />
                    </View>
                    <View className='sheet1-item-text-2'><Text decode>{item.rank}&emsp;洗剪吹 ￥{item.price}起</Text></View>
                    <View className='sheet1-item-text-2'>今日体温：<Text className={`color-g ${item.temperature >= 38 && 'color-r'}`}>{item.temperature ? `${item.temperature}℃` : '暂无'}</Text></View>
                  </View>
                  <View>
                    <Button className='btn-style btn-orange u-btn' hoverClass='btn-hover' onClick={this.onClickAppoint.bind(this, item)}>预约</Button>
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
    const { orderInfo } = this.state
    return (
      <View className='p-order-detail'>
        <View className='u-order-head'>
          <View className='u-head-title'>
            <View className='text-style-1'>{orderInfo.currentBarberName}</View>
            <View className='u-title-icon'>
              <Image className='icon_save' src={orderInfo.currentTemperature >= 38 ? icon_danger : icon_save} />
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
            <CheckList selectSingle checkList={orderInfo.timeList} onSelectedCheck={this.onChangeTimeList.bind(this)} />
          </View>
          <View className='u-body-section'>
            <CheckList checkList={orderInfo.projectList} onSelectedCheck={this.onChangeProjectList.bind(this)} />
          </View>
        </View>
        <View className='u-order-foot'>
          <Button className='btn-style btn-orange btn-large btn-circle-44' hoverClass='btn-hover' disabled={!(orderInfo.currentDate && orderInfo.currentTime && orderInfo.currentProjects[0] && orderInfo.checkedProtocol)} onClick={this.onClickAppointSure.bind(this)}>立即预约</Button>
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
        <AtMessage />
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
