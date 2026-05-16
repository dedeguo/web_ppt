import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePptStore = defineStore('ppt', () => {
  const pptHtml = ref('')
  const pptJson = ref(null)
  const isGenerating = ref(false)
  const error = ref('')
  const selectedStyle = ref('business')
  const customStyle = ref('')
  const inputText = ref('')
  const chatHistory = ref([])

  function setPptJson(json) {
    pptJson.value = json
  }

  function setPptHtml(html) {
    pptHtml.value = html
  }

  function setGenerating(val) {
    isGenerating.value = val
  }

  function setError(msg) {
    error.value = msg
  }

  function setStyle(style) {
    selectedStyle.value = style
  }

  function setCustomStyle(text) {
    customStyle.value = text
  }

  function setInputText(text) {
    inputText.value = text
  }

  function addChatMessage(role, content) {
    chatHistory.value.push({ role, content })
    if (chatHistory.value.length > 6) {
      chatHistory.value = chatHistory.value.slice(-6)
    }
  }

  function reset() {
    pptHtml.value = ''
    pptJson.value = null
    isGenerating.value = false
    error.value = ''
    chatHistory.value = []
  }

  return {
    pptHtml,
    pptJson,
    isGenerating,
    error,
    selectedStyle,
    customStyle,
    inputText,
    chatHistory,
    setPptJson,
    setPptHtml,
    setGenerating,
    setError,
    setStyle,
    setCustomStyle,
    setInputText,
    addChatMessage,
    reset,
  }
})