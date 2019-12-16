/* tslint:disable:no-console */
interface Subscription {
[key: string]: any
}
interface SwRegistration {
  pushManager: {
    subscribe: (a: {userVisibleOnly: boolean,  applicationServerKey: Uint8Array}) =>  Promise<() => void>
  }
}
import { register } from 'register-service-worker'
const swUrl = process.env.NODE_ENV === 'production' ?  'service-worker.js' : 'sw.js'
// 公钥
const applicationServerPublicKey = 'BIQA_i7CDy9RkhfwGOJqNZUBiQsHuwYjHyPWXwU_MxG1HL-fu7dqSVRfXKnwHTpUFdbs2TVKobHD_S1brMptq20'
// 私钥
const applicationServerPrivateKey = '8HKCufmWI7rDerV_hXEfMrn6VBo-vVD-mhTaov23PJc'
let swRegistration: SwRegistration
register(`${process.env.BASE_URL}${swUrl}`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB',
      )
    },
    registered(swReg) {
      console.log('Service worker has been registered.')
      swRegistration = swReg
      if ('PushManager' in window) {
        swReg.pushManager.getSubscription().then((subscription: Subscription) => {
          // 如果用户没有订阅
          if (!subscription) {
              subscribeUser(swReg) // 订阅操作
          } else {
              console.log('您已经订阅我们的通知--------', subscription)
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
// tslint:disable-next-line:no-shadowed-variable
function subscribeUser(swRegistration: SwRegistration) {

  const applicationServerKey: Uint8Array = urlB64ToUint8Array(applicationServerPublicKey)
  swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
    })
    // 用户同意
    .then(function(subscription: Subscription) {
        console.log('用户同意订阅:', (subscription))
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
        console.log('订阅失败：', err)
    })
}
function urlB64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
