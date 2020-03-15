import Taro, { Component } from '@tarojs/taro'
import { View, Button, Input } from '@tarojs/components'
import { AtIcon, AtMessage } from 'taro-ui'
import './staff_temperature.styl'

import{ navigateTo, getUserInfo } from '../../../utils/util'
import validate from '../../../utils/validate'
import cloudRequest from '../../../utils/request_cloud'

import HalfScreenLayout from '../../../components/half-screen-layout/half-screen-layout'

export default class UserEdit extends Component {

  constructor (props) {
    super(props)
    this.state = {
      layoutShow: false,
      businessId: '',
      temperatureList: [],
      addInfo: {
        barberId: '',
        temperature: ''
      }
    }
  }

  componentWillMount () { }

  componentDidMount () {
    const businessId = getUserInfo().id
    this.setState({ businessId })
    this.getTemperatureList(businessId)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '体温登记',
  }

  async getTemperatureList(id) {
    const businessId = id || this.state.businessId
    const date = new Date().toLocaleDateString().replace(/(\/)/g, '-')
    const res = await cloudRequest({ name: 'getBarbers', data: { businessId } })
    if (!res || res.code !== 'success') return
    const res2 = await cloudRequest({ name: 'getTemperatures', data: { businessId, date } })
    if (!res2 || res2.code !== 'success') return
    let staffList = res.data || []
    let tList = res2.data || []
    const temperatureList = staffList.map((item) => {
      let tfilter = tList.filter(item2 => item2.barberId === item._id)
      const temperature = tfilter.length > 0 ? tfilter[0].temperature : ''
      return {
        name: item.name,
        barberId: item._id,
        temperature
      }
    })
    this.setState({ temperatureList })
  }

  onChangeInput(valueName, e) {
    let { addInfo } = this.state
    addInfo[valueName] = e.detail.value
    this.setState({ addInfo })
  }

  onChangeShow(layoutShow) {
    this.setState({ layoutShow })
  }

  onClickToHistory() {
    navigateTo('/pages/business/staff_temperature_history/staff_temperature_history')
  }

  onClickItem(item) {
    let addInfo = this.state
    addInfo.barberId = item.barberId
    addInfo.temperature = item.temperature
    this.setState({ addInfo })
    this.onChangeShow(true)
  }

  async onClickAdd() {
    const { barberId, temperature } = this.state.addInfo
    const data = {
      barberId,
      temperature,
      date: new Date().toLocaleDateString().replace(/(\/)/g, '-')
    }
    const vRes = validate([
      { type: 'vEmpty', value: temperature, msg: '体温不能为空' },
    ])
    if (vRes !== true) {
      Taro.atMessage({ 'message': vRes, 'type': 'error', })
      return
    }

    Taro.showLoading({ title: '加载中', mask: true })
    const res = await cloudRequest({ name: 'registeTemperature', data })
    Taro.hideLoading()
    if (!res || res.code !== 'success') return
    Taro.atMessage({ 'message': '登记成功', 'type': 'success', })
    this.setState({ addInfo: {} })
    this.getTemperatureList()
    this.onChangeShow(false)
  }

  render () {
    const { temperatureList, layoutShow, addInfo } = this.state
    return (
      <View className='p-page'>
        <AtMessage />
        <View className='p-contain'>
          <View className='p-temperature-list'>
            <View className='u-temperature-head' hoverClass='view-hover' onClick={this.onClickToHistory}>
              <View className='flex-1 u-temperature-title'>今日体温</View>
              <View className='color-888 margin-r-8'>查看历史</View>
              <AtIcon value='chevron-right' size='14' color='#888'></AtIcon>
            </View>
            {
              temperatureList.map((item) => {
                const classTemperature = item.temperature
                ? item.temperature >= 38
                  ? 'color-r'
                  : 'color-g'
                : 'color-888'
                return (
                  <View className='u-item' key={item.name} onClick={this.onClickItem.bind(this, item)}>
                    <View className='flex-1 u-item-name'>{item.name}</View>
                    <View className={`margin-r-20 ${classTemperature}`}>{item.temperature ? `${item.temperature}℃` : '请输入体温'}</View>
                    <AtIcon value='chevron-right' size='14' color='#888'></AtIcon>
                  </View>
                )
              })
            }
          </View>
        </View>
        <HalfScreenLayout
          show={layoutShow}
          title='添加体温'
          onChangeShow={this.onChangeShow.bind(this)}
          renderFooter={
            <Button className='btn-style btn-purple btn-large btn-circle-44' hoverClass='btn-hover' onClick={this.onClickAdd.bind(this)}>确认</Button>
          }
        >
          <View className='p-form'>
            <View className='u-item'>
              <View className='u-name'>体温</View>
              <Input type='number' className='u-input' placeholder='请输入体温' placeholderClass='color-888' maxLength='20' value={addInfo.temperature} onBlur={this.onChangeInput.bind(this, 'temperature')} />
            </View>
          </View>
        </HalfScreenLayout>
      </View>
    )
  }
}
