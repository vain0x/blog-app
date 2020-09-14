type DisposeFn = () => void

const arrayDrain = <T>(array: T[]): T[] => array.splice(0, array.length)

export class Subscription {
  #isUnsubscribed = false

  readonly #disposeFns: DisposeFn[] = []

  subscribe(dispose: DisposeFn): void {
    if (!(dispose instanceof Function)) {
      throw new Error("can't subscribe non-function value")
    }

    if (this.#isUnsubscribed) {
      dispose()
      return
    }

    this.#disposeFns.push(dispose)
  }

  unsubscribe(): void {
    if (this.#isUnsubscribed) {
      return
    }

    this.#isUnsubscribed = true

    const errors: unknown[] = []
    const disposeFns = arrayDrain(this.#disposeFns)
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
