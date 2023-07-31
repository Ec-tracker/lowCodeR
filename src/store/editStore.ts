import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import {
  EditStoreState,
  EditStoreAction,
  ICanvas,
  ICmp,
  Style,
  IEditStore,
} from './editStoreTypes'
import { getOnlyKey } from 'src/utils'
import Axios from 'src/request/axios'
import { getCanvasByIdEnd, saveCanvasEnd } from 'src/request/end'
import { enableMapSet } from 'immer'
import { resetZoom } from './zoomStore'
import { recordCanvasChangeHistory } from './historySlice'
enableMapSet()

const useEditStore = create(
  immer<EditStoreState & EditStoreAction>((set) => ({
    canvas: getDefaultCanvas(),
    assembly: new Set(),
    canvasChangeHistory: [{ canvas: getDefaultCanvas(), assembly: new Set() }],
    canvasChangeHistoryIndex: 0,
  }))
)

export const clearCanvas = () => {
  useEditStore.setState((draft) => {
    draft.canvas = getDefaultCanvas()
  })

  resetZoom()
}

export const addCmp = (_cmp: ICmp) => {
  useEditStore.setState((draft) => {
    draft.canvas.cmps.push({ ..._cmp, key: getOnlyKey() })
    draft.assembly = new Set([draft.canvas.cmps.length - 1])
  })
}

export const updateAssemblyCmpsDistance = (newStyle: Style) => {
  useEditStore.setState((draft) => {
    draft.assembly.forEach((index) => {
      const cmp = { ...draft.canvas.cmps[index] }

      let invalid = false

      for (const key in newStyle) {
        if (
          (key === 'width' || key === 'height') &&
          cmp.style[key] + newStyle[key] < 2
        ) {
          invalid = true
          break
        }
        cmp.style[key] += newStyle[key]
      }

      if (!invalid) {
        draft.canvas.cmps[index] = cmp
      }
    })
  })
}

export const saveCanvas = async (
  id: number | null,
  type: string,
  successCallback: (id: number) => void
) => {
  const canvas = useEditStore.getState().canvas
  const res: any = await Axios.post(saveCanvasEnd, {
    id,
    title: canvas.title,
    content: JSON.stringify(canvas),
    type,
  })

  successCallback(res?.id)
}

export const fetchCanvas = async (id: number) => {
  const res: any = await Axios.get(getCanvasByIdEnd + id)

  if (res) {
    useEditStore.setState((draft) => {
      draft.canvas = JSON.parse(res.content)
      draft.canvas.title = res.title
      draft.assembly.clear()
      // 初始化历史数据
      draft.canvasChangeHistory = [
        { canvas: draft.canvas, assembly: draft.assembly },
      ]
      draft.canvasChangeHistoryIndex = 0
    })
  }
}

export const setAllCmpSelected = () => {
  useEditStore.setState((draft) => {
    let len = draft.canvas.cmps.length
    draft.assembly = new Set(Array.from({ length: len }, (_, b) => b))
  })
}

export const setCmpsSeleted = (indexes: Array<number>) => {
  useEditStore.setState((draft) => {
    if (indexes) {
      indexes.forEach((index) => {
        if (draft.assembly.has(index)) {
          draft.assembly.delete(index)
        } else {
          draft.assembly.add(index)
        }
      })
    }
  })
}

export const setCmpSeleted = (index: number) => {
  if (index === -1) {
    useEditStore.setState((draft) => {
      if (draft.assembly.size > 0) {
        draft.assembly.clear()
      }
    })
  } else if (index > -1) {
    useEditStore.setState((draft) => {
      draft.assembly = new Set([index])
    })
  }
}

export const recordCanvasChangeHistory_2 = () => {
  const store = useEditStore.getState()
  if (
    store.canvas ===
    store.canvasChangeHistory[store.canvasChangeHistoryIndex].canvas
  ) {
    return
  }

  useEditStore.setState((draft) => {
    recordCanvasChangeHistory(draft)
  })
}

// 修改画布 title
export const updateCanvasTitle = (title: string) => {
  useEditStore.setState((draft) => {
    draft.canvas.title = title
    recordCanvasChangeHistory(draft)
  })
}

// ! 更新画布属性
export const updateCanvasStyle = (_style: any) => {
  useEditStore.setState((draft) => {
    Object.assign(draft.canvas.style, _style)
    recordCanvasChangeHistory(draft)
  })
}

// 修改选中组件的style
export const editAssemblyStyle = (_style: Style) => {
  useEditStore.setState((draft) => {
    draft.assembly.forEach((index: number) => {
      const _s = { ...draft.canvas.cmps[index].style }
      const canvasStyle = draft.canvas.style
      if (_style.right === 0) {
        // 计算left
        _s.left = canvasStyle.width - _s.width
      } else if (_style.bottom === 0) {
        // top
        _s.top = canvasStyle.height - _s.height
      } else if (_style.left === 'center') {
        _s.left = (canvasStyle.width - _s.width) / 2
      } else if (_style.top === 'center') {
        _s.top = (canvasStyle.height - _s.height) / 2
      } else {
        Object.assign(_s, _style)
      }

      draft.canvas.cmps[index].style = _s

      recordCanvasChangeHistory(draft)
    })
  })
}

// 修改单个组件的style
export const updateSelectedCmpStyle = (newStyle: Style) => {
  useEditStore.setState((draft) => {
    Object.assign(
      draft.canvas.cmps[selectedCmpIndexSelector(draft)].style,
      newStyle
    )
    recordCanvasChangeHistory(draft)
  })
}

// 选中的单个组件的index
export const selectedCmpIndexSelector = (store: IEditStore): number => {
  const selectedCmpIndex = Array.from(store.assembly)[0]
  return selectedCmpIndex === undefined ? -1 : selectedCmpIndex
}

// 修改单个组件的属性
export const updateSelectedCmpAttr = (name: string, value: string) => {
  useEditStore.setState((draft: any) => {
    const selectedIndex = selectedCmpIndexSelector(draft)
    draft.canvas.cmps[selectedIndex][name] = value
    recordCanvasChangeHistory(draft)
  })
}

export default useEditStore

function getDefaultCanvas(): ICanvas {
  return {
    title: '未命名',
    // 页面样式
    style: {
      width: 320,
      height: 568,
      backgroundColor: '#ffffff',
      backgroundImage: '',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    },
    // 组件
    cmps: [],
  }
}
