"use client"

import { useEffect, useRef, useState, useCallback } from "react"

/* ── types ── */
interface Star {
  x: number; y: number; r: number; baseAlpha: number; speed: number; phase: number
}
interface Particle {
  x: number; y: number; vx: number; vy: number; size: number
  alpha: number; life: number; maxLife: number; color: string; rotation: number; rotSpeed: number
}

interface HeartToHeartProps {
  message: string
  senderName: string
  recipientName: string
}

/* ── palette (unchanged) ── */
const SKY_BG        = "#fff5f7"
const SKY_MID       = "#ffe8ee"
const SKY_TOP       = "#ffd6e0"
const GROUND_A      = "rgba(255,210,220,0)"
const GROUND_B      = "rgba(255,190,205,0.35)"
const GROUND_C      = "rgba(248,175,195,0.55)"
const HORIZON_COLOR = "rgba(236,112,140,0.12)"
const STAR_COLOR    = "rgba(236,112,140,"
const HEART_CORE    = "232,88,122"
const HEART_MID     = "255,143,163"
const HEART_OUTER   = "255,200,215"
const THREAD_A      = "rgba(232,88,122,"
const THREAD_BRIGHT = "rgba(255,160,180,"
const PULSE_COLOR   = "rgba(255,200,220,"
const VIG_COLOR     = "rgba(255,240,245,"

/* ── draw heart shape (unchanged) ── */
function heartPath(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath()
  ctx.moveTo(0, -s * 0.35)
  ctx.bezierCurveTo(-s, -s * 1.2, -s * 1.8, -s * 0.1, 0, s * 0.9)
  ctx.bezierCurveTo(s * 1.8, -s * 0.1, s, -s * 1.2, 0, -s * 0.35)
  ctx.closePath()
}

