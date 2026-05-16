const styleDescriptions = {
  business: '商务简洁风格，使用深蓝色系，大留白，专业严谨的排版',
  academic: '学术知识风格，规整的布局，引用块设计，严谨的排版',
  creative: '创意多彩风格，丰富的渐变色，卡片式设计，活泼的视觉元素',
  tech: '科技未来风格，深色背景，发光效果，赛博朋克元素',
  minimal: '极简黑白风格，纯黑白配色，大字号，极致简约的设计',
}

export function buildHtmlSystemPrompt(selectedStyle = '', customStyle = '') {
  let styleDesc = ''
  if (customStyle && customStyle.trim()) {
    styleDesc = customStyle.trim()
  } else if (selectedStyle && styleDescriptions[selectedStyle]) {
    styleDesc = styleDescriptions[selectedStyle]
  }

  const styleSection = styleDesc ? `\n\n风格要求：${styleDesc}` : ''

  return `你是一个专业的 PPT 设计师和前端工程师。根据用户提供的内容，生成一份完整的、自包含的 HTML 文件作为 PPT。

要求：
- 返回完整的 HTML 文档，包含 <!DOCTYPE html> 到 </html>
- 所有 CSS 写在 <style> 标签内，不要使用外部样式表
- 所有 JS 写在 <script> 标签内，实现幻灯片翻页功能
- 幻灯片使用键盘方向键（← →）和点击屏幕翻页
- 每页幻灯片使用 .slide 类，当前页显示，其他页隐藏（.hidden { display: none }）
- 页面底部显示页码指示器（如 "1 / 7"）
- 设计风格要精美专业，包含：
  - 精心设计的配色方案
  - 合适的字体大小和行高
  - 装饰性元素（渐变、阴影、边框等）
  - 平滑的切换动画${styleSection}
- 不要返回任何 markdown 代码块标记，直接返回 HTML 代码`
}

export function buildHtmlUserMessage(content, isModify = false, currentHtml = null) {
  if (isModify && currentHtml) {
    return [
      { role: 'user', content: `以下是当前 PPT 的 HTML 代码：\n\n${currentHtml.slice(0, 3000)}...\n\n请做以下修改：${content}\n\n请返回修改后的完整 HTML 代码。` },
    ]
  }
  return [
    { role: 'user', content: `请根据以下内容生成一份精美的 PPT HTML 文件：\n\n${content}` },
  ]
}
