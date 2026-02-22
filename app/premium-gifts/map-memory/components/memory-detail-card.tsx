"use client"

import React from "react"
import {
  X,
  Calendar,
  MapPin,
  Heart,
  Trash2,
  Edit2,
  Link2,
  Sparkles,
} from "lucide-react"
import type { Memory } from "@/lib/memory-types"
import { format } from "date-fns"
import { getMemoryAnniversary } from "@/lib/anniversary-utils"

interface MemoryDetailCardProps {
  memory: Memory
  allMemories: Memory[]
  onClose: () => void
  onDelete?: (id: string) => void
  onEdit?: (memory: Memory) => void
  onConnect?: (memoryId: string, otherMemoryId: string) => void
}

export function MemoryDetailCard({
  memory,
  allMemories,
  onClose,
  onDelete,
  onEdit,
  onConnect,
}: MemoryDetailCardProps) {
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [showConnectMenu, setShowConnectMenu] = React.useState(false)

  const anniversary = getMemoryAnniversary(memory)

  const connectedMemories = memory.connectedTo
    ? allMemories.filter((m) => memory.connectedTo?.includes(m.id))
    : []

  const availableConnections = allMemories.filter(
    (m) => m.id !== memory.id && !memory.connectedTo?.includes(m.id)
  )

  const handleDelete = () => {
    if (!onDelete) return
    onDelete(memory.id)
    onClose()
  }

  const handleConnect = (otherId: string) => {
    if (!onConnect) return
    onConnect(memory.id, otherId)
    setShowConnectMenu(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md glass-strong rounded-3xl shadow-2xl shadow-primary/10 overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">

        {memory.imageUrl && (
          <div className="relative w-full bg-gradient-to-b from-muted/30 to-muted/10 flex-shrink-0 flex items-center justify-center py-6 overflow-hidden">
            <img
              src={memory.imageUrl}
              alt={memory.title}
              className="w-full h-auto max-h-[400px] object-contain rounded-lg"
            />
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground shadow-sm"
        >
          <X size={16} />
        </button>

        <div className="p-6 space-y-4">

          {anniversary && (
            <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 flex items-center gap-2 animate-pulse-soft">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">
                {anniversary.label}
              </span>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-2xl shadow-sm"
              style={{ backgroundColor: memory.badge.bgColor }}
            >
              {memory.badge.emoji}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-xl font-bold text-foreground leading-tight text-balance">
                {memory.title}
              </h2>

              <span
                className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{
                  backgroundColor: memory.badge.bgColor,
                  color: memory.badge.color,
                }}
              >
                {memory.badge.label}
              </span>
            </div>
          </div>

          {memory.message && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {memory.message}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground/80">
            {memory.date && (
              <span className="flex items-center gap-1 rounded-full bg-muted/60 px-3 py-1.5">
                <Calendar size={12} />
                {format(new Date(memory.date), "MMM d, yyyy")}
              </span>
            )}

            <span className="flex items-center gap-1 rounded-full bg-muted/60 px-3 py-1.5">
              <MapPin size={12} />
              {memory.lat.toFixed(2)}, {memory.lng.toFixed(2)}
            </span>
          </div>

          {connectedMemories.length > 0 && (
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                <Link2 size={12} />
                Connected Memories ({connectedMemories.length})
              </p>

              <div className="space-y-2">
                {connectedMemories.map((conn) => (
                  <div
                    key={conn.id}
                    className="flex items-center gap-2 rounded-lg bg-muted/40 p-2 text-xs hover:bg-muted/60 transition-colors cursor-pointer"
                  >
                    <div
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-sm"
                      style={{ backgroundColor: conn.badge.bgColor }}
                    >
                      {conn.badge.emoji}
                    </div>

                    <span className="flex-1 line-clamp-1 text-foreground/80">
                      {conn.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIONS — Only if editable */}
          {(onEdit || onDelete) && (
            <div className="pt-4 border-t border-border/50 flex gap-2">

              {onEdit && (
                <button
                  onClick={() => onEdit(memory)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-accent/50 hover:bg-accent/70 text-foreground/80 hover:text-foreground px-3 py-2 text-xs font-medium transition-colors"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
              )}

              {onDelete && (
                showConfirm ? (
                  <>
                    <button
                      onClick={handleDelete}
                      className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-destructive/50 hover:bg-destructive/70 text-destructive-foreground px-3 py-2 text-xs font-medium transition-colors"
                    >
                      <Trash2 size={14} />
                      Yes, Delete
                    </button>

                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex items-center justify-center rounded-xl bg-muted/60 hover:bg-muted px-3 py-2 text-xs font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="flex items-center justify-center rounded-xl bg-destructive/20 hover:bg-destructive/30 text-destructive px-3 py-2 text-xs font-medium transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )
              )}

            </div>
          )}

          <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-muted-foreground/50">
            <Heart size={10} fill="currentColor" />
            <span>Tohfaah Memory</span>
            <Heart size={10} fill="currentColor" />
          </div>
        </div>
      </div>
    </div>
  )
}
