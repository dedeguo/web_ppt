export function esc(text) {
  if (!text) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function wrapHtml(json, slidesHtml, extraCss = '', extraBodyClass = '') {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(json.title || 'PPT')}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;overflow:hidden}
.slide{position:absolute;top:0;left:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;opacity:1;transition:opacity .4s,transform .4s}
.slide.hidden{display:none}
.slide-content{max-width:900px;width:80%}
.page-indicator{position:fixed;bottom:24px;right:32px;color:#94a3b8;font-size:14px;z-index:100}
${extraCss}
</style>
</head>
<body${extraBodyClass ? ` class="${extraBodyClass}"` : ''}>
${slidesHtml}
<div class="page-indicator" id="pn">1 / ${json.slides.length}</div>
<script>
let c=0;const s=document.querySelectorAll('.slide');
function sh(i){s.forEach((x,j)=>x.classList.toggle('hidden',j!==i));document.getElementById('pn').textContent=(i+1)+' / '+s.length}
function next(){c=Math.min(c+1,s.length-1);sh(c)}
function prev(){c=Math.max(c-1,0);sh(c)}
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' '){e.preventDefault();next()}else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();prev()}})
document.addEventListener('click',()=>next())
</script>
</body>
</html>`
}