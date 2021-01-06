const webpush = require('web-push')
const urlsafeBase64 = require('urlsafe-base64')
const Storage = require('node-storage')
const vapid = require('./vapid.json')

webpush.setVapidDetails(
  'mailto:lightninggk@gmail.com',
  vapid.publicKey,
  vapid.privateKey
)

const store = new Storage(`${__dirname}/db`)
const subscriptions = store.get('subscriptions') || []


module.exports.getKey = () => urlsafeBase64.decode(vapid.publicKey)

module.exports.addSubscription = (subscription) => {
  subscriptions.push(subscription)
  store.put('subscriptions', subscriptions)
}

module.exports.send = (message) => {
  subscriptions.forEach(subscription => {
    webpush.sendNotification(subscription, message).catch(console.error)
  })
}