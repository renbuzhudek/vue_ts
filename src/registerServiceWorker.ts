/* tslint:disable:no-console */
interface Subscription {
[key: string]: any
}
interface SwRegistration {
  pushManager: {
    subscribe: (a: {userVisibleOnly: boolean}) =>  Promise<() => void>
  }
}
import { register } from 'register-service-worker'
const swUrl = process.env.NODE_ENV === 'production' ?  'service-worker.js' : 'sw.js'

register(`${process.env.BASE_URL}${swUrl}`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB',
      )
    },
    registered(swReg) {
      console.log('Service worker has been registered.')

      if ('PushManager' in window) {
        swReg.pushManager.getSubscription().then((subscription: Subscription) => {
          // 如果用户没有订阅
          if (!subscription) {
              subscribeUser(swReg) // 订阅操作
          } else {
              console.log('You have subscribed our notification--------', subscription)
          }
      })
    }
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
    },
    updated() {
      console.log('New content is available; please refresh.')
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    },
  })
// 订阅
function subscribeUser(swRegistration: SwRegistration) {


    swRegistration.pushManager.subscribe({
        userVisibleOnly: true
    })
    // 用户同意
    .then(function(subscription: Subscription) {
        console.log('User is subscribed:', (subscription))
        fetch('http://data.xxx.com/Admin/Login/login', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify(subscription)
          }).then(function(response) {
            console.log(response)
          })
    })
    // 用户不同意或者生成失败
    .catch(function(err) {
        console.log('Failed to subscribe the user: ', err)
    })
}
