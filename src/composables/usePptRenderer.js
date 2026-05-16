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
    console.log('[usePptRenderer] render 开始, style:', store.selectedStyle)
    const json = store.pptJson
    console.log('[usePptRenderer] pptJson:', json ? `title=${json.title}, slides=${json.slides?.length}` : 'null')

    if (!json || !json.slides) {
      console.error('[usePptRenderer] 没有可渲染的 PPT 数据')
      store.setError('没有可渲染的 PPT 数据')
      return null
    }
    const templateFn = templates[store.selectedStyle] || templates.business
    console.log('[usePptRenderer] 使用模板:', store.selectedStyle, '模板函数:', typeof templateFn)

    try {
      const html = templateFn(json)
      console.log('[usePptRenderer] 渲染成功, HTML 长度:', html.length)
      store.setPptHtml(html)
      return html
    } catch (e) {
      console.error('[usePptRenderer] 模板渲染失败:', e.message, e)
      store.setError(`模板渲染失败: ${e.message}`)
      return null
    }
  }

  return { render }
}