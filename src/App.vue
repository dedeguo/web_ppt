<script setup>
</script>

<template>
  <div class="app-container">
    <aside class="side-panel">
      <h2>Web PPT</h2>
    </aside>
    <main class="preview-panel">
      <div class="placeholder">在左侧输入内容，选择风格，点击生成 PPT</div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}

.side-panel {
  width: 360px;
  min-width: 360px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 16px;
  overflow-y: auto;
}

.side-panel h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.preview-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.placeholder {
  color: #94a3b8;
  font-size: 16px;
}
</style>