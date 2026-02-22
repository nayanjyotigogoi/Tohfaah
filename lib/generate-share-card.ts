import { Memory } from "./memory-types"

export async function downloadShareCard(memory: Memory) {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  canvas.width = 1200
  canvas.height = 1200

  /* =========================
     Background Gradient
  ========================= */
  const gradient = ctx.createLinearGradient(0, 0, 1200, 1200)
  gradient.addColorStop(0, memory.badge.bgColor + "33")
  gradient.addColorStop(1, memory.badge.color + "22")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1200, 1200)

  /* =========================
     White Card
  ========================= */
  ctx.fillStyle = "#ffffff"
  ctx.beginPath()
  ctx.roundRect(100, 100, 1000, 1000, 40)
  ctx.fill()

  let photoHeight = 0

  /* =========================
     Draw Photo (Safe)
  ========================= */
  if (memory.imageUrl) {
    try {
      const img = await loadImage(memory.imageUrl)

      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        const maxWidth = 920
        const ratio = img.naturalWidth / img.naturalHeight
        const height = maxWidth / ratio

        ctx.drawImage(img, 140, 140, maxWidth, height)
        photoHeight = height
      }
    } catch (err) {
      console.log("Image skipped (failed to load)")
    }
  }

  /* =========================
     Badge
  ========================= */
  ctx.fillStyle = memory.badge.bgColor
  ctx.beginPath()
  ctx.roundRect(140, 160 + photoHeight, 260, 50, 25)
  ctx.fill()

  ctx.fillStyle = memory.badge.color
  ctx.font = "bold 22px sans-serif"
  ctx.fillText(
    `${memory.badge.emoji} ${memory.badge.label}`,
    160,
    192 + photoHeight
  )

  /* =========================
     Title
  ========================= */
  ctx.fillStyle = "#1a1a1a"
  ctx.font = "bold 56px sans-serif"
  ctx.fillText(memory.title, 140, 270 + photoHeight)

  /* =========================
     Message
  ========================= */
  ctx.fillStyle = "#555"
  ctx.font = "30px sans-serif"
  wrapText(ctx, memory.message || "", 140, 340 + photoHeight, 900, 42)

  /* =========================
     Date + Location
  ========================= */
  ctx.fillStyle = "#777"
  ctx.font = "26px sans-serif"

  let metaY = 820
  if (memory.date) {
    const formattedDate = new Date(memory.date).toLocaleDateString(
      "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    )
    ctx.fillText(`📅 ${formattedDate}`, 140, metaY)
    metaY += 40
  }

  ctx.fillText(
    `📍 ${memory.lat.toFixed(4)}, ${memory.lng.toFixed(4)}`,
    140,
    metaY
  )

  /* =========================
     Footer
  ========================= */
  ctx.fillStyle = "#aaa"
  ctx.font = "22px sans-serif"
  ctx.fillText(
    "Created with Tohfaah Emotional Memory Map",
    140,
    1050
  )

  /* =========================
     Download PNG
  ========================= */
  const link = document.createElement("a")
  link.download = `${memory.title
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()}-memory.png`
  link.href = canvas.toDataURL("image/png")
  link.click()
}

/* =========================
   Image Loader (Safe)
========================= */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("Failed to load image"))

    img.src = src
  })
}

/* =========================
   Text Wrapper
========================= */

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ")
  let line = ""

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " "
    const testWidth = ctx.measureText(testLine).width

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y)
      line = words[n] + " "
      y += lineHeight
    } else {
      line = testLine
    }
  }

  ctx.fillText(line, x, y)
}

/* =========================
   Share (Native)
========================= */

export function shareMemory(memory: Memory) {
  const text = `${memory.title}\n\n${memory.message}\n\n${memory.badge.emoji} ${memory.badge.label}`

  if (navigator.share) {
    navigator.share({
      title: memory.title,
      text: text,
    }).catch(() => {
      copyToClipboard(text)
    })
  } else {
    copyToClipboard(text)
  }
}

function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
    alert("Memory copied to clipboard!")
  }
}