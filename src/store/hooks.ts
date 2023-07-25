import { useSearchParams } from 'react-router-dom'
import { isString } from 'lodash'

export function useCanvasId(): number | null {
  const [params] = useSearchParams()
  let id: any = params.get('id')

  if (isString(id)) {
    id = parseInt(id)
  }

  return id
}

export function useCanvasType() {
  const [params] = useSearchParams()
  let type = params.get('type')

  return type || 'content'
}
