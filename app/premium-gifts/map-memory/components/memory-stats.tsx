"use client"

import { Memory, BADGES } from "../../../../lib/memory-types"
import { MapPin, Heart, Calendar, Sparkles } from "lucide-react"
import { useMemo } from "react"

interface MemoryStatsProps {
  memories: Memory[]
}

export function MemoryStats({ memories }: MemoryStatsProps) {
  const stats = useMemo(() => {
    const badgeCount = new Map<string, number>()
    const locations = new Set<string>()

    memories.forEach((memory) => {
      const count = badgeCount.get(memory.badge.label) || 0
      badgeCount.set(memory.badge.label, count + 1)

      locations.add(
        `${memory.lat.toFixed(1)},${memory.lng.toFixed(1)}`
      )
    })

    const mostUsedBadge =
      memories.length === 0
        ? BADGES[0]
        : BADGES.reduce((prev, current) => {
            const prevCount = badgeCount.get(prev.label) || 0
            const currentCount = badgeCount.get(current.label) || 0
            return currentCount > prevCount ? current : prev
          })

    const firstMemory =
      memories.length > 0
        ? [...memories].sort(
            (a, b) => a.createdAt - b.createdAt
          )[0]
        : null

    const daysSinceFirst = firstMemory
      ? Math.floor(
          (Date.now() - firstMemory.createdAt) /
            (1000 * 60 * 60 * 24)
        )
      : 0

    return {
      total: memories.length,
      locations: locations.size,
      mostUsedBadge,
      mostUsedCount:
        badgeCount.get(mostUsedBadge.label) || 0,
      daysSinceFirst,
      badgeBreakdown: BADGES.map((badge) => ({
        badge,
        count: badgeCount.get(badge.label) || 0,
      }))
        .filter((item) => item.count > 0)
        .sort((a, b) => b.count - a.count),
    }
  }, [memories])

  return (
    <div className="fixed top-16 left-4 right-4 sm:top-6 sm:left-6 sm:right-auto z-[400] pointer-events-none animate-fade-in-up">
      <div className="glass-strong rounded-2xl p-3 sm:p-4 shadow-lg pointer-events-auto w-full max-w-[calc(100vw-2rem)] sm:w-64">
        <h3 className="font-serif font-bold text-foreground mb-3 flex items-center gap-2">
          <Sparkles size={18} className="text-primary" />
          Memory Stats
        </h3>

        <div className="space-y-3">
          {/* Total */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart size={14} />
              <span>Total Memories</span>
            </div>
            <span className="font-semibold text-foreground">
              {stats.total}
            </span>
          </div>

          {/* Locations */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} />
              <span>Places Visited</span>
            </div>
            <span className="font-semibold text-foreground">
              {stats.locations}
            </span>
          </div>

          {/* Days Together */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={14} />
              <span>Days Together</span>
            </div>
            <span className="font-semibold text-foreground">
              {stats.daysSinceFirst}
            </span>
          </div>

          {/* Most Used Emotion */}
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">
              Most Used Emotion
            </p>
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor:
                    stats.mostUsedBadge.bgColor,
                  color: stats.mostUsedBadge.color,
                }}
              >
                {stats.mostUsedBadge.emoji}{" "}
                {stats.mostUsedBadge.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {stats.mostUsedCount}x
              </span>
            </div>
          </div>

          {/* Breakdown */}
          {stats.total > 0 && (
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">
                Emotion Breakdown
              </p>
              <div className="space-y-1.5">
                {stats.badgeBreakdown
                  .slice(0, 5)
                  .map(({ badge, count }) => (
                    <div
                      key={badge.label}
                      className="flex items-center gap-2"
                    >
                      <span className="text-base">
                        {badge.emoji}
                      </span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${
                              (count / stats.total) * 100
                            }%`,
                            backgroundColor: badge.color,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-6 text-right">
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
