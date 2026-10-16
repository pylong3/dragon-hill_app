<script setup lang="ts">
import { ChromePicker } from 'vue-color'
import { ref } from 'vue'

const colorObj = ref({
  hex: '#000000',
  rgba: { r: 0, g: 0, b: 0, a: 1 },
})
</script>

<template>
  <div class="container">
    <div class="bubble">你好呀，这是左下角尾巴的气泡。</div>
  <br><br>
  <div class="bubble right">我是右下角尾巴。</div>
  <br><br>
  <div class="bubble top-left">我是左上角尾巴。</div>
  </div>
</template>

<style scoped>
 .container {
    background: #f0f0f0;
    padding: 60px;
    font-family: sans-serif;
  }

  .bubble {
    position: relative;
    background: #fff;
    border: 2px solid #333;
    border-radius: 16px;
    padding: 12px 18px;
    display: inline-block;
    max-width: 260px;
    font-size: 14px;
    line-height: 1.5;
  }

  .bubble::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    background: #fff;
    border-right: 2px solid #333;
    border-bottom: 2px solid #333;
    transform: rotate(45deg);
    bottom: -10px;
    left: 30px;
  }

  /* 右下角尾巴 */
  .bubble.right::after {
    left: auto;
    right: 30px;
  }

  /* 左上角尾巴 */
  .bubble.top-left::after {
    bottom: auto;
    top: -10px;
    border-right: none;
    border-bottom: none;
    border-left: 2px solid #333;
    border-top: 2px solid #333;
    transform: rotate(45deg);
  }</style>
