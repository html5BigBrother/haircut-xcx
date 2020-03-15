import Taro, { Component } from '@tarojs/taro'
import { View, Input, Button, Image } from '@tarojs/components'
import { AtMessage } from 'taro-ui'
import './login.styl'

import validate from '../../../utils/validate'
import { navigateTo } from '../../../utils/util'
import cloudRequest from '../../../utils/request_cloud'

import icon_logo from '../../../static/imgs/icon_logo.svg'

import HalfScreenLayout from '../../../components/half-screen-layout/half-screen-layout'

export default class Login extends Component {

  constructor (props) {
    super(props)
    this.state = {
      layoutShow: false,
      name: '',
      phone: '',
      // show: true,
      // buttons: [
      //   {
      //     type: 'default',
      //     className: '',
      //     text: '辅助操作',
      //     value: 0
      //   },
      //   {
      //       type: 'primary',
      //       className: '',
      //       text: '主操作',
      //       value: 1
      //   }
      // ]
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '登录',
  }

  onClickLogin() {
    cloudRequest({ name: 'customerRegiste', data: { name: '天宇测试1', phone: '15757179449' } })

    // Taro.navigateTo({ url: '/pages/customer/index/index' })

  }

  async onClickRegister() {
    const { name, phone } = this.state
    const data = { name, phone }
    const vRes = validate([
      { type: 'vEmpty', value: name, msg: '请输入姓名' },
      { type: 'vEmpty', value: phone, msg: '请输入手机号码' },
      { type: 'vTel', value: phone, msg: '手机号码格式有误' },
    ])

    if (vRes !== true) {
      Taro.atMessage({ 'message': vRes, 'type': 'error', })
      return
    }

    const res = await cloudRequest({ name: 'customerRegiste ', data })
    if (!res || res.code !== 'success') return
  }

  onChangeShow(layoutShow) {
    this.setState({ layoutShow })
  }

  onChangeInput(valueName, e) {
    this.setState({ [valueName]: e.detail.value })
  }

  render () {
    const { layoutShow } = this.state
    return (
      <View className='p-page'>
        <AtMessage />
        <View className='p-contain'>
          <View className='u-logo-box'>
            <Image className='u-logo-icon' src={icon_logo} />
            <View className='u-logo-text'>快预约</View>
          </View>
          <Button className='btn-style btn-primary u-btn' hoverClass='btn-hover' onClick={this.onChangeShow.bind(this, true)}>手机号登录</Button>
          <Button className='btn-style btn-default u-btn' hoverClass='btn-hover'>取消</Button>
        </View>
        <View>
          <HalfScreenLayout
            show={layoutShow}
            title='注册'
            onChangeShow={this.onChangeShow.bind(this)}
            renderFooter={
              <Button className='btn-style btn-purple btn-large btn-circle-44' hoverClass='btn-hover' onClick={this.onClickRegister.bind(this)}>注册</Button>
            }
          >
            <View className='p-form'>
              <View className='u-item'>
                <View className='u-name'>姓名</View>
                <Input className='u-input' placeholder='请输入姓名' placeholderClass='color-888' maxLength='20' onBlur={this.onChangeInput.bind(this, 'name')} />
              </View>
              <View className='u-item'>
                <View className='u-name'>手机号码</View>
                <Input type='number' className='u-input' placeholder='请输入手机号码' placeholderClass='color-888' maxLength='11' onBlur={this.onChangeInput.bind(this, 'phone')} />
              </View>
            </View>
          </HalfScreenLayout>
        </View>
      </View>
    )
  }
}
