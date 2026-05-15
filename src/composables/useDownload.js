import { usePptStore } from './usePptStore'

export function useDownload() {
  const store = usePptStore()

  function download() {
    if (!store.pptHtml) return

    const title = store.pptJson?.title || 'PPT'
    const date = new Date().toISOString().slice(0, 10)
    const filename = `${title}_${date}.html`

    const blob = new Blob([store.pptHtml], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return { download }
}