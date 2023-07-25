import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import {
  EditStoreState,
  EditStoreAction,
  ICanvas,
  ICmp,
  Style,
} from './editStoreTypes'
import { getOnlyKey } from 'src/utils'
import Axios from 'src/request/axios'
import { getCanvasByIdEnd, saveCanvasEnd } from 'src/request/end'
import { enableMapSet } from 'immer'
import { resetZoom } from './zoomStore'
enableMapSet()

const useEditStore = create(
  immer<EditStoreState & EditStoreAction>((set) => ({
    canvas: getDefaultCanvas(),
    assembly: new Set(),
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
      const cmp = draft.canvas.cmps[index]

      for (const key in newStyle) {
        cmp.style[key] += newStyle[key]
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
