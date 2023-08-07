import React from 'react'
import styles from './index.module.less'
import Canvas from './Canvas'
import useEditStore, {
  delSelectedCmps,
  setAllCmpSelected,
  setCmpSeleted,
  updateAssemblyCmpsDistance,
} from 'src/store/editStore'
import useZoomStore from 'src/store/zoomStore'
import { ICmpWithKey } from 'src/store/editStoreTypes'
import { isImgComponent, isGraphComponent } from '../LeftSider'
import classNames from 'classnames'
import { pick } from 'lodash'

export default function Center() {
  const { zoom, zoomIn, zoomOut } = useZoomStore()
  const { canvas } = useEditStore()
  const keyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(e.code)

    // 键盘事件
    switch (e.code) {
      case 'Backspace':
        delSelectedCmps()
        return

      // 左移
      case 'ArrowLeft':
        e.preventDefault()
        updateAssemblyCmpsDistance({ left: -1 })
        return

      // 右移
      case 'ArrowRight':
        e.preventDefault()
        updateAssemblyCmpsDistance({ left: 1 })
        return

      // 上移
      case 'ArrowUp':
        e.preventDefault()
        updateAssemblyCmpsDistance({ top: -1 })
        return

      // 下移
      case 'ArrowDown':
        e.preventDefault()
        updateAssemblyCmpsDistance({ top: 1 })
        return
    }

    if (e.altKey) {
      switch (e.code) {
        case 'KeyA':
          setAllCmpSelected()
          break
        case 'Minus':
        case 'NumpadSubtract':
          zoomOut()
          e.preventDefault()
          break
        case 'Equal':
        case 'NumpadAdd':
          zoomIn()
          e.preventDefault()
          break
      }
    }
  }
  return (
    <div
      id="center"
      className={styles.main}
      style={{
        minHeight: (zoom / 100) * canvas.content.style.height + 100,
      }}
      tabIndex={0}
      onClick={(e: React.MouseEvent) => {
        if ((e.target as HTMLElement).id.indexOf('cmp') === -1) {
          setCmpSeleted(-1)
        }
      }}
      onKeyDown={keyDown}
    >
      <Canvas />
    </div>
  )
}
