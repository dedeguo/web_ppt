<script setup>
import PptIframe from './PptIframe.vue'
import SlideControls from './SlideControls.vue'
import FeedbackBar from './FeedbackBar.vue'
</script>

<template>
  <div class="preview-panel-inner">
    <PptIframe />
    <SlideControls />
    <FeedbackBar />
  </div>
</template>

<style scoped>
.preview-panel-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>