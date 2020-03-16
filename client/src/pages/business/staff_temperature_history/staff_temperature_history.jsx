import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './staff_temperature_history.styl'

import{ getUserInfo } from '../../../utils/util'
import cloudRequest from '../../../utils/request_cloud'

export default class UserEdit extends Component {

  constructor (props) {
    super(props)
    this.state = {
      temperatureAllList: []
    }
  }

  componentWillMount () { }

  componentDidMount () {
    const businessId = getUserInfo().id
    this.getTemperatureAllList(businessId)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '体温登记',
  }

  async getTemperatureAllList(businessId) {
    Taro.showLoading({ title: '加载中', mask: true })
    const res = await cloudRequest({ name: 'getBarbers', data: { businessId } })
    Taro.hideLoading()
    if (!res || res.code !== 'success') return

    Taro.showLoading({ title: '加载中', mask: true })
    const res2 = await cloudRequest({ name: 'getTemperatures', data: { businessId } })
    Taro.hideLoading()
    if (!res2 || res2.code !== 'success') return

    let staffList = res.data || []
    let list = res2.data || []
    // 遍历员工列表补充姓名
    list.forEach((item) => {
      let sfilter = staffList.filter(item2 => item2._id === item.barberId)
      item.name = sfilter.length > 0 ? sfilter[0].name : '未命名员工'
    })
    // 根据时间重组数组
    let temperatureAllList = []
    list.forEach(item => {
      let obj = { date: item.date, active: true, itemList: [] }
      if (temperatureAllList.filter(item2 => item2.date === item.date).length === 0 ) {
        list.forEach(item3 => {
          if (item3.date === item.date) obj.itemList.push(item3)
        })
        temperatureAllList.push(obj)
      }
    })
    // 根据时间逆序
    temperatureAllList.sort((a, b) => {
     return new Date(b.date) - new Date(a.date)
    })
    // 转换年月日
    temperatureAllList.forEach(item => {
      item.date = `${new Date(item.date).getFullYear()}年${new Date(item.date).getMonth() + 1}月${new Date(item.date).getDate()}日`
    })

    this.setState({ temperatureAllList })
  }

  onChangeActive(index) {
    const { temperatureAllList } = this.state
    temperatureAllList[index].active = !temperatureAllList[index].active
    this.setState({ temperatureAllList })
  }

  onClickHideAll() {
    const { temperatureAllList } = this.state
    temperatureAllList.forEach((item) => {
      item.active = false
    })
    this.setState({ temperatureAllList })
  }

  render () {
    const { temperatureAllList } = this.state
    return (
      <View className='p-page'>
        <View className='p-contain'>
          <View className='p-list'>
            <View className='u-head'>
              <View className='flex-1 u-title'>历史记录</View>
              <View className='color-888' onClick={this.onClickHideAll.bind(this)}>全部收起</View>
            </View>
            {
              temperatureAllList.map((item, index) =>
                <View className='accordion-wrap' key={item.date}>
                  <View className='accordion-head' hoverClass='view-hover'  onClick={this.onChangeActive.bind(this, index)}>
                    <View className='accordion-content'>
                      <View className='flex-1 u-title'>{item.date}</View>
                    </View>
                    <AtIcon className={`accordion-chevron ${item.active && 'active'}`} value='chevron-down' size='14' color='#888'></AtIcon>
                  </View>
                  <View className={`accordion-list ${item.active && 'active'}`}>
                    {
                      item.itemList.map((item2) =>
                        <View className='accordion-item' key={item2.name}>
                          <View className='flex-1'>{item2.name}</View>
                          <View className={`color-g ${item2.temperature >= 38 && 'color-r'}`}>{item2.temperature}℃</View>
                        </View>
                      )
                    }
                  </View>
                </View>
              )
            }
          </View>
        </View>
      </View>
    )
  }
}
