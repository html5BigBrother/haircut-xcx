import Taro, { Component } from '@tarojs/taro'
import { View, Button, Input } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './staff_temperature.styl'

import{ navigateTo } from '../../../utils/util'

import HalfScreenLayout from '../../../components/half-screen-layout/half-screen-layout'

export default class UserEdit extends Component {

  constructor (props) {
    super(props)
    this.state = {
      layoutShow: false,
      temperatureList: [
        { name: 'Tony', type: '总监' },
        { name: 'Jack', type: '经理', price: '50' },
      ]
    }
  }

  componentWillMount () { }

  componentDidMount () {}

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '体温登记',
  }

  onClickToHistory() {
    navigateTo('/pages/business/staff_temperature_history/staff_temperature_history')
  }

  onChangeShow(layoutShow) {
    this.setState({ layoutShow })
  }

  render () {
    const { temperatureList, layoutShow } = this.state
    return (
      <View className='p-page'>
        <View className='p-contain'>
          <View className='p-temperature-list'>
            <View className='u-temperature-head' hoverClass='view-hover' onClick={this.onClickToHistory}>
              <View className='flex-1 u-temperature-title'>今日体温</View>
              <View className='color-888 margin-r-8'>查看历史</View>
              <AtIcon value='chevron-right' size='14' color='#888'></AtIcon>
            </View>
            {
              temperatureList.map((item) => 
                <View className='u-item' key={item.name} onClick={this.onChangeShow.bind(this, true)}>
                  <View className='flex-1 u-item-name'>{item.name}</View>
                  <View className={`color-888 margin-r-20 ${item.price && 'color-g'}`}>请输入体温</View>
                  <AtIcon value='chevron-right' size='14' color='#888'></AtIcon>
                </View>
              )
            }
          </View>
        </View>
        <HalfScreenLayout show={layoutShow} title='添加体温' onChangeShow={this.onChangeShow.bind(this)}>
          <View className='p-form'>
            <View className='u-item'>
              <View className='u-name'>体温</View>
              <Input className='u-input' placeholder='请输入体温' placeholderClass='color-888' maxLength='20' onBlur={this.onChangeInput.bind(this, 'name')} />
            </View>
          </View>
          <View className='p-bottom-btn'>
            <Button className='btn-style btn-purple btn-large btn-circle-44' hoverClass='btn-hover' onClick={this.onChangeShow.bind(this, true)}>确认</Button>
          </View>
        </HalfScreenLayout>
      </View>
    )
  }
}
