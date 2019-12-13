// 强制刷新，但是会有一些问题 https://blog.csdn.net/VhWfR2u02Q/article/details/84801178
this.addEventListener('install',function(event){
  this.skipWaiting();
});
this.addEventListener('activate', function (event) {
  this.clients.claim();
});

// 客户端发出的请求会触发fetch事件
self.addEventListener('fetch', function (event) {
  event.respondWith(
      caches.match(event.request).then(function (response) {
        // console.log('response------------',response);
        
          // 来来来，代理可以搞一些代理的事情

          // 如果 Service Worker 有自己的返回，就直接返回，减少一次 http 请求
          if (response) {
              return response;
          }

          // 如果 service worker 没有返回，那就得直接请求真实远程服务
          var request = event.request.clone(); // 把原始请求拷过来
          return fetch(request).then(function (httpRes) {

              // http请求的返回已被抓到，可以处置了。

              // 请求失败了，直接返回失败的结果就好了。。
              if (!httpRes || httpRes.status !== 200) {
                  return httpRes;
              }

              // 请求成功的话，将请求缓存起来。
              var responseClone = httpRes.clone();
              caches.open('my-test-cache-v1').then(function (cache) {
                  cache.put(event.request, responseClone);
              });

              return httpRes;
          });
      })
  )
});
// 收到来自客户端的postmessage时触发
self.addEventListener('message', function (event) {
  console.log('service-worker收到message:',event.data); // 输出：'sw.updatedone'
  self.registration.showNotification('service-worker发出了一个通知！')
  this.setTimeout(()=>{
    self.clients.matchAll()
    .then(function (clients) {
        if (clients && clients.length) {
            clients.forEach(function (client) {
                // 向所有匹配的客户端页面发送postmessage
                client.postMessage('client,我收到了！谢谢！');
            })
        }
    })
  },1000)
});
// 监听sw发出的通知被点击的事件
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.',clients);

  event.notification.close();  // 关闭这个通知

  event.waitUntil(
      clients.openWindow('https://developers.google.com/web/')    // 打开一个标签
  )
})