import Taro, { Component } from '@tarojs/taro'
import { View, Button, Input, Picker } from '@tarojs/components'
import './login.styl'


export default class Login extends Component {

  constructor (props) {
    super(props)
    this.state = {
      regionValue: [],
      rangeStartTime: ['9:00', '10:00', '11:00'],
      rangeEndTime: ['9:00', '10:00', '11:00'],
      startTime: '',
      endTime: ''
    }
  }

  config = {
    navigationBarTitleText: '创建商户',
  }

  onChangeInput(valueName, e) {
    console.log(valueName)
    console.log(e)
  }

  onChangeRegion(e) {
    const regionValue = e.detail.value
    this.setState({ regionValue })
  }

  onChangeStartTime(e) {
    const startTime = this.state.rangeStartTime[e.detail.value]
    this.setState({ startTime })
  }

  onChangeEndTime(e) {
    const endTime = this.state.rangeEndTime[e.detail.value]
    this.setState({ endTime })
  }

  onClickCreate() {

    Taro.navigateTo({ url: '/pages/business/index/index' })

    // Taro.cloud.callFunction({
    //   name: 'customerRegiste',
    //   // 传给云函数的参数
    //   data: {
    //     name: 'hjaha',
    //     phone: '12345678901',
    //   },
    //   // 成功回调
    //   complete: () => {

    //   }
    // })
  }

  render () {
    const { regionValue, startTime, rangeStartTime, endTime, rangeEndTime } = this.state
    return (
      <View className='p-page'>
        <View className='p-contain'>
          <View className='p-form'>
            <View className='u-item'>
              <View className='u-name'>商家名称</View>
              <Input className='u-input' placeholder='请输入名称' placeholderClass='color-888' maxLength='20' onBlur={this.onChangeInput.bind(this, 'name')} />
            </View>
            <View className='u-item'>
              <View className='u-name'>省市区</View>
                <Picker className={`u-input ${!regionValue[0] && 'color-888'}`} mode='region' onChange={this.onChangeRegion.bind(this)}>{regionValue.length > 0 ? regionValue.join(' ') : '请选择省市区'}</Picker>
            </View>
            <View className='u-item'>
              <View className='u-name'>地址</View>
              <Input className='u-input' placeholder='请输入详细地址' placeholderClass='color-888' maxLength='30' onBlur={this.onChangeInput.bind(this, 'name')} />
            </View>
            <View className='u-item'>
              <View className='u-name'>联系方式</View>
              <Input className='u-input' placeholder='请输入电话' type='number' placeholderClass='color-888' maxLength='11' onBlur={this.onChangeInput.bind(this, 'name')} />
            </View>
            <View className='u-item'>
              <View className='u-name'>营业起始</View>
              <Picker className={`u-input ${!startTime && 'color-888'}`} mode='selector' range={rangeStartTime} onChange={this.onChangeStartTime.bind(this)}>{startTime || '请选择营业起始时间'}</Picker>
            </View>
            <View className='u-item'>
              <View className='u-name'>营业截止</View>
              <Picker className={`u-input ${!endTime && 'color-888'}`} mode='selector' range={rangeEndTime} onChange={this.onChangeEndTime.bind(this)}>{endTime || '请选择营业截止时间'}</Picker>
            </View>
          </View>
          <View className='u-foot'>
            <Button className='btn-style btn-blue btn-large btn-circle-44 u-btn' hoverClass='btn-hover' onClick={this.onClickCreate}>完成</Button>
          </View>
        </View>
      </View>
    )
  }
}
