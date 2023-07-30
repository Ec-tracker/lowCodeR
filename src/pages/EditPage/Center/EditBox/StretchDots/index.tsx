import styles from './index.module.less'
import { updateAssemblyCmpsDistance } from 'src/store/editStore'
import { throttle } from 'lodash'

interface IStretchProps {
  zoom: number
  style: any
}

import React from 'react'

export default function StretchDots(props: IStretchProps) {
  const { zoom, style } = props
  const { width, height, transform } = style

  const onMouseDown = (e) => {
    let startX = e.pageX
    let startY = e.pageY
    const direction = e.target.dataset.direction

    if (!direction) return

    e.preventDefault()
    e.stopPropagation()

    const move = throttle((e) => {
      const x = e.pageX
      const y = e.pageY

      let distX = x - startX
      let distY = y - startY

      distX = (distX * 100) / zoom
      distY = (distY * 100) / zoom

      let newStyle: any = {}

      if (direction) {
        if (direction.indexOf('top') >= 0) {
          distY = 0 - distY
          newStyle.top = -distY
        }

        if (direction.indexOf('left') >= 0) {
          distX = 0 - distX
          newStyle.left = -distX
        }
      }
      Object.assign(newStyle, { width: distX, height: distY })

      updateAssemblyCmpsDistance(newStyle)

      startX = x
      startY = y
    }, 50)

    const up = () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    }

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
  }

  return (
    <>
      <div
        className={styles.stretchDot}
        style={{
          top: -8,
          left: -8,
          transform,
          cursor: 'nwse-resize',
        }}
        data-direction="top, left"
        onMouseDown={onMouseDown}
      />

      <div
        className={styles.stretchDot}
        style={{
          top: -8,
          left: width / 2 - 8,
          transform,
          cursor: 'row-resize',
        }}
        data-direction="top"
        onMouseDown={onMouseDown}
      />

      <div
        className={styles.stretchDot}
        style={{
          top: -8,
          left: width - 12,
          transform,
          cursor: 'nesw-resize',
        }}
        data-direction="top right"
        onMouseDown={onMouseDown}
      />

      <div
        className={styles.stretchDot}
        style={{
          top: height / 2 - 8,
          left: width - 12,
          transform,
          cursor: 'col-resize',
        }}
        data-direction="right"
        onMouseDown={onMouseDown}
      />

      <div
        className={styles.stretchDot}
        style={{
          top: height - 10,
          left: width - 12,
          transform,
          cursor: 'nwse-resize',
        }}
        data-direction="bottom right"
        onMouseDown={onMouseDown}
      />

      <div
        className={styles.stretchDot}
        style={{
          top: height - 10,
          left: width / 2 - 8,
          transform,
          cursor: 'row-resize',
        }}
        data-direction="bottom"
        onMouseDown={onMouseDown}
      />

      <div
        className={styles.stretchDot}
        style={{
          top: height - 10,
          left: -8,
          transform,
          cursor: 'nesw-resize',
        }}
        data-direction="bottom left"
        onMouseDown={onMouseDown}
      />
      <div
        className={styles.stretchDot}
        style={{
          top: height / 2 - 8,
          left: -8,
          transform,
          cursor: 'col-resize',
        }}
        data-direction="left"
        onMouseDown={onMouseDown}
      />
    </>
  )
}
