// HEIC decoding consumes significant CPU and memory; limit conversions across all gallery items.
const MAX_CONCURRENT = 2
let active = 0
const pending: Array<() => void> = []

function drain() {
  while (active < MAX_CONCURRENT && pending.length) {
    pending.shift()?.()
  }
}

export function scheduleHeicDecode<T>(
  task: () => Promise<T>,
  signal: AbortSignal
): Promise<T> {
  if (signal.aborted) return Promise.reject(signal.reason)

  return new Promise<T>((resolve, reject) => {
    const onAbort = () => {
      const index = pending.indexOf(start)
      if (index !== -1) {
        pending.splice(index, 1)
        reject(signal.reason)
      }
    }

    const start = () => {
      signal.removeEventListener('abort', onAbort)
      active++
      Promise.resolve()
        .then(() => {
          if (signal.aborted) throw signal.reason
          return task()
        })
        .then(resolve, reject)
        .finally(() => {
          active--
          drain()
        })
    }

    pending.push(start)
    signal.addEventListener('abort', onAbort, { once: true })
    drain()
  })
}
