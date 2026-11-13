import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

export function usePrefersReducedMotion(): Ref<boolean> {
  const reduced = ref(false)
  let media: MediaQueryList | null = null
  const update = () => {
    reduced.value = media?.matches ?? false
  }
  onMounted(() => {
    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    update()
    media.addEventListener('change', update)
  })
  onBeforeUnmount(() => media?.removeEventListener('change', update))
  return reduced
}

/** True while the element is on screen. Animations only run when visible. */
export function useInView(target: Ref<Element | null | undefined>, threshold = 0.25): Ref<boolean> {
  const inView = ref(false)
  let observer: IntersectionObserver | null = null
  onMounted(() => {
    if (!target.value) return
    observer = new IntersectionObserver(
      ([entry]) => {
        inView.value = entry?.isIntersecting ?? false
      },
      { threshold },
    )
    observer.observe(target.value)
  })
  onBeforeUnmount(() => observer?.disconnect())
  return inView
}

/** Becomes true the first time the element is on screen and stays true. */
export function useSeenOnce(target: Ref<Element | null | undefined>, threshold = 0.25): Ref<boolean> {
  const inView = useInView(target, threshold)
  const seen = ref(false)
  watch(inView, (v) => {
    if (v) seen.value = true
  })
  return seen
}

/**
 * Steps through a scripted preview while it is visible.
 * `durations[i]` is how long step i is held. With reduced motion the
 * preview rests on `restStep` so the card still tells its story.
 */
export function useStepLoop(
  target: Ref<Element | null | undefined>,
  durations: number[],
  restStep = durations.length - 1,
): Ref<number> {
  const step = ref(0)
  const inView = useInView(target, 0.35)
  const reduced = usePrefersReducedMotion()
  let timer: ReturnType<typeof setTimeout> | undefined

  const stop = () => {
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined
  }
  const schedule = () => {
    stop()
    timer = setTimeout(() => {
      step.value = (step.value + 1) % durations.length
      schedule()
    }, durations[step.value])
  }

  watch(
    [inView, reduced],
    ([visible, isReduced]) => {
      if (isReduced) {
        stop()
        step.value = restStep
      } else if (visible) {
        schedule()
      } else {
        stop()
      }
    },
  )
  onMounted(() => {
    step.value = 0
  })
  onBeforeUnmount(stop)
  return step
}

/**
 * Replays an animation every `period` ms while the element is visible.
 * The markup must already show the final frame: with reduced motion `play`
 * is never called, so the diagram simply stays at rest.
 */
export function useReplay(target: Ref<Element | null | undefined>, period: number, play: () => void) {
  const inView = useInView(target, 0.35)
  const reduced = usePrefersReducedMotion()
  let timer: ReturnType<typeof setInterval> | undefined
  const stop = () => {
    if (timer !== undefined) clearInterval(timer)
    timer = undefined
  }
  watch([inView, reduced], ([visible, isReduced]) => {
    stop()
    if (visible && !isReduced) {
      play()
      timer = setInterval(play, period)
    }
  })
  onBeforeUnmount(stop)
}
