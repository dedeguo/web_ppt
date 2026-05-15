import { ref } from 'vue'
import mammoth from 'mammoth'

const ALLOWED_TYPES = ['.txt', '.md', '.docx']
const MAX_SIZE = 10 * 1024 * 1024

export function useFileParser() {
  const parsedText = ref('')
  const fileName = ref('')
  const parseError = ref('')

  function validate(file) {
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (!ALLOWED_TYPES.includes(ext)) {
      return `不支持的文件格式：${ext}，仅支持 .txt / .md / .docx`
    }
    if (file.size > MAX_SIZE) {
      return `文件过大（${(file.size / 1024 / 1024).toFixed(1)}MB），最大 10MB`
    }
    return null
  }

  async function parse(file) {
    parseError.value = ''
    parsedText.value = ''
    fileName.value = ''

    const err = validate(file)
    if (err) {
      parseError.value = err
      return null
    }

    try {
      const ext = '.' + file.name.split('.').pop().toLowerCase()
      let text

      if (ext === '.docx') {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        text = result.value
      } else {
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = () => reject(new Error('文件读取失败'))
          reader.readAsText(file)
        })
      }

      parsedText.value = text
      fileName.value = file.name
      return text
    } catch (e) {
      parseError.value = ext === '.docx' ? 'Word 文档解析失败' : '文件读取失败'
      return null
    }
  }

  return { parsedText, fileName, parseError, parse }
}