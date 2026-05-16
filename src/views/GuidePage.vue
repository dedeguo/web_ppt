<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push({ name: 'HtmlMode' })
}
</script>

<template>
  <div class="guide-page">
    <div class="guide-content">
      <h1>Web PPT 使用说明</h1>

      <section>
        <h2>快速开始</h2>
        <ol>
          <li>在左侧文本框中输入 PPT 内容（至少 10 个字符），或上传 <code>.txt</code> / <code>.md</code> / <code>.docx</code> 文件</li>
          <li>从下拉框选择 PPT 风格，或选择「自定义...」输入自定义风格描述</li>
          <li>点击「生成 PPT」按钮</li>
          <li>AI 生成完成后，PPT 在右侧预览区展示</li>
        </ol>
      </section>

      <section>
        <h2>翻页操作</h2>
        <ul>
          <li>使用键盘 <strong>← →</strong> 方向键翻页</li>
          <li>或<strong>点击屏幕</strong>翻页</li>
        </ul>
      </section>

      <section>
        <h2>修改 PPT</h2>
        <p>在底部输入框输入修改意见（如「把标题颜色改成红色，增加动画效果」），按回车或点击「发送修改意见」按钮，AI 会重新生成调整后的 PPT。</p>
      </section>

      <section>
        <h2>全屏预览</h2>
        <p>点击右下角的 <strong></strong> 按钮进入全屏模式，隐藏左侧面板和底部工具栏，PPT 占满整个窗口。按 <strong>ESC</strong> 退出全屏。</p>
      </section>

      <section>
        <h2>下载 PPT</h2>
        <p>点击右下角的 <strong>⬇</strong> 按钮，将 PPT 保存为独立的 HTML 文件，双击即可在浏览器中演示。</p>
      </section>

      <section>
        <h2>两种模式</h2>
        <ul>
          <li><strong>HTML 模式</strong>（默认）：AI 直接生成完整 HTML，风格表现力更强</li>
          <li><strong>JSON 模式</strong>（路径 <code>/json</code>）：AI 返回结构化 JSON，由前端模板渲染</li>
        </ul>
      </section>

      <section>
        <h2>PPT 风格</h2>
        <table>
          <thead>
            <tr><th>风格</th><th>视觉特征</th></tr>
          </thead>
          <tbody>
            <tr><td>商务简洁</td><td>深蓝色系、大留白、专业严谨的排版</td></tr>
            <tr><td>学术知识</td><td>规整布局、引用块设计、严谨排版</td></tr>
            <tr><td>创意多彩</td><td>丰富渐变色、卡片式设计、活泼视觉元素</td></tr>
            <tr><td>科技未来</td><td>深色背景、发光效果、赛博朋克元素</td></tr>
            <tr><td>极简黑白</td><td>纯黑白配色、大字号、极致简约设计</td></tr>
            <tr><td>自定义</td><td>输入任意风格描述，AI 自由发挥</td></tr>
          </tbody>
        </table>
      </section>

      <div class="guide-footer">
        <button class="back-btn" @click="goHome">开始使用</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guide-page {
  flex: 1;
  overflow-y: auto;
  background: #f8fafc;
}

.guide-content {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 24px;
}

h1 {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 32px;
}

section {
  margin-bottom: 28px;
}

h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

p, li {
  font-size: 14px;
  line-height: 1.7;
  color: #475569;
}

code {
  padding: 2px 6px;
  background: #f1f5f9;
  border-radius: 4px;
  font-size: 13px;
  color: #334155;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th, td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background: #f8fafc;
  font-weight: 600;
  color: #1e293b;
}

td {
  color: #475569;
}

.guide-footer {
  margin-top: 40px;
  text-align: center;
}

.back-btn {
  padding: 10px 32px;
  border: none;
  border-radius: 8px;
  background: #3b82f6;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #2563eb;
}
</style>