import { memo } from 'react'
import styles from './index.module.less'
import { ICmpWithKey } from 'src/store/editStoreTypes'
import { isImgComponent, isTextComponent } from '../../LeftSider'
import { Img, Text } from './CmpDetail'
import classNames from 'classnames'
import { pick, omit } from 'lodash'
import { setCmpSeleted, setCmpsSeleted } from 'src/store/editStore'

interface ICmp {
  cmp: ICmpWithKey
  index: number
  isSelected: boolean
}

const Cmp = memo((props: ICmp) => {
  const { index, cmp, isSelected } = props
  const { style } = cmp
  const zIndex = index

  const setSelected = (e) => {
    if (e.ctrlKey) {
      setCmpsSeleted([index])
    } else {
      setCmpSeleted(index)
    }
  }

  const outerStyle = pick(style, ['position', 'top', 'left', 'width', 'height'])

  const innerStyle = omit(style, ['position', 'top', 'left'])

  return (
    <div
      className={classNames(styles.main, isSelected && 'selectedBorder')}
      style={{ ...outerStyle }}
      onClick={setSelected}
    >
      <div className={styles.inner} style={{ ...innerStyle, zIndex }}>
        {cmp.type === isTextComponent && <Text {...cmp} />}
        {cmp.type === isImgComponent && <Img {...cmp} />}
      </div>
    </div>
  )
})

export default Cmp
