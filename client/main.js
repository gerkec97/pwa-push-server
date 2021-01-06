
// Service Worker Registration
let swReg

const serverUrl = 'http://localhost:3333'

// Update UI for subscribed status
const setSubscribedStatus = (state) => {

  if (state) {
    document.getElementById('subscribe').className = 'hidden'
    document.getElementById('unsubscribe').className = ''
  } else {
    document.getElementById('subscribe').className = ''
    document.getElementById('unsubscribe').className = 'hidden'
  }
}

// Register Service Worker
navigator.serviceWorker.register('sw.js').then( registration => {

  // Reference registration globally
  swReg = registration

  // Check if a subscription exists, and if so, update the UI
  swReg.pushManager.getSubscription().then( setSubscribedStatus )

// Log errors
}).catch(console.error)

const getApplicationServerKey = () => {
  return fetch(`${serverUrl}/key`)
    .then(res => res.arrayBuffer())
    .then(buf => new Uint8Array(buf))
}

const unsubscribe = () => {
  swReg.pushManager.getSubscription().then(subscription => {
    subscription.unsubscribe().then(() => setSubscribedStatus(false))
  })
}

const subscribe = () => {

  if (!swReg) {
    console.error('ServiceWorker subscription not found')
  }

  getApplicationServerKey().then(applicationServerKey => (
    swReg.pushManager.subscribe({
      applicationServerKey,
      userVisibleOnly: true
    }).then(res => res.toJSON()).then(subscription => {
      fetch(`${serverUrl}/subscribe`, { method: 'POST', body: JSON.stringify(subscription) })
        .then(setSubscribedStatus)
        .catch(unsubscribe)
    }).catch(console.error)
  ))

}

// fetch('http://localhost:3333/key').then( res => res.text() ).then(console.log)
