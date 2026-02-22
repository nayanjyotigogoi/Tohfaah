"use client"

import { X, Heart, Calendar, Search } from "lucide-react"
import type { Memory } from "../../../../lib/memory-types"
import { format } from "date-fns"
import React from "react"

interface MemorySidebarProps {
  memories: Memory[]
  onSelect: (memory: Memory) => void
  onClose: () => void
}

export function MemorySidebar({
  memories,
  onSelect,
  onClose,
}: MemorySidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedBadge, setSelectedBadge] = React.useState<string | null>(null)

  const sorted = [...memories].sort((a, b) => b.createdAt - a.createdAt)

  const filtered = sorted.filter((memory) => {
    const matchesSearch =
      searchQuery === "" ||
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (memory.message ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

    const matchesBadge =
      selectedBadge === null || memory.badge.label === selectedBadge

    return matchesSearch && matchesBadge
  })

  const badges = [...new Set(memories.map((m) => m.badge.label))]

  return (
    <div className="fixed inset-0 z-[900] flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className="relative z-10 ml-auto h-full w-full max-w-sm glass-strong shadow-2xl shadow-primary/10 flex flex-col animate-fade-in-up overflow-hidden"
        style={{ animationDuration: "0.3s" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Heart
              className="text-primary"
              size={16}
              fill="currentColor"
            />
            <h2 className="font-serif text-lg font-bold text-foreground">
              All Memories
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border/50 flex-shrink-0 space-y-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
            />
            <input
              type="text"
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted/60 border border-border/50 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Badge Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedBadge(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedBadge === null
                  ? "bg-primary/20 text-primary"
                  : "bg-muted/60 text-muted-foreground/80 hover:bg-muted/80"
              }`}
            >
              All
            </button>

            {badges.map((badge) => {
              const badgeData = memories.find(
                (m) => m.badge.label === badge
              )?.badge

              return (
                <button
                  key={badge}
                  onClick={() =>
                    setSelectedBadge(
                      selectedBadge === badge ? null : badge
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                    selectedBadge === badge
                      ? "opacity-100"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: badgeData?.bgColor,
                    color: badgeData?.color,
                    ...(selectedBadge === badge &&
                      badgeData?.color && {
                        boxShadow: `0 0 0 2px ${badgeData.color}`,
                      }),
                  }}
                >
                  {badgeData?.emoji}
                </button>
              )
            })}
          </div>
        </div>

        {/* Memory List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-center">
              <div>
                <p className="text-sm text-muted-foreground/60">
                  No memories found
                </p>
                <p className="text-xs text-muted-foreground/40 mt-1">
                  Try adjusting your filters
                </p>
              </div>
            </div>
          ) : (
            filtered.map((memory, index) => (
              <button
                key={memory.id}
                onClick={() => onSelect(memory)}
                className="flex items-start gap-3 rounded-2xl bg-card/80 p-3.5 text-left transition-all hover:bg-card hover:shadow-md hover:shadow-primary/5 active:scale-[0.99] animate-fade-in-up"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg"
                  style={{ backgroundColor: memory.badge.bgColor }}
                >
                  {memory.badge.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">
                    {memory.title}
                  </h3>

                  <div className="mt-0.5 flex items-center gap-2">
                    <span
                      className="text-[10px] font-semibold rounded-full px-2 py-0.5"
                      style={{
                        backgroundColor: memory.badge.bgColor,
                        color: memory.badge.color,
                      }}
                    >
                      {memory.badge.label}
                    </span>

                    {memory.date && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
                        <Calendar size={9} />
                        {format(new Date(memory.date), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>

                  {memory.message && (
                    <p className="mt-1 text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                      {memory.message}
                    </p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 text-center flex-shrink-0">
          <p className="text-[10px] text-muted-foreground/50 flex items-center justify-center gap-1">
            <Heart size={8} fill="currentColor" />
            {filtered.length} of {memories.length} memories
            <Heart size={8} fill="currentColor" />
          </p>
        </div>
      </div>
    </div>
  )
}
