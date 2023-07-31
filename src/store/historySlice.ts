import useEditStore from './editStore'
import type { EditStoreState } from './editStoreTypes'

const maxCanvasChangeHistory = 100

export const recordCanvasChangeHistory = (draft: EditStoreState) => {
  draft.canvasChangeHistory = draft.canvasChangeHistory.slice(
    0,
    draft.canvasChangeHistoryIndex + 1
  )

  draft.canvasChangeHistory.push({
    canvas: draft.canvas,
    assembly: draft.assembly,
  })

  if (draft.canvasChangeHistory.length > maxCanvasChangeHistory) {
    draft.canvasChangeHistory.shift()
    draft.canvasChangeHistoryIndex--
  }
}

export const goPrevCanvasHistory = () => {
  useEditStore.setState((draft) => {
    let newIndex = draft.canvasChangeHistoryIndex - 1

    if (newIndex < 0) {
      newIndex = 0
    }

    if (draft.canvasChangeHistoryIndex === newIndex) {
      return
    }

    const item = draft.canvasChangeHistory[newIndex]
    draft.canvas = item.canvas
    draft.assembly = item.assembly
    draft.canvasChangeHistoryIndex = newIndex
  })
}

export const goNextCanvasHistory = () => {
  useEditStore.setState((draft) => {
    let newIndex = draft.canvasChangeHistoryIndex + 1

    if (newIndex >= draft.canvasChangeHistory.length) {
      newIndex = draft.canvasChangeHistory.length - 1
    }

    if (draft.canvasChangeHistoryIndex === newIndex) {
      return
    }
    const item = draft.canvasChangeHistory[newIndex]
    draft.canvas = item.canvas
    draft.assembly = item.assembly
    draft.canvasChangeHistoryIndex = newIndex
  })
}
