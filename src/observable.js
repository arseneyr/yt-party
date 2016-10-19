import { Observable } from 'rxjs'

export function throttleTimeDistinct (duration, compare) {
  return Observable.create(subscriber => {
    const source = this

    let timer = null
    let previous = null

    const realCompare = typeof compare === 'function' ? compare : (x,y) => (x === y)

    const subscription = source.subscribe(value => {
      if (!timer) {
        timer = setTimeout(() => (timer = null), duration)
        subscriber.next(value)
      } else {
        try {
          if (!realCompare(previous, value)) {
            clearTimeout(timer)
            timer = setTimeout(() => (timer = null), duration)
            subscriber.next(value)
          }
        } catch (err) {
          subscriber.error(err)
        }
      }

      previous = value
    },
    err => subscriber.error(err),
    () => subscriber.complete())

    return () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }

      return subscription.unsubscribe()
    }
  })
}