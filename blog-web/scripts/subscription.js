/* eslint-disable no-undef */

module.exports.Subscription = class Subscription {
  constructor() {
    this.isUnsubscribed = false
    this.disposeFns = []
  }

  subscribe(dispose) {
    if (!(dispose instanceof Function)) {
      throw new Error("expected a function to subscribe")
    }

    if (this.isUnsubscribed) {
      dispose()
      return
    }

    this.disposeFns.push(dispose)
  }

  unsubscribe() {
    if (this.isUnsubscribed) {
      return
    }

    this.isUnsubscribed = true

    const errors = []
    const disposeFns = arrayDrain(this.disposeFns)
    for (const dispose of disposeFns) {
      try {
        dispose()
      } catch (err) {
        errors.push(err)
      }
    }

    if (errors.length !== 0) {
      if (errors.length === 1) {
        throw errors[0]
      }
      throw errors
    }
  }
}

const arrayDrain = array => array.splice(0, array.length)
