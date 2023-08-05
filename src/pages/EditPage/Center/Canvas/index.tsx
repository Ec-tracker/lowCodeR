import useEditStore, {
  addCmp,
  clearCanvas,
  fetchCanvas,
} from 'src/store/editStore'
import styles from './index.module.less'
import { ICmpWithKey } from 'src/store/editStoreTypes'
import Cmp from '../Cmp'
import { useEffect } from 'react'
import { useCanvasId } from 'src/store/hooks'
import EditBox from '../EditBox'
import Zoom from '../Zoom'
import useZoomStore, { resetZoom } from 'src/store/zoomStore'

export default function Canvas() {
  const { canvas, assembly } = useEditStore()
  const { cmps, style } = canvas.content
  const id = useCanvasId()

  const { zoom } = useZoomStore()
  useEffect(() => {
    if (id) {
      fetchCanvas(id)
    } else {
      clearCanvas()
    }
    resetZoom()
  }, [])

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.getData('drag-cmp')) return

    let dragCmp = JSON.parse(e.dataTransfer.getData('drag-cmp')) as ICmpWithKey

    const endX = e.pageX
    const endY = e.pageY

    const canvasDomPos = {
      top: 114,
      left: document.body.clientWidth / 2 - (style.width / 2) * (zoom / 100),
    }

    let disX = endX - canvasDomPos.left
    let disY = endY - canvasDomPos.top

    disX = (disX * 100) / zoom
    disY = (disY * 100) / zoom

    dragCmp.style.left = disX - dragCmp.style.width / 2
    dragCmp.style.top = disY - dragCmp.style.height / 2

    addCmp(dragCmp)
  }

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div
      id="canvas"
      className={styles.main}
      style={{ ...style, transform: `scale(${zoom / 100})` }}
      onDrop={onDrop}
      onDragOver={allowDrop}
    >
      <EditBox />
      {cmps.map((cmp, index) => (
        <Cmp
          key={cmp.key}
          index={index}
          cmp={cmp}
          isSelected={assembly.has(index)}
        ></Cmp>
      ))}
      <Zoom />
    </div>
  )
}
