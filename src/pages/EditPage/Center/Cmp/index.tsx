import { memo } from 'react'
import styles from './index.module.less'
import { ICmpWithKey } from 'src/store/editStoreTypes'
import { isTextComponent } from '../../LeftSider'
import { Text } from './CmpDetail'

interface ICmp {
  cmp: ICmpWithKey
  index: number
}

const Cmp = memo((props: ICmp) => {
  const { index, cmp } = props
  const { style } = cmp
  const zIndex = index

  return (
    <div className={styles.main} style={{ ...style, zIndex }}>
      {cmp.type === isTextComponent && <Text {...cmp} />}
    </div>
  )
})

export default Cmp
