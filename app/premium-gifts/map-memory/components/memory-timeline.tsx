"use client"

import { Memory } from "@/lib/memory-types"
import { X, Calendar, MapPin } from "lucide-react"
import Image from "next/image"

interface MemoryTimelineProps {
  memories: Memory[]
  onClose: () => void
  onSelectMemory: (memory: Memory) => void
}

export function MemoryTimeline({
  memories,
  onClose,
  onSelectMemory,
}: MemoryTimelineProps) {

  const sortedMemories = [...memories].sort(
    (a, b) => b.createdAt - a.createdAt
  )

  const groupedMemories = sortedMemories.reduce((groups, memory) => {
    const dateKey = new Date(memory.createdAt).toDateString()

    if (!groups[dateKey]) {
      groups[dateKey] = []
    }

    groups[dateKey].push(memory)
    return groups
  }, {} as Record<string, Memory[]>)

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in-up">
      <div className="glass-strong rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground">
              Memory Activity
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {memories.length} total memories
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/60 via-secondary/60 to-accent/60" />

            <div className="space-y-10">
              {Object.entries(groupedMemories).map(
                ([dateKey, dayMemories]) => (
                  <div key={dateKey}>

                    {/* Date Header */}
                    <div className="relative pl-14 mb-4">
                      <div className="absolute left-3 top-1 w-6 h-6 rounded-full bg-background border-2 border-primary shadow-sm" />
                      <h3 className="text-sm font-semibold text-muted-foreground">
                        {new Date(dateKey).toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })} ({dayMemories.length})
                      </h3>
                    </div>

                    {/* Memories */}
                    <div className="space-y-4">
                      {dayMemories.map((memory) => {
                        const created = new Date(memory.createdAt)

                        return (
                          <div
                            key={memory.id}
                            className="relative pl-14 cursor-pointer group"
                            onClick={() => {
                              onSelectMemory(memory)
                              onClose()
                            }}
                          >
                            <div
                              className="absolute left-3 top-4 w-4 h-4 rounded-full bg-background border-2 shadow-sm"
                              style={{ borderColor: memory.badge.color }}
                            />

                            <div className="glass rounded-xl p-3 hover:shadow-md transition-all group-hover:-translate-y-0.5">
                              <div className="flex gap-3">

                                {memory.imageUrl && (
                                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                                    <img
                                      src={memory.imageUrl}
                                      alt={memory.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}

                                <div className="flex-1 min-w-0">

                                  {/* Username + Time */}
                                  <div className="text-xs text-muted-foreground mb-1">
                                    <span className="font-medium text-foreground">
                                      {memory.user?.full_name || "Unknown"}
                                    </span>{" "}
                                    •{" "}
                                    {created.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>

                                  <h4 className="font-medium text-foreground text-sm mb-1">
                                    {memory.title}
                                  </h4>

                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                    {memory.message}
                                  </p>

                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    {memory.date && (
                                      <div className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        <span>
                                          {new Date(
                                            memory.date
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <MapPin size={12} />
                                      <span>
                                        {memory.lat.toFixed(2)},{" "}
                                        {memory.lng.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>

                                </div>
                              </div>
                            </div>

                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}