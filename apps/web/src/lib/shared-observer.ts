type ObserverCallback = (isIntersecting: boolean) => void

const observerMap = new Map<string, IntersectionObserver>()
const callbackMap = new WeakMap<Element, ObserverCallback>()

function getObserver(threshold: number): IntersectionObserver {
  const key = `${threshold}`
  let observer = observerMap.get(key)
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cb = callbackMap.get(entry.target)
          if (cb) cb(entry.isIntersecting)
        })
      },
      { threshold }
    )
    observerMap.set(key, observer)
  }
  return observer
}

export function observe(el: Element, callback: ObserverCallback, threshold = 0): () => void {
  callbackMap.set(el, callback)
  const observer = getObserver(threshold)
  observer.observe(el)
  return () => {
    observer.unobserve(el)
    callbackMap.delete(el)
  }
}
