import { usePptStore } from './usePptStore'
import { buildHtmlSystemPrompt, buildHtmlUserMessage } from '../prompts/htmlSystemPrompt'

export function useHtmlApi() {
  const store = usePptStore()

  const apiConfig = {
    key: import.meta.env.VITE_API_KEY,
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.openai.com/v1',
    model: import.meta.env.VITE_API_MODEL || 'gpt-4o',
    maxTokens: parseInt(import.meta.env.VITE_API_MAX_TOKENS) || 65536,
  }

  async function generate(content, isModify = false) {
    store.setGenerating(true)
    store.setError('')
    store.addChatMessage('user', isModify ? `修改意见：${content}` : `生成 PPT：${content.slice(0, 200)}...`)

    try {
      const messages = [
        { role: 'system', content: buildHtmlSystemPrompt(store.selectedStyle, store.customStyle) },
        ...buildHtmlUserMessage(content, isModify, store.pptHtml),
      ]

      const response = await fetch(`${apiConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiConfig.key}`,
        },
        body: JSON.stringify({
          model: apiConfig.model,
          messages,
          temperature: 0.7,
          max_tokens: apiConfig.maxTokens,
          stream: true,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API 请求失败 (${response.status}): ${errorText.slice(0, 200)}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data)
            fullContent += parsed.choices?.[0]?.delta?.content || ''
          } catch { continue }
        }
      }

      console.log('[useHtmlApi] 收到原始内容长度:', fullContent.length)
      console.log('[useHtmlApi] 原始内容前 200 字符:', fullContent.slice(0, 200))
      console.log('[useHtmlApi] 原始内容后 200 字符:', fullContent.slice(-200))

      const html = extractHtml(fullContent)
      console.log('[useHtmlApi] 提取后 HTML 长度:', html ? html.length : 0)
      console.log('[useHtmlApi] 提取后 HTML 前 200 字符:', html ? html.slice(0, 200) : 'null')
      console.log('[useHtmlApi] 是否以 <!DOCTYPE 开头:', html ? html.trim().startsWith('<!DOCTYPE') : false)
      store.setPptHtml(html)
      store.addChatMessage('assistant', 'PPT HTML 生成完成')
      return html
    } catch (e) {
      store.setError(e.message || 'PPT 生成失败，请重试')
      return null
    } finally {
      store.setGenerating(false)
    }
  }

  function extractHtml(content) {
    const match = content.match(/```(?:html)?\s*([\s\S]*)```/)
    if (match) return match[1].trim()
    const doctypeMatch = content.match(/<!DOCTYPE[\s\S]*?<\/html>/i)
    if (doctypeMatch) return doctypeMatch[0]
    return content
  }

  return { generate }
}
