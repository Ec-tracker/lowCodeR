import { useState } from 'react'
import styles from './index.module.less'
import useEditStore from 'src/store/editStore'
import EditCanvas from './EditCanvas'
import EditCmp from './EditCmp'
import EditMultiCmps from './EditMultiCmps'

export default function RightSider() {
  const [showEdit, setShowEdit] = useState(false)

  const [canvas, assembly] = useEditStore((state) => [
    state.canvas,
    state.assembly,
  ])

  const assemblySize = assembly.size
  return (
    <div className={styles.main}>
      <div
        className={styles.switch}
        onClick={() => {
          setShowEdit(!showEdit)
        }}
      >
        {showEdit ? '隐藏编辑区域' : '显示编辑区域'}
      </div>

      {showEdit &&
        (assemblySize === 0 ? (
          <EditCanvas canvas={canvas} />
        ) : assemblySize === 1 ? (
          <EditCmp selectedCmp={canvas.content.cmps[Array.from(assembly)[0]]} />
        ) : (
          <EditMultiCmps />
        ))}
    </div>
  )
}
