import useEditStore, {
  recordCanvasChangeHistory_2,
  updateAssemblyCmpsDistance,
  updateSelectedCmpAttr,
  updateSelectedCmpStyle,
} from 'src/store/editStore'
import styles from './index.module.less'
import { throttle } from 'lodash'
import useZoomStore from 'src/store/zoomStore'
import StretchDots from './StretchDots'
import { useState, useEffect } from 'react'
import { isTextComponent } from '../../LeftSider'
import TextareaAutosize from 'react-textarea-autosize'
import Menu from '../Menu'

export default function EditBox() {
  const [cmps, assembly] = useEditStore((store) => [
    store.canvas.content.cmps,
    store.assembly,
  ])

  const { zoom } = useZoomStore()

  const size = assembly.size

  const selectedIndex = Array.from(assembly)[0]

  // 只有单个文本组件的时候才会用到
  const selectedCmp = cmps[Array.from(assembly)[0]]
  const [textareaFocused, setTextareaFocused] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    setShowMenu(false)
  }, [selectedIndex])

  if (size === 0) {
    return null
  }

  let top = 9999,
    left = 9999,
    bottom = -9999,
    right = -9999

  assembly.forEach((index) => {
    const cmp = cmps[index]
    top = Math.min(top, cmp.style.top)
    left = Math.min(left, cmp.style.left)

    bottom = Math.max(bottom, cmp.style.top + cmp.style.height)
    right = Math.max(right, cmp.style.left + cmp.style.width)
  })

  let width = right - left + 8
  let height = bottom - top + 8

  top -= 4
  left -= 4

  const onMouseDown = throttle((e) => {
    e.preventDefault()

    let startX = e.pageX
    let startY = e.pageY

    const move = (e) => {
      const x = e.pageX
      const y = e.pageY

      let disX = x - startX
      let disY = y - startY
      disX = (disX * 100) / zoom
      disY = (disY * 100) / zoom

      updateAssemblyCmpsDistance({ top: disY, left: disX })

      startX = x
      startY = y
    }

    const up = () => {
      recordCanvasChangeHistory_2()
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    }

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }, 200)
  return (
    <div
      className={styles.main}
      style={{
        zIndex: 99999,
        top,
        left,
        width,
        height,
      }}
      onMouseDown={onMouseDown}
      onClick={(e) => {
        e.stopPropagation()
      }}
      onDoubleClick={() => {
        setTextareaFocused(true)
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        setShowMenu(true)
      }}
      onMouseLeave={() => {
        setTextareaFocused(false)
        setShowMenu(false)
      }}
    >
      {size === 1 &&
        selectedCmp.type === isTextComponent &&
        textareaFocused && (
          <TextareaAutosize
            value={selectedCmp.value}
            style={{
              ...selectedCmp.style,
              top: 2,
              left: 2,
            }}
            onChange={(e) => {
              const newValue = e.target.value
              updateSelectedCmpAttr('value', newValue)
            }}
            onHeightChange={(height) => {
              updateSelectedCmpStyle({ height })
            }}
          ></TextareaAutosize>
        )}

      {showMenu && <Menu style={{ left: width }} assemblySize={size} />}
      <StretchDots zoom={zoom} style={{ width, height }} />
    </div>
  )
}
