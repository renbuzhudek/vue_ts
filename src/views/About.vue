<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="clickhandle">点击发送postmessage</button>
    <button @click="notifyMe()">Notify me!</button>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({

})
export default class About extends Vue {

  public mounted() {
    console.log('about 挂载!!!!!!!!!!')
    window.navigator.serviceWorker.addEventListener('message', function(event) {
  console.log('客户端收到message:', event.data)

 })
  }
   private clickhandle(): void {
    window.navigator.serviceWorker.controller && window.navigator.serviceWorker.controller.postMessage('sw.你听得到吗？')

  }
  private notifyMe(): void {
  // 先检查浏览器是否支持
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification')
  } else if (Notification.permission === 'granted') {
    // If it's okay let's create a notification
    const notification = new Notification('Hi there!')
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // 如果用户同意，就可以向他们发送通知
      if (permission === 'granted') {
        const notification = new Notification('Hi there!')
      }
    })
  }


  // 最后，如果执行到这里，说明用户已经拒绝对相关通知进行授权
  // 出于尊重，我们不应该再打扰他们了
}
}
</script>
