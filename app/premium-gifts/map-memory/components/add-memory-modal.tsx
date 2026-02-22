"use client"

import { useState, useRef, useMemo } from "react"
import { X, ImagePlus, Heart, Calendar, MapPin, Search } from "lucide-react"
import { BADGES, type Badge, type Memory } from "@/lib/memory-types"

interface AddMemoryModalProps {
  initialCoords?: { lat: number; lng: number } | null
  onSave: (memory: Memory) => Promise<void> | void
  onClose: () => void
}

export function AddMemoryModal({
  initialCoords,
  onSave,
  onClose,
}: AddMemoryModalProps) {
  const lat = initialCoords?.lat ?? 0
  const lng = initialCoords?.lng ?? 0

  const [title, setTitle] = useState("")
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)
  const [message, setMessage] = useState("")
  const [date, setDate] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const fileRef = useRef<HTMLInputElement>(null)

  const filteredBadges = useMemo(() => {
    if (!searchQuery.trim()) return BADGES
    return BADGES.filter((badge) =>
      badge.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(selected)
  }

  const handleSave = async () => {
    if (!title.trim() || !selectedBadge) return

    const memory: Memory & { file?: File | null } = {
      id: `temp-${Date.now()}`,
      user_id: "current-user", 
      title: title.trim(),
      badge: selectedBadge,
      message: message.trim(),
      date: date || undefined,
      imageUrl: imagePreview || undefined,
      lat,
      lng,
      createdAt: Date.now(),
      file,
    }

    try {
      setSaving(true)
      await onSave(memory)
      onClose()
    } catch (err) {
      console.error("Failed to save memory", err)
    } finally {
      setSaving(false)
    }
  }

  const isValid = title.trim().length > 0 && selectedBadge !== null

  return (
    <div className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto glass-strong rounded-t-3xl md:rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-border/50 glass-strong">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-primary" />
            <span className="text-xs text-muted-foreground font-medium">
              {lat.toFixed(2)}, {lng.toFixed(2)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60 hover:bg-muted"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-6">
          {/* Title */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Memory Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give this memory a name..."
              className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary/40"
              autoFocus
            />
          </div>

          {/* Badge Section */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Choose a Feeling
            </label>

            {/* Search */}
            <div className="relative mb-3">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search feeling..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-card pl-9 pr-3 py-2 text-sm outline-none focus:border-primary/40"
              />
            </div>

            {/* Badge Grid */}
            <div className="max-h-52 overflow-y-auto pr-1">
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {filteredBadges.map((badge) => {
                  const isSelected =
                    selectedBadge?.label === badge.label

                  return (
                    <button
                      key={badge.label}
                      onClick={() => setSelectedBadge(badge)}
                      className={`flex flex-col items-center justify-center gap-1 rounded-2xl p-3 transition-all duration-200 ${
                        isSelected
                          ? "scale-105 shadow-lg ring-2 ring-primary"
                          : "hover:scale-105 hover:shadow-md"
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? badge.bgColor
                          : "hsl(var(--muted) / 0.4)",
                      }}
                    >
                      <span className="text-2xl">
                        {badge.emoji}
                      </span>
                      <span className="text-[11px] font-medium">
                        {badge.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Photo (Optional)
            </label>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={imagePreview}
                  alt="Memory preview"
                  className="h-40 w-full object-cover rounded-2xl"
                />
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/30 px-4 py-6 text-sm text-muted-foreground hover:border-primary/30 hover:bg-muted/50"
              >
                <ImagePlus size={18} />
                Add a photo
              </button>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="What makes this place special to you..."
              className="w-full resize-none rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary/40"
            />
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Calendar size={12} />
              Date (Optional)
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary/40"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!isValid || saving}
            className={`flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold transition-all ${
              isValid
                ? "bg-primary text-primary-foreground shadow-lg hover:brightness-105 active:scale-[0.98]"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            <Heart size={16} fill={isValid ? "currentColor" : "none"} />
            {saving ? "Saving..." : "Save This Memory"}
          </button>
        </div>
      </div>
    </div>
  )
}