export default function HeartToHeart({
  message,
  senderName,
  recipientName,
}: HeartToHeartProps) {

  /* ── dynamic lines using your file variables ── */
  const LINES = [
    `${recipientName},`,
    message,
    `With all my love,`,
    `${senderName}`,
  ]

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const heartsRef = useRef<Particle[]>([])
  const timeRef = useRef(0)
  const [visibleLines, setVisibleLines] = useState(0)
  const [showTagline, setShowTagline] = useState(false)

  /* ── text timers (unchanged) ── */
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 2000 + i * 1200))
    })
    timers.push(
      setTimeout(() => setShowTagline(true), 2000 + LINES.length * 1200 + 800)
    )
    return () => timers.forEach(clearTimeout)
  }, [LINES.length])


  /* ── init stars ── */
  const initStars = useCallback((w: number, h: number) => {
    const count = Math.floor((w * h) / 3200)
    starsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.78,
      r: Math.random() * 1.6 + 0.2,
      baseAlpha: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [])

  /* ── spawn a floating heart from left figure toward right ── */
  const spawnHeart = useCallback((w: number, h: number) => {
    const leftX = w * 0.2
    const rightX = w * 0.8
    const groundY = h * 0.78
    const startY = groundY - h * 0.18
    const colors = [HEART_CORE, HEART_MID, "255,105,140", "250,180,200"]

    // direction: from left figure toward right figure, with arc upward
    const dx = rightX - leftX
    const speed = Math.random() * 0.6 + 0.4

    heartsRef.current.push({
      x: leftX + (Math.random() - 0.5) * 20,
      y: startY + (Math.random() - 0.5) * 15,
      vx: (dx / 600) * speed,
      vy: -(Math.random() * 1.2 + 0.5),
      size: Math.random() * 7 + 4,
      alpha: 0,
      life: 0,
      maxLife: Math.random() * 180 + 140,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
    })
  }, [])

  /* ── main canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let animId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars(canvas.width, canvas.height)
    }

    /* stars */
    const drawStars = (t: number) => {
      for (const s of starsRef.current) {
        const twinkle = Math.sin(t * s.speed + s.phase) * 0.35 + 0.65
        const a = s.baseAlpha * twinkle
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `${STAR_COLOR}${a})`
        ctx.fill()
        if (s.r > 1.2) {
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3)
          g.addColorStop(0, `${STAR_COLOR}${a * 0.18})`)
          g.addColorStop(1, `${STAR_COLOR}0)`)
          ctx.fillStyle = g
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2); ctx.fill()
        }
      }
    }

    /* ground + horizon */
    const drawGround = (w: number, h: number) => {
      const gy = h * 0.78
      const grad = ctx.createLinearGradient(0, gy, 0, h)
      grad.addColorStop(0, GROUND_A)
      grad.addColorStop(0.3, GROUND_B)
      grad.addColorStop(1, GROUND_C)
      ctx.fillStyle = grad
      ctx.fillRect(0, gy, w, h - gy)

      const hGrad = ctx.createLinearGradient(0, gy - 2, 0, gy + 8)
      hGrad.addColorStop(0, "rgba(236,112,140,0)")
      hGrad.addColorStop(0.5, HORIZON_COLOR)
      hGrad.addColorStop(1, "rgba(236,112,140,0)")
      ctx.fillStyle = hGrad
      ctx.fillRect(0, gy - 2, w, 10)
    }

    /* ── male figure (left) ── broader shoulders, shorter hair ── */
    const drawMaleFigure = (cx: number, groundY: number, scale: number) => {
      ctx.save()
      ctx.translate(cx, groundY)
      ctx.scale(scale, scale)

      // body gradient
      const figGrad = ctx.createLinearGradient(0, 0, 0, -200)
      figGrad.addColorStop(0, "rgba(140,55,80,0.92)")
      figGrad.addColorStop(0.5, "rgba(160,70,95,0.88)")
      figGrad.addColorStop(1, "rgba(180,90,115,0.82)")

      // legs
      ctx.beginPath()
      ctx.moveTo(-14, 0)
      ctx.lineTo(-10, -55)
      ctx.lineTo(-4, -55)
      ctx.lineTo(-2, 0)
      ctx.closePath()
      ctx.fillStyle = figGrad; ctx.fill()

      ctx.beginPath()
      ctx.moveTo(2, 0)
      ctx.lineTo(4, -55)
      ctx.lineTo(10, -55)
      ctx.lineTo(14, 0)
      ctx.closePath()
      ctx.fillStyle = figGrad; ctx.fill()

      // torso - broader for male
      ctx.beginPath()
      ctx.moveTo(-12, -55)
      ctx.quadraticCurveTo(-18, -80, -20, -100)
      ctx.quadraticCurveTo(-22, -120, -18, -135)
      ctx.lineTo(18, -135)
      ctx.quadraticCurveTo(22, -120, 20, -100)
      ctx.quadraticCurveTo(18, -80, 12, -55)
      ctx.closePath()
      ctx.fillStyle = figGrad; ctx.fill()

      // arms - one extended outward toward partner
      ctx.beginPath()
      ctx.moveTo(18, -125)
      ctx.quadraticCurveTo(30, -118, 40, -108)
      ctx.quadraticCurveTo(50, -98, 55, -100)
      ctx.quadraticCurveTo(56, -98, 52, -94)
      ctx.quadraticCurveTo(45, -92, 36, -102)
      ctx.quadraticCurveTo(28, -110, 18, -118)
      ctx.closePath()
      ctx.fillStyle = figGrad; ctx.fill()

      // other arm relaxed
      ctx.beginPath()
      ctx.moveTo(-18, -125)
      ctx.quadraticCurveTo(-26, -110, -28, -90)
      ctx.quadraticCurveTo(-30, -75, -26, -68)
      ctx.quadraticCurveTo(-24, -66, -22, -68)
      ctx.quadraticCurveTo(-22, -75, -22, -90)
      ctx.quadraticCurveTo(-20, -110, -18, -118)
      ctx.closePath()
      ctx.fillStyle = figGrad; ctx.fill()

      // neck
      ctx.beginPath()
      ctx.moveTo(-6, -135)
      ctx.lineTo(-6, -148)
      ctx.lineTo(6, -148)
      ctx.lineTo(6, -135)
      ctx.closePath()
      ctx.fillStyle = figGrad; ctx.fill()

      // head - slightly more angular jaw
      ctx.beginPath()
      ctx.ellipse(0, -163, 14, 16, 0, 0, Math.PI * 2)
      ctx.fillStyle = figGrad; ctx.fill()

      // short hair
      ctx.beginPath()
      ctx.ellipse(0, -172, 15, 10, 0, Math.PI, 0)
      ctx.fillStyle = "rgba(120,40,65,0.95)"; ctx.fill()

      ctx.restore()
    }

    /* ── female figure (right) ── narrower shoulders, long flowing hair, dress silhouette ── */
    const drawFemaleFigure = (cx: number, groundY: number, scale: number) => {
      ctx.save()
      ctx.translate(cx, groundY)
      ctx.scale(-1, 1) // face left toward male
      ctx.scale(scale, scale)

      const figGrad = ctx.createLinearGradient(0, 0, 0, -200)
      figGrad.addColorStop(0, "rgba(200,80,110,0.92)")
      figGrad.addColorStop(0.5, "rgba(215,100,130,0.88)")
      figGrad.addColorStop(1, "rgba(230,130,155,0.82)")

      // dress / skirt - A-line silhouette
      ctx.beginPath()
      ctx.moveTo(-22, 0)
      ctx.quadraticCurveTo(-18, -25, -12, -55)
      ctx.lineTo(12, -55)
      ctx.quadraticCurveTo(18, -25, 22, 0)
      ctx.closePath()
      ctx.fillStyle = figGrad; ctx.fill()

      // torso - narrower, feminine
      ctx.beginPath()
      ctx.moveTo(-10, -55)
      ctx.quadraticCurveTo(-14, -70, -14, -90)
      ctx.quadraticCurveTo(-15, -110, -13, -125)
      ctx.lineTo(13, -125)
      ctx.quadraticCurveTo(15, -110, 14, -90)
      ctx.quadraticCurveTo(14, -70, 10, -55)
      ctx.closePath()
      ctx.fillStyle = figGrad; ctx.fill()

      // arm extended toward partner
      ctx.beginPath()
      ctx.moveTo(13, -118)
      ctx.quadraticCurveTo(24, -112, 34, -104)
      ctx.quadraticCurveTo(42, -96, 46, -98)
      ctx.quadraticCurveTo(47, -96, 44, -93)
      ctx.quadraticCurveTo(38, -90, 30, -98)
      ctx.quadraticCurveTo(22, -106, 13, -112)
      ctx.closePath()
      ctx.fillStyle = figGrad; ctx.fill()

      // other arm
      ctx.beginPath()
      ctx.moveTo(-13, -118)
      ctx.quadraticCurveTo(-20, -105, -22, -88)
      ctx.quadraticCurveTo(-23, -76, -20, -70)
      ctx.quadraticCurveTo(-18, -68, -17, -70)
      ctx.quadraticCurveTo(-17, -78, -17, -88)
      ctx.quadraticCurveTo(-16, -105, -13, -112)
      ctx.closePath()
      ctx.fillStyle = figGrad; ctx.fill()

      // neck - slimmer
      ctx.beginPath()
      ctx.moveTo(-5, -125)
      ctx.lineTo(-5, -140)
      ctx.lineTo(5, -140)
      ctx.lineTo(5, -125)
      ctx.closePath()
      ctx.fillStyle = figGrad; ctx.fill()

      // head - rounder, softer
      ctx.beginPath()
      ctx.ellipse(0, -155, 13, 16, 0, 0, Math.PI * 2)
      ctx.fillStyle = figGrad; ctx.fill()

      // long flowing hair
      ctx.beginPath()
      ctx.moveTo(-16, -162)
      ctx.quadraticCurveTo(-18, -175, -14, -175)
      ctx.quadraticCurveTo(-8, -178, 0, -175)
      ctx.quadraticCurveTo(8, -178, 14, -175)
      ctx.quadraticCurveTo(18, -175, 16, -162)
      // hair flows down the back
      ctx.quadraticCurveTo(18, -150, 18, -135)
      ctx.quadraticCurveTo(18, -115, 16, -95)
      ctx.quadraticCurveTo(14, -85, 10, -88)
      ctx.quadraticCurveTo(12, -110, 12, -125)
      ctx.quadraticCurveTo(12, -145, 14, -158)
      ctx.quadraticCurveTo(12, -165, 0, -168)
      ctx.quadraticCurveTo(-12, -165, -14, -158)
      ctx.quadraticCurveTo(-12, -145, -12, -125)
      ctx.quadraticCurveTo(-14, -110, -16, -95)
      ctx.quadraticCurveTo(-20, -85, -22, -88)
      ctx.quadraticCurveTo(-22, -115, -18, -135)
      ctx.quadraticCurveTo(-18, -150, -16, -162)
      ctx.closePath()
      ctx.fillStyle = "rgba(170,60,90,0.95)"; ctx.fill()

      ctx.restore()
    }

    /* heart glow in chest */
    const drawHeartGlow = (cx: number, cy: number, t: number, offset: number) => {
      const pulse = Math.sin(t * 0.004 + offset) * 0.3 + 0.7

      const r3 = 55 * pulse
      const g3 = ctx.createRadialGradient(cx, cy, 0, cx, cy, r3)
      g3.addColorStop(0, `rgba(${HEART_CORE},${0.15 * pulse})`)
      g3.addColorStop(1, `rgba(${HEART_CORE},0)`)
      ctx.fillStyle = g3; ctx.beginPath(); ctx.arc(cx, cy, r3, 0, Math.PI * 2); ctx.fill()

      const r2 = 25 * pulse
      const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, r2)
      g2.addColorStop(0, `rgba(${HEART_MID},${0.3 * pulse})`)
      g2.addColorStop(1, `rgba(${HEART_MID},0)`)
      ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(cx, cy, r2, 0, Math.PI * 2); ctx.fill()

      // tiny heart icon in the center
      ctx.save()
      ctx.translate(cx, cy)
      const hs = 5 * pulse
      heartPath(ctx, hs)
      ctx.fillStyle = `rgba(${HEART_OUTER},${0.85 * pulse})`
      ctx.fill()
      ctx.restore()
    }

    /* connection thread with catenary */
    const drawThread = (x1: number, y1: number, x2: number, y2: number, t: number) => {
      const midX = (x1 + x2) / 2
      const midY = Math.min(y1, y2) - 70 + Math.sin(t * 0.002) * 12

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.quadraticCurveTo(midX, midY, x2, y2)
      ctx.strokeStyle = `${THREAD_A}${0.2 + Math.sin(t * 0.003) * 0.06})`
      ctx.lineWidth = 2.5
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.quadraticCurveTo(midX, midY, x2, y2)
      ctx.strokeStyle = `${THREAD_BRIGHT}${0.4 + Math.sin(t * 0.003) * 0.1})`
      ctx.lineWidth = 1
      ctx.stroke()

      // traveling pulse
      const pT = ((t * 0.0008) % 1)
      const px = x1 + (x2 - x1) * pT
      const py = (1 - pT) * (1 - pT) * y1 + 2 * (1 - pT) * pT * midY + pT * pT * y2
      const pg = ctx.createRadialGradient(px, py, 0, px, py, 18)
      pg.addColorStop(0, `${PULSE_COLOR}0.6)`)
      pg.addColorStop(1, `${PULSE_COLOR}0)`)
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, 18, 0, Math.PI * 2); ctx.fill()
    }

    /* floating heart particles */
    const updateHearts = (t: number) => {
      const ps = heartsRef.current
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.003 // gentle gravity arc
        p.vx += (Math.random() - 0.5) * 0.015
        p.rotation += p.rotSpeed

        const ratio = p.life / p.maxLife
        if (ratio < 0.1) p.alpha = ratio / 0.1
        else if (ratio > 0.65) p.alpha = (1 - ratio) / 0.35
        else p.alpha = 1
        if (p.life >= p.maxLife) { ps.splice(i, 1); continue }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = p.alpha * 0.75

        // glow
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 3)
        glow.addColorStop(0, `rgba(${p.color},${p.alpha * 0.3})`)
        glow.addColorStop(1, `rgba(${p.color},0)`)
        ctx.fillStyle = glow
        ctx.beginPath(); ctx.arc(0, 0, p.size * 3, 0, Math.PI * 2); ctx.fill()

        // heart shape
        heartPath(ctx, p.size)
        ctx.fillStyle = `rgba(${p.color},${p.alpha * 0.85})`
        ctx.fill()

        ctx.globalAlpha = 1
        ctx.restore()
      }
    }

    /* ── main render loop ── */
    const render = (timestamp: number) => {
      timeRef.current = timestamp
      const w = canvas.width, h = canvas.height

      // sky
      ctx.fillStyle = SKY_BG
      ctx.fillRect(0, 0, w, h)
      const skyGrad = ctx.createRadialGradient(w * 0.5, h * 0.2, 0, w * 0.5, h * 0.2, Math.max(w, h) * 0.85)
      skyGrad.addColorStop(0, SKY_TOP)
      skyGrad.addColorStop(0.45, SKY_MID)
      skyGrad.addColorStop(1, SKY_BG)
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, w, h)

      drawStars(timestamp)
      drawGround(w, h)

      const figScale = Math.min(w / 1200, 1) * 0.85 + 0.35
      const groundY = h * 0.78
      const leftX = w * 0.2, rightX = w * 0.8

      drawMaleFigure(leftX, groundY, figScale)
      drawFemaleFigure(rightX, groundY, figScale)

      const heartYLeft = groundY - 105 * figScale
      const heartYRight = groundY - 100 * figScale
      drawHeartGlow(leftX, heartYLeft, timestamp, 0)
      drawHeartGlow(rightX, heartYRight, timestamp, Math.PI)
      drawThread(leftX, heartYLeft, rightX, heartYRight, timestamp)

      // spawn floating hearts from left figure toward right
      if (Math.random() < 0.08) spawnHeart(w, h)
      updateHearts(timestamp)

      // soft vignette
      const vGrad = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.8)
      vGrad.addColorStop(0, "rgba(255,245,247,0)")
      vGrad.addColorStop(1, `${VIG_COLOR}0.4)`)
      ctx.fillStyle = vGrad
      ctx.fillRect(0, 0, w, h)

      animId = requestAnimationFrame(render)
    }

    resize()
    animId = requestAnimationFrame(render)
    window.addEventListener("resize", resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  }, [initStars, spawnHeart])

  /* ── render ── */
  return (
    <section
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ background: SKY_BG }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 select-none max-w-3xl">

  {/* To Label */}
  <p
    className="uppercase tracking-[0.4em] text-xs md:text-sm mb-4"
    style={{
      color: "rgba(200, 100, 130, 0.6)",
      opacity: visibleLines >= 1 ? 1 : 0,
      transition: "opacity 1s ease",
    }}
  >
    To
  </p>

  {/* Recipient Name - HERO */}
  <h2
    className="font-display text-4xl md:text-6xl lg:text-7xl mb-6"
    style={{
      background: "linear-gradient(90deg, rgb(232,88,122), rgb(255,143,163))",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      opacity: visibleLines >= 1 ? 1 : 0,
      transform: visibleLines >= 1 ? "translateY(0)" : "translateY(20px)",
      transition: "all 1.2s cubic-bezier(0.22,1,0.36,1)",
    }}
  >
    {recipientName}
  </h2>

  {/* Divider */}
  <div
    className="w-20 h-[2px] mb-10"
    style={{
      background: "rgba(232,88,122,0.4)",
      opacity: visibleLines >= 2 ? 1 : 0,
      transition: "opacity 1s ease 0.3s",
    }}
  />

  {/* Message - Centerpiece */}
  <p
    className="font-serif text-lg md:text-2xl lg:text-3xl leading-relaxed max-w-2xl"
    style={{
      color: "rgba(120,40,65,0.92)",
      opacity: visibleLines >= 2 ? 1 : 0,
      transform: visibleLines >= 2 ? "translateY(0)" : "translateY(25px)",
      transition:
        "opacity 1.4s cubic-bezier(0.25,0.46,0.45,0.94), transform 1.4s cubic-bezier(0.25,0.46,0.45,0.94)",
    }}
  >
    “{message}”
  </p>

  {/* Signature */}
  <p
    className="mt-10 font-display text-lg md:text-xl"
    style={{
      color: "rgba(160,50,80,0.8)",
      opacity: visibleLines >= 3 ? 1 : 0,
      transition: "opacity 1.2s ease 0.4s",
    }}
  >
    — {senderName}
  </p>

  {/* Tagline */}
  <p
    className="mt-14 text-xs tracking-[0.35em] uppercase"
    style={{
      color: "rgba(200, 100, 130, 0.5)",
      opacity: showTagline ? 1 : 0,
      transition: "opacity 2.5s ease",
    }}
  >
    miles apart, never alone
  </p>
</div>

    </section>
  )
}
