import { esc, wrapHtml } from './shared'

export function academicTemplate(json) {
  const slidesHtml = json.slides.map((slide, i) => {
    const cls = i === 0 ? 'slide' : 'slide hidden'
    const layoutClass = slide.layout === 'left-right' ? 'layout-lr' : slide.layout === 'top-down' ? 'layout-td' : 'layout-center'

    let content = `<div class="header-line"></div><h2>${esc(slide.title || '')}</h2>`
    if (slide.subtitle) content += `<p class="subtitle">${esc(slide.subtitle)}</p>`
    if (slide.text) content += `<blockquote>${esc(slide.text)}</blockquote>`
    if (slide.points) content += `<ul>${slide.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`
    if (slide.items) content += `<ul>${slide.items.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`

    return `<div class="${cls} ${layoutClass}" data-index="${i}">
      <div class="slide-content">${content}</div>
    </div>`
  }).join('\n')

  return wrapHtml(json, slidesHtml, `
body{background:#f8fafc;color:#1e293b}
.header-line{width:100%;height:3px;background:#1e3a5f;margin-bottom:32px}
h2{font-size:40px;font-weight:700;margin-bottom:24px;color:#0f172a}
.subtitle{font-size:20px;color:#475569;margin-bottom:24px}
blockquote{border-left:4px solid #1e3a5f;padding:12px 20px;margin:16px 0;background:#f1f5f9;font-size:18px;color:#475569;line-height:1.7}
.body-text{font-size:18px;color:#334155;line-height:2}
ul{list-style:none;font-size:20px;line-height:2.6}
li{padding:2px 0}
li::before{content:'—';color:#1e3a5f;margin-right:12px}
.layout-center .slide-content{text-align:center}
.layout-center .header-line{margin-left:auto;margin-right:auto;width:60%}
.layout-center ul{display:inline-block;text-align:left}
  `)
}