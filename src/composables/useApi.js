import { usePptStore } from './usePptStore'
import { buildSystemPrompt, buildUserMessage } from '../prompts/systemPrompt'

export function useApi() {
  const store = usePptStore()

  const apiConfig = {
    key: import.meta.env.VITE_API_KEY,
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.openai.com/v1',
    model: import.meta.env.VITE_API_MODEL || 'gpt-4o',
  }

  console.log('[useApi] 初始化 API 配置:', {
    baseUrl: apiConfig.baseUrl,
    model: apiConfig.model,
    hasKey: !!apiConfig.key,
  })

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
    console.log('[useApi] generate 开始, isModify:', isModify, 'content 长度:', content.length)
    store.setGenerating(true)
    store.setError('')
    store.addChatMessage('user', isModify ? `修改意见：${content}` : `生成 PPT：${content.slice(0, 200)}...`)

    try {
      const messages = buildMessages(content, isModify)
      console.log('[useApi] 消息数量:', messages.length)
      console.log('[useApi] 请求 URL:', `${apiConfig.baseUrl}/chat/completions`)
      console.log('[useApi] 请求 model:', apiConfig.model)

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

      console.log('[useApi] 响应状态:', response.status, response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[useApi] 响应错误内容:', errorText)
        throw new Error(`API 请求失败 (${response.status}): ${errorText.slice(0, 200)}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''
      let chunkCount = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            console.log('[useApi] 收到 [DONE] 标记')
            continue
          }
          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta?.content || ''
            fullContent += delta
            chunkCount++
          } catch { continue }
        }
      }

      console.log('[useApi] 流式读取完成, 分块数:', chunkCount, '内容长度:', fullContent.length)
      console.log('[useApi] 原始内容前 300 字符:', fullContent.slice(0, 300))

      let jsonData
      try {
        jsonData = JSON.parse(fullContent)
        console.log('[useApi] JSON 解析成功, slides 数量:', jsonData.slides?.length)
      } catch (parseErr) {
        console.error('[useApi] 直接 JSON 解析失败:', parseErr.message)
        console.log('[useApi] 尝试提取 JSON 代码块...')

        const jsonMatch = fullContent.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (jsonMatch) {
          console.log('[useApi] 找到 markdown 代码块，尝试解析')
          try {
            jsonData = JSON.parse(jsonMatch[1].trim())
            console.log('[useApi] 代码块 JSON 解析成功, slides 数量:', jsonData.slides?.length)
          } catch (e2) {
            console.error('[useApi] 代码块 JSON 解析也失败:', e2.message)
            throw new Error(`AI 返回内容无法解析: ${e2.message}`)
          }
        } else {
          const firstBrace = fullContent.indexOf('{')
          const lastBrace = fullContent.lastIndexOf('}')
          if (firstBrace !== -1 && lastBrace > firstBrace) {
            const jsonStr = fullContent.slice(firstBrace, lastBrace + 1)
            console.log('[useApi] 提取 {} 之间的内容, 长度:', jsonStr.length)
            try {
              jsonData = JSON.parse(jsonStr)
              console.log('[useApi] 提取后 JSON 解析成功, slides 数量:', jsonData.slides?.length)
            } catch (e3) {
              console.error('[useApi] 提取后 JSON 解析也失败:', e3.message)
              console.error('[useApi] 完整内容:', fullContent)
              throw new Error(`AI 返回内容无法解析: ${e3.message}`)
            }
          } else {
            console.error('[useApi] 未找到 JSON 内容')
            console.error('[useApi] 完整内容:', fullContent)
            throw new Error(`AI 返回内容无法解析: ${parseErr.message}`)
          }
        }
      }

      store.setPptJson(jsonData)
      store.addChatMessage('assistant', `已生成 ${jsonData.slides?.length || 0} 页 PPT`)
      return jsonData
    } catch (e) {
      console.error('[useApi] generate 异常:', e.message, e)
      store.setError(e.message || 'PPT 生成失败，请重试')
      return null
    } finally {
      store.setGenerating(false)
      console.log('[useApi] generate 结束')
    }
  }

  return { generate }
}