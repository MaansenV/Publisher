// Landing page engine — refactored from the original self-executing IIFE
// into an SSR-safe init/destroy pair. No top-level browser access: importing
// this module during the VitePress SSR build runs nothing (the IIFE is gone),
// so it never touches `window`/`document`/canvas until initLanding() is called
// from LandingInit.vue's onMounted (client-only).
//
// Fails open: if init throws or elements are missing, the boot overlay
// auto-dismisses via CSS and hero content stays visible.
//
// Cleanup tracks every RAF, timeout, observer and listener through central
// registries so SPA navigation away from the landing leaves no orphaned
// animation loops or duplicate handlers.

type AnyEl = Element | Window | Document

export function initLanding(): () => void {
  // SSR / non-browser guard.
  if (typeof window === 'undefined') return () => {}

  const cleanups: Array<() => void> = []
  const timers: number[] = []
  let rafDraw = 0
  let rafRing = 0
  let destroyed = false
  let observer: IntersectionObserver | null = null

  // Central listener registry — every removeEventListener flows from here.
  function on(el: AnyEl, type: string, fn: EventListener, opts?: AddEventListenerOptions): void {
    el.addEventListener(type, fn, opts)
    cleanups.push(() => el.removeEventListener(type, fn, opts))
  }
  // Central timeout registry — every setTimeout is cancellable on destroy.
  function later(fn: () => void, ms: number): number {
    const id = window.setTimeout(fn, ms)
    timers.push(id)
    return id
  }

  try {
    // Mark JS active so CSS gates entrance animations. Idempotent on re-mount.
    document.documentElement.classList.add('js')

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches

    // ================================================================
    // BOOT SEQUENCE — console types init lines, bar fills in parallel,
    // hero reveals when both finish. Click-to-skip. Two-flag dismiss.
    // CSS hard cap: 2.5s on .booting, 3s no-JS fallback.
    // ================================================================
    const bootOverlay = document.getElementById('boot-overlay')
    const bootText = document.getElementById('boot-text')
    const heroEl = document.querySelector('.hero')

    const bootLines = ['> initializing publisher system...', '> catalog: 1 asset online']
    let typingDone = false
    let barDone = false
    let dismissed = false

    function tryDismiss(): void {
      if (typingDone && barDone && !dismissed) {
        dismissed = true
        if (bootOverlay) bootOverlay.classList.add('boot-done')
        later(() => {
          if (bootOverlay) bootOverlay.style.display = 'none'
        }, 400)
        if (heroEl) heroEl.classList.add('hero-ready')
      }
    }

    function dismissBoot(): void {
      dismissed = true
      if (bootOverlay) bootOverlay.classList.add('boot-done')
      later(() => {
        if (bootOverlay) bootOverlay.style.display = 'none'
      }, 400)
      if (heroEl) heroEl.classList.add('hero-ready')
    }

    if (bootOverlay) on(bootOverlay, 'click', dismissBoot)

    function startBoot(): void {
      if (!bootOverlay || reducedMotion) {
        dismissBoot()
        return
      }

      bootOverlay.classList.add('booting')
      let lineIdx = 0
      let charIdx = 0
      let currentText = ''

      function typeNext(): void {
        if (destroyed) return
        if (lineIdx >= bootLines.length) {
          typingDone = true
          tryDismiss()
          return
        }
        const line = bootLines[lineIdx]
        if (charIdx < line.length) {
          currentText += line[charIdx]
          if (bootText) bootText.textContent = currentText
          charIdx++
          later(typeNext, 8 + Math.random() * 14)
        } else {
          currentText += '\n'
          if (bootText) bootText.textContent = currentText
          charIdx = 0
          lineIdx++
          later(typeNext, 60)
        }
      }

      // CSS drives the bar fill (0.9s); JS timer gates barDone for the
      // two-flag dismiss pattern.
      later(() => {
        barDone = true
        tryDismiss()
      }, 950)

      later(typeNext, 100)
    }

    // ================================================================
    // ENGINE CANVAS — rotating icosahedron wireframe. DPR-aware.
    // ================================================================
    const canvas = document.getElementById('engine-canvas') as HTMLCanvasElement | null
    let ctx: CanvasRenderingContext2D | null = null
    let w = 0,
      h = 0,
      cx = 0,
      cy = 0,
      dpr = 1
    let angle = 0
    let targetMouseX = 0,
      targetMouseY = 0,
      mouseX = 0,
      mouseY = 0
    let scrollOffset = 0

    const phi = (1 + Math.sqrt(5)) / 2
    const verts = [
      [-1, phi, 0],
      [1, phi, 0],
      [-1, -phi, 0],
      [1, -phi, 0],
      [0, -1, phi],
      [0, 1, phi],
      [0, -1, -phi],
      [0, 1, -phi],
      [phi, 0, -1],
      [phi, 0, 1],
      [-phi, 0, -1],
      [-phi, 0, 1]
    ]
    for (let i = 0; i < verts.length; i++) {
      const len = Math.sqrt(
        verts[i][0] * verts[i][0] + verts[i][1] * verts[i][1] + verts[i][2] * verts[i][2]
      )
      verts[i][0] /= len
      verts[i][1] /= len
      verts[i][2] /= len
    }
    const edges = [
      [0, 1], [0, 5], [0, 7], [0, 10], [0, 11], [1, 5], [1, 7], [1, 8], [1, 9],
      [2, 3], [2, 4], [2, 6], [2, 10], [2, 11], [3, 4], [3, 6], [3, 8], [3, 9],
      [4, 5], [4, 9], [4, 11], [5, 9], [5, 11], [6, 7], [6, 8], [6, 10],
      [7, 8], [7, 10], [8, 9], [9, 11], [10, 11]
    ]

    if (canvas) ctx = canvas.getContext('2d')

    function resize(): void {
      if (!canvas || !ctx) return
      dpr = window.devicePixelRatio || 1
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function project(v: number[], rotY: number, rotX: number): number[] {
      const x1 = v[0] * Math.cos(rotY) - v[2] * Math.sin(rotY)
      const z1 = v[0] * Math.sin(rotY) + v[2] * Math.cos(rotY)
      const y1 = v[1]
      const y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX)
      const z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX)
      const persp = 3 / (3 - z2 * 0.4)
      const scale = Math.min(w, h) * 0.22
      return [cx + x1 * scale * persp, cy + y2 * scale * persp, z2]
    }

    function draw(): void {
      if (destroyed || !ctx) return
      ctx.clearRect(0, 0, w, h)

      cx = w > 768 ? w * 0.7 : w / 2
      cy = h * 0.42 - scrollOffset * 0.3

      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05

      const rotY = angle + mouseX * 0.5
      const rotX = angle * 0.6 + mouseY * 0.3

      const projected: number[][] = []
      for (let i = 0; i < verts.length; i++) {
        projected.push(project(verts[i], rotY, rotX))
      }

      for (let e = 0; e < edges.length; e++) {
        const a = projected[edges[e][0]]
        const b = projected[edges[e][1]]
        const avgZ = (a[2] + b[2]) / 2
        const alpha = Math.max(0.04, Math.min(0.5, 0.3 - avgZ * 0.15))
        ctx.beginPath()
        ctx.moveTo(a[0], a[1])
        ctx.lineTo(b[0], b[1])
        ctx.strokeStyle = 'rgba(255, 229, 0, ' + alpha + ')'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      for (let v = 0; v < projected.length; v++) {
        const p = projected[v]
        const vAlpha = Math.max(0.2, Math.min(1, 0.6 - p[2] * 0.3))
        ctx.fillStyle = 'rgba(245, 245, 240, ' + vAlpha + ')'
        ctx.fillRect(p[0] - 2.5, p[1] - 2.5, 5, 5)
      }

      angle += 0.004
      rafDraw = requestAnimationFrame(draw)
    }

    // ================================================================
    // CUSTOM CURSOR — dot + ring with hover detection. pointer:fine only.
    // ================================================================
    const cursorDot = document.getElementById('cursor-dot')
    const cursorRing = document.getElementById('cursor-ring')

    if (finePointer && !reducedMotion && cursorDot && cursorRing) {
      let tx = 0,
        ty = 0,
        ringX = 0,
        ringY = 0

      on(document, 'mousemove', ((e: MouseEvent) => {
        tx = e.clientX
        ty = e.clientY
        cursorDot.style.transform = 'translate(' + (tx - 3) + 'px, ' + (ty - 3) + 'px)'
      }) as EventListener)

      function animateRing(): void {
        if (destroyed) return
        ringX += (tx - ringX) * 0.15
        ringY += (ty - ringY) * 0.15
        cursorRing.style.transform =
          'translate(' +
          (ringX - 16) +
          'px, ' +
          (ringY - 16) +
          'px)' +
          (cursorRing.classList.contains('hover') ? ' scale(1.5)' : '')
        rafRing = requestAnimationFrame(animateRing)
      }
      rafRing = requestAnimationFrame(animateRing)

      const hoverables = document.querySelectorAll('a, button, [data-tilt]')
      hoverables.forEach((el) => {
        on(el, 'mouseenter', (() => {
          cursorRing.classList.add('hover')
        }) as EventListener)
        on(el, 'mouseleave', (() => {
          cursorRing.classList.remove('hover')
        }) as EventListener)
      })
    }

    // ================================================================
    // 3D TILT — cards respond to mouse position with smooth ease-back.
    // ================================================================
    if (finePointer && !reducedMotion) {
      const tiltCards = document.querySelectorAll('[data-tilt]')
      tiltCards.forEach((card) => {
        const el = card as HTMLElement
        el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        on(el, 'mousemove', ((e: MouseEvent) => {
          const rect = el.getBoundingClientRect()
          const x = (e.clientX - rect.left) / rect.width - 0.5
          const y = (e.clientY - rect.top) / rect.height - 0.5
          el.style.transition = 'none'
          el.style.transform =
            'perspective(800px) rotateY(' + x * 6 + 'deg) rotateX(' + -y * 6 + 'deg)'
        }) as EventListener)
        on(el, 'mouseleave', (() => {
          el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          el.style.transform = 'perspective(800px) rotateY(0) rotateX(0)'
        }) as EventListener)
      })
    }

    // ================================================================
    // SCROLL + MOUSE — wireframe reacts to scroll and mouse.
    // ================================================================
    on(window, 'scroll', (() => {
      scrollOffset = window.scrollY
    }) as EventListener, { passive: true })

    on(window, 'mousemove', ((e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }) as EventListener)

    // ================================================================
    // SCROLL REVEAL — sections fade in on enter.
    // ================================================================
    const revealEls = document.querySelectorAll('.section, .coming-soon, .console-panel, .dossier-prose')
    if ('IntersectionObserver' in window && !reducedMotion) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const t = entry.target as HTMLElement
              t.style.opacity = '1'
              t.style.transform = 'translateY(0)'
              observer?.unobserve(t)
            }
          })
        },
        { threshold: 0.1 }
      )

      revealEls.forEach((el) => {
        const t = el as HTMLElement
        t.style.opacity = '0'
        t.style.transform = 'translateY(24px)'
        t.style.transition =
          'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        observer?.observe(t)
      })
    }

    // ================================================================
    // FORM — copy subject input into _subject hidden field on submit.
    // ================================================================
    const contactForm = document.querySelector('.contact-form')
    if (contactForm) {
      on(contactForm, 'submit', (() => {
        const subjectInput = document.getElementById('form-subject') as HTMLInputElement | null
        const hiddenSubject = contactForm.querySelector('[name="_subject"]') as HTMLInputElement | null
        if (subjectInput && hiddenSubject) {
          hiddenSubject.value = subjectInput.value || 'New message from Publisher page'
        }
      }) as EventListener)
    }

    // ================================================================
    // INIT
    // ================================================================
    if (!reducedMotion) {
      resize()
      on(window, 'resize', resize)
      if (canvas && ctx) rafDraw = requestAnimationFrame(draw)
      startBoot()
    } else {
      if (canvas) canvas.style.display = 'none'
      if (bootOverlay) bootOverlay.style.display = 'none'
      if (heroEl) heroEl.classList.add('hero-ready')
    }
  } catch (err) {
    // Fails open: log but never crash the SPA. CSS boot-fade-out (3s)
    // dismisses the overlay regardless; hero is visible without .hero-ready
    // under reduced-motion overrides.
    console.error('[landing] init failed — failing open', err)
  }

  return function destroyLanding(): void {
    if (destroyed) return
    destroyed = true
    // Set the flag first so any in-flight RAF/timeout callback bails before
    // we cancel — cancel stops future frames, the flag stops the current one.
    cancelAnimationFrame(rafDraw)
    cancelAnimationFrame(rafRing)
    for (const id of timers) clearTimeout(id)
    timers.length = 0
    if (observer) observer.disconnect()
    for (const fn of cleanups) {
      try {
        fn()
      } catch {
        /* best-effort teardown */
      }
    }
    cleanups.length = 0
  }
}
