const INTRO_EVENT = 'laye:intro-complete'

interface IntroWindow extends Window {
  __layeIntroComplete?: boolean
}

export function markIntroComplete() {
  if (typeof window === 'undefined') return
  ;(window as IntroWindow).__layeIntroComplete = true
  window.dispatchEvent(new Event(INTRO_EVENT))
}

export function onIntroComplete(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  if ((window as IntroWindow).__layeIntroComplete) {
    callback()
    return () => {}
  }
  window.addEventListener(INTRO_EVENT, callback, { once: true })
  return () => window.removeEventListener(INTRO_EVENT, callback)
}
