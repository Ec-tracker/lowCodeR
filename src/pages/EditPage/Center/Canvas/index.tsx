import useEditStore from 'src/store/editStore'
import styles from './index.module.less'
import { ICmpWithKey } from 'src/store/editStoreTypes'
import Cmp from '../Cmp'

export default function Canvas() {
  const { canvas, addCmp } = useEditStore()
  const { cmps, style } = canvas

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.getData('drag-cmp')) return

    let dragCmp = JSON.parse(e.dataTransfer.getData('drag-cmp')) as ICmpWithKey

    const endX = e.pageX
    const endY = e.pageY

    const canvasDomPos = {
      top: 114,
      left: (document.body.clientWidth - style.width) / 2,
    }

    let disX = endX - canvasDomPos.left
    let disY = endY - canvasDomPos.top

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
      style={style}
      onDrop={onDrop}
      onDragOver={allowDrop}
    >
      {cmps.map((cmp, index) => (
        <Cmp key={cmp.key} index={index} cmp={cmp}></Cmp>
      ))}
    </div>
  )
}
