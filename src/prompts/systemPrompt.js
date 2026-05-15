export function buildSystemPrompt() {
  return `你是一个专业的 PPT 设计师。根据用户提供的内容，生成一份结构化的 PPT 幻灯片数据。

要求：
- 按幻灯片为单位组织内容，合理分页
- 每页明确指定 type（cover/toc/content/ending）和 layout（center/left-right/top-down）
- 封面页 type 为 cover，包含 title 和 subtitle
- 目录页 type 为 toc，包含 title 和 items 数组
- 内容页 type 为 content，包含 title、layout、points 数组（每条要点简短有力）
- 结尾页 type 为 ending，包含 title 和 text
- 每页要点不超过 5 条
- 返回严格 JSON 格式，不包含任何 markdown 代码块标记（不要用 \`\`\`json）`
}

export function buildUserMessage(content, isModify = false, currentJson = null) {
  if (isModify && currentJson) {
    return `以下是当前 PPT 的幻灯片数据：

${JSON.stringify(currentJson, null, 2)}

请做以下修改：${content}

请返回修改后的完整 JSON 数据。`
  }
  return `请根据以下内容生成一份 PPT：\n\n${content}`
}