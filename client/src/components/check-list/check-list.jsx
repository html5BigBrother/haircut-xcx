import Taro, { Component } from '@tarojs/taro'
import { View, Text, Label, Checkbox, CheckboxGroup } from '@tarojs/components'
import './check-list.styl'

/* 多个 checkbox 选择组件

参数

show 控制显示隐藏
onChangeShow 改变父组件show
checkedBgColor 选中背景色

*/

const defaultProps = {
  selectSingle: false,
  checkList: []
}

class CheckList extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  static externalClasses = ['check-list-class']

  onChangeCheckedList(e) {
    let { selectSingle, checkList, onSelectedCheck } = this.props
    const valueList = e.detail.value
    checkList.forEach((item, index) => {
      const indexStr = String(index)
      if (selectSingle) item.checked = !!(valueList.length > 0 && valueList[valueList.length -1].indexOf(indexStr) > -1)
      else item.checked = valueList.indexOf(indexStr) > -1
    })
    onSelectedCheck({ checkList })
  }

  render () {
    const { checkList, checkedBgColor } = this.props
    return (
      <View className='check-list-style check-list-class'>
        <CheckboxGroup onChange={this.onChangeCheckedList.bind(this)}>
          {
            checkList.map((item, index) => 
              <Label className={`u-label ${item.disabled && 'disabled'} ${item.checked && 'checked'}`} style={item.checked ? `background-color: ${checkedBgColor};` : ''} key={item.value}>
                <Checkbox className='u-checkbox' value={index} disabled={item.disabled} checked={item.checked}></Checkbox>
                <Text>09:00</Text>
              </Label>
            )
          }
        </CheckboxGroup>
      </View>
    )
  }
}

CheckList.defaultProps = defaultProps

export default CheckList