import { usePptStore } from './usePptStore'
import { businessTemplate } from '../templates/business'
import { creativeTemplate } from '../templates/creative'
import { academicTemplate } from '../templates/academic'

const templates = {
  business: businessTemplate,
  creative: creativeTemplate,
  academic: academicTemplate,
}

export function usePptRenderer() {
  const store = usePptStore()

  function render() {
    const json = store.pptJson
    if (!json || !json.slides) {
      store.setError('没有可渲染的 PPT 数据')
      return null
    }
    const templateFn = templates[store.selectedStyle] || templates.business
    const html = templateFn(json)
    store.setPptHtml(html)
    return html
  }

  return { render }
}