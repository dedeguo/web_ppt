import { usePptStore } from './usePptStore'
import { buildSystemPrompt, buildUserMessage } from '../prompts/systemPrompt'

export function useApi() {
  const store = usePptStore()

  const apiConfig = {
    key: import.meta.env.VITE_API_KEY,
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.openai.com/v1',
    model: import.meta.env.VITE_API_MODEL || 'gpt-4o',
  }

  function buildMessages(content, isModify = false) {
    const systemMsg = { role: 'system', content: buildSystemPrompt() }
    const userMsg = { role: 'user', content: buildUserMessage(content, isModify, store.pptJson) }
    if (isModify && store.chatHistory.length > 0) {
      const recent = store.chatHistory.slice(-4)
      return [systemMsg, ...recent, userMsg]
    }
    return [systemMsg, userMsg]
  }

  async function generate(content, isModify = false) {
    store.setGenerating(true)
    store.setError('')
    store.addChatMessage('user', isModify ? `修改意见：${content}` : `生成 PPT：${content.slice(0, 200)}...`)

    try {
      const messages = buildMessages(content, isModify)
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
          max_tokens: 4096,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`API 请求失败 (${response.status})`)
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

      const jsonData = JSON.parse(fullContent)
      store.setPptJson(jsonData)
      store.addChatMessage('assistant', `已生成 ${jsonData.slides?.length || 0} 页 PPT`)
      return jsonData
    } catch (e) {
      store.setError(e.message || 'PPT 生成失败，请重试')
      return null
    } finally {
      store.setGenerating(false)
    }
  }

  return { generate }
}