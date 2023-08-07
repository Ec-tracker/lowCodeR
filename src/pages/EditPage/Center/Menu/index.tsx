import classNames from 'classnames'
import {
  addAssemblyCmps,
  addZIndex,
  bottomZIndex,
  delSelectedCmps,
  setCmpSeleted,
  subZIndex,
  topZIndex,
} from 'src/store/editStore'
import styles from './index.module.less'
import { ICmpWithKey, Style } from 'src/store/editStoreTypes'
import { isGraphComponent, isImgComponent } from '../../LeftSider'
import { pick } from 'lodash'

export default function Menu({
  style,
  assemblySize,
  cmps,
  selectedIndex,
}: {
  style: Style
  assemblySize: number
  cmps: Array<ICmpWithKey>
  selectedIndex: number
}) {
  if (assemblySize === 0) {
    return null
  }

  const overlap = (cmp: ICmpWithKey) => {
    const selectedCmp = cmps[selectedIndex]

    const _style = selectedCmp.style
    const selectedCmpStyle = {
      top: _style.top,
      right: _style.left + _style.width - 0,
      bottom: _style.top + _style.height - 0,
      left: _style.left,
    }

    const _style2 = cmp.style
    const cmpStyle = {
      top: _style2.top,
      right: _style2.left + _style2.width - 0,
      bottom: _style2.top + _style2.height - 0,
      left: _style2.left,
    }
    if (
      selectedCmpStyle.top > cmpStyle.bottom ||
      selectedCmpStyle.right < cmpStyle.left ||
      selectedCmpStyle.bottom < cmpStyle.top ||
      selectedCmpStyle.left > cmpStyle.right
    ) {
      return false
    } else {
      return true
    }
  }

  return (
    <div className={classNames(styles.main)} style={style}>
      <ul className={classNames(styles.menu)}>
        <li onClick={addAssemblyCmps}>复制组件</li>
        <li onClick={delSelectedCmps}>删除组件</li>
        {assemblySize === 1 && (
          <>
            <li onClick={addZIndex}>上移一层</li>
            <li onClick={subZIndex}>下移一层</li>
            <li onClick={topZIndex}>置顶</li>
            <li onClick={bottomZIndex}>置底</li>
            <li>附件组件</li>
          </>
        )}
      </ul>
      {assemblySize == 1 && (
        <ul className={styles.nearByCmps}>
          {cmps.map((item, index) =>
            index === selectedIndex || !overlap(item) ? null : (
              <Item key={item.key} cmp={item} index={index}></Item>
            )
          )}
        </ul>
      )}
    </div>
  )
}

interface ItemProps {
  cmp: ICmpWithKey
  index: number
}

function Item(props: ItemProps) {
  const { cmp, index } = props
  const { type, value } = cmp

  let left, right

  switch (type) {
    case isImgComponent:
      left = <img className={styles.left} src={value} alt="" />
      right = '图片'
      break

    case isGraphComponent:
      left = (
        <span
          className={styles.left}
          style={pick(cmp.style, [
            'backgroundColor',
            'borderWidth',
            'borderStyle',
            'borderColor',
            'borderRadius',
          ])}
        ></span>
      )
      right = '图形'
      break

    // case isTextComponent:
    default:
      left = (
        <span
          className={classNames(styles.left, 'iconfont icon-wenben')}
        ></span>
      )
      right = value
      break
  }

  return (
    <li onClick={() => setCmpSeleted(index)}>
      {left}
      <span className={styles.txt}>{right}</span>
    </li>
  )
}
