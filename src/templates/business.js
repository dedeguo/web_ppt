import { esc, wrapHtml } from './shared'

export function businessTemplate(json) {
  const slidesHtml = json.slides.map((slide, i) => {
    const cls = i === 0 ? 'slide' : 'slide hidden'
    const layoutClass = slide.layout === 'left-right' ? 'layout-lr' : slide.layout === 'top-down' ? 'layout-td' : 'layout-center'

    let content = `<h2>${esc(slide.title || '')}</h2>`
    if (slide.subtitle) content += `<p class="subtitle">${esc(slide.subtitle)}</p>`
    if (slide.text) content += `<p class="body-text">${esc(slide.text)}</p>`
    if (slide.points) content += `<ul>${slide.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`
    if (slide.items) content += `<ul>${slide.items.map(p => `<li>${esc(p)}</li>`).join('')}</ul>`

    return `<div class="${cls} ${layoutClass}" data-index="${i}">
      <div class="slide-content">${content}</div>
    </div>`
  }).join('\n')

  return wrapHtml(json, slidesHtml, `
body{background:#fff;color:#1e293b}
.slide-content{padding:0 40px}
h2{font-size:42px;font-weight:700;margin-bottom:32px;color:#0f172a;border-left:4px solid #3b82f6;padding-left:20px}
.subtitle{font-size:22px;color:#64748b;margin-top:-20px;margin-bottom:32px}
.body-text{font-size:20px;color:#475569;line-height:1.8}
ul{list-style:none;font-size:22px;line-height:2.2}
li{padding:4px 0}
li::before{content:'▸';color:#3b82f6;margin-right:14px;font-size:16px}
.layout-center .slide-content{text-align:center}
.layout-center h2{border-left:none;padding-left:0}
.layout-center ul{display:inline-block;text-align:left}
  `)
}