import React from 'react'
import styles from './index.module.less'
import Canvas from './Canvas'
import useEditStore, {
  setAllCmpSelected,
  setCmpSeleted,
} from 'src/store/editStore'
import useZoomStore from 'src/store/zoomStore'

export default function Center() {
  const { zoom, zoomIn, zoomOut } = useZoomStore()
  const { canvas } = useEditStore()
  const keyDown = (e) => {
    console.log(e)
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
        minHeight: (zoom / 100) * canvas.style.height + 100,
      }}
      tabIndex={0}
      onClick={(e) => {
        if (e.target?.id === 'center') {
          setCmpSeleted(-1)
        }
      }}
      onKeyDown={keyDown}
    >
      <Canvas />
    </div>
  )
}
