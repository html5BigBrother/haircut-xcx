import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './half-screen-layout.styl'

/* 底部弹框组件

参数

show 控制显示隐藏
title 标题
onChangeShow 改变父组件show

*/

const defaultProps = {
  show: false,
  title: '',
}

class HalfScreenLayout extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  static externalClasses = ['layout-class']

  render () {
    const { show, title } = this.props
    return (
      <View className={`layout-warp layout-class ${show ? 'layout-show' : ''}`}>
        <View className='layout-mask' onClick={() => { this.props.onChangeShow(false) }}></View>
        <View className='layout-container'>
          { title && <View className='layout-container-title'>{title}</View>}
          <View className='layout-close' onClick={() => { this.props.onChangeShow(false) }}><AtIcon color='#888888' value='close-circle'></AtIcon></View>
          <View className='layout-container-body'>{this.props.children}</View>
          <View className='layout-container-footer'>{this.props.renderFooter}</View>
        </View>
      </View>
    )
  }
}

HalfScreenLayout.defaultProps = defaultProps

export default HalfScreenLayout