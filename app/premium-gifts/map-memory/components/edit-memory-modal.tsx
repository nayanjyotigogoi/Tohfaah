"use client"

import React from "react"
import { X } from "lucide-react"
import type { Memory, Badge } from "@/lib/memory-types"
import { BADGES } from "@/lib/memory-types"

interface EditMemoryModalProps {
  memory: Memory
  onClose: () => void
  onSave: (memory: Memory) => Promise<void> | void
}

export function EditMemoryModal({ memory, onClose, onSave }: EditMemoryModalProps) {
  const [title, setTitle] = React.useState(memory.title)
  const [message, setMessage] = React.useState(memory.message)
  const [selectedBadge, setSelectedBadge] = React.useState<Badge>(memory.badge)
  const [date, setDate] = React.useState(memory.date || "")
  const [saving, setSaving] = React.useState(false)

  const handleSave = async () => {
    try {
      setSaving(true)
      await onSave({
        ...memory,
        title,
        message,
        badge: selectedBadge,
        date: date || undefined,
      })
      onClose()
    } catch (err) {
      console.error("Failed to update memory", err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md glass-strong rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-primary/10 overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border/50 flex-shrink-0">
          <h2 className="font-serif text-xl font-bold text-foreground">
            Edit Memory
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-foreground/70 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/50 text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/70 mb-3">
              Emotion ({selectedBadge.label})
            </label>
            <div className="grid grid-cols-5 gap-2">
              {BADGES.map((badge) => (
                <button
                  key={badge.label}
                  onClick={() => setSelectedBadge(badge)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all ${
                    selectedBadge.label === badge.label
                      ? "opacity-100"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: badge.bgColor,
                    ...(selectedBadge.label === badge.label && {
                      boxShadow: `0 0 0 2px ${badge.color}`,
                    }),
                  }}
                >
                  <span className="text-xl">{badge.emoji}</span>
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: badge.color }}
                  >
                    {badge.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/70 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/50 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/70 mb-2">
              Date (optional)
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/50 text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-muted/60 hover:bg-muted/80 text-foreground font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-3 rounded-xl bg-primary/80 hover:bg-primary text-primary-foreground font-medium text-sm transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
