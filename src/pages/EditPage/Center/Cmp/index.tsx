import { memo } from 'react'
import styles from './index.module.less'
import { ICmpWithKey } from 'src/store/editStoreTypes'
import { isImgComponent, isTextComponent } from '../../LeftSider'
import { Img, Text } from './CmpDetail'
import classNames from 'classnames'
import { pick, omit } from 'lodash'
import { setCmpSeleted, setCmpsSeleted } from 'src/store/editStore'

interface ICmpProps {
  cmp: ICmpWithKey
  index: number
  isSelected: boolean
}

const Cmp = memo((props: ICmpProps) => {
  const { cmp, index, isSelected } = props
  const { style } = cmp

  const setSelected = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (e.metaKey) {
      setCmpsSeleted([index])
    } else {
      setCmpSeleted(index)
    }
  }

  const outerStyle = pick(style, ['position', 'top', 'left', 'width', 'height'])

  const innerStyle = omit(style, 'position', 'top', 'left')

  const transform = `rotate(${style.transform}deg)`

  console.log('cmp render') //sy-log

  return (
    <div
      className={classNames(styles.main, isSelected && 'selectedBorder')}
      style={{ ...outerStyle, transform }}
      onClick={setSelected}
      id={'cmp' + cmp.key}
    >
      <div className={styles.inner} style={{ ...innerStyle, zIndex: index }}>
        {cmp.type === isTextComponent && <Text {...cmp} />}
        {cmp.type === isImgComponent && <Img {...cmp} />}
      </div>
    </div>
  )
})

export default Cmp